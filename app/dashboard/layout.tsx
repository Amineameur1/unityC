"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  ClipboardList,
  FileBox,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  Users,
  X,
  Layers,
  Shield,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { user, logout } = useAuth() // Get the authenticated user and logout function

  // User state
  const [currentUser, setCurrentUser] = useState<{
    name: string
    role: string
    department?: string
  }>({
    name: "",
    role: "",
    department: "",
  })

  // Get user info from localStorage on page load
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)

        // Extract name from username if first and last name aren't available
        const name =
          userData.firstName && userData.lastName
            ? `${userData.firstName} ${userData.lastName}`
            : userData.username || "User"

        setCurrentUser({
          name: name,
          role: userData.role || "Employee", // Default to Employee if role is missing
          department: userData.department?.toString(),
        })
      } catch (error) {
        console.error("Error parsing user data:", error)
        // Set default values if there's an error
        setCurrentUser({
          name: "User",
          role: "Employee",
          department: "",
        })
      }
    }
  }, [])

  // Logout
  const handleLogout = async () => {
    try {
      // Use the auth context's logout function
      await logout()

      // Show success message
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      })

      // Use window.location.href instead of router.push
      window.location.href = "/login"

      // Toast notification will be shown by the auth provider
    } catch (error) {
      console.error("Logout error:", error)

      // Show error toast in case of failure
      toast({
        title: "Error",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Update the navItems array to remove Companies, Performance, and Administration items

  // Replace the current navItems array with this updated version:
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      roles: ["Owner", "Admin", "Employee"],
    },
    {
      title: "Departments",
      href: "/dashboard/departments",
      icon: <Layers className="h-5 w-5" />,
      roles: ["Owner", "Admin"], // Removed Employee from here
    },
    {
      title: "Employees",
      href: "/dashboard/employees",
      icon: <Users className="h-5 w-5" />,
      roles: ["Owner", "Admin"],
    },
    {
      title: "Tasks",
      href: "/dashboard/tasks",
      icon: <ClipboardList className="h-5 w-5" />,
      roles: ["Owner", "Admin", "Employee"],
    },
    {
      title: "Resources",
      href: "/dashboard/resources",
      icon: <Package className="h-5 w-5" />,
      roles: ["Owner", "Admin"], // Removed Employee from here
    },
    {
      title: "Files",
      href: "/dashboard/files",
      icon: <FileBox className="h-5 w-5" />,
      roles: ["Owner", "Admin"], // Removed Employee from here
    },
    {
      title: "Announcements",
      href: "/dashboard/announcements",
      icon: <MessageSquare className="h-5 w-5" />,
      roles: ["Owner", "Admin", "Employee"],
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: ["Owner", "Admin", "Employee"],
    },
  ]

  // Filter menu items based on user role
  const filteredNavItems = navItems.filter((item) => {
    // إذا كان المستخدم Owner، أظهر جميع العناصر المخصصة للمالك
    if (currentUser.role === "Owner" && item.roles.includes("Owner")) {
      return true
    }

    // إذا كان المستخدم Admin، أظهر العناصر المخصصة للمسؤول
    if (currentUser.role === "Admin" && item.roles.includes("Admin")) {
      return true
    }

    // إذا كان المستخدم Employee، أظهر فقط العناصر المخصصة للموظف
    if (currentUser.role === "Employee" && item.roles.includes("Employee")) {
      return true
    }

    return false
  })

  // Remove the adminNavItems array and related code by replacing the filtering logic:
  // Replace this section:
  const mainNavItems = filteredNavItems
  const adminNavItems = [] // Empty array since we're removing the Administration section

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <Button variant="outline" size="icon" className="md:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
          <SheetContent side="left" className="w-72 sm:max-w-xs">
            <div className="flex h-full flex-col">
              <div className="flex items-center border-b px-2 py-4">
                <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
                  <div className="rounded-md bg-primary p-1">
                    <Layers className="h-6 w-6 text-primary-foreground" />
                  </div>
                  EnterpriseOS
                </Link>
                <Button variant="ghost" size="icon" className="mr-auto" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close navigation menu</span>
                </Button>
              </div>
              <nav className="flex-1 overflow-auto" aria-label="Main Navigation">
                <div className="px-4 py-3">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Main Navigation
                  </h4>
                  <div className="grid gap-1">
                    {mainNavItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted",
                          pathname === item.href ? "bg-muted font-medium" : "transparent",
                        )}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Administration section removed */}

                <div className="px-4 py-3">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</h4>
                  <div className="grid gap-1">
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted",
                        pathname === "/dashboard/settings" ? "bg-muted font-medium" : "transparent",
                      )}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false)
                        handleLogout()
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-red-500 transition-colors hover:bg-muted"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 font-semibold md:text-lg">
          <div className="rounded-md bg-primary p-1">
            <Layers className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="hidden md:inline">EnterpriseOS</span>
        </Link>

        {/* Remove the search bar that was here */}

        {/* Remove the notifications button that was here */}

        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt={currentUser.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start md:flex">
                  <span className="text-sm font-medium">{currentUser.name}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    {currentUser.role === "Owner" && <Shield className="h-3 w-3 text-primary" />}
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/dashboard/settings/profile" className="flex w-full items-center">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/settings" className="flex w-full items-center">
                  Settings
                </Link>
              </DropdownMenuItem>
              {/* System Settings option removed */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-background md:block">
          <nav className="flex flex-col h-full">
            <div className="flex-1 overflow-auto py-2">
              <div className="px-3 py-2">
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">
                  Main Navigation
                </h4>
                <div className="grid gap-1 pt-1">
                  {mainNavItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted",
                        pathname === item.href ? "bg-muted font-medium" : "transparent",
                      )}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Administration section removed */}
            </div>

            <div className="border-t px-3 py-4">
              <Link
                href="/dashboard/settings"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted",
                  pathname === "/dashboard/settings" ? "bg-muted font-medium" : "transparent",
                )}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-2 mt-1 text-red-500 hover:bg-muted hover:text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
