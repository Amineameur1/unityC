"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ClipboardList,
  FileBox,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Search,
  Settings,
  Users,
  X,
  Layers,
  Shield,
  FileText,
  DollarSign,
  PieChart,
  Database,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

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
  const handleLogout = () => {
    // Remove user data from local storage
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("authRedirectPath")

    // Show success message
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    })

    // Use window.location.href instead of router.push
    window.location.href = "/login"
  }

  // Define menu items based on user role
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      roles: ["Owner", "Company Manager", "Department Manager", "Employee"],
    },
    {
      title: "Companies",
      href: "/dashboard/companies",
      icon: <Building2 className="h-5 w-5" />,
      roles: ["Owner", "Company Manager"],
    },
    {
      title: "Departments",
      href: "/dashboard/departments",
      icon: <Layers className="h-5 w-5" />,
      roles: ["Owner", "Company Manager", "Department Manager"],
    },
    {
      title: "Employees",
      href: "/dashboard/employees",
      icon: <Users className="h-5 w-5" />,
      roles: ["Owner", "Company Manager", "Department Manager"],
    },
    {
      title: "Tasks",
      href: "/dashboard/tasks",
      icon: <ClipboardList className="h-5 w-5" />,
      roles: ["Owner", "Company Manager", "Department Manager", "Employee"],
    },
    {
      title: "Resources",
      href: "/dashboard/resources",
      icon: <Package className="h-5 w-5" />,
      roles: ["Owner", "Company Manager", "Department Manager"],
    },
    {
      title: "Files",
      href: "/dashboard/files",
      icon: <FileBox className="h-5 w-5" />,
      roles: ["Owner", "Company Manager", "Department Manager", "Employee"],
    },
    {
      title: "Announcements",
      href: "/dashboard/announcements",
      icon: <MessageSquare className="h-5 w-5" />,
      roles: ["Owner", "Company Manager", "Department Manager", "Employee"],
    },
    {
      title: "Performance",
      href: "/dashboard/performance",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ["Owner", "Company Manager", "Department Manager"],
    },
    // Owner-specific items
    {
      title: "Audit Logs",
      href: "/dashboard/audit-logs",
      icon: <FileText className="h-5 w-5" />,
      roles: ["Owner"],
    },
    {
      title: "Salaries",
      href: "/dashboard/salaries",
      icon: <DollarSign className="h-5 w-5" />,
      roles: ["Owner"],
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: <PieChart className="h-5 w-5" />,
      roles: ["Owner"],
    },
    {
      title: "System Settings",
      href: "/dashboard/system-settings",
      icon: <Database className="h-5 w-5" />,
      roles: ["Owner"],
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: ["Owner", "Company Manager", "Department Manager", "Employee"],
    },
  ]

  // Filter menu items based on user role
  const filteredNavItems = navItems.filter((item) => {
    // If the user is Owner, show all Owner items
    if (currentUser.role === "Owner" && item.roles.includes("Owner")) {
      return true
    }

    // If the user is Admin/Department Manager, show appropriate items
    if (currentUser.role === "Admin" && item.roles.includes("Admin")) {
      return true
    }

    // If the user is Employee, only show Employee items
    if (currentUser.role === "Employee" && item.roles.includes("Employee")) {
      return true
    }

    return false
  })

  // Group navigation items by category for better organization
  const mainNavItems = filteredNavItems.filter(
    (item) =>
      ![
        "/dashboard/audit-logs",
        "/dashboard/salaries",
        "/dashboard/analytics",
        "/dashboard/system-settings",
        "/dashboard/settings",
      ].includes(item.href),
  )

  const adminNavItems = filteredNavItems.filter((item) =>
    ["/dashboard/audit-logs", "/dashboard/salaries", "/dashboard/analytics", "/dashboard/system-settings"].includes(
      item.href,
    ),
  )

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
                <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close navigation menu</span>
                </Button>
              </div>
              <nav className="flex-1 overflow-auto">
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

                {adminNavItems.length > 0 && (
                  <div className="px-4 py-3">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Administration
                    </h4>
                    <div className="grid gap-1">
                      {adminNavItems.map((item, index) => (
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
                )}

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
        <div className="relative ml-auto flex-1 md:grow-0 md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-full rounded-full bg-background pl-8 md:w-80" />
        </div>
        <Button variant="ghost" size="icon" className="relative ml-auto md:ml-0">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
            3
          </Badge>
          <span className="sr-only">Notifications</span>
        </Button>
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
            {currentUser.role === "Owner" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/dashboard/system-settings" className="flex w-full items-center">
                    System Settings
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

              {adminNavItems.length > 0 && (
                <div className="px-3 py-2 mt-2">
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">
                    Administration
                  </h4>
                  <div className="grid gap-1 pt-1">
                    {adminNavItems.map((item, index) => (
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
              )}
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

