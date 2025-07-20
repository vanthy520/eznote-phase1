"use client"

import { useState, useEffect } from "react"
import { PostCard } from "@/components/post-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, Info } from "lucide-react"
import type { Post } from "@/lib/types"

interface PrivateRoomScreenProps {
  posts: Post[]
}

const demoPrivatePosts: Post[] = [
  {
    id: "private-1",
    content:
      "My personal thoughts and reflections... 🤔 This is encrypted and stored securely on IPFS, only I can decrypt and view this content.",
    author: {
      address: "0x1234...5678",
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    timestamp: new Date(Date.now() - 1800000),
    likes: 0,
    comments: 0,
    isLiked: false,
    images: [],
    ipfsHash: "QmEncrypted123...",
    nftTokenId: "PRIV001",
    visibility: "private",
  },
]

export function PrivateRoomScreen({ posts }: PrivateRoomScreenProps) {
  const [privatePosts, setPrivatePosts] = useState<Post[]>([])

  useEffect(() => {
    // Filter posts that are explicitly private
    const filtered = posts.filter((p) => p.visibility === "private")
    // If no private posts from global state, use demo ones
    if (filtered.length === 0) {
      setPrivatePosts(demoPrivatePosts)
    } else {
      setPrivatePosts(filtered)
    }
  }, [posts])

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-green-600 mr-2" />
            <h1 className="text-2xl font-bold">Private Room</h1>
          </div>
          <div className="text-sm text-muted-foreground">{privatePosts.length} private posts</div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <div className="flex items-center text-green-800 dark:text-green-200">
            <Lock className="h-4 w-4 mr-2" />
            <p className="text-sm font-medium">Your private space - encrypted and secure</p>
          </div>
        </div>
      </div>

      {/* Demo Alert */}
      <div className="p-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            🔒 <strong>Private Mode</strong> - These posts are encrypted before blockchain storage. Only you can decrypt
            them!
          </AlertDescription>
        </Alert>
      </div>

      {/* Private Posts */}
      <div className="p-4 space-y-4">
        {privatePosts.length === 0 ? (
          <div className="text-center py-12">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No private posts yet</h3>
            <p className="text-muted-foreground">
              Create private posts for personal thoughts and sensitive information
            </p>
          </div>
        ) : (
          privatePosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}
