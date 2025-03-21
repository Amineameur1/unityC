"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  CalendarIcon,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  AlertTriangle,
  Info,
  CheckCircle2,
  Users,
  Building2,
  Package,
  Settings,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample announcement data
const initialAnnouncements = [
  {
    id: 1,
    title: "Quarterly Company Meeting",
    content:
      "Please join us for the Q2 company meeting on Friday, June 30th at 2:00 PM in the main conference room. We will be discussing our quarterly results and upcoming initiatives.",
    author: "Emily Davis",
    department: "Human Resources",
    priority: "Normal",
    date: new Date(2023, 5, 25),
    target: "Company",
  },
  {
    id: 2,
    title: "Office Closure - Independence Day",
    content:
      "The office will be closed on Tuesday, July 4th in observance of Independence Day. Regular operations will resume on Wednesday, July 5th.",
    author: "Emily Davis",
    department: "Human Resources",
    priority: "Important",
    date: new Date(2023, 5, 28),
    target: "Company",
  },
  {
    id: 3,
    title: "New Product Launch",
    content:
      "We're excited to announce the launch of our new product line on July 15th. Please review the marketing materials and be prepared to discuss with clients.",
    author: "Sarah Johnson",
    department: "Marketing",
    priority: "High",
    date: new Date(2023, 6, 1),
    target: "Department",
  },
  {
    id: 4,
    title: "System Maintenance",
    content:
      "The IT department will be performing system maintenance this weekend. The CRM system will be unavailable from Saturday 8 PM to Sunday 2 AM.",
    author: "John Smith",
    department: "Engineering",
    priority: "Important",
    date: new Date(2023, 6, 5),
    target: "Company",
  },
  {
    id: 5,
    title: "New Hire Announcement",
    content:
      "Please join us in welcoming Jane Doe to the Marketing team. Jane will be joining us as a Senior Marketing Manager starting next Monday.",
    author: "Emily Davis",
    department: "Human Resources",
    priority: "Normal",
    date: new Date(2023, 6, 7),
    target: "Department",
  },
  {
    id: 6,
    title: "Urgent: Security Alert",
    content:
      "We have detected suspicious login attempts. Please change your passwords immediately and enable two-factor authentication if you haven't already.",
    author: "David Wilson",
    department: "Engineering",
    priority: "Critical",
    date: new Date(2023, 6, 2),
    target: "Company",
  },
]

