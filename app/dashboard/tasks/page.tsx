"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { CalendarIcon, ClipboardList, MoreHorizontal, Plus, Search, Clock, CheckCircle2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { fetchWithAuth } from "@/services/api-client"
import { useAuth } from "@/components/auth-provider"

// Interface for task data
interface Task {
  id: number
  title: string
  description: string
  assignedTo: number
  departmentId: number
  status: string
  priority: string
  deadline: string
  createdAt: string
  updatedAt: string
  employee?: {
    id: number
    firstName: string
    lastName: string
  }
  department?: {
    id: number
    name: string
  }
}

// Interface for employee data
interface Employee {
  id: number
  firstName: string
  lastName: string
  departmentId?: number
}

// Interface for department data
interface Department {
  id: number
  name: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { toast } = useToast()
  const { user } = useAuth()

  // Task form state
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    departmentId: "",
    priority: "Medium",
    deadline: new Date().toISOString(),
    uploadedFile: null as File | null,
  })

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true)
      try {
        const response = await fetchWithAuth("/api/tasks")

        if (!response.ok) {
          throw new Error("Failed to fetch tasks")
        }

        const data = await response.json()
        setTasks(Array.isArray(data) ? data : [])

        toast({
          title: "Tasks loaded",
          description: `Successfully loaded ${Array.isArray(data) ? data.length : 0} tasks`,
        })
      } catch (error) {
        console.error("Error fetching tasks:", error)
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again later.",
          variant: "destructive",
        })
        setTasks([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [toast])

  // Fetch employees and departments for the dropdown menus
  useEffect(() => {
    const fetchEmployeesAndDepartments = async () => {
      try {
        // Fetch employees
        const employeesResponse = await fetchWithAuth(`/api/employees?companyId=${user?.company || 1}`)
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json()
          setEmployees(employeesData.employees || [])
        }

        // Fetch departments
        const departmentsResponse = await fetchWithAuth("/api/departments")
        if (departmentsResponse.ok) {
          const departmentsData = await departmentsResponse.json()
          setDepartments(Array.isArray(departmentsData) ? departmentsData : departmentsData.departments || [])
        }
      } catch (error) {
        console.error("Error fetching employees or departments:", error)
      }
    }

    fetchEmployeesAndDepartments()
  }, [user])

  // Filter tasks based on search query and active tab
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.employee &&
        `${task.employee.firstName} ${task.employee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.department && task.department.name.toLowerCase().includes(searchQuery.toLowerCase()))

    // Status filter
    const matchesStatus =
      activeTab === "all" ||
      (activeTab === "active" && task.status !== "Completed") ||
      (activeTab === "completed" && task.status === "Completed")

    return matchesSearch && matchesStatus
  })

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
      // Format the date as ISO string
      setNewTask((prev) => ({ ...prev, deadline: date.toISOString() }))
    }
  }

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewTask((prev) => ({ ...prev, uploadedFile: e.target.files?.[0] || null }))
    }
  }

  // Handle task creation
  const handleAddTask = async () => {
    // Validate required fields
    if (!newTask.title || !newTask.assignedTo || !newTask.departmentId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare form data for file upload
      const formData = new FormData()

      // Add task data
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        assignedTo: Number.parseInt(newTask.assignedTo),
        departmentId: Number.parseInt(newTask.departmentId),
        priority: newTask.priority,
        deadline: newTask.deadline,
      }

      // If there's a file, add it to the form data
      if (newTask.uploadedFile) {
        formData.append("uploadedFile", newTask.uploadedFile)
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
      setTasks((prevTasks) => [
        ...prevTasks,
        {
          ...data.task,
          employee: employees.find((emp) => emp.id === Number.parseInt(newTask.assignedTo)),
          department: departments.find((dept) => dept.id === Number.parseInt(newTask.departmentId)),
        },
      ])

      // Reset form
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        departmentId: "",
        priority: "Medium",
        deadline: new Date().toISOString(),
        uploadedFile: null,
      })

      // Close dialog
      setIsDialogOpen(false)

      toast({
        title: "Success",
        description: "Task created successfully!",
      })
    } catch (error) {
      console.error("Error creating task:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mark task as complete
  const markTaskAsComplete = async (taskId: number) => {
    try {
      // In a real application, you would call an API to update the task status
      // For now, we'll just update the local state
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: task.status === "Completed" ? "In Progress" : "Completed" } : task,
        ),
      )

      toast({
        title: "Success",
        description: "Task status updated successfully!",
      })
    } catch (error) {
      console.error("Error updating task status:", error)
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Calculate statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === "Completed").length
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length

  // Format date for display
  const formatDeadline = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy/MM/dd")
    } catch (error) {
      return "Invalid date"
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage and track tasks across your organization</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Create a new task and assign it to an employee.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="assignedTo">Assignee</Label>
                  <Select value={newTask.assignedTo} onValueChange={(value) => handleSelectChange("assignedTo", value)}>
                    <SelectTrigger id="assignedTo">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>
                          {employee.firstName} {employee.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="departmentId">Department</Label>
                  <Select
                    value={newTask.departmentId}
                    onValueChange={(value) => handleSelectChange("departmentId", value)}
                  >
                    <SelectTrigger id="departmentId">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id.toString()}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newTask.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadline">Due Date</Label>
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
              </div>
              <div className="grid gap-2">
                <Label htmlFor="uploadedFile">Attachment (Optional)</Label>
                <Input id="uploadedFile" type="file" onChange={handleFileChange} className="cursor-pointer" />
                <p className="text-xs text-muted-foreground">Upload any relevant files for this task.</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleAddTask} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
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
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">All tasks assigned to you</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">Pending tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">Completed tasks</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>List of all tasks in your organization</CardDescription>
          <Tabs defaultValue="all" className="mt-4" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading tasks...</span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tasks found. Create your first task using the "Add Task" button.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-left">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      {task.employee ? `${task.employee.firstName} ${task.employee.lastName}` : "Not assigned"}
                    </TableCell>
                    <TableCell>{task.department?.name || "Not specified"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          task.status === "Completed"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : task.status === "In Progress"
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-yellow-500 bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          task.priority === "High"
                            ? "border-red-500 bg-red-50 text-red-700"
                            : task.priority === "Medium"
                              ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                              : "border-green-500 bg-green-50 text-green-700"
                        }`}
                      >
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDeadline(task.deadline)}</TableCell>
                    <TableCell className="text-left">
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
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Task</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => markTaskAsComplete(task.id)}>
                            {task.status === "Completed" ? "Reopen Task" : "Mark as Completed"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
