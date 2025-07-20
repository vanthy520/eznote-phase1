"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useWallet } from "./WalletContext"

interface EzCoinContextType {
  balance: number
  purchaseEzCoins: (amount: number, paymentMethod: string) => Promise<boolean>
  spendEzCoins: (amount: number, purpose: string) => Promise<boolean>
  getTransactionHistory: () => EzCoinTransaction[]
  refreshBalance: () => Promise<void>
}

interface EzCoinTransaction {
  id: string
  type: "purchase" | "spend"
  amount: number
  purpose: string
  timestamp: Date
  txHash?: string
}

const EzCoinContext = createContext<EzCoinContextType>({
  balance: 0,
  purchaseEzCoins: async () => false,
  spendEzCoins: async () => false,
  getTransactionHistory: () => [],
  refreshBalance: async () => {},
})

export const useEzCoin = () => useContext(EzCoinContext)

export function EzCoinProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<EzCoinTransaction[]>([])
  const { address } = useWallet()

  useEffect(() => {
    if (address) {
      loadBalance()
      loadTransactions()
    }
  }, [address])

  const loadBalance = async () => {
    try {
      const storedBalance = await AsyncStorage.getItem(`ezcoin_balance_${address}`)
      if (storedBalance) {
        setBalance(Number.parseInt(storedBalance))
      }
    } catch (error) {
      console.error("Error loading EzCoin balance:", error)
    }
  }

  const saveBalance = async (newBalance: number) => {
    try {
      await AsyncStorage.setItem(`ezcoin_balance_${address}`, newBalance.toString())
      setBalance(newBalance)
    } catch (error) {
      console.error("Error saving EzCoin balance:", error)
    }
  }

  const loadTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem(`ezcoin_transactions_${address}`)
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions))
      }
    } catch (error) {
      console.error("Error loading transactions:", error)
    }
  }

  const saveTransaction = async (transaction: EzCoinTransaction) => {
    try {
      const updatedTransactions = [...transactions, transaction]
      await AsyncStorage.setItem(`ezcoin_transactions_${address}`, JSON.stringify(updatedTransactions))
      setTransactions(updatedTransactions)
    } catch (error) {
      console.error("Error saving transaction:", error)
    }
  }

  const purchaseEzCoins = async (amount: number, paymentMethod: string): Promise<boolean> => {
    try {
      // Simulate payment processing
      // In production, integrate with Stripe/PayPal/Apple Pay/Google Pay
      const success = await processPayment(amount, paymentMethod)

      if (success) {
        const newBalance = balance + amount
        await saveBalance(newBalance)

        const transaction: EzCoinTransaction = {
          id: Date.now().toString(),
          type: "purchase",
          amount,
          purpose: `Purchased via ${paymentMethod}`,
          timestamp: new Date(),
        }

        await saveTransaction(transaction)
        Alert.alert("Success!", `Purchased ${amount} EzCoins successfully!`)
        return true
      }

      return false
    } catch (error) {
      Alert.alert("Purchase Failed", "Please try again")
      return false
    }
  }

  const spendEzCoins = async (amount: number, purpose: string): Promise<boolean> => {
    if (balance < amount) {
      Alert.alert("Insufficient EzCoins", `You need ${amount} EzCoins but only have ${balance}`)
      return false
    }

    try {
      const newBalance = balance - amount
      await saveBalance(newBalance)

      const transaction: EzCoinTransaction = {
        id: Date.now().toString(),
        type: "spend",
        amount,
        purpose,
        timestamp: new Date(),
      }

      await saveTransaction(transaction)
      return true
    } catch (error) {
      Alert.alert("Transaction Failed", "Please try again")
      return false
    }
  }

  const processPayment = async (amount: number, paymentMethod: string): Promise<boolean> => {
    // Simulate payment processing delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // In production, integrate with actual payment processors
        resolve(true)
      }, 2000)
    })
  }

  const refreshBalance = async () => {
    await loadBalance()
  }

  const getTransactionHistory = () => {
    return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  return (
    <EzCoinContext.Provider
      value={{
        balance,
        purchaseEzCoins,
        spendEzCoins,
        getTransactionHistory,
        refreshBalance,
      }}
    >
      {children}
    </EzCoinContext.Provider>
  )
}
