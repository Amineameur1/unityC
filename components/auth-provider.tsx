"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@/services/auth"

// Define auth context type
type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check auth status when app loads
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userStr = localStorage.getItem("user")
        if (userStr) {
          const currentUser = JSON.parse(userStr)
          setUser(currentUser)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        setUser(null)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Redirect based on auth status
  useEffect(() => {
    if (isLoading) return // Don't redirect while loading

    // Store current path to return to after login
    const currentPath = pathname || "/"

    // If user is not logged in and trying to access a protected page
    if (!user && currentPath.startsWith("/dashboard")) {
      // Store requested path in localStorage to return after login
      localStorage.setItem("authRedirectPath", currentPath)
      router.push("/login")
      return
    }

    // If user is logged in and trying to access login or register page
    if (user && (currentPath === "/login" || currentPath === "/register" || currentPath.startsWith("/register/"))) {
      // Check for a saved path to return to
      const redirectPath = localStorage.getItem("authRedirectPath") || "/dashboard"
      localStorage.removeItem("authRedirectPath") // Clear saved path after using it
      router.push(redirectPath)
      return
    }
  }, [user, isLoading, pathname, router])

  // Update the login function to store the token properly
  const login = async (username: string, password: string) => {
    setIsLoading(true)

    try {
      // Validate inputs
      if (!username.trim()) {
        return { success: false, error: "Username is required" }
      }

      if (!password.trim()) {
        return { success: false, error: "Password is required" }
      }

      // Use the internal API endpoint instead of direct endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Login failed",
        }
      }

      // Validate that we have a user object with required fields
      if (!data.user) {
        return {
          success: false,
          error: "Invalid user data received",
        }
      }

      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(data.user))

      // Store token if available
      if (data.token) {
        localStorage.setItem("token", data.token)
      } else {
        // If no token is provided, create a mock token for development
        localStorage.setItem("token", `mock-token-${Date.now()}`)
      }

      setUser(data.user)

      // Check for a saved redirect path
      const redirectPath = localStorage.getItem("authRedirectPath") || "/dashboard"
      localStorage.removeItem("authRedirectPath") // Clear the saved path after using it

      router.push(redirectPath)
      return { success: true, user: data.user }
    } catch (error: any) {
      console.error("Login error:", error)
      return {
        success: false,
        error: error.message || "An error occurred while trying to log in",
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Call the logout API endpoint
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
      })

      // Even if the API call fails, we should still clear local storage and redirect

      // Remove user data from localStorage
      localStorage.removeItem("user")
      localStorage.removeItem("token")

      // Update user state to null
      setUser(null)

      // Redirect user to login page
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)

      // Even in case of error, remove user data and redirect
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      setUser(null)
      router.push("/login")
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

