"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/components/wallet-provider"
import { useEzCoin } from "@/components/ezcoin-provider"
import { useTheme } from "next-themes"
import { Settings, User, Coins, Download, LogOut } from "lucide-react"

export function SettingsScreen() {
  const { address, balance, disconnectWallet } = useWallet()
  const { balance: ezCoinBalance, transactions } = useEzCoin()
  const { theme, setTheme } = useTheme()

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-20 p-4">
        <div className="flex items-center">
          <Settings className="h-8 w-8 text-gray-600 mr-2" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Wallet Address</p>
                <p className="text-sm text-muted-foreground">{address}</p>
              </div>
              <Badge variant="secondary">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">MATIC Balance</p>
                <p className="text-sm text-muted-foreground">{balance} MATIC</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EzCoin Wallet */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              EzCoin Wallet
            </CardTitle>
            <CardDescription>Your virtual currency for app features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Current Balance</p>
                <p className="text-sm text-muted-foreground">{ezCoinBalance} EzCoins</p>
              </div>
              <Button variant="outline" size="sm">
                Buy More
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Total Transactions: {transactions.length}</p>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card>
          <CardHeader>
            <CardTitle>App Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Toggle dark theme</p>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export All Posts (JSON + IPFS Links)
            </Button>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={disconnectWallet} className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
