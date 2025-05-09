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
        const userStr = sessionStorage.getItem("user")
        const storedAccessToken = sessionStorage.getItem("accessToken") || sessionStorage.getItem("token")
        const storedRefreshToken = sessionStorage.getItem("refreshToken")

        console.log("Checking auth status...")
        console.log(`User data in sessionStorage: ${userStr ? "Present" : "Not present"}`)
        console.log(`Access token in sessionStorage: ${storedAccessToken ? "Present" : "Not present"}`)
        console.log(`Refresh token in sessionStorage: ${storedRefreshToken ? "Present" : "Not present"}`)

        if (userStr) {
          const currentUser = JSON.parse(userStr)
          console.log("User data:", currentUser)

          // تأكد من أن معرف القسم متاح للمستخدمين من نوع Admin
          if (currentUser.role === "Admin") {
            // استخراج معرف القسم من أي مكان متاح
            const departmentId =
              currentUser.department ||
              currentUser.departmentId ||
              (currentUser.user && currentUser.user.department) ||
              (currentUser.user && currentUser.user.departmentId)

            if (departmentId) {
              currentUser.departmentId = departmentId
              console.log(`Setting departmentId for Admin user: ${departmentId}`)
              // تحديث sessionStorage بالقيمة الجديدة
              sessionStorage.setItem("user", JSON.stringify(currentUser))
            } else {
              console.warn("Admin user without department ID!")
            }
          }

          setUser(currentUser)
        } else {
          setUser(null)
        }

        if (storedAccessToken) {
          setAccessToken(storedAccessToken)
          // تأكد من تخزين التوكن في كلا المكانين للتوافق
          sessionStorage.setItem("accessToken", storedAccessToken)
          sessionStorage.setItem("token", storedAccessToken)
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
        sessionStorage.setItem("accessToken", data.accessToken)
        sessionStorage.setItem("token", data.accessToken) // تخزين التوكن في كلا المكانين للتوافق
        setAccessToken(data.accessToken)

        // Update refresh token if a new one is provided
        if (data.refreshToken) {
          sessionStorage.setItem("refreshToken", data.refreshToken)
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
      // Store requested path in sessionStorage to return after login
      sessionStorage.setItem("authRedirectPath", currentPath)
      router.push("/login")
      return
    }

    // If user is logged in and trying to access login or register page
    if (user && (currentPath === "/login" || currentPath === "/register" || currentPath.startsWith("/register/"))) {
      // للموظفين، إعادة التوجيه مباشرة إلى المهام
      if (user.role === "Employee") {
        router.push("/dashboard/tasks/my-tasks")
        return
      }

      // للأدوار الأخرى (المالك والمسؤول)، التحقق من وجود مسار محفوظ للعودة إليه
      const redirectPath = sessionStorage.getItem("authRedirectPath") || "/dashboard"
      sessionStorage.removeItem("authRedirectPath") // مسح المسار المحفوظ بعد استخدامه
      router.push(redirectPath)
      return
    }

    // إعادة توجيه الموظفين من جذر لوحة التحكم إلى المهام
    if (user && user.role === "Employee" && currentPath === "/dashboard") {
      router.push("/dashboard/tasks/my-tasks")
      return
    }
  }, [user, isLoading, pathname, router])

  // Helper function to get auth header
  const getAuthHeader = () => {
    const token = accessToken || sessionStorage.getItem("accessToken") || sessionStorage.getItem("token")
    console.log(`getAuthHeader called, token: ${token ? "Present" : "Not present"}`)
    return token ? { Authorization: `Bearer ${token}` } : {}
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

      console.log("Login response:", data)

      // تأكد من أن معرف القسم موجود في كائن المستخدم
      // إذا كان المستخدم من نوع Admin، تأكد من حفظ معرف القسم
      if (data.user.role === "Admin") {
        // استخراج معرف القسم من أي مكان متاح
        const departmentId =
          data.user.department ||
          data.user.departmentId ||
          (data.user.user && data.user.user.department) ||
          (data.user.user && data.user.user.departmentId)

        if (departmentId) {
          data.user.departmentId = departmentId
          console.log("Admin user with department ID:", departmentId)
        } else {
          console.warn("Admin user without department ID in login response!")
        }
      }

      // Store user info in sessionStorage
      sessionStorage.setItem("user", JSON.stringify(data.user))

      // Store tokens if available
      if (data.accessToken) {
        sessionStorage.setItem("accessToken", data.accessToken)
        sessionStorage.setItem("token", data.accessToken) // تخزين التوكن في كلا المكانين للتوافق
        setAccessToken(data.accessToken)
        console.log("Stored access token:", data.accessToken)
      }

      if (data.refreshToken) {
        sessionStorage.setItem("refreshToken", data.refreshToken)
        setRefreshToken(data.refreshToken)
        console.log("Stored refresh token:", data.refreshToken)
      }

      setUser(data.user)

      // تعديل الجزء الخاص بإعادة التوجيه بعد تسجيل الدخول
      if (data.user.role === "Employee") {
        router.push("/dashboard/tasks/my-tasks")
        return { success: true, user: data.user }
      } else if (data.user.role === "Admin" || data.user.role === "Owner") {
        // توجيه المالك والمسؤول إلى لوحة التحكم الرئيسية
        const redirectPath = sessionStorage.getItem("authRedirectPath") || "/dashboard"
        sessionStorage.removeItem("authRedirectPath") // مسح المسار المحفوظ بعد استخدامه
        router.push(redirectPath)
        return { success: true, user: data.user }
      }

      // For other roles, check for a saved redirect path
      const redirectPath = sessionStorage.getItem("authRedirectPath") || "/dashboard"
      sessionStorage.removeItem("authRedirectPath") // Clear the saved path after using it

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

      // Even if the API call fails, we should still clear sessionStorage and redirect

      // Remove user data and tokens from sessionStorage
      sessionStorage.removeItem("user")
      sessionStorage.removeItem("accessToken")
      sessionStorage.removeItem("token") // إزالة التوكن من كلا المكانين
      sessionStorage.removeItem("refreshToken")

      // Update state to null
      setUser(null)
      setAccessToken(null)
      setRefreshToken(null)

      // Redirect user to login page
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)

      // Even in case of error, remove user data and redirect
      sessionStorage.removeItem("user")
      sessionStorage.removeItem("accessToken")
      sessionStorage.removeItem("token") // إزالة التوكن من كلا المكانين
      sessionStorage.removeItem("refreshToken")
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
