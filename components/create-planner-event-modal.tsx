"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Gem, Loader2, Repeat } from "lucide-react"
import { useEzCoin } from "@/components/ezcoin-provider"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import type { PlannerEvent } from "@/lib/types"

interface CreatePlannerEventModalProps {
  visible: boolean
  onClose: () => void
  onEventAdded: (event: PlannerEvent) => void
}

export function CreatePlannerEventModal({ visible, onClose, onEventAdded }: CreatePlannerEventModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [time, setTime] = useState(format(new Date(), "HH:mm"))
  const [isPermanent, setIsPermanent] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrenceType, setRecurrenceType] = useState<"daily" | "weekly" | "monthly">("daily")
  const [recurrenceCount, setRecurrenceCount] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const { spendEzCoins, balance } = useEzCoin()
  const { toast } = useToast()

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDate(format(new Date(), "yyyy-MM-dd"))
    setTime(format(new Date(), "HH:mm"))
    setIsPermanent(false)
    setIsRecurring(false)
    setRecurrenceType("daily")
    setRecurrenceCount(1)
  }

  const calculateCost = () => {
    let cost = 0
    if (isPermanent) {
      cost += 1
    }
    if (isRecurring) {
      cost += recurrenceCount // 1 EzCoin per recurrence
    }
    return cost
  }

  const handleSaveEvent = async () => {
    if (!title.trim() || !date || !time) {
      toast({
        title: "Missing Information",
        description: "Please provide a title, date, and time for your event.",
        variant: "destructive",
      })
      return
    }

    const eventDateTime = new Date(`${date}T${time}:00`)
    if (isNaN(eventDateTime.getTime())) {
      toast({
        title: "Invalid Date/Time",
        description: "Please select a valid date and time.",
        variant: "destructive",
      })
      return
    }

    const cost = calculateCost()
    if (cost > 0 && balance < cost) {
      toast({
        title: "Insufficient EzCoins",
        description: `You need ${cost} EzCoins to save this event. You only have ${balance}.`,
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    // Simulate blockchain interaction and EzCoin deduction
    setTimeout(async () => {
      let success = true
      if (cost > 0) {
        success = await spendEzCoins(
          cost,
          `Create Planner Event (Permanent: ${isPermanent}, Recurring: ${isRecurring ? `${recurrenceCount}x ${recurrenceType}` : "No"})`,
        )
      }

      if (success) {
        const ipfsHash = isPermanent
          ? `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
          : undefined
        const nftTokenId = isPermanent
          ? Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, "0")
          : undefined

        const newEvent: PlannerEvent = {
          id: `event-${Date.now()}`,
          title: title.trim(),
          description: description.trim() || undefined,
          date: eventDateTime,
          isPermanent,
          ipfsHash,
          nftTokenId,
          isRecurring,
          recurrenceType: isRecurring ? recurrenceType : undefined,
          recurrenceCount: isRecurring ? recurrenceCount : undefined,
        }

        onEventAdded(newEvent)

        toast({
          title: "Event Saved!",
          description: `"${title}" has been added to your planner. Cost: ${cost} EzCoins.`,
        })
        resetForm()
        onClose()
      }
      setIsSaving(false)
    }, 1500)
  }

  const currentCost = calculateCost()

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-purple-500" />
            Add New Planner Event
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-title">Title</Label>
            <Input
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description">Description (Optional)</Label>
            <Textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details about the event..."
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-date">Date</Label>
              <Input id="event-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-time">Time</Label>
              <Input id="event-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="permanent-save" className="flex items-center gap-2">
              <Gem className="h-4 w-4 text-purple-500" />
              Save Permanently to Blockchain
            </Label>
            <Switch id="permanent-save" checked={isPermanent} onCheckedChange={setIsPermanent} />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="recurring-event" className="flex items-center gap-2">
              <Repeat className="h-4 w-4 text-blue-500" />
              Recurring Event
            </Label>
            <Switch id="recurring-event" checked={isRecurring} onCheckedChange={setIsRecurring} />
          </div>

          {isRecurring && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recurrence-type">Recurrence</Label>
                <Select
                  value={recurrenceType}
                  onValueChange={(value: "daily" | "weekly" | "monthly") => setRecurrenceType(value)}
                >
                  <SelectTrigger id="recurrence-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recurrence-count">Occurrences</Label>
                <Input
                  id="recurrence-count"
                  type="number"
                  min="1"
                  value={recurrenceCount}
                  onChange={(e) => setRecurrenceCount(Math.max(1, Number.parseInt(e.target.value) || 1))}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Badge variant="secondary" className="text-sm">
              Cost: {currentCost} EzCoins
            </Badge>
            <div className="flex gap-2">
              <Button onClick={handleSaveEvent} disabled={isSaving} className="flex-1">
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Event"
                )}
              </Button>
              <Button variant="outline" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
