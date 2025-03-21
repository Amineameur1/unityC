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
import Cookies from "js-cookie"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  // حالة المستخدم
  const [currentUser, setCurrentUser] = useState<{
    name: string
    role: string
    department?: string
  }>({
    name: "",
    role: "",
    department: "",
  })

  // جلب معلومات المستخدم من localStorage عند تحميل الصفحة
  useEffect(() => {
    // التحقق من وجود المستخدم في localStorage
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setCurrentUser(user)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  // تسجيل الخروج
  const handleLogout = () => {
    // حذف token من الكوكيز
    Cookies.remove("auth-token")

    // حذف معلومات المستخدم من localStorage
    localStorage.removeItem("user")

    // إظهار رسالة نجاح
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح من النظام",
    })

    // إعادة التوجيه إلى صفحة تسجيل الدخول
    router.push("/login")
  }

  // تحديد عناصر القائمة بناءً على دور المستخدم
  const navItems = [
    {
      title: "لوحة التحكم",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      roles: ["Company Manager", "Department Manager", "Employee"],
    },
    {
      title: "الشركات",
      href: "/dashboard/companies",
      icon: <Building2 className="h-5 w-5" />,
      roles: ["Company Manager"],
    },
    {
      title: "الأقسام",
      href: "/dashboard/departments",
      icon: <Building2 className="h-5 w-5" />,
      roles: ["Company Manager", "Department Manager"],
    },
    {
      title: "الموظفين",
      href: "/dashboard/employees",
      icon: <Users className="h-5 w-5" />,
      roles: ["Company Manager", "Department Manager"],
    },
    {
      title: "المهام",
      href: "/dashboard/tasks",
      icon: <ClipboardList className="h-5 w-5" />,
      roles: ["Company Manager", "Department Manager", "Employee"],
    },
    {
      title: "الموارد",
      href: "/dashboard/resources",
      icon: <Package className="h-5 w-5" />,
      roles: ["Company Manager", "Department Manager"],
    },
    {
      title: "الملفات",
      href: "/dashboard/files",
      icon: <FileBox className="h-5 w-5" />,
      roles: ["Company Manager", "Department Manager", "Employee"],
    },
    {
      title: "الإعلانات",
      href: "/dashboard/announcements",
      icon: <MessageSquare className="h-5 w-5" />,
      roles: ["Company Manager", "Department Manager", "Employee"],
    },
    {
      title: "الأداء",
      href: "/dashboard/performance",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ["Company Manager", "Department Manager"],
    },
    {
      title: "الإعدادات",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: ["Company Manager", "Department Manager", "Employee"],
    },
  ]

  // تصفية عناصر القائمة بناءً على دور المستخدم
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
                  نظام إدارة المؤسسات
                </Link>
                <Button variant="ghost" size="icon" className="mr-auto" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">إغلاق قائمة التنقل</span>
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
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setOpen(false)
                    handleLogout()
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </Button>
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
          نظام إدارة المؤسسات
        </Link>
        <div className="relative ml-auto flex-1 md:grow-0 md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="بحث..." className="w-full rounded-lg bg-background pl-8 md:w-80" />
        </div>
        <Button variant="outline" size="icon" className="ml-auto md:ml-0">
          <Bell className="h-5 w-5" />
          <span className="sr-only">الإشعارات</span>
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
            <DropdownMenuLabel>حسابي</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard/settings/profile" className="flex w-full items-center">
                الملف الشخصي
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard/settings" className="flex w-full items-center">
                الإعدادات
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>تسجيل الخروج</DropdownMenuItem>
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

