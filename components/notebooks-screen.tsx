"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus, Sparkles } from "lucide-react"

const demoNotebooks = [
  {
    id: "1",
    title: "Travel Memories",
    description: "Collection of my travel experiences and adventures",
    tags: ["travel", "adventure", "memories"],
    postCount: 12,
    nftCount: 8,
  },
  {
    id: "2",
    title: "Learning Journey",
    description: "My blockchain and Web3 learning progress",
    tags: ["learning", "blockchain", "web3"],
    postCount: 25,
    nftCount: 15,
  },
]

export function NotebooksScreen() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold">Notebooks</h1>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Notebook
          </Button>
        </div>
      </div>

      {/* Notebooks */}
      <div className="p-4 space-y-4">
        {demoNotebooks.map((notebook) => (
          <Card key={notebook.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {notebook.title}
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Sparkles className="h-4 w-4 mr-1" />
                  EzAI
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">{notebook.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {notebook.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{notebook.postCount} posts</span>
                <span>{notebook.nftCount} NFTs minted</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
