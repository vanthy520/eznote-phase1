"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface EzCoinContextType {
  balance: number
  purchaseEzCoins: (amount: number, paymentMethod: string) => Promise<boolean>
  spendEzCoins: (amount: number, purpose: string) => Promise<boolean>
  transactions: EzCoinTransaction[]
}

interface EzCoinTransaction {
  id: string
  type: "purchase" | "spend"
  amount: number
  purpose: string
  timestamp: Date
}

const EzCoinContext = createContext<EzCoinContextType>({
  balance: 0,
  purchaseEzCoins: async () => false,
  spendEzCoins: async () => false,
  transactions: [],
})

export const useEzCoin = () => useContext(EzCoinContext)

export function EzCoinProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(50) // Start with 50 EzCoins for demo
  const [transactions, setTransactions] = useState<EzCoinTransaction[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Load saved balance and transactions
    const savedBalance = localStorage.getItem("ezcoin_balance")
    const savedTransactions = localStorage.getItem("ezcoin_transactions")

    if (savedBalance) {
      setBalance(Number.parseInt(savedBalance))
    }
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
  }, [])

  const saveData = (newBalance: number, newTransactions: EzCoinTransaction[]) => {
    localStorage.setItem("ezcoin_balance", newBalance.toString())
    localStorage.setItem("ezcoin_transactions", JSON.stringify(newTransactions))
  }

  const purchaseEzCoins = async (amount: number, paymentMethod: string): Promise<boolean> => {
    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBalance = balance + amount
        const newTransaction: EzCoinTransaction = {
          id: Date.now().toString(),
          type: "purchase",
          amount,
          purpose: `Purchased via ${paymentMethod}`,
          timestamp: new Date(),
        }
        const newTransactions = [...transactions, newTransaction]

        setBalance(newBalance)
        setTransactions(newTransactions)
        saveData(newBalance, newTransactions)

        toast({
          title: "Purchase Successful!",
          description: `You purchased ${amount} EzCoins via ${paymentMethod}`,
        })
        resolve(true)
      }, 2000)
    })
  }

  const spendEzCoins = async (amount: number, purpose: string): Promise<boolean> => {
    if (balance < amount) {
      toast({
        title: "Insufficient EzCoins",
        description: `You need ${amount} EzCoins but only have ${balance}`,
        variant: "destructive",
      })
      return false
    }

    const newBalance = balance - amount
    const newTransaction: EzCoinTransaction = {
      id: Date.now().toString(),
      type: "spend",
      amount,
      purpose,
      timestamp: new Date(),
    }
    const newTransactions = [...transactions, newTransaction]

    setBalance(newBalance)
    setTransactions(newTransactions)
    saveData(newBalance, newTransactions)

    return true
  }

  return (
    <EzCoinContext.Provider
      value={{
        balance,
        purchaseEzCoins,
        spendEzCoins,
        transactions,
      }}
    >
      {children}
    </EzCoinContext.Provider>
  )
}
