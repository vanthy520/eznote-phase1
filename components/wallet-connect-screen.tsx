"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/components/wallet-provider"
import { Loader2, Wallet, Shield, Sparkles, Coins } from "lucide-react"

export function WalletConnectScreen() {
  const [isConnecting, setIsConnecting] = useState(false)
  const { connectWallet } = useWallet()

  const handleConnect = async () => {
    setIsConnecting(true)
    await connectWallet()
    setIsConnecting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">EZ</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to EzNote</CardTitle>
          <CardDescription>Connect your wallet to start creating permanent memories on the blockchain</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={handleConnect} disabled={isConnecting} className="w-full h-12 text-lg">
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </>
            )}
          </Button>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Secure blockchain storage</span>
            </div>
            <div className="flex items-center space-x-3">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <span className="text-sm text-muted-foreground">NFT memory badges</span>
            </div>
            <div className="flex items-center space-x-3">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">EzCoin rewards system</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
