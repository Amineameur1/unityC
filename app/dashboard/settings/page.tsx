"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SettingsIndexPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect all users to profile page
    router.push("/dashboard/settings/profile")
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
