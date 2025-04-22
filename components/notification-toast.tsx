"use client"

import { useEffect, useState } from "react"
import { Bell, AlertTriangle, Info, CheckCircle2 } from "lucide-react"
import { announcementService } from "@/services/api"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Announcement {
  id: number
  title: string
  content: string
  priority: string
  createdAt: string
  departmentId?: number | null
  employee?: {
    firstName: string
    lastName: string
  }
}

export function NotificationToast() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [readAnnouncements, setReadAnnouncements] = useState<number[]>([])

  useEffect(() => {
    // Load read announcements from localStorage
    const storedReadAnnouncements = localStorage.getItem("readAnnouncements")
    if (storedReadAnnouncements) {
      setReadAnnouncements(JSON.parse(storedReadAnnouncements))
    }

    const fetchAnnouncements = async () => {
      setIsLoading(true)
      try {
        const data = await announcementService.getGlobalAnnouncements()
        setAnnouncements(data)

        // Calculate unread count
        const storedReadIds = JSON.parse(localStorage.getItem("readAnnouncements") || "[]")
        const unreadCount = data.filter((a) => !storedReadIds.includes(a.id)).length
        setUnreadCount(unreadCount)
      } catch (err) {
        console.error("Failed to fetch announcements:", err)
        setError("Failed to load announcements")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnnouncements()

    // Set up polling every 5 minutes
    const intervalId = setInterval(fetchAnnouncements, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  const markAsRead = (id: number) => {
    const updatedReadAnnouncements = [...readAnnouncements, id]
    setReadAnnouncements(updatedReadAnnouncements)
    localStorage.setItem("readAnnouncements", JSON.stringify(updatedReadAnnouncements))

    // Update unread count
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    const allIds = announcements.map((a) => a.id)
    setReadAnnouncements(allIds)
    localStorage.setItem("readAnnouncements", JSON.stringify(allIds))
    setUnreadCount(0)
  }

  const isRead = (id: number) => {
    return readAnnouncements.includes(id)
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (e) {
      return "Invalid date"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "Medium":
        return <Info className="h-4 w-4 text-orange-500" />
      case "Low":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "Medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <span className="text-sm text-muted-foreground">Loading notifications...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-4">
              <span className="text-sm text-red-500">{error}</span>
            </div>
          ) : announcements.length === 0 ? (
            <div className="flex items-center justify-center p-4">
              <span className="text-sm text-muted-foreground">No notifications</span>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className={cn(
                  "border-b p-3 transition-colors hover:bg-muted/50",
                  !isRead(announcement.id) && "bg-muted/20",
                )}
                onClick={() => markAsRead(announcement.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    {getPriorityIcon(announcement.priority)}
                    <div>
                      <p className="text-sm font-medium">{announcement.title}</p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">{announcement.content}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className={cn("text-[10px]", getPriorityColor(announcement.priority))}>
                          {announcement.priority}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{formatDate(announcement.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  {!isRead(announcement.id) && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
            <a href="/dashboard/announcements">View all</a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
