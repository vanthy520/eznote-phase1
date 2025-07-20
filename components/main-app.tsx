"use client"

import { useState } from "react"
import { Home, Lock, BookOpen, Clock, Settings, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HomeFeedScreen } from "@/components/home-feed-screen"
import { PrivateRoomScreen } from "@/components/private-room-screen"
import { NotebooksScreen } from "@/components/notebooks-screen"
import { TimelineScreen } from "@/components/timeline-screen"
import { SettingsScreen } from "@/components/settings-screen"
import { CreatePostModal } from "@/components/create-post-modal"
import type { Post } from "@/lib/types" // Import Post type

type Tab = "home" | "private" | "notebooks" | "timeline" | "settings"

export function MainApp() {
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [posts, setPosts] = useState<Post[]>([]) // Global posts state

  const addPost = (newPost: Post) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]) // Add new post to the beginning
  }

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeFeedScreen posts={posts} setPosts={setPosts} /> // Pass posts and setter
      case "private":
        return <PrivateRoomScreen posts={posts.filter((p) => p.visibility === "private")} /> // Filter private posts
      case "notebooks":
        return <NotebooksScreen />
      case "timeline":
        return <TimelineScreen posts={posts} /> // Pass all posts to timeline
      case "settings":
        return <SettingsScreen />
      default:
        return <HomeFeedScreen posts={posts} setPosts={setPosts} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="pb-20">{renderScreen()}</div>

      {/* Floating Action Button */}
      <Button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-lg z-40"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-30">
        <div className="flex items-center justify-around py-2 px-4">
          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("home")}
            className="flex flex-col items-center gap-1 h-16 px-3"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant={activeTab === "private" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("private")}
            className="flex flex-col items-center gap-1 h-16 px-3"
          >
            <Lock className="h-5 w-5" />
            <span className="text-xs">Private</span>
          </Button>
          <Button
            variant={activeTab === "notebooks" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("notebooks")}
            className="flex flex-col items-center gap-1 h-16 px-3"
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-xs">Notebooks</span>
          </Button>
          <Button
            variant={activeTab === "timeline" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("timeline")}
            className="flex flex-col items-center gap-1 h-16 px-3"
          >
            <Clock className="h-5 w-5" />
            <span className="text-xs">Timeline</span>
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("settings")}
            className="flex flex-col items-center gap-1 h-16 px-3"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </div>

      <CreatePostModal visible={showCreateModal} onClose={() => setShowCreateModal(false)} onPostCreated={addPost} />
    </div>
  )
}