// Sample notification data
const initialNotifications = [
  {
    id: 1,
    title: "New task assigned",
    content: "You have been assigned a new task: 'Q2 Financial Report'",
    type: "Task",
    date: new Date(2023, 5, 28),
    read: false,
  },
  {
    id: 2,
    title: "Meeting reminder",
    content: "Quarterly Company Meeting in 30 minutes",
    type: "Reminder",
    date: new Date(2023, 5, 30),
    read: false,
  },
  {
    id: 3,
    title: "Performance review completed",
    content: "Your performance review has been completed by David Wilson",
    type: "Performance",
    date: new Date(2023, 5, 27),
    read: true,
  },
  {
    id: 4,
    title: "Resource allocated",
    content: "New laptop has been allocated to you",
    type: "Resource",
    date: new Date(2023, 5, 26),
    read: true,
  },
  {
    id: 5,
    title: "New announcement",
    content: "Office Closure - Independence Day",
    type: "Announcement",
    date: new Date(2023, 5, 28),
    read: false,
  },
  {
    id: 6,
    title: "Task deadline approaching",
    content: "Task 'Website Redesign Meeting' is due tomorrow",
    type: "Alert",
    date: new Date(2023, 5, 29),
    read: false,
  },
  {
    id: 7,
    title: "System update completed",
    content: "The CRM system has been updated to version 2.5",
    type: "System",
    date: new Date(2023, 5, 25),
    read: true,
  },
]

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [searchQuery, setSearchQuery] = useState("")
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    author: "John Doe",
    department: "",
    priority: "Normal",
    date: new Date(),
    target: "Company",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("announcements")

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date)
      setNewAnnouncement((prev) => ({ ...prev, date: date }))
    }
  }

  const handleAddAnnouncement = () => {
    const newId = announcements.length > 0 ? Math.max(...announcements.map((a) => a.id)) + 1 : 1
    const announcementToAdd = {
      id: newId,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      author: newAnnouncement.author,
      department: newAnnouncement.department,
      priority: newAnnouncement.priority,
      date: newAnnouncement.date,
      target: newAnnouncement.target,
    }
    setAnnouncements([...announcements, announcementToAdd])
    setNewAnnouncement({
      title: "",
      content: "",
      author: "John Doe",
      department: "",
      priority: "Normal",
      date: new Date(),
      target: "Company",
    })
    setIsDialogOpen(false)
  }

  const markNotificationAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  // Calculate statistics
  const totalAnnouncements = announcements.length
  const companyAnnouncements = announcements.filter((a) => a.target === "Company").length
  const departmentAnnouncements = announcements.filter((a) => a.target === "Department").length
  const unreadNotifications = notifications.filter((n) => !n.read).length

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "High":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "Important":
        return <Info className="h-5 w-5 text-blue-500" />
      case "Normal":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getTargetIcon = (target: string) => {
    switch (target) {
      case "Company":
        return <Building2 className="h-5 w-5 text-primary" />
      case "Department":
        return <Users className="h-5 w-5 text-primary" />
      default:
        return <Users className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case "Task":
        return (
          <div className="rounded-full bg-blue-500 p-2">
            <CheckCircle2 className="h-4 w-4 text-white" />
          </div>
        )
      case "Reminder":
        return (
          <div className="rounded-full bg-yellow-500 p-2">
            <Bell className="h-4 w-4 text-white" />
          </div>
        )
      case "Performance":
        return (
          <div className="rounded-full bg-green-500 p-2">
            <Users className="h-4 w-4 text-white" />
          </div>
        )
      case "Resource":
        return (
          <div className="rounded-full bg-purple-500 p-2">
            <Package className="h-4 w-4 text-white" />
          </div>
        )
      case "Announcement":
        return (
          <div className="rounded-full bg-indigo-500 p-2">
            <MessageSquare className="h-4 w-4 text-white" />
          </div>
        )
      case "Alert":
        return (
          <div className="rounded-full bg-red-500 p-2">
            <AlertTriangle className="h-4 w-4 text-white" />
          </div>
        )
      case "System":
        return (
          <div className="rounded-full bg-gray-500 p-2">
            <Settings className="h-4 w-4 text-white" />
          </div>
        )
      default:
        return (
          <div className="rounded-full bg-primary p-2">
            <Info className="h-4 w-4 text-white" />
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Announcements & Notifications</h1>
          <p className="text-muted-foreground">Manage company announcements and view your notifications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
              <DialogDescription>Create a new announcement for your organization.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={newAnnouncement.title}
                  onChange={handleInputChange}
                  placeholder="Enter announcement title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={newAnnouncement.content}
                  onChange={handleInputChange}
                  placeholder="Enter announcement content"
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={newAnnouncement.department}
                    onValueChange={(value) => handleSelectChange("department", value)}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Customer Support">Customer Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newAnnouncement.priority}
                    onValueChange={(value) => handleSelectChange("priority", value)}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Important">Important</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="target">Target Audience</Label>
                  <Select value={newAnnouncement.target} onValueChange={(value) => handleSelectChange("target", value)}>
                    <SelectTrigger id="target">
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Company">Entire Company</SelectItem>
                      <SelectItem value="Department">Department Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAnnouncement}>Publish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnnouncements}</div>
            <p className="text-xs text-muted-foreground">Published announcements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company-wide</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyAnnouncements}</div>
            <p className="text-xs text-muted-foreground">Company-wide announcements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Department</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentAnnouncements}</div>
            <p className="text-xs text-muted-foreground">Department-specific announcements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadNotifications}</div>
            <p className="text-xs text-muted-foreground">Notifications awaiting your attention</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="announcements" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="announcements" className="mt-4 space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">No announcements found</p>
              </CardContent>
            </Card>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      {getPriorityIcon(announcement.priority)}
                      <div>
                        <CardTitle>{announcement.title}</CardTitle>
                        <CardDescription>
                          {format(announcement.date, "MMMM d, yyyy")} • {announcement.author} •{" "}
                          {announcement.department}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTargetIcon(announcement.target)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Pin to Top</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{announcement.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <div className="text-xs text-muted-foreground">
                    {announcement.target === "Company"
                      ? "Visible to all employees"
                      : `Visible to ${announcement.department} department`}
                  </div>
                  <Button variant="ghost" size="sm">
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Your Notifications</CardTitle>
                <Button variant="ghost" size="sm" onClick={markAllNotificationsAsRead}>
                  Mark all as read
                </Button>
              </div>
              <CardDescription>You have {unreadNotifications} unread notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Bell className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">No notifications found</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 rounded-lg border p-4 ${
                      !notification.read ? "bg-muted/50" : ""
                    }`}
                  >
                    {getNotificationTypeIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground">{notification.content}</p>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <span className="sr-only">Mark as read</span>
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          </Button>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {format(notification.date, "MMMM d, yyyy • h:mm a")}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

