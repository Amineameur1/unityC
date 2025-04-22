"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@/services/auth"

// Define auth context type
type AuthContextType = {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshAccessToken: () => Promise<boolean>
  isLoading: boolean
  getAuthHeader: () => { Authorization?: string }
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check auth status when app loads
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userStr = localStorage.getItem("user")
        const storedAccessToken = localStorage.getItem("accessToken")
        const storedRefreshToken = localStorage.getItem("refreshToken")

        if (userStr) {
          const currentUser = JSON.parse(userStr)
          setUser(currentUser)
        } else {
          setUser(null)
        }

        if (storedAccessToken) {
          setAccessToken(storedAccessToken)
        } else {
          setAccessToken(null)
        }

        if (storedRefreshToken) {
          setRefreshToken(storedRefreshToken)
        } else {
          setRefreshToken(null)
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        setUser(null)
        setAccessToken(null)
        setRefreshToken(null)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Refresh token function
  const refreshAccessToken = async (): Promise<boolean> => {
    if (!refreshToken) {
      return false
    }

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        throw new Error("Failed to refresh token")
      }

      const data = await response.json()

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken)
        setAccessToken(data.accessToken)

        // Update refresh token if a new one is provided
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken)
          setRefreshToken(data.refreshToken)
        }

        return true
      }

      return false
    } catch (error) {
      console.error("Error refreshing token:", error)
      return false
    }
  }

  // Set up token refresh interval
  useEffect(() => {
    // Only set up refresh if we have a refresh token
    if (!refreshToken) return

    // Refresh token every 1.5 minutes (since access token expires in 2 minutes)
    const refreshInterval = setInterval(() => {
      refreshAccessToken().catch(console.error)
    }, 90000) // 90 seconds = 1.5 minutes

    return () => clearInterval(refreshInterval)
  }, [refreshToken])

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
      // For employees, redirect directly to tasks
      if (user.role === "Employee") {
        router.push("/dashboard/tasks/my-tasks")
        return
      }

      // For other roles, check for a saved path to return to
      const redirectPath = localStorage.getItem("authRedirectPath") || "/dashboard"
      localStorage.removeItem("authRedirectPath") // Clear saved path after using it
      router.push(redirectPath)
      return
    }

    // Redirect employees from dashboard root to tasks
    if (user && user.role === "Employee" && currentPath === "/dashboard") {
      router.push("/dashboard/tasks/my-tasks")
      return
    }
  }, [user, isLoading, pathname, router])

  // Helper function to get auth header
  const getAuthHeader = () => {
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
  }

  // Update the login function to work with token-based authentication
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

      // Use the internal API endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include", // Important for cookies
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

      // Store tokens if available
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken)
        setAccessToken(data.accessToken)
      }

      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken)
        setRefreshToken(data.refreshToken)
      }

      setUser(data.user)

      // For employees, redirect directly to tasks
      if (data.user.role === "Employee") {
        router.push("/dashboard/tasks/my-tasks")
        return { success: true, user: data.user }
      }

      // For other roles, check for a saved redirect path
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
        credentials: "include", // Important for cookies
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      })

      // Even if the API call fails, we should still clear local storage and redirect

      // Remove user data and tokens from localStorage
      localStorage.removeItem("user")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")

      // Update state to null
      setUser(null)
      setAccessToken(null)
      setRefreshToken(null)

      // Redirect user to login page
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)

      // Even in case of error, remove user data and redirect
      localStorage.removeItem("user")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      setUser(null)
      setAccessToken(null)
      setRefreshToken(null)
      router.push("/login")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        refreshAccessToken,
        isLoading,
        getAuthHeader,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
