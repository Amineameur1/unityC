"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ClipboardList, Clock, MoreHorizontal, Search } from "lucide-react"
import { format } from "date-fns"

// Sample task data for the current employee
const initialTasks = [
  {
    id: 1,
    title: "Prepare Monthly Sales Report",
    description: "Create a detailed report on last month's sales and performance analysis",
    assignedBy: "Ahmed Mohammed",
    status: "In Progress",
    priority: "High",
    dueDate: new Date(2023, 5, 15),
  },
  {
    id: 2,
    title: "Update Customer Database",
    description: "Update customer information and add new customers to the database",
    assignedBy: "Sarah Ahmed",
    status: "Pending",
    priority: "Medium",
    dueDate: new Date(2023, 5, 18),
  },
  {
    id: 3,
    title: "Prepare Presentation for New Product",
    description: "Create a presentation for the new product for the meeting with potential clients",
    assignedBy: "Mohammed Ali",
    status: "In Progress",
    priority: "High",
    dueDate: new Date(2023, 5, 20),
  },
  {
    id: 4,
    title: "Review Marketing Plan",
    description: "Review the marketing plan for the next quarter and provide feedback",
    assignedBy: "Sarah Ahmed",
    status: "Completed",
    priority: "Medium",
    dueDate: new Date(2023, 5, 10),
  },
  {
    id: 5,
    title: "Train New Employees",
    description: "Train new employees on using the enterprise management system",
    assignedBy: "Ahmed Mohammed",
    status: "In Progress",
    priority: "High",
    dueDate: new Date(2023, 5, 25),
  },
]

export default function MyTasksPage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredTasks = tasks.filter(
    (task) =>
      (activeTab === "all" ||
        (activeTab === "active" && task.status !== "Completed") ||
        (activeTab === "completed" && task.status === "Completed")) &&
      (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedBy.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const markTaskAsComplete = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: task.status === "Completed" ? "In Progress" : "Completed" } : task,
      ),
    )
  }

  // Calculate statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === "Completed").length
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">Manage and track tasks assigned to you</p>
        </div>
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
          <CardDescription>List of all tasks assigned to you</CardDescription>
          <Tabs defaultValue="all" className="mt-4" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Assigned By</TableHead>
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
                  <TableCell className="max-w-xs truncate">{task.description}</TableCell>
                  <TableCell>{task.assignedBy}</TableCell>
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
                  <TableCell>{format(task.dueDate, "yyyy/MM/dd")}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  )
}

