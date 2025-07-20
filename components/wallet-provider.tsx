"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: string
  isLoading: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  signMessage: (message: string) => Promise<string>
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: null,
  balance: "0",
  isLoading: true,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  signMessage: async () => "",
})

export const useWallet = () => useContext(WalletContext)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading and check for existing connection
    setTimeout(() => {
      const savedConnection = localStorage.getItem("wallet_connected")
      if (savedConnection) {
        setIsConnected(true)
        setAddress("0x1234...5678")
        setBalance("2.5")
      }
      setIsLoading(false)
    }, 1000)
  }, [])

  const connectWallet = async () => {
    // Simulate wallet connection
    setIsLoading(true)
    setTimeout(() => {
      setIsConnected(true)
      setAddress("0x1234...5678")
      setBalance("2.5")
      localStorage.setItem("wallet_connected", "true")
      setIsLoading(false)
    }, 2000)
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance("0")
    localStorage.removeItem("wallet_connected")
  }

  const signMessage = async (message: string): Promise<string> => {
    // Simulate message signing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("0xsignature123...")
      }, 1000)
    })
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        isLoading,
        connectWallet,
        disconnectWallet,
        signMessage,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
