"use client"

import type { Note } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Lock, Globe, Gem, MoreHorizontal } from "lucide-react"

interface NoteCardProps {
  note: Note
}

export function NoteCard({ note }: NoteCardProps) {
  const getVisibilityIcon = () => {
    switch (note.visibility) {
      case "private":
        return <Lock className="h-3 w-3" />
      case "public":
        return <Globe className="h-3 w-3" />
      case "permanent":
        return <Gem className="h-3 w-3" />
    }
  }

  const getVisibilityColor = () => {
    switch (note.visibility) {
      case "private":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "public":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "permanent":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
    }
  }

  return (
    <Card className={`${note.visibility === "permanent" ? "ring-2 ring-purple-500 ring-opacity-50" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={note.authorAvatar || "/placeholder.svg"} />
              <AvatarFallback>{note.authorName?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{note.authorName}</p>
              <p className="text-xs text-muted-foreground">{formatDistanceToNow(note.createdAt)} ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getVisibilityColor()}>
              {getVisibilityIcon()}
              <span className="ml-1 capitalize">{note.visibility}</span>
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {note.title && <h3 className="font-semibold mb-2">{note.title}</h3>}
        <div
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        {note.visibility === "permanent" && note.blockchainHash && (
          <div className="mt-3 p-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
            <p className="text-xs text-purple-700 dark:text-purple-300">🔗 Permanently stored on blockchain</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
