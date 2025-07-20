"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SocialNoteCard } from "@/components/social-note-card"
import { NoteCard } from "@/components/note-card"
import { Search, Filter, X, Users, Lock } from "lucide-react"
import type { Note } from "@/lib/types"
import { collection, query, where, orderBy, onSnapshot, or } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"
import { demoNotes, demoPrivateNotes } from "@/lib/demo-data"

export function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allPublicNotes, setAllPublicNotes] = useState<Note[]>([])
  const [allPrivateNotes, setAllPrivateNotes] = useState<Note[]>([])
  const [filteredPublicNotes, setFilteredPublicNotes] = useState<Note[]>([])
  const [filteredPrivateNotes, setFilteredPrivateNotes] = useState<Note[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const { user, isDemoMode } = useAuth()

  useEffect(() => {
    if (isDemoMode) {
      // Use mock data
      setAllPublicNotes(demoNotes)
      setAllPrivateNotes(demoPrivateNotes)

      const allNotes = [...demoNotes, ...demoPrivateNotes]
      const tags = new Set<string>()
      allNotes.forEach((note) => note.tags.forEach((t) => tags.add(t)))
      setAvailableTags(Array.from(tags))
      return
    }

    if (!user || !db) return

    // Query for all notes (public and user's private)
    const publicQuery = query(
      collection(db, "notes"),
      or(where("visibility", "==", "public"), where("visibility", "==", "permanent")),
      orderBy("createdAt", "desc"),
    )

    const privateQuery = query(
      collection(db, "notes"),
      where("authorId", "==", user.uid),
      where("visibility", "==", "private"),
      orderBy("createdAt", "desc"),
    )

    const unsubscribePublic = onSnapshot(publicQuery, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Note[]
      setAllPublicNotes(notesData)
    })

    const unsubscribePrivate = onSnapshot(privateQuery, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Note[]
      setAllPrivateNotes(notesData)
    })

    // Extract tags from all notes
    const allNotes = [...allPublicNotes, ...allPrivateNotes]
    const tags = new Set<string>()
    allNotes.forEach((note) => note.tags.forEach((t) => tags.add(t)))
    setAvailableTags(Array.from(tags))

    return () => {
      unsubscribePublic()
      unsubscribePrivate()
    }
  }, [user, isDemoMode])

  useEffect(() => {
    const filterNotes = (notes: Note[]) => {
      let filtered = notes

      // Filter by search query
      if (searchQuery.trim()) {
        filtered = filtered.filter(
          (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
        )
      }

      // Filter by selected tags
      if (selectedTags.length > 0) {
        filtered = filtered.filter((note) => selectedTags.some((tag) => note.tags.includes(tag)))
      }

      return filtered
    }

    setFilteredPublicNotes(filterNotes(allPublicNotes))
    setFilteredPrivateNotes(filterNotes(allPrivateNotes))
  }, [allPublicNotes, allPrivateNotes, searchQuery, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-20 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Search</h1>
          {(searchQuery || selectedTags.length > 0) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts, notes, tags..."
            className="pl-10"
          />
        </div>

        {/* Tags Filter */}
        {availableTags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Filter className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Filter by tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.slice(0, 10).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="p-4">
        <Tabs defaultValue="public" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="public" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Public Posts ({filteredPublicNotes.length})
            </TabsTrigger>
            <TabsTrigger value="private" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              My Private ({filteredPrivateNotes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="public" className="space-y-4 mt-4">
            {filteredPublicNotes.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No public posts found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
              </div>
            ) : (
              filteredPublicNotes.map((note) => <SocialNoteCard key={note.id} note={note} />)
            )}
          </TabsContent>

          <TabsContent value="private" className="space-y-4 mt-4">
            {filteredPrivateNotes.length === 0 ? (
              <div className="text-center py-12">
                <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No private notes found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or create some private notes</p>
              </div>
            ) : (
              filteredPrivateNotes.map((note) => <NoteCard key={note.id} note={note} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
