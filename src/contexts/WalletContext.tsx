"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { Alert } from "react-native"
import WalletConnect from "@walletconnect/client"
import { ethers } from "ethers"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: string
  connector: WalletConnect | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => Promise<void>
  signMessage: (message: string) => Promise<string>
  sendTransaction: (transaction: any) => Promise<string>
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: null,
  balance: "0",
  connector: null,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  signMessage: async () => "",
  sendTransaction: async () => "",
})

export const useWallet = () => useContext(WalletContext)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0")
  const [connector, setConnector] = useState<WalletConnect | null>(null)

  const connectWallet = async () => {
    try {
      const walletConnector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
        qrcodeModal: require("@walletconnect/qrcode-modal"),
      })

      if (!walletConnector.connected) {
        await walletConnector.createSession()
      }

      walletConnector.on("connect", (error, payload) => {
        if (error) {
          Alert.alert("Connection Error", error.message)
          return
        }

        const { accounts } = payload.params[0]
        setAddress(accounts[0])
        setIsConnected(true)
        setConnector(walletConnector)
        fetchBalance(accounts[0])
      })

      walletConnector.on("session_update", (error, payload) => {
        if (error) {
          Alert.alert("Session Error", error.message)
          return
        }

        const { accounts } = payload.params[0]
        setAddress(accounts[0])
        fetchBalance(accounts[0])
      })

      walletConnector.on("disconnect", (error, payload) => {
        setIsConnected(false)
        setAddress(null)
        setBalance("0")
        setConnector(null)
      })
    } catch (error) {
      Alert.alert("Wallet Connection Failed", "Please try again")
    }
  }

  const disconnectWallet = async () => {
    if (connector) {
      await connector.killSession()
    }
    setIsConnected(false)
    setAddress(null)
    setBalance("0")
    setConnector(null)
  }

  const fetchBalance = async (walletAddress: string) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com")
      const balanceWei = await provider.getBalance(walletAddress)
      const balanceEth = ethers.utils.formatEther(balanceWei)
      setBalance(Number.parseFloat(balanceEth).toFixed(4))
    } catch (error) {
      console.error("Error fetching balance:", error)
    }
  }

  const signMessage = async (message: string): Promise<string> => {
    if (!connector || !address) {
      throw new Error("Wallet not connected")
    }

    try {
      const signature = await connector.signMessage([ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message)), address])
      return signature
    } catch (error) {
      throw new Error("Failed to sign message")
    }
  }

  const sendTransaction = async (transaction: any): Promise<string> => {
    if (!connector || !address) {
      throw new Error("Wallet not connected")
    }

    try {
      const txHash = await connector.sendTransaction({
        from: address,
        ...transaction,
      })
      return txHash
    } catch (error) {
      throw new Error("Transaction failed")
    }
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        connector,
        connectWallet,
        disconnectWallet,
        signMessage,
        sendTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
