export interface Note {
  id: string
  title: string
  content: string
  images?: string[] // Array of image URLs
  visibility: "private" | "public" | "permanent"
  tags: string[]
  authorId: string
  authorName: string
  authorAvatar?: string
  createdAt: Date
  updatedAt: Date
  isPermanent?: boolean
  blockchainHash?: string
  ipfsHash?: string
  likes?: number
  comments?: Comment[]
}

export interface Comment {
  id: string
  content: string
  authorId: string
  authorName: string
  authorAvatar?: string
  createdAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  walletAddress?: string
  createdAt: Date
}

export interface Post {
  id: string
  content: string
  author: {
    address: string
    name: string
    avatar: string | null
  }
  timestamp: Date
  likes: number
  comments: number
  isLiked: boolean
  images: string[]
  ipfsHash: string
  nftTokenId: string
  visibility: "public" | "private"
}

export interface Notebook {
  id: string
  title: string
  description: string
  tags: string[]
  postCount: number
  nftCount: number
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  address: string
  name: string
  avatar?: string
  ezCoinBalance: number
  totalPosts: number
  totalNFTs: number
}

export type VisibilityLevel = "private" | "public" | "permanent"

export interface PlannerEvent {
  id: string
  title: string
  description?: string
  date: Date
  isPermanent: boolean
  ipfsHash?: string
  nftTokenId?: string
  isRecurring: boolean
  recurrenceType?: "daily" | "weekly" | "monthly"
  recurrenceCount?: number // Number of times it recurs, or -1 for indefinite (for demo)
  originalEventId?: string // For recurring event instances
  videoUrl?: string // New: URL for video attachment
  audioUrl?: string // New: URL for audio attachment
  reminders?: number[] // New: Array of minutes before event (e.g., [5, 30, 60])
}
