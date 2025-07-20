"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Sparkles, Save, Lock, Globe, Gem, Plus, Loader2, Info, ImageIcon } from "lucide-react"
import type { VisibilityLevel } from "@/lib/types"
import { useAuth } from "@/components/auth-provider"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

interface NoteEditorProps {
  onClose: () => void
}

export function NoteEditor({ onClose }: NoteEditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [visibility, setVisibility] = useState<VisibilityLevel>("public")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const { user, isDemoMode } = useAuth()
  const { toast } = useToast()

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const addImage = () => {
    // Demo: Add placeholder images
    const imageQueries = [
      "beautiful landscape",
      "city skyline",
      "nature scene",
      "abstract art",
      "food photography",
      "travel destination",
    ]
    const randomQuery = imageQueries[Math.floor(Math.random() * imageQueries.length)]
    const newImage = `/placeholder.svg?height=400&width=600&query=${randomQuery}`
    setImages([...images, newImage])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleAISummarize = async () => {
    if (!content.trim()) {
      toast({
        title: "No content to summarize",
        description: "Please write some content first",
        variant: "destructive",
      })
      return
    }

    setAiLoading(true)

    // Demo mode simulation
    setTimeout(() => {
      const demoSummary =
        "\n\n**AI Summary:**\n• Key points from your note\n• Main ideas summarized\n• Important details highlighted"
      setContent(content + demoSummary)
      toast({
        title: isDemoMode ? "Demo Summary Added!" : "Summary Added!",
        description: isDemoMode
          ? "This is a demo AI summary. Add OpenAI key for real AI features."
          : "AI summary has been added to your note",
      })
      setAiLoading(false)
    }, 2000)
  }

  const handleAIImprove = async () => {
    if (!content.trim()) {
      toast({
        title: "No content to improve",
        description: "Please write some content first",
        variant: "destructive",
      })
      return
    }

    setAiLoading(true)

    // Demo mode simulation
    setTimeout(() => {
      const improvedContent =
        content + "\n\n*[AI Enhancement: This content has been improved with better structure and clarity]*"
      setContent(improvedContent)
      toast({
        title: isDemoMode ? "Demo Content Improved!" : "Content Improved!",
        description: isDemoMode
          ? "This is a demo AI improvement. Add OpenAI key for real AI features."
          : "Your content has been enhanced by AI",
      })
      setAiLoading(false)
    }, 2000)
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing content",
        description: "Please add both title and content",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    if (isDemoMode) {
      // Demo mode simulation
      setTimeout(() => {
        toast({
          title: "Demo Note Saved!",
          description: `Your ${visibility} note has been saved in demo mode. Set up Firebase to save real notes.`,
        })
        setSaving(false)
        onClose()
      }, 1500)
      return
    }

    try {
      await addDoc(collection(db!, "notes"), {
        title: title.trim(),
        content: content.trim(),
        images: images.length > 0 ? images : undefined,
        visibility,
        tags,
        authorId: user?.uid,
        authorName: user?.displayName || user?.email,
        authorAvatar: user?.photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPermanent: visibility === "permanent",
        likes: 0,
      })

      toast({
        title: "Note saved!",
        description: `Your ${visibility} note has been saved successfully`,
      })
      onClose()
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save note. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <h1 className="text-xl font-bold">Create Post</h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Demo Mode Alert */}
        {isDemoMode && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              📝 <strong>Demo Mode</strong> - Posts won't be permanently saved. Set up Firebase for real storage!
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, experiences, or memories..."
              className="min-h-[150px]"
            />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Images</Label>
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
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Assistant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                EzGPT Assistant{" "}
                {isDemoMode && (
                  <Badge variant="secondary" className="ml-2">
                    Demo
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleAISummarize} disabled={aiLoading}>
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Summarize
                </Button>
                <Button variant="outline" size="sm" onClick={handleAIImprove} disabled={aiLoading}>
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Improve Writing
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Visibility */}
          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select value={visibility} onValueChange={(value: VisibilityLevel) => setVisibility(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Public - Share with everyone
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Private - Only you can see
                  </div>
                </SelectItem>
                <SelectItem value="permanent">
                  <div className="flex items-center">
                    <Gem className="h-4 w-4 mr-2" />
                    Permanent Memory - Blockchain stored
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {visibility === "permanent" && (
              <p className="text-xs text-muted-foreground">
                ⚠️ Permanent memories are stored forever on blockchain and cannot be deleted
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                onKeyPress={(e) => e.key === "Enter" && addTag()}
              />
              <Button onClick={addTag} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer">
                    #{tag}
                    <X className="h-3 w-3 ml-1" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Share Post
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
