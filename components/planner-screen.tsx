"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Plus, Gem, Sparkles, Loader2, Video, Mic, Bell, Download } from "lucide-react"
import { CreatePlannerEventModal } from "@/components/create-planner-event-modal"
import type { Post, PlannerEvent } from "@/lib/types"
import { format, isSameDay, isSameWeek, isSameMonth, addDays, addWeeks, addMonths } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface PlannerScreenProps {
  posts: Post[] // For AI suggestions
}

type PlannerView = "day" | "week" | "month"

export function PlannerScreen({ posts }: PlannerScreenProps) {
  const [activeView, setActiveView] = useState<PlannerView>("day")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [events, setEvents] = useState<PlannerEvent[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<PlannerEvent[]>([])
  const [aiLoading, setAiLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load events from local storage on mount
    const savedEvents = localStorage.getItem("planner_events")
    if (savedEvents) {
      setEvents(
        JSON.parse(savedEvents).map((event: PlannerEvent) => ({
          ...event,
          date: new Date(event.date), // Convert date string back to Date object
        })),
      )
    }
  }, [])

  useEffect(() => {
    // Save events to local storage whenever they change
    localStorage.setItem("planner_events", JSON.stringify(events))
  }, [events])

  const addEvent = (newEvent: PlannerEvent) => {
    setEvents((prevEvents) => {
      const newEvents = [newEvent, ...prevEvents]
      if (newEvent.isRecurring && newEvent.recurrenceType && newEvent.recurrenceCount !== undefined) {
        let currentRecurrenceDate = newEvent.date
        for (let i = 1; i <= newEvent.recurrenceCount; i++) {
          if (newEvent.recurrenceType === "daily") {
            currentRecurrenceDate = addDays(currentRecurrenceDate, 1)
          } else if (newEvent.recurrenceType === "weekly") {
            currentRecurrenceDate = addWeeks(currentRecurrenceDate, 1)
          } else if (newEvent.recurrenceType === "monthly") {
            currentRecurrenceDate = addMonths(currentRecurrenceDate, 1)
          }
          newEvents.push({
            ...newEvent,
            id: `${newEvent.id}-recur-${i}`,
            date: currentRecurrenceDate,
            isPermanent: newEvent.isPermanent, // Recurring events inherit permanence
            ipfsHash: newEvent.isPermanent ? `Qm${Math.random().toString(36).substring(2, 15)}` : undefined,
            nftTokenId: newEvent.isPermanent
              ? Math.floor(Math.random() * 10000)
                  .toString()
                  .padStart(4, "0")
              : undefined,
            originalEventId: newEvent.id,
          })
        }
      }
      return newEvents.sort((a, b) => a.date.getTime() - b.date.getTime())
    })
  }

  const generateAISuggestions = () => {
    setAiLoading(true)
    setTimeout(() => {
      const suggestions: PlannerEvent[] = []
      const processedPosts = new Set<string>() // To avoid duplicate suggestions from same post

      posts.forEach((post) => {
        if (processedPosts.has(post.id)) return

        const lowerContent = post.content.toLowerCase()
        const postDate = post.timestamp

        if (lowerContent.includes("meeting") || lowerContent.includes("call")) {
          suggestions.push({
            id: `ai-sugg-${Date.now()}-${suggestions.length}`,
            title: `Follow up on "${post.content.substring(0, 20)}..."`,
            description: "Suggested by EzAI based on your recent posts.",
            date: addDays(postDate, 1), // Suggest for next day
            isPermanent: false,
            isRecurring: false,
          })
        }
        if (lowerContent.includes("project") || lowerContent.includes("deadline")) {
          suggestions.push({
            id: `ai-sugg-${Date.now()}-${suggestions.length}`,
            title: `Work on "${post.content.substring(0, 20)}..." project`,
            description: "Suggested by EzAI based on your recent posts.",
            date: addWeeks(postDate, 1), // Suggest for next week
            isPermanent: false,
            isRecurring: false,
          })
        }
        if (lowerContent.includes("birthday") || lowerContent.includes("anniversary")) {
          suggestions.push({
            id: `ai-sugg-${Date.now()}-${suggestions.length}`,
            title: `Remember "${post.content.substring(0, 20)}..."`,
            description: "Suggested by EzAI based on your recent posts.",
            date: addMonths(postDate, 1), // Suggest for next month
            isPermanent: false,
            isRecurring: false,
          })
        }
        processedPosts.add(post.id)
      })

      setAiSuggestions(suggestions)
      setAiLoading(false)
      toast({
        title: "AI Suggestions Generated!",
        description: "Check the suggestions section for new event ideas.",
      })
    }, 1500)
  }

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        if (activeView === "day") {
          return isSameDay(event.date, currentDate)
        } else if (activeView === "week") {
          return isSameWeek(event.date, currentDate, { weekStartsOn: 1 }) // Monday start
        } else if (activeView === "month") {
          return isSameMonth(event.date, currentDate)
        }
        return false
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [events, activeView, currentDate])

  const getDisplayDate = () => {
    if (activeView === "day") {
      return format(currentDate, "EEEE, MMMM d, yyyy")
    } else if (activeView === "week") {
      const startOfWeek = format(currentDate, "MMM d")
      const endOfWeek = format(addDays(currentDate, 6), "MMM d, yyyy")
      return `${startOfWeek} - ${endOfWeek}`
    } else if (activeView === "month") {
      return format(currentDate, "MMMM yyyy")
    }
    return ""
  }

  const navigateDate = (direction: "prev" | "next") => {
    if (activeView === "day") {
      setCurrentDate(addDays(currentDate, direction === "next" ? 1 : -1))
    } else if (activeView === "week") {
      setCurrentDate(addWeeks(currentDate, direction === "next" ? 1 : -1))
    } else if (activeView === "month") {
      setCurrentDate(addMonths(currentDate, direction === "next" ? 1 : -1))
    }
  }

  const exportEvents = (formatType: "json" | "csv") => {
    const data = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description || "",
      date: event.date.toISOString(),
      isPermanent: event.isPermanent,
      ipfsHash: event.ipfsHash || "",
      nftTokenId: event.nftTokenId || "",
      isRecurring: event.isRecurring,
      recurrenceType: event.recurrenceType || "",
      recurrenceCount: event.recurrenceCount || 0,
      videoUrl: event.videoUrl || "",
      audioUrl: event.audioUrl || "",
      reminders: event.reminders ? event.reminders.join(",") : "",
    }))

    let fileContent: string
    let fileName: string
    let mimeType: string

    if (formatType === "json") {
      fileContent = JSON.stringify(data, null, 2)
      fileName = "eznote_planner_events.json"
      mimeType = "application/json"
    } else {
      const headers = Object.keys(data[0] || {}).join(",")
      const rows = data.map((row) =>
        Object.values(row)
          .map((value) => `"${value}"`)
          .join(","),
      )
      fileContent = [headers, ...rows].join("\n")
      fileName = "eznote_planner_events.csv"
      mimeType = "text/csv"
    }

    const blob = new Blob([fileContent], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Events Exported!",
      description: `Your planner events have been exported as ${formatType.toUpperCase()}.`,
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CalendarDays className="h-8 w-8 text-purple-600 mr-2" />
            <h1 className="text-2xl font-bold">Planner</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportEvents("json")}>
              <Download className="h-4 w-4 mr-2" />
              JSON
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportEvents("csv")}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>

        {/* View Filters */}
        <div className="flex gap-2 mb-4">
          <Button variant={activeView === "day" ? "default" : "outline"} size="sm" onClick={() => setActiveView("day")}>
            Day
          </Button>
          <Button
            variant={activeView === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveView("week")}
          >
            Week
          </Button>
          <Button
            variant={activeView === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveView("month")}
          >
            Month
          </Button>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigateDate("prev")}>
            {"<"}
          </Button>
          <h2 className="text-lg font-semibold">{getDisplayDate()}</h2>
          <Button variant="ghost" size="icon" onClick={() => navigateDate("next")}>
            {">"}
          </Button>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
              EzAI Planner Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={generateAISuggestions} disabled={aiLoading} className="w-full mb-4">
              {aiLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Generate Suggestions from Posts
            </Button>
            {aiSuggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Click to add to your planner:</p>
                {aiSuggestions.map((sugg) => (
                  <Button
                    key={sugg.id}
                    variant="outline"
                    className="w-full justify-start h-auto py-2 bg-transparent"
                    onClick={() => {
                      addEvent(sugg)
                      setAiSuggestions(aiSuggestions.filter((item) => item.id !== sugg.id)) // Remove after adding
                      toast({
                        title: "Suggestion Added!",
                        description: `"${sugg.title}" added to your planner.`,
                      })
                    }}
                  >
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{sugg.title}</span>
                      <span className="text-xs text-muted-foreground">{format(sugg.date, "MMM d, yyyy")}</span>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Planner Events */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No events for this view.</h3>
            <p className="text-muted-foreground">Add a new event or try a different view!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <div className="flex items-center gap-2">
                      {event.isPermanent && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <Gem className="h-3 w-3 mr-1" />
                          Permanent
                        </Badge>
                      )}
                      {event.isRecurring && <Badge variant="secondary">Recurring</Badge>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{format(event.date, "MMM d, yyyy 'at' h:mm a")}</p>
                  {event.description && <p className="text-sm">{event.description}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    {event.videoUrl && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Video className="h-3 w-3" /> Video
                      </Badge>
                    )}
                    {event.audioUrl && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Mic className="h-3 w-3" /> Audio
                      </Badge>
                    )}
                    {event.reminders && event.reminders.length > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Bell className="h-3 w-3" /> Reminders
                      </Badge>
                    )}
                  </div>
                  {event.isPermanent && event.ipfsHash && (
                    <div className="mt-2 p-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                      <p className="text-xs text-purple-700 dark:text-purple-300 flex items-center">
                        <Gem className="h-3 w-3 mr-1" />
                        IPFS Hash: {event.ipfsHash.slice(0, 10)}...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button for Add Event */}
      <Button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-lg z-40"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <CreatePlannerEventModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onEventAdded={addEvent}
      />
    </div>
  )
}
