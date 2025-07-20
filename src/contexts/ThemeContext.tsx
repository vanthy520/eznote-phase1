"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface ThemeColors {
  primary: string
  secondary: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  success: string
  warning: string
  error: string
}

interface ThemeContextType {
  isDark: boolean
  colors: ThemeColors
  toggleTheme: () => void
}

const lightColors: ThemeColors = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  background: "#ffffff",
  surface: "#f8fafc",
  text: "#1e293b",
  textSecondary: "#64748b",
  border: "#e2e8f0",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
}

const darkColors: ThemeColors = {
  primary: "#818cf8",
  secondary: "#a78bfa",
  background: "#0f172a",
  surface: "#1e293b",
  text: "#f1f5f9",
  textSecondary: "#94a3b8",
  border: "#334155",
  success: "#34d399",
  warning: "#fbbf24",
  error: "#f87171",
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightColors,
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme")
      if (savedTheme) {
        setIsDark(savedTheme === "dark")
      }
    } catch (error) {
      console.error("Error loading theme:", error)
    }
  }

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark
      setIsDark(newTheme)
      await AsyncStorage.setItem("theme", newTheme ? "dark" : "light")
    } catch (error) {
      console.error("Error saving theme:", error)
    }
  }

  const colors = isDark ? darkColors : lightColors

  return <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>{children}</ThemeContext.Provider>
}
