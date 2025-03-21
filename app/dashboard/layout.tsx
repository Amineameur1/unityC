"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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

// Mock user data - in a real app, this would come from authentication
const currentUser = {
  name: "Mohammed Abdullah",
  role: "Company Manager", // Company Manager | Department Manager | Employee
  department: "IT",
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Define navigation items based on user role
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      roles: ["Company Manager", "Department Manager", "Employee"],
    },
    {
      title: "Companies",
      href: "/dashboard/companies",
      icon: <Building2 className="h-5 w-5" />,
      roles: ["Company Manager"],
    },
    {
      title: "Employees",
      href: "/dashboard/employees",
      icon: <Users className="h-5 w-5" />,
      roles: ["Company Manager", "Department Manager"],
    },
    {
      title: "Tasks",
      href: "/dashboard/tasks",
      icon: <ClipboardList className="h-5 w-5" />,
      roles: ["Company Manager", "Department Manager", "Employee"],
    },
    {
      title: "Resources",
      href: "/dashboard/resources",
      icon: <Package className="h-5 w-5" />,
      roles: ["Company Manager", "Department Manager"],
    },
    {
      title: "Files",
      href: "/dashboard/files",
      icon: <FileBox className="h-5 w-5" />,
      roles: ["Company Manager", "Department Manager", "Employee"],
    },
    {
      title: "Announcements",
      href: "/dashboard/announcements",
      icon: <MessageSquare className="h-5 w-5" />,
      roles: ["Company Manager", "Department Manager", "Employee"],
    },
    {
      title: "Performance",
      href: "/dashboard/performance",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ["Company Manager", "Department Manager"],
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: ["Company Manager", "Department Manager", "Employee"],
    },
  ]

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => item.roles.includes(currentUser.role))

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <Button variant="outline" size="icon" className="md:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
          <SheetContent side="right" className="w-72 sm:max-w-xs">
            <div className="flex h-full flex-col">
              <div className="flex items-center border-b px-2 py-4">
                <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                    <path d="M18 14h-8" />
                    <path d="M15 18h-5" />
                    <path d="M10 6h8v4h-8V6Z" />
                  </svg>
                  Enterprise Management System
                </Link>
                <Button variant="ghost" size="icon" className="mr-auto" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close navigation menu</span>
                </Button>
              </div>
              <nav className="grid gap-2 p-4">
                {filteredNavItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted",
                      pathname === item.href ? "bg-muted" : "transparent",
                    )}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
              <div className="mt-auto p-4">
                <Link href="/">
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setOpen(false)}>
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 font-semibold md:text-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
            <path d="M18 14h-8" />
            <path d="M15 18h-5" />
            <path d="M10 6h8v4h-8V6Z" />
          </svg>
          Enterprise Management System
        </Link>
        <div className="relative ml-auto flex-1 md:grow-0 md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-full rounded-lg bg-background pl-8 md:w-80" />
        </div>
        <Button variant="outline" size="icon" className="ml-auto md:ml-0">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <span className="hidden md:inline-flex">{currentUser.name}</span>
              <span className="hidden md:inline-flex text-xs text-muted-foreground">({currentUser.role})</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/" className="flex w-full items-center">
                Sign Out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-l bg-muted/40 md:block">
          <nav className="grid gap-2 p-4">
            {filteredNavItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted",
                  pathname === item.href ? "bg-muted" : "transparent",
                )}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

