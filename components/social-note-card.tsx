"use client"

import type { Note } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Share, Gem, MoreHorizontal, Globe } from "lucide-react"
import { useState } from "react"

interface SocialNoteCardProps {
  note: Note
}

export function SocialNoteCard({ note }: SocialNoteCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(note.likes || 0)

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  const getVisibilityBadge = () => {
    if (note.visibility === "permanent") {
      return (
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Gem className="h-3 w-3 mr-1" />
          Permanent Memory
        </Badge>
      )
    }
    return (
      <Badge variant="secondary">
        <Globe className="h-3 w-3 mr-1" />
        Public
      </Badge>
    )
  }

  return (
    <Card className={`${note.visibility === "permanent" ? "ring-2 ring-purple-500 ring-opacity-30" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={note.authorAvatar || "/placeholder.svg"} />
              <AvatarFallback>{note.authorName?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{note.authorName}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">{formatDistanceToNow(note.createdAt)} ago</p>
                {getVisibilityBadge()}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Title */}
        {note.title && <h3 className="font-semibold text-lg">{note.title}</h3>}

        {/* Content */}
        <div
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />

        {/* Images */}
        {note.images && note.images.length > 0 && (
          <div className="space-y-2">
            {note.images.length === 1 ? (
              <img
                src={note.images[0] || "/placeholder.svg"}
                alt="Post image"
                className="w-full rounded-lg object-cover max-h-96"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {note.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-48 rounded-lg object-cover"
                      crossOrigin="anonymous"
                    />
                    {index === 3 && note.images!.length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold">+{note.images!.length - 4} more</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-accent">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Blockchain Badge */}
        {note.visibility === "permanent" && note.blockchainHash && (
          <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
            <p className="text-xs text-purple-700 dark:text-purple-300 flex items-center">
              <Gem className="h-3 w-3 mr-1" />
              Permanently stored on blockchain • Hash: {note.blockchainHash.slice(0, 10)}...
            </p>
          </div>
        )}

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
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>Comment</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
