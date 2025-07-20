"use client"

import { useWallet } from "@/components/wallet-provider"
import { WalletConnectScreen } from "@/components/wallet-connect-screen"
import { MainApp } from "@/components/main-app"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { isConnected, isLoading } = useWallet()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return isConnected ? <MainApp /> : <WalletConnectScreen />
}
