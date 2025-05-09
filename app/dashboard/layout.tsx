"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Users,
  X,
  Layers,
  Shield,
  FileText,
  BarChart3,
  Building,
  FolderOpen,
  BookOpen,
  Settings,
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
import { NotificationToast } from "@/components/notification-toast"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { user, logout } = useAuth()

  // State for collapsible sections in mobile menu
  const [openSections, setOpenSections] = useState({
    organization: true,
    tasks: true,
    resources: false,
  })

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

  // Get user info from sessionStorage on page load
  useEffect(() => {
    const userStr = sessionStorage.getItem("user")
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
  }, [user]) // Add user as a dependency to re-run when auth user changes

  // Logout
  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      })
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Update the navItems array to correctly show/hide items for employees
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      roles: ["Owner", "Admin"],
      category: "main",
    },
    {
      title: "Departments",
      href: "/dashboard/departments",
      icon: <Layers className="h-5 w-5" />,
      roles: ["Owner", "Admin"],
      category: "organization",
    },
    {
      title: "Employees",
      href: "/dashboard/employees",
      icon: <Users className="h-5 w-5" />,
      roles: ["Owner", "Admin"],
      category: "organization",
    },
    {
      title: "Companies",
      href: "/dashboard/companies",
      icon: <Building className="h-5 w-5" />,
      roles: ["Owner", "Admin"],
      category: "organization",
    },
    {
      title: "Tasks",
      href: "/dashboard/tasks",
      icon: <ClipboardList className="h-5 w-5" />,
      roles: ["Owner", "Admin"],
      category: "tasks",
    },
    {
      title: "My Tasks",
      href: "/dashboard/tasks/my-tasks",
      icon: <ClipboardList className="h-5 w-5" />,
      roles: ["Admin", "Employee"], // تم إزالة Owner من هنا
      category: "tasks",
    },
    {
      title: "Announcements",
      href: "/dashboard/announcements",
      icon: <MessageSquare className="h-5 w-5" />,
      roles: ["Owner", "Admin", "Employee"],
      category: "communication",
    },
    {
      title: "Files",
      href: "/dashboard/files",
      icon: <FolderOpen className="h-5 w-5" />,
      roles: ["Owner", "Admin", "Employee"],
      category: "resources",
    },
    {
      title: "Resources",
      href: "/dashboard/resources",
      icon: <BookOpen className="h-5 w-5" />,
      roles: ["Owner", "Admin", "Employee"],
      category: "resources",
    },
    {
      title: "Performance",
      href: "/dashboard/performance",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ["Owner", "Admin"],
      category: "reports",
    },
    {
      title: "Audit Logs",
      href: "/dashboard/audit-logs",
      icon: <FileText className="h-5 w-5" />,
      roles: ["Owner", "Admin"],
      category: "reports",
    },
  ]

  // Filter menu items based on user role
  const filteredNavItems = navItems.filter((item) => {
    // If no role is detected, show all items
    if (!currentUser.role) return true

    if (currentUser.role === "Owner" && item.roles.includes("Owner")) {
      return true
    }
    if (currentUser.role === "Admin" && item.roles.includes("Admin")) {
      return true
    }
    if (currentUser.role === "Employee" && item.roles.includes("Employee")) {
      return true
    }
    return false
  })

  // Group items by category for mobile menu
  const groupedNavItems = filteredNavItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, typeof navItems>,
  )

  // Only show main navigation items in the horizontal navbar
  const horizontalNavItems = filteredNavItems.filter((item) =>
    ["main", "organization", "tasks", "communication"].includes(item.category),
  )

  // Toggle a collapsible section
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Horizontal navbar for desktop */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            {/* Mobile menu button - moved here for better positioning on small screens */}
            <Sheet open={open} onOpenChange={setOpen}>
              <Button variant="outline" size="icon" className="mr-2 md:hidden" onClick={() => setOpen(true)}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
              <SheetContent side="left" className="w-80 sm:max-w-sm p-0">
                {/* Sheet content remains the same */}
                <div className="flex h-full flex-col">
                  <div className="flex items-center border-b px-4 py-3">
                    <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
                      <div className="rounded-md bg-primary p-1">
                        <Layers className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <span className="text-lg">EnterpriseOS</span>
                    </Link>
                    <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close navigation menu</span>
                    </Button>
                  </div>

                  {/* Rest of the sheet content remains unchanged */}
                  {/* User profile section */}
                  <div className="border-b px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt={currentUser.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {currentUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{currentUser.name}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          {currentUser.role === "Owner" && <Shield className="h-3 w-3 text-primary" />}
                          {currentUser.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <nav className="flex-1 overflow-auto py-2" aria-label="Main Navigation">
                    {/* Main Dashboard */}
                    {groupedNavItems.main && (
                      <div className="px-3 py-2">
                        {groupedNavItems.main.map((item, index) => (
                          <Link
                            key={index}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted",
                              pathname === item.href ? "bg-muted font-medium" : "transparent",
                            )}
                          >
                            {item.icon}
                            <span>{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Organization section */}
                    {groupedNavItems.organization && (
                      <div className="px-3 py-2">
                        <div
                          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                          onClick={() => toggleSection("organization")}
                        >
                          <div className="flex items-center gap-3">
                            <Building className="h-5 w-5 text-muted-foreground" />
                            <span>Organization</span>
                          </div>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform",
                              openSections.organization && "rotate-180",
                            )}
                          />
                        </div>
                        {openSections.organization && (
                          <div className="space-y-1 pl-10 pt-1">
                            {groupedNavItems.organization.map((item, index) => (
                              <Link
                                key={index}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                                  pathname === item.href ? "bg-muted/60 font-medium" : "text-muted-foreground",
                                )}
                              >
                                {item.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tasks section */}
                    {groupedNavItems.tasks && (
                      <div className="px-3 py-2">
                        <div
                          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                          onClick={() => toggleSection("tasks")}
                        >
                          <div className="flex items-center gap-3">
                            <ClipboardList className="h-5 w-5 text-muted-foreground" />
                            <span>Tasks</span>
                          </div>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform",
                              openSections.tasks && "rotate-180",
                            )}
                          />
                        </div>
                        {openSections.tasks && (
                          <div className="space-y-1 pl-10 pt-1">
                            {groupedNavItems.tasks.map((item, index) => (
                              <Link
                                key={index}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                                  pathname === item.href ? "bg-muted/60 font-medium" : "text-muted-foreground",
                                )}
                              >
                                {item.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Communication section */}
                    {groupedNavItems.communication && (
                      <div className="px-3 py-2">
                        {groupedNavItems.communication.map((item, index) => (
                          <Link
                            key={index}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted",
                              pathname === item.href ? "bg-muted font-medium" : "transparent",
                            )}
                          >
                            {item.icon}
                            <span>{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Resources section */}
                    {groupedNavItems.resources && (
                      <div className="px-3 py-2">
                        <div
                          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                          onClick={() => toggleSection("resources")}
                        >
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                            <span>Resources</span>
                          </div>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform",
                              openSections.resources && "rotate-180",
                            )}
                          />
                        </div>
                        {openSections.resources && (
                          <div className="space-y-1 pl-10 pt-1">
                            {groupedNavItems.resources.map((item, index) => (
                              <Link
                                key={index}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                                  pathname === item.href ? "bg-muted/60 font-medium" : "text-muted-foreground",
                                )}
                              >
                                {item.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reports section */}
                    {groupedNavItems.reports && (
                      <div className="px-3 py-2">
                        {groupedNavItems.reports.map((item, index) => (
                          <Link
                            key={index}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted",
                              pathname === item.href ? "bg-muted font-medium" : "transparent",
                            )}
                          >
                            {item.icon}
                            <span>{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Settings */}
                    <div className="px-3 py-2">
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted",
                          pathname.startsWith("/dashboard/settings") ? "bg-muted font-medium" : "transparent",
                        )}
                      >
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                      </Link>
                    </div>
                  </nav>

                  <div className="border-t px-3 py-4">
                    <button
                      onClick={() => {
                        setOpen(false)
                        handleLogout()
                      }}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-red-500 transition-colors hover:bg-muted"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2 font-semibold md:text-lg">
              <div className="rounded-md bg-primary p-1">
                <Layers className="h-6 w-6 text-primary-foreground" />
              </div>
              <span>EnterpriseOS</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {horizontalNavItems.length > 0
              ? horizontalNavItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted",
                      pathname === item.href ? "bg-muted" : "transparent",
                    )}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                ))
              : // Fallback navigation items if filtered list is empty
                navItems
                  .filter((item) => ["main", "organization", "tasks", "communication"].includes(item.category))
                  .map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted",
                        pathname === item.href ? "bg-muted" : "transparent",
                      )}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  ))}
          </nav>

          <div className="flex items-center gap-2">
            <NotificationToast />

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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
