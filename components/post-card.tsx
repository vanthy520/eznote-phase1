"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Share, Gem, MoreHorizontal } from "lucide-react"
import { useEzCoin } from "@/components/ezcoin-provider"
import { EzAIButton } from "@/components/ezai-button"
import { useToast } from "@/hooks/use-toast"
import type { Post } from "@/lib/types"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post.likes)
  const { spendEzCoins } = useEzCoin()
  const { toast } = useToast()

  const handleLike = async () => {
    const success = await spendEzCoins(1, "Like post")
    if (success) {
      setLiked(!liked)
      setLikeCount(liked ? likeCount - 1 : likeCount + 1)
      toast({
        title: liked ? "Unliked post" : "Liked post!",
        description: liked ? "Removed like" : "1 EzCoin spent",
      })
    }
  }

  const handleComment = () => {
    toast({
      title: "Comments",
      description: "Comment feature coming soon!",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`IPFS: ${post.ipfsHash}`)
    toast({
      title: "Shared!",
      description: "IPFS hash copied to clipboard",
    })
  }

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                {post.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author.name}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">{formatDistanceToNow(post.timestamp)} ago</p>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Gem className="h-3 w-3 mr-1" />
                  NFT #{post.nftTokenId}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Content */}
        <p className="text-base leading-relaxed">{post.content}</p>

        {/* Images */}
        {post.images.length > 0 && (
          <div className="space-y-2">
            <img
              src={post.images[0] || "/placeholder.svg"}
              alt="Post image"
              className="w-full rounded-lg object-cover max-h-96"
              crossOrigin="anonymous"
            />
          </div>
        )}

        {/* Blockchain Info */}
        <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
          <p className="text-xs text-purple-700 dark:text-purple-300 flex items-center">
            <Gem className="h-3 w-3 mr-1" />
            Permanently stored on IPFS • Hash: {post.ipfsHash.slice(0, 20)}...
          </p>
        </div>

        {/* Social Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-1 ${liked ? "text-red-500" : ""}`}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
              <span>{likeCount}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleComment} className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share className="h-4 w-4" />
            </Button>
          </div>
          <EzAIButton content={post.content} />
        </div>
      </CardContent>
    </Card>
  )
}
