"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@/services/auth"

// Define auth context type
type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => Promise<void>
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
  // تعديل آلية التوجيه بناءً على حالة المصادقة
  useEffect(() => {
    if (isLoading) return // لا تقم بأي توجيه أثناء التحميل

    // تخزين المسار الحالي للرجوع إليه بعد تسجيل الدخول
    const currentPath = pathname || "/"

    // إذا كان المستخدم غير مسجل الدخول ويحاول الوصول إلى صفحة محمية
    if (!user && currentPath.startsWith("/dashboard")) {
      // تخزين المسار المطلوب في localStorage للعودة إليه بعد تسجيل الدخول
      localStorage.setItem("authRedirectPath", currentPath)
      router.push("/login")
      return
    }

    // إذا كان المستخدم مسجل الدخول ويحاول الوصول إلى صفحة تسجيل الدخول أو التسجيل
    if (user && (currentPath === "/login" || currentPath === "/register" || currentPath.startsWith("/register/"))) {
      // التحقق من وجود مسار محفوظ للعودة إليه
      const redirectPath = localStorage.getItem("authRedirectPath") || "/dashboard"
      localStorage.removeItem("authRedirectPath") // مسح المسار المحفوظ بعد استخدامه
      router.push(redirectPath)
      return
    }
  }, [user, isLoading, pathname, router])

  // تعديل وظيفة تسجيل الدخول لمعالجة الاستجابة بالشكل الصحيح
  // Login function
  // تعديل وظيفة تسجيل الدخول
  const login = async (username: string, password: string) => {
    setIsLoading(true)

    try {
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

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Login failed")
      }

      const data = await response.json()

      // Validate that we have a user object with required fields
      if (!data.user || !data.user.role) {
        throw new Error("Invalid user data received from server")
      }

      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(data.user))
      if (data.token) {
        localStorage.setItem("token", data.token)
      }

      setUser(data.user)

      // Check for a saved redirect path
      const redirectPath = localStorage.getItem("authRedirectPath") || "/dashboard"
      localStorage.removeItem("authRedirectPath") // Clear the saved path after using it

      router.push(redirectPath)
      return { user: data.user }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    try {
      // إزالة بيانات المستخدم من التخزين المحلي
      localStorage.removeItem("user")

      // تحديث حالة المستخدم إلى null
      setUser(null)

      // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)

      // حتى في حالة حدوث خطأ، نقوم بإزالة بيانات المستخدم وإعادة التوجيه
      localStorage.removeItem("user")
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

