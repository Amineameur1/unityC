"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Layers, Lock, Mail, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Get return path from query parameters if exists
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const user = sessionStorage.getItem("user")
      if (user) {
        // Use window.location.href instead of router.push to avoid routing issues
        window.location.href = callbackUrl
      }
    }

    checkAuth()
  }, [callbackUrl])

  // Update the handleSubmit function to properly handle login errors
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null) // Clear previous errors

    try {
      // Validate input
      if (!username.trim()) {
        throw new Error("Username is required")
      }

      if (!password.trim()) {
        throw new Error("Password is required")
      }

      // Use the internal API endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error("Invalid username or password")
        } else if (response.status === 403) {
          throw new Error("Your account is inactive or has been suspended")
        } else {
          throw new Error(data.error || "Login failed")
        }
      }

      // Validate the user data
      if (!data.user) {
        throw new Error("Invalid user data received")
      }

      // Store user info in sessionStorage
      sessionStorage.setItem("user", JSON.stringify(data.user))
      if (data.token) {
        sessionStorage.setItem("token", data.token)
      }

      toast({
        title: "Login successful",
        description: "Welcome to the Enterprise Management System",
      })

      // تعديل منطق إعادة التوجيه بعد تسجيل الدخول الناجح
      if (data.user.role === "Employee") {
        window.location.href = "/dashboard/tasks/my-tasks"
        return
      } else if (data.user.role === "Owner" || data.user.role === "Admin") {
        // حفظ مسار العودة إذا كان موجودًا
        if (callbackUrl && callbackUrl !== "/dashboard") {
          sessionStorage.setItem("authRedirectPath", callbackUrl)
        }

        // إعادة التوجيه إلى لوحة التحكم
        window.location.href = "/dashboard"
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "An error occurred while trying to log in. Please try again.")

      toast({
        title: "Login failed",
        description: error.message || "An error occurred while trying to log in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-background p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full bg-primary/10 p-2">
            <Layers className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Enter your credentials to access your account</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Email or Username
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your email or username"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm font-normal ml-2">
                Remember me
              </Label>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">OR</span>
          </div>
        </div>

        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
