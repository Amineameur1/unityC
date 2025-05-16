"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Users, Layers, ClipboardList, CheckCircle, Clock, AlertCircle, ArrowRight, MessageSquare } from "lucide-react"

// Sample data for charts
const taskStatusData = [
  { name: "Completed", value: 12, color: "#10b981" },
  { name: "In Progress", value: 8, color: "#3b82f6" },
  { name: "Pending", value: 5, color: "#f59e0b" },
]

const departmentData = [
  { name: "HR", employees: 8 },
  { name: "Engineering", employees: 15 },
  { name: "Marketing", employees: 6 },
  { name: "Finance", employees: 4 },
  { name: "Operations", employees: 7 },
]

const activityData = [
  { day: "Mon", tasks: 5 },
  { day: "Tue", tasks: 8 },
  { day: "Wed", tasks: 12 },
  { day: "Thu", tasks: 10 },
  { day: "Fri", tasks: 15 },
  { day: "Sat", tasks: 7 },
  { day: "Sun", tasks: 3 },
]

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    tasks: 0,
    announcements: 0,
  })
  const [recentAnnouncements, setRecentAnnouncements] = useState([])
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<{
    role: string
  } | null>(null)

  useEffect(() => {
    // Get user info from sessionStorage
    const userStr = sessionStorage.getItem("user")
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        setCurrentUser({
          role: userData.role,
        })

        // إذا كان المستخدم هو موظف أو أدمن، قم بإعادة توجيهه إلى صفحة المهام الخاصة به
        if (userData.role === "Employee" || userData.role === "Admin") {
          router.push("/dashboard/tasks/my-tasks")
          return
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [router])

  useEffect(() => {
    if (!currentUser) return

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // In a real app, you would fetch this data from your API
        // For now, we'll simulate a delay and use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        setStats({
          employees: 40,
          departments: 5,
          tasks: 25,
          announcements: 8,
        })

        setRecentAnnouncements([
          {
            id: "1",
            title: "Company Meeting",
            content: "All-hands meeting this Friday at 3 PM in the main conference room.",
            createdAt: "2023-06-15T10:00:00Z",
          },
          {
            id: "2",
            title: "New Project Launch",
            content: "We're excited to announce the launch of our new project next week.",
            createdAt: "2023-06-14T14:30:00Z",
          },
          {
            id: "3",
            title: "Holiday Schedule",
            content: "Please review the updated holiday schedule for the upcoming months.",
            createdAt: "2023-06-13T09:15:00Z",
          },
        ])
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [currentUser, toast])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="mt-2 h-4 w-1/3" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="p-4">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Skeleton className="h-10 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="p-4">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="p-4">
                <Skeleton className="h-[200px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your enterprise management system</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stats.employees}</div>
            <Button
              variant="link"
              className="px-0 text-xs text-muted-foreground"
              onClick={() => router.push("/dashboard/employees")}
            >
              View all employees
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Layers className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stats.departments}</div>
            <Button
              variant="link"
              className="px-0 text-xs text-muted-foreground"
              onClick={() => router.push("/dashboard/departments")}
            >
              View all departments
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stats.tasks}</div>
            <Button
              variant="link"
              className="px-0 text-xs text-muted-foreground"
              onClick={() => router.push("/dashboard/tasks")}
            >
              View all tasks
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stats.announcements}</div>
            <Button
              variant="link"
              className="px-0 text-xs text-muted-foreground"
              onClick={() => router.push("/dashboard/announcements")}
            >
              View all announcements
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="p-4">
            <CardTitle>Task Status</CardTitle>
            <CardDescription>Overview of current task statuses</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-center space-x-4">
              <div className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-xs">Completed</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4 text-blue-500" />
                <span className="text-xs">In Progress</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="mr-1 h-4 w-4 text-yellow-500" />
                <span className="text-xs">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4">
            <CardTitle>Department Size</CardTitle>
            <CardDescription>Number of employees per department</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="employees" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="p-4">
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Task creation over the past week</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tasks" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4">
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>Latest company announcements</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {recentAnnouncements.map((announcement: any) => (
                <div key={announcement.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{announcement.title}</h4>
                    <span className="text-xs text-muted-foreground">{formatDate(announcement.createdAt)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{announcement.content}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/announcements")}>
                View All Announcements
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
