"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2 } from "lucide-react"
import { useEzCoin } from "@/components/ezcoin-provider"
import { useToast } from "@/hooks/use-toast"

interface EzAIButtonProps {
  content: string
}

export function EzAIButton({ content }: EzAIButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const { spendEzCoins, balance } = useEzCoin()
  const { toast } = useToast()

  const handleAIAction = async (action: string) => {
    if (balance < 2) {
      toast({
        title: "Insufficient EzCoins",
        description: "You need 2 EzCoins to use EzAI",
        variant: "destructive",
      })
      return
    }

    const success = await spendEzCoins(2, `EzAI ${action}`)
    if (!success) return

    setIsProcessing(true)

    // Simulate AI processing
    setTimeout(() => {
      let response = ""
      switch (action) {
        case "summarize":
          response = `📝 **AI Summary:**\n• ${content.split(" ").slice(0, 10).join(" ")}...\n• Key themes: blockchain, memories, social\n• Sentiment: Positive and engaging`
          break
        case "expand":
          response = `✨ **AI Expansion:**\n${content}\n\nThis post beautifully captures the essence of permanent digital memories. The blockchain technology ensures that this moment will be preserved forever, creating a lasting legacy for future generations to discover and appreciate.`
          break
        case "suggest":
          response = `🏷️ **AI Suggested Tags:**\n#blockchain #memories #NFT #permanent #social #web3 #crypto #digital #forever #legacy`
          break
        default:
          response = "AI processing complete!"
      }
      setAiResponse(response)
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
      >
        <Sparkles className="h-3 w-3" />
        <span className="text-xs font-semibold">EzAI</span>
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              EzAI Assistant
              <Badge variant="secondary">2 EzCoins each</Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Button
              onClick={() => handleAIAction("summarize")}
              disabled={isProcessing}
              className="w-full justify-start"
              variant="outline"
            >
              📝 Summarize Content
            </Button>

            <Button
              onClick={() => handleAIAction("expand")}
              disabled={isProcessing}
              className="w-full justify-start"
              variant="outline"
            >
              ✨ Expand & Improve
            </Button>

            <Button
              onClick={() => handleAIAction("suggest")}
              disabled={isProcessing}
              className="w-full justify-start"
              variant="outline"
            >
              🏷️ Suggest Tags
            </Button>

            {isProcessing && (
              <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Processing with AI...</span>
              </div>
            )}

            {aiResponse && !isProcessing && (
              <div className="p-4 bg-muted rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{aiResponse}</pre>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
