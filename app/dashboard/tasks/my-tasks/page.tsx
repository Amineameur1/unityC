"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Search, Filter, MoreHorizontal, MessageSquare, CalendarDays } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { fetchWithAuth } from "@/services/api-client"
import { useAuth } from "@/components/auth-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Task interface
interface Task {
  id: number
  title: string
  description: string
  assignedTo: number
  departmentId: number
  status: "To Do" | "In Progress" | "Completed"
  priority: "Low" | "Medium" | "High"
  deadline: string
  createdAt: string
  updatedAt: string
  comments?: number
  employee?: {
    id: number
    firstName: string
    lastName: string
    avatar?: string
  }
  department?: {
    id: number
    name: string
  }
}

// Department interface
interface Department {
  id: number
  name: string
}

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { toast } = useToast()
  const { user } = useAuth()
  const [activeFilter, setActiveFilter] = useState("todo") // Default to "todo" instead of "all"

  // Task form state
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    departmentId: "",
    priority: "Medium",
    deadline: new Date().toISOString(),
    status: "To Do",
  })

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true)
      try {
        const response = await fetchWithAuth("/api/tasks/my-tasks")

        if (!response.ok) {
          throw new Error("Failed to fetch tasks")
        }

        const data = await response.json()

        // Transform the data to match our expected format
        const formattedTasks = Array.isArray(data)
          ? data.map((task) => ({
              ...task,
              status: task.status === "Pending" ? "To Do" : task.status,
            }))
          : []

        setTasks(formattedTasks)
        setFilteredTasks(formattedTasks)
      } catch (error) {
        console.error("Error fetching tasks:", error)
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again later.",
          variant: "destructive",
        })

        // Mock data for development
        const mockTasks: Task[] = [
          {
            id: 1,
            title: "Finish user onboarding",
            description: "Complete the user onboarding flow for new employees",
            assignedTo: 1,
            departmentId: 1,
            status: "To Do",
            priority: "High",
            deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: 1,
            department: { id: 1, name: "Development" },
            employee: { id: 1, firstName: "John", lastName: "Doe" },
          },
          {
            id: 2,
            title: "Work in progress Dashboard",
            description: "Implement the WIP dashboard for project tracking",
            assignedTo: 1,
            departmentId: 1,
            status: "In Progress",
            priority: "Medium",
            deadline: new Date().toISOString(), // Today
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: 1,
            department: { id: 1, name: "Development" },
            employee: { id: 1, firstName: "John", lastName: "Doe" },
          },
          {
            id: 3,
            title: "Kanban manager",
            description: "Create a kanban board for task management",
            assignedTo: 1,
            departmentId: 2,
            status: "In Progress",
            priority: "Medium",
            deadline: new Date(Date.now() - 86400000 * 7).toISOString(), // A week ago
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: 8,
            department: { id: 2, name: "Template" },
            employee: { id: 1, firstName: "John", lastName: "Doe" },
          },
          {
            id: 4,
            title: "Manage internal feedback",
            description: "Implement a system for collecting and managing internal feedback",
            assignedTo: 1,
            departmentId: 3,
            status: "Completed",
            priority: "Low",
            deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: 1,
            department: { id: 3, name: "Dev" },
            employee: { id: 1, firstName: "John", lastName: "Doe" },
          },
          {
            id: 5,
            title: "Product Update - Q4 (2024)",
            description: "Prepare the Q4 product update presentation",
            assignedTo: 1,
            departmentId: 1,
            status: "In Progress",
            priority: "High",
            deadline: new Date(Date.now() + 86400000 * 14).toISOString(), // Two weeks from now
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: 0,
            department: { id: 1, name: "Development" },
            employee: { id: 1, firstName: "John", lastName: "Doe" },
          },
          {
            id: 6,
            title: "React Native with Flutter",
            description: "Research integration possibilities between React Native and Flutter",
            assignedTo: 1,
            departmentId: 1,
            status: "Completed",
            priority: "Medium",
            deadline: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: 1,
            department: { id: 1, name: "Development" },
            employee: { id: 1, firstName: "John", lastName: "Doe" },
          },
        ]

        setTasks(mockTasks)
        setFilteredTasks(mockTasks)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [toast])

  // Fetch departments for the dropdown menus
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentsResponse = await fetchWithAuth("/api/departments")
        if (departmentsResponse.ok) {
          const departmentsData = await departmentsResponse.json()
          setDepartments(Array.isArray(departmentsData) ? departmentsData : departmentsData.departments || [])
        }
      } catch (error) {
        console.error("Error fetching departments:", error)
        // Mock departments
        setDepartments([
          { id: 1, name: "Development" },
          { id: 2, name: "Marketing" },
          { id: 3, name: "Design" },
          { id: 4, name: "HR" },
        ])
      }
    }

    fetchDepartments()
  }, [])

  // Filter tasks based on search query and active filter
  useEffect(() => {
    let filtered = tasks

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.department?.name && task.department.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Apply status filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((task) => {
        if (activeFilter === "todo") return task.status === "To Do"
        if (activeFilter === "inprogress") return task.status === "In Progress"
        if (activeFilter === "completed") return task.status === "Completed"
        return true
      })
    }

    setFilteredTasks(filtered)
  }, [tasks, searchQuery, activeFilter])

  // Handle input change for text fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewTask((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select change for dropdown fields
  const handleSelectChange = (name: string, value: string) => {
    setNewTask((prev) => ({ ...prev, [name]: value }))
  }

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date)
      setNewTask((prev) => ({ ...prev, deadline: date.toISOString() }))
    }
  }

  // Handle task creation
  const handleAddTask = async () => {
    // Validate required fields
    if (!newTask.title || !newTask.departmentId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare task data
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        assignedTo: user?.id || 1,
        departmentId: Number.parseInt(newTask.departmentId),
        priority: newTask.priority,
        deadline: newTask.deadline,
        status: newTask.status,
      }

      // Make the API request
      const response = await fetchWithAuth("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create task")
      }

      const data = await response.json()

      // Add the new task to the state
      const newTaskWithDetails: Task = {
        ...data.task,
        employee: {
          id: user?.id || 1,
          firstName: user?.firstName || "Current",
          lastName: user?.lastName || "User",
        },
        department: departments.find((dept) => dept.id === Number.parseInt(newTask.departmentId)),
        comments: 0,
      }

      setTasks((prevTasks) => [...prevTasks, newTaskWithDetails])

      // Reset form
      setNewTask({
        title: "",
        description: "",
        departmentId: "",
        priority: "Medium",
        deadline: new Date().toISOString(),
        status: "To Do",
      })

      // Close dialog
      setIsDialogOpen(false)

      toast({
        title: "Success",
        description: "Task created successfully!",
      })
    } catch (error) {
      console.error("Error creating task:", error)

      // For demo purposes, add the task to the local state
      const newTaskId = Math.max(...tasks.map((t) => t.id), 0) + 1
      const newTaskWithDetails: Task = {
        id: newTaskId,
        title: newTask.title,
        description: newTask.description,
        assignedTo: user?.id || 1,
        departmentId: Number.parseInt(newTask.departmentId) || 1,
        status: newTask.status as "To Do" | "In Progress" | "Completed",
        priority: newTask.priority as "Low" | "Medium" | "High",
        deadline: newTask.deadline,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: 0,
        employee: {
          id: user?.id || 1,
          firstName: user?.firstName || "Current",
          lastName: user?.lastName || "User",
        },
        department: departments.find((dept) => dept.id === Number.parseInt(newTask.departmentId)) || {
          id: 1,
          name: "Development",
        },
      }

      setTasks((prev) => [...prev, newTaskWithDetails])

      // Reset form
      setNewTask({
        title: "",
        description: "",
        departmentId: "",
        priority: "Medium",
        deadline: new Date().toISOString(),
        status: "To Do",
      })

      // Close dialog
      setIsDialogOpen(false)

      toast({
        title: "Success",
        description: "Task created successfully! (Demo mode)",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update task status
  const updateTaskStatus = (taskId: number, newStatus: "To Do" | "In Progress" | "Completed") => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))

    toast({
      title: "Status updated",
      description: `Task moved to ${newStatus}`,
    })
  }

  // Count tasks by status
  const todoCount = tasks.filter((t) => t.status === "To Do").length
  const inProgressCount = tasks.filter((t) => t.status === "In Progress").length
  const completedCount = tasks.filter((t) => t.status === "Completed").length
  const totalCount = tasks.length

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const today = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(today.getDate() + 1)

      if (date.toDateString() === today.toDateString()) {
        return "Today"
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return "Tomorrow"
      } else {
        return format(date, "MMM d, yyyy")
      }
    } catch (error) {
      return "Invalid date"
    }
  }

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-700 border-red-200"
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "Low":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // Get department color
  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Development":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Marketing":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "Design":
        return "bg-pink-50 text-pink-700 border-pink-200"
      case "Template":
        return "bg-green-50 text-green-700 border-green-200"
      case "Dev":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // Get column title based on active filter
  const getColumnTitle = () => {
    if (activeFilter === "todo") return "To Do"
    if (activeFilter === "inprogress") return "In Progress"
    if (activeFilter === "completed") return "Completed"
    return "All Tasks"
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8 bg-white min-h-screen">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">Manage and track your assigned tasks</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="w-full pl-8 border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-1 border-gray-200">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Task filter tabs - keep all buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2">
        <Button
          variant={activeFilter === "todo" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("todo")}
          className="rounded-full"
        >
          To do <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">{todoCount}</span>
        </Button>
        <Button
          variant={activeFilter === "inprogress" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("inprogress")}
          className="rounded-full"
        >
          In Progress <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">{inProgressCount}</span>
        </Button>
        <Button
          variant={activeFilter === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("completed")}
          className="rounded-full"
        >
          Completed <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">{completedCount}</span>
        </Button>
      </div>



      {isLoading ? (
        <div className="flex justify-center items-center py-8 text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading tasks...</span>
        </div>
      ) : (
        <div className="w-full">
          {/* Single column that changes based on active filter */}
          <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center text-gray-800">
                {getColumnTitle()}
                <span className="ml-2 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">{filteredTasks.length}</span>
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3 min-h-[200px]">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <Card
                    key={task.id}
                    className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {task.status !== "To Do" && (
                                <DropdownMenuItem onClick={() => updateTaskStatus(task.id, "To Do")}>
                                  Move to To Do
                                </DropdownMenuItem>
                              )}
                              {task.status !== "In Progress" && (
                                <DropdownMenuItem onClick={() => updateTaskStatus(task.id, "In Progress")}>
                                  Move to In Progress
                                </DropdownMenuItem>
                              )}
                              {task.status !== "Completed" && (
                                <DropdownMenuItem onClick={() => updateTaskStatus(task.id, "Completed")}>
                                  Mark as Completed
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>{formatDate(task.deadline)}</span>
                          {task.comments !== undefined && (
                            <>
                              <MessageSquare className="h-3.5 w-3.5 ml-2" />
                              <span>{task.comments}</span>
                            </>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {task.department && (
                            <Badge variant="outline" className={`text-xs ${getDepartmentColor(task.department.name)}`}>
                              {task.department.name}
                            </Badge>
                          )}
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="flex justify-end">
                          <Avatar className="h-6 w-6 border border-gray-200">
                            <AvatarImage
                              src={task.employee?.avatar || "/placeholder.svg?height=24&width=24&query=user"}
                              alt={task.employee ? `${task.employee.firstName} ${task.employee.lastName}` : "User"}
                            />
                            <AvatarFallback className="text-xs bg-gray-100 text-gray-700">
                              {task.employee ? getInitials(task.employee.firstName, task.employee.lastName) : "U"}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <p>No tasks found in this category</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
