"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { User, Shield, Palette, Key } from "lucide-react"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Simple navigation items without tab parameters
  const settingsNavItems = [
    {
      title: "Profile",
      href: "/dashboard/settings/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Account",
      href: "/dashboard/settings/account",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      title: "Appearance",
      href: "/dashboard/settings/appearance",
      icon: <Palette className="h-5 w-5" />,
    },
    {
      title: "Security",
      href: "/dashboard/settings/security",
      icon: <Key className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
    
      <div className="flex-1">{children}</div>
    </div>
  )
}
