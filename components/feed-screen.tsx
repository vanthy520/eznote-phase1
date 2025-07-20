"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, onSnapshot, where, or } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"
import type { Note } from "@/lib/types"
import { NoteCard } from "@/components/note-card"
import { Loader2, Brain } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { demoNotes } from "@/lib/demo-data"

export function FeedScreen() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const { user, isDemoMode } = useAuth()

  useEffect(() => {
    if (isDemoMode) {
      // Use demo data
      setTimeout(() => {
        setNotes(demoNotes)
        setLoading(false)
      }, 1000)
      return
    }

    if (!user || !db) {
      setLoading(false)
      return
    }

    // Real Firebase query
    const q = query(
      collection(db, "notes"),
      or(
        where("authorId", "==", user.uid),
        where("visibility", "==", "public"),
        where("visibility", "==", "permanent"),
      ),
      orderBy("createdAt", "desc"),
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Note[]

      setNotes(notesData)
      setLoading(false)
    })

    return unsubscribe
  }, [user, isDemoMode])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Demo Mode Alert */}
      {isDemoMode && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            🚀 <strong>Demo Mode</strong> - You're viewing sample data. Set up Firebase to save real notes!
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-4">
        <div className="flex items-center">
          <Brain className="h-8 w-8 text-indigo-600 mr-2" />
          <h1 className="text-2xl font-bold">EzNote</h1>
        </div>
        <div className="text-sm text-muted-foreground">{notes.length} notes</div>
      </div>

      {/* Notes Feed */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No notes yet</h3>
            <p className="text-muted-foreground">Start by creating your first note!</p>
          </div>
        ) : (
          notes.map((note) => <NoteCard key={note.id} note={note} />)
        )}
      </div>
    </div>
  )
}
