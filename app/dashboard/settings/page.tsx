"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, User, Shield, BellRing, Palette, Key } from "lucide-react"
import Link from "next/link"

export default function SettingsIndexPage() {
  const router = useRouter()

  // Redirect to profile settings after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard/settings/profile")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account, profile, and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Profile Settings",
            description: "Manage your profile information and portfolio",
            icon: <User className="h-6 w-6" />,
            href: "/dashboard/settings/profile",
            color: "bg-blue-100 dark:bg-blue-900/30",
            textColor: "text-blue-600 dark:text-blue-400",
          },
          {
            title: "Account Settings",
            description: "Manage your account settings and preferences",
            icon: <Shield className="h-6 w-6" />,
            href: "/dashboard/settings/account",
            color: "bg-purple-100 dark:bg-purple-900/30",
            textColor: "text-purple-600 dark:text-purple-400",
          },
          {
            title: "Company Information",
            description: "Manage your company details and information",
            icon: <Building2 className="h-6 w-6" />,
            href: "/dashboard/settings/account?tab=company",
            color: "bg-green-100 dark:bg-green-900/30",
            textColor: "text-green-600 dark:text-green-400",
          },
          {
            title: "Notification Settings",
            description: "Manage how you receive notifications",
            icon: <BellRing className="h-6 w-6" />,
            href: "/dashboard/settings/account?tab=notifications",
            color: "bg-amber-100 dark:bg-amber-900/30",
            textColor: "text-amber-600 dark:text-amber-400",
          },
          {
            title: "Appearance",
            description: "Customize the appearance of your dashboard",
            icon: <Palette className="h-6 w-6" />,
            href: "/dashboard/settings/appearance",
            color: "bg-indigo-100 dark:bg-indigo-900/30",
            textColor: "text-indigo-600 dark:text-indigo-400",
          },
          {
            title: "Security",
            description: "Manage your security settings and password",
            icon: <Key className="h-6 w-6" />,
            href: "/dashboard/settings/security",
            color: "bg-red-100 dark:bg-red-900/30",
            textColor: "text-red-600 dark:text-red-400",
          },
        ].map((item, index) => (
          <Link href={item.href} key={index} className="block">
            <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-full ${item.color}`}>
                    <div className={item.textColor}>{item.icon}</div>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-4 rounded-lg border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
        Redirecting to profile settings in a few seconds...
      </div>
    </div>
  )
}

