"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth"
import { auth, isFirebaseEnabled } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { Brain, Mail, Lock, Info } from "lucide-react"

export function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFirebaseEnabled) {
      toast({
        title: "Demo Mode",
        description: "Firebase not configured. You're automatically logged in as demo user.",
      })
      return
    }

    setLoading(true)

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth!, email, password)
      } else {
        await createUserWithEmailAndPassword(auth!, email, password)
      }
      toast({
        title: "Success!",
        description: isLogin ? "Logged in successfully" : "Account created successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    if (!isFirebaseEnabled) {
      toast({
        title: "Demo Mode",
        description: "Firebase not configured. You're automatically logged in as demo user.",
      })
      return
    }

    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth!, provider)
      toast({
        title: "Success!",
        description: "Logged in with Google successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // In demo mode, this component won't be shown because user is auto-logged in
  if (!isFirebaseEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 text-indigo-600 mr-2" />
              <CardTitle className="text-2xl font-bold">EzNote Demo</CardTitle>
            </div>
            <CardDescription>Loading demo mode...</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>Firebase not configured. Running in demo mode with sample data.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-indigo-600 mr-2" />
            <CardTitle className="text-2xl font-bold">EzNote</CardTitle>
          </div>
          <CardDescription>{isLogin ? "Welcome back!" : "Create your account"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGoogleAuth} disabled={loading} className="w-full bg-transparent" variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              <Lock className="h-4 w-4 mr-2" />
              {isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="text-center">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-sm">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
