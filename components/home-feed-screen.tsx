"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { PostCard } from "@/components/post-card"
import { EzCoinBalance } from "@/components/ezcoin-balance"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, Users, Info } from "lucide-react"
import type { Post } from "@/lib/types" // Import Post type

interface HomeFeedScreenProps {
  posts: Post[]
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
}

const demoSocialPosts: Post[] = [
  {
    id: "1",
    content:
      "Just minted my first memory NFT on EzNote! 🎉 This moment is now permanently stored on the blockchain forever!",
    author: {
      address: "0x1234...5678",
      name: "CryptoMemory",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    timestamp: new Date(Date.now() - 3600000),
    likes: 24,
    comments: 8,
    isLiked: false,
    images: ["/placeholder.svg?height=300&width=500"],
    ipfsHash: "QmX1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9",
    nftTokenId: "001",
    visibility: "public",
  },
  {
    id: "2",
    content:
      "Beautiful sunset today! 🌅 Storing this precious moment forever with EzNote's blockchain technology. Nature's beauty deserves to be permanent!",
    author: {
      address: "0x9876...5432",
      name: "NatureLover",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    timestamp: new Date(Date.now() - 7200000),
    likes: 45,
    comments: 12,
    isLiked: true,
    images: ["/placeholder.svg?height=400&width=600"],
    ipfsHash: "QmA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2",
    nftTokenId: "002",
    visibility: "public",
  },
  {
    id: "3",
    content:
      "Coffee and coding session! ☕💻 Working on some exciting blockchain features. The future of social media is decentralized! #Web3 #Blockchain",
    author: {
      address: "0x5555...7777",
      name: "BlockchainDev",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    timestamp: new Date(Date.now() - 10800000),
    likes: 18,
    comments: 5,
    isLiked: false,
    images: ["/placeholder.svg?height=300&width=500"],
    ipfsHash: "QmF1G2H3I4J5K6L7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2",
    nftTokenId: "003",
    visibility: "public",
  },
]

export function HomeFeedScreen({ posts, setPosts }: HomeFeedScreenProps) {
  const [feedFilter, setFeedFilter] = useState<"all" | "trending">("all")

  useEffect(() => {
    // Initialize posts if empty (first load)
    if (posts.length === 0) {
      setPosts(demoSocialPosts)
    }
  }, [posts, setPosts])

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-indigo-600 mr-2" />
            <h1 className="text-2xl font-bold">EzNote Social</h1>
          </div>
          <EzCoinBalance />
        </div>

        {/* Feed Filters */}
        <div className="flex gap-2">
          <Button
            variant={feedFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFeedFilter("all")}
            className="flex items-center gap-1"
          >
            <Users className="h-3 w-3" />
            All Posts
          </Button>
          <Button
            variant={feedFilter === "trending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFeedFilter("trending")}
            className="flex items-center gap-1"
          >
            <TrendingUp className="h-3 w-3" />
            Trending
          </Button>
        </div>
      </div>

      {/* Demo Alert */}
      <div className="p-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            🚀 <strong>Demo Mode</strong> - You're viewing sample blockchain posts. All features are fully functional!
          </AlertDescription>
        </Alert>
      </div>

      {/* Social Feed */}
      <div className="p-4 space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No posts yet.</h3>
            <p className="text-muted-foreground">Be the first to share a memory!</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}
