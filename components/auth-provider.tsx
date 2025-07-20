"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { auth, isFirebaseEnabled } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  isDemoMode: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isDemoMode: false,
})

export const useAuth = () => useContext(AuthContext)

// Mock user for demo mode
const mockUser = {
  uid: "demo-user-123",
  email: "demo@eznote.com",
  displayName: "Demo User",
  photoURL: "/placeholder.svg?height=40&width=40",
  emailVerified: true,
} as User

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseEnabled) {
      // Demo mode - simulate logged in user
      setTimeout(() => {
        setUser(mockUser)
        setLoading(false)
      }, 1000)
      return
    }

    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isDemoMode: !isFirebaseEnabled }}>{children}</AuthContext.Provider>
  )
}
