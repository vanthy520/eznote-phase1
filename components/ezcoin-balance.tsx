"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Coins } from "lucide-react"
import { useEzCoin } from "@/components/ezcoin-provider"
import { PurchaseEzCoinsModal } from "@/components/purchase-ezcoins-modal"

export function EzCoinBalance() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const { balance } = useEzCoin()

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowPurchaseModal(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 hover:from-yellow-500 hover:to-orange-600"
      >
        <Coins className="h-4 w-4" />
        <span className="font-semibold">{balance}</span>
      </Button>

      <PurchaseEzCoinsModal visible={showPurchaseModal} onClose={() => setShowPurchaseModal(false)} />
    </>
  )
}
