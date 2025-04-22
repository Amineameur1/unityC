"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SettingsIndexPage() {
  const router = useRouter()

  useEffect(() => {
    // Get user role from localStorage
    const userStr = localStorage.getItem("user")
    let userRole = "Employee"

    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        userRole = userData.role || "Employee"
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    // Redirect based on role
    if (userRole === "Employee") {
      router.push("/dashboard/settings/account")
    } else {
      router.push("/dashboard/settings/profile")
    }
  }, [router])

  return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="text-center">
        <h2 className="text-xl font-medium">Loading settings...</h2>
        <p className="text-muted-foreground mt-2">You will be redirected shortly.</p>
      </div>
    </div>
  )
}
