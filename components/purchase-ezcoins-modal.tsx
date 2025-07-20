"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, CreditCard, Smartphone, Loader2 } from "lucide-react"
import { useEzCoin } from "@/components/ezcoin-provider"

interface PurchaseEzCoinsModalProps {
  visible: boolean
  onClose: () => void
}

export function PurchaseEzCoinsModal({ visible, onClose }: PurchaseEzCoinsModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const { purchaseEzCoins } = useEzCoin()

  const packages = [
    { amount: 10, price: "$0.99", popular: false },
    { amount: 50, price: "$3.99", popular: true },
    { amount: 100, price: "$6.99", popular: false },
    { amount: 500, price: "$24.99", popular: false },
  ]

  const paymentMethods = [
    { id: "stripe", name: "Credit Card", icon: CreditCard },
    { id: "paypal", name: "PayPal", icon: CreditCard },
    { id: "apple", name: "Apple Pay", icon: Smartphone },
    { id: "google", name: "Google Pay", icon: Smartphone },
  ]

  const handlePurchase = async (amount: number, paymentMethod: string) => {
    setIsProcessing(true)
    const success = await purchaseEzCoins(amount, paymentMethod)
    setIsProcessing(false)
    if (success) {
      onClose()
    }
  }

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            Purchase EzCoins
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* EzCoin Packages */}
          <div className="space-y-3">
            <h3 className="font-semibold">Choose Package:</h3>
            <div className="grid grid-cols-2 gap-2">
              {packages.map((pkg) => (
                <Button
                  key={pkg.amount}
                  variant={selectedPackage === pkg.amount ? "default" : "outline"}
                  onClick={() => setSelectedPackage(pkg.amount)}
                  className="h-16 flex flex-col items-center justify-center relative"
                >
                  {pkg.popular && <Badge className="absolute -top-2 -right-2 bg-green-500 text-xs">Popular</Badge>}
                  <div className="flex items-center gap-1">
                    <Coins className="h-4 w-4" />
                    <span className="font-bold">{pkg.amount}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{pkg.price}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          {selectedPackage && (
            <div className="space-y-3">
              <h3 className="font-semibold">Payment Method:</h3>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <Button
                    key={method.id}
                    variant="outline"
                    onClick={() => handlePurchase(selectedPackage, method.name)}
                    disabled={isProcessing}
                    className="w-full justify-start"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <method.icon className="h-4 w-4 mr-2" />
                    )}
                    {method.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Usage Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              💡 <strong>EzCoin Usage:</strong>
            </p>
            <p>• Text post: 1 EzCoin</p>
            <p>• Image post: 3 EzCoins</p>
            <p>• EzAI assistance: 2 EzCoins</p>
            <p>• NFT minting: 5 EzCoins</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
