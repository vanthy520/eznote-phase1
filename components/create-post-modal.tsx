"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useEzCoin } from "@/components/ezcoin-provider"
import { useToast } from "@/hooks/use-toast"
import { Globe, Lock, Loader2, ImageIcon } from "lucide-react"
import { useWallet } from "@/components/wallet-provider"
import type { Post } from "@/lib/types"

interface CreatePostModalProps {
  visible: boolean
  onClose: () => void
  onPostCreated: (post: Post) => void // Callback to add new post to global state
}

export function CreatePostModal({ visible, onClose, onPostCreated }: CreatePostModalProps) {
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([]) // For image support
  const [visibility, setVisibility] = useState<"public" | "private">("public")
  const [isPosting, setIsPosting] = useState(false)
  const { spendEzCoins, balance } = useEzCoin()
  const { toast } = useToast()
  const { address } = useWallet() // Get user's wallet address

  const addImage = () => {
    // Simulate image upload by adding a placeholder image
    const imageQueries = [
      "abstract landscape",
      "cityscape",
      "nature scene",
      "geometric pattern",
      "food art",
      "travel photo",
    ]
    const randomQuery = imageQueries[Math.floor(Math.random() * imageQueries.length)]
    const newImage = `/placeholder.svg?height=400&width=600&query=${randomQuery}`
    setImages([...images, newImage])
    toast({
      title: "Image Added!",
      description: "Placeholder image added. In a real app, this would be an upload.",
    })
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handlePost = async () => {
    if (!content.trim()) {
      toast({
        title: "Empty Post",
        description: "Please write something to share",
        variant: "destructive",
      })
      return
    }

    const cost = images.length > 0 ? 3 : 1 // Text post costs 1 EzCoin, image post costs 3 EzCoins
    if (balance < cost) {
      toast({
        title: "Insufficient EzCoins",
        description: `You need ${cost} EzCoin to create this post`,
        variant: "destructive",
      })
      return
    }

    setIsPosting(true)

    // Simulate blockchain posting process
    setTimeout(async () => {
      const success = await spendEzCoins(cost, "Create post")
      if (success) {
        // Simulate IPFS upload and NFT minting
        const ipfsHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
        const nftTokenId = Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")

        const newPost: Post = {
          id: `post-${Date.now()}`,
          content: content.trim(),
          author: {
            address: address || "0xUnknown",
            name: "You", // Assuming current user is "You" for demo
            avatar: "/placeholder.svg?height=40&width=40",
          },
          timestamp: new Date(),
          likes: 0,
          comments: 0,
          isLiked: false,
          images: images,
          ipfsHash: ipfsHash,
          nftTokenId: nftTokenId,
          visibility: visibility,
        }

        onPostCreated(newPost) // Add the new post to the global state

        toast({
          title: "Post Created!",
          description: "Your memory has been stored on the blockchain and NFT minted!",
        })
        setContent("")
        setImages([])
        setVisibility("public")
        onClose()
      }
      setIsPosting(false)
    }, 3000)
  }

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind? Share a memory to store forever on the blockchain..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px]"
          />

          {/* Image Upload Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Images (Optional)</span>
              <Button onClick={addImage} size="sm" variant="outline">
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      onClick={() => removeImage(index)}
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6"
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Select value={visibility} onValueChange={(value: "public" | "private") => setVisibility(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Public
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Private
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Badge variant="secondary">{images.length > 0 ? "3 EzCoins" : "1 EzCoin"}</Badge>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>✨ Your post will be:</p>
            <p>• Stored permanently on IPFS</p>
            <p>• Hash saved on Polygon blockchain</p>
            <p>• NFT badge minted to your wallet</p>
            {visibility === "private" && <p>• Encrypted before upload</p>}
          </div>

          <div className="flex gap-2">
            <Button onClick={handlePost} disabled={isPosting} className="flex-1">
              {isPosting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Storing on Blockchain...
                </>
              ) : (
                "Create Post"
              )}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={isPosting}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
