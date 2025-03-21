"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import Cookies from "js-cookie"

// تعريف نوع المستخدم
type User = {
  name: string
  email: string
  role: string
  department?: string
} | null

// تعريف سياق المصادقة
type AuthContextType = {
  user: User
  login: (email: string, password: string, remember: boolean) => Promise<void>
  logout: () => void
  isLoading: boolean
}

// إنشاء سياق المصادقة
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// مزود المصادقة
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // التحقق من حالة المصادقة عند تحميل التطبيق
  useEffect(() => {
    const checkAuth = () => {
      const authToken = Cookies.get("auth-token")
      const userStr = localStorage.getItem("user")

      if (authToken && userStr) {
        try {
          const userData = JSON.parse(userStr)
          setUser(userData)
        } catch (error) {
          console.error("Error parsing user data:", error)
          setUser(null)
          Cookies.remove("auth-token")
          localStorage.removeItem("user")
        }
      } else {
        setUser(null)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // إعادة التوجيه بناءً على حالة المصادقة
  useEffect(() => {
    if (!isLoading) {
      // إذا كان المستخدم غير مسجل دخوله ويحاول الوصول إلى مسار محمي
      if (!user && pathname?.startsWith("/dashboard")) {
        router.push(`/login?callbackUrl=${pathname}`)
      }

      // إذا كان المستخدم مسجل دخوله ويحاول الوصول إلى صفحة تسجيل الدخول أو التسجيل
      if (user && (pathname === "/login" || pathname === "/register")) {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  // دالة تسجيل الدخول
  const login = async (email: string, password: string, remember: boolean) => {
    setIsLoading(true)

    try {
      // في تطبيق حقيقي، ستقوم بإرسال طلب إلى الخادم للتحقق من بيانات المستخدم
      // هنا نقوم بمحاكاة عملية تسجيل الدخول

      // تأخير لمحاكاة طلب الشبكة
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // تعيين token في الكوكيز
      const expirationDays = remember ? 30 : 1
      Cookies.set("auth-token", "sample-auth-token-123456", { expires: expirationDays })

      // إنشاء كائن المستخدم
      const userData = {
        name: "محمد عبدالله",
        email: email,
        role: "Company Manager",
      }

      // تخزين معلومات المستخدم في localStorage
      localStorage.setItem("user", JSON.stringify(userData))

      // تحديث حالة المستخدم
      setUser(userData)

      // إعادة التوجيه إلى لوحة التحكم
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // دالة تسجيل الخروج
  const logout = () => {
    // حذف token من الكوكيز
    Cookies.remove("auth-token")

    // حذف معلومات المستخدم من localStorage
    localStorage.removeItem("user")

    // تحديث حالة المستخدم
    setUser(null)

    // إعادة التوجيه إلى صفحة تسجيل الدخول
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

// Hook لاستخدام سياق المصادقة
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

