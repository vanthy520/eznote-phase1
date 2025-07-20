"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CalendarDays, Filter, Globe, Lock, Gem } from "lucide-react"
import { PostCard } from "@/components/post-card"
import type { Post } from "@/lib/types"

interface PlannerScreenProps {
  posts: Post[]
}

export function PlannerScreen({ posts }: PlannerScreenProps) {
  const [filter, setFilter] = useState<"all" | "public" | "private" | "nft">("all")
  const [filteredTimelinePosts, setFilteredTimelinePosts] = useState<Post[]>([])

  useEffect(() => {
    let tempPosts = [...posts] // Start with all posts

    if (filter === "public") {
      tempPosts = tempPosts.filter((p) => p.visibility === "public")
    } else if (filter === "private") {
      tempPosts = tempPosts.filter((p) => p.visibility === "private")
    } else if (filter === "nft") {
      tempPosts = tempPosts.filter((p) => p.nftTokenId !== undefined) // Assuming NFT posts have nftTokenId
    }
    // Sort by timestamp descending
    tempPosts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    setFilteredTimelinePosts(tempPosts)
  }, [posts, filter])

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CalendarDays className="h-8 w-8 text-purple-600 mr-2" />
            <h1 className="text-2xl font-bold">Planner</h1>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <Filter className="h-3 w-3" />
            All ({posts.length})
          </Button>
          <Button
            variant={filter === "public" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("public")}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <Globe className="h-3 w-3" />
            Public ({posts.filter((p) => p.visibility === "public").length})
          </Button>
          <Button
            variant={filter === "private" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("private")}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <Lock className="h-3 w-3" />
            Private ({posts.filter((p) => p.visibility === "private").length})
          </Button>
          <Button
            variant={filter === "nft" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("nft")}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <Gem className="h-3 w-3" />
            NFT Memories ({posts.filter((p) => p.nftTokenId !== undefined).length})
          </Button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="p-4 space-y-6">
        {filteredTimelinePosts.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No posts found for this filter.</h3>
            <p className="text-muted-foreground">Start creating memories!</p>
          </div>
        ) : (
          filteredTimelinePosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}
