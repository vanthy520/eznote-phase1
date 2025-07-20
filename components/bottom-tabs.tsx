"use client"

import { useState } from "react"
import { LayoutDashboard, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import DashboardScreen from "./dashboard-screen"
import PlannerScreen from "./planner-screen" // Corrected import path and component name

export function BottomTabs() {
  const [activeTab, setActiveTab] = useState("planner") // Default to planner

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardScreen />
      case "planner":
        return <PlannerScreen />
      default:
        return <PlannerScreen />
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-auto">{renderContent()}</main>
      <nav className="sticky bottom-0 left-0 right-0 bg-background border-t p-2 flex justify-around items-center shadow-lg">
        <Button
          variant="ghost"
          className={cn(
            "flex flex-col items-center gap-1 text-sm",
            activeTab === "dashboard" ? "text-primary" : "text-muted-foreground",
          )}
          onClick={() => setActiveTab("dashboard")}
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "flex flex-col items-center gap-1 text-sm",
            activeTab === "planner" ? "text-primary" : "text-muted-foreground",
          )}
          onClick={() => setActiveTab("planner")}
        >
          <CalendarDays className="w-5 h-5" />
          Planner
        </Button>
      </nav>
    </div>
  )
}
