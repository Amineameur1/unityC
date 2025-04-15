"use client"

import type React from "react"

import { useState } from "react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, CalendarIcon, MoreHorizontal, Plus, Search } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// إضافة استخدام مكون المصادقة
import { useAuth } from "@/components/auth-provider"

// Sample performance data
const initialPerformance = [
  {
    id: 1,
    employee: "John Smith",
    position: "Software Engineer",
    department: "Engineering",
    rating: 4.5,
    status: "Completed",
    reviewDate: new Date(2023, 5, 15),
    reviewedBy: "David Wilson",
    salary: 95000,
    currency: "USD",
  },
  {
    id: 2,
    employee: "Sarah Johnson",
    position: "Marketing Manager",
    department: "Marketing",
    rating: 4.2,
    status: "Completed",
    reviewDate: new Date(2023, 5, 10),
    reviewedBy: "Jessica Martinez",
    salary: 85000,
    currency: "USD",
  },
  {
    id: 3,
    employee: "Michael Brown",
    position: "Financial Analyst",
    department: "Finance",
    rating: 3.8,
    status: "Completed",
    reviewDate: new Date(2023, 5, 8),
    reviewedBy: "Robert Taylor",
    salary: 78000,
    currency: "USD",
  },
  {
    id: 4,
    employee: "Emily Davis",
    position: "HR Specialist",
    department: "Human Resources",
    rating: 4.0,
    status: "Pending",
    reviewDate: new Date(2023, 6, 5),
    reviewedBy: "Jennifer Anderson",
    salary: 72000,
    currency: "USD",
  },
  {
    id: 5,
    employee: "David Wilson",
    position: "Lead Developer",
    department: "Engineering",
    rating: 4.7,
    status: "Completed",
    reviewDate: new Date(2023, 5, 12),
    reviewedBy: "John Smith",
    salary: 110000,
    currency: "USD",
  },
  {
    id: 6,
    employee: "Jessica Martinez",
    position: "Sales Representative",
    department: "Sales",
    rating: 3.5,
    status: "Pending",
    reviewDate: new Date(2023, 6, 10),
    reviewedBy: "Sarah Johnson",
    salary: 65000,
    currency: "USD",
  },
  {
    id: 7,
    employee: "Robert Taylor",
    position: "Product Manager",
    department: "Product",
    rating: 4.3,
    status: "Scheduled",
    reviewDate: new Date(2023, 6, 15),
    reviewedBy: "David Wilson",
    salary: 98000,
    currency: "USD",
  },
  {
    id: 8,
    employee: "Jennifer Anderson",
    position: "Support Specialist",
    department: "Customer Support",
    rating: 3.9,
    status: "Scheduled",
    reviewDate: new Date(2023, 6, 20),
    reviewedBy: "Emily Davis",
    salary: 62000,
    currency: "USD",
  },
]

export default function PerformancePage() {
  // داخل المكون الرئيسي، أضف:
  const { user } = useAuth()
  const userRole = user?.role || "Employee" // افتراضي كموظف إذا لم يتم تحديد الدور

  // تعديل الدالة لإضافة التحقق من الصلاحيات
  const canCreatePerformanceReview = userRole === "Owner" || userRole === "Admin"
  const canUpdatePerformanceReview = userRole === "Owner" || userRole === "Admin"
  const canDeletePerformanceReview = userRole === "Owner"

  const [performances, setPerformances] = useState(initialPerformance)
  const [searchQuery, setSearchQuery] = useState("")
  const [newPerformance, setNewPerformance] = useState({
    employee: "",
    position: "",
    department: "",
    rating: 0,
    status: "Scheduled",
    reviewDate: new Date(),
    reviewedBy: "",
    salary: 0,
    currency: "USD",
    comments: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("all")

  const filteredPerformances = performances.filter(
    (performance) =>
      (activeTab === "all" || performance.status.toLowerCase() === activeTab.toLowerCase()) &&
      (performance.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        performance.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        performance.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        performance.reviewedBy.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewPerformance((prev) => ({
      ...prev,
      [name]: name === "rating" || name === "salary" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewPerformance((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date)
      setNewPerformance((prev) => ({ ...prev, reviewDate: date }))
    }
  }

  const handleAddPerformance = () => {
    const newId = performances.length > 0 ? Math.max(...performances.map((p) => p.id)) + 1 : 1
    const performanceToAdd = {
      id: newId,
      employee: newPerformance.employee,
      position: newPerformance.position,
      department: newPerformance.department,
      rating: newPerformance.rating,
      status: newPerformance.status,
      reviewDate: newPerformance.reviewDate,
      reviewedBy: newPerformance.reviewedBy,
      salary: newPerformance.salary,
      currency: newPerformance.currency,
    }
    setPerformances([...performances, performanceToAdd])
    setNewPerformance({
      employee: "",
      position: "",
      department: "",
      rating: 0,
      status: "Scheduled",
      reviewDate: new Date(),
      reviewedBy: "",
      salary: 0,
      currency: "USD",
      comments: "",
    })
    setIsDialogOpen(false)
  }

  // Calculate statistics
  const totalReviews = performances.length
  const completedReviews = performances.filter((p) => p.status === "Completed").length
  const pendingReviews = performances.filter((p) => p.status === "Pending").length
  const scheduledReviews = performances.filter((p) => p.status === "Scheduled").length
  const averageRating =
    performances.filter((p) => p.status === "Completed").reduce((sum, p) => sum + p.rating, 0) / completedReviews || 0
  const averageSalary = performances.reduce((sum, p) => sum + p.salary, 0) / totalReviews || 0

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Performance & Salary</h1>
          <p className="text-muted-foreground">Manage employee performance reviews and salary information</p>
        </div>
        {canCreatePerformanceReview && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add Performance Review</DialogTitle>
                <DialogDescription>Create a new performance review for an employee.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="employee">Employee</Label>
                  <Select
                    value={newPerformance.employee}
                    onValueChange={(value) => handleSelectChange("employee", value)}
                  >
                    <SelectTrigger id="employee">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="John Smith">John Smith</SelectItem>
                      <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                      <SelectItem value="Michael Brown">Michael Brown</SelectItem>
                      <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                      <SelectItem value="David Wilson">David Wilson</SelectItem>
                      <SelectItem value="Jessica Martinez">Jessica Martinez</SelectItem>
                      <SelectItem value="Robert Taylor">Robert Taylor</SelectItem>
                      <SelectItem value="Jennifer Anderson">Jennifer Anderson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      name="position"
                      value={newPerformance.position}
                      onChange={handleInputChange}
                      placeholder="Enter position"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={newPerformance.department}
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Input
                      id="rating"
                      name="rating"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={newPerformance.rating.toString()}
                      onChange={handleInputChange}
                      placeholder="Enter rating"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newPerformance.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reviewDate">Review Date</Label>
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
                  <Label htmlFor="reviewedBy">Reviewed By</Label>
                  <Select
                    value={newPerformance.reviewedBy}
                    onValueChange={(value) => handleSelectChange("reviewedBy", value)}
                  >
                    <SelectTrigger id="reviewedBy">
                      <SelectValue placeholder="Select reviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="John Smith">John Smith</SelectItem>
                      <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                      <SelectItem value="Michael Brown">Michael Brown</SelectItem>
                      <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                      <SelectItem value="David Wilson">David Wilson</SelectItem>
                      <SelectItem value="Jessica Martinez">Jessica Martinez</SelectItem>
                      <SelectItem value="Robert Taylor">Robert Taylor</SelectItem>
                      <SelectItem value="Jennifer Anderson">Jennifer Anderson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                      id="salary"
                      name="salary"
                      type="number"
                      value={newPerformance.salary.toString()}
                      onChange={handleInputChange}
                      placeholder="Enter salary"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={newPerformance.currency}
                      onValueChange={(value) => handleSelectChange("currency", value)}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="comments">Comments</Label>
                  <Textarea
                    id="comments"
                    name="comments"
                    value={newPerformance.comments}
                    onChange={handleInputChange}
                    placeholder="Enter review comments"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPerformance}>Add Review</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reviews..."
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
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
            <p className="text-xs text-muted-foreground">Performance reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
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
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedReviews}</div>
            <p className="text-xs text-muted-foreground">Completed reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
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
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Out of 5.0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
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
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {averageSalary.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-muted-foreground">Average annual salary</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Performance Reviews</CardTitle>
          <CardDescription>Manage employee performance reviews and salary information.</CardDescription>
          <Tabs defaultValue="all" className="mt-4" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="all">All Reviews</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Review Date</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPerformances.map((performance) => (
                <TableRow key={performance.id}>
                  <TableCell className="font-medium">{performance.employee}</TableCell>
                  <TableCell>{performance.position}</TableCell>
                  <TableCell>{performance.department}</TableCell>
                  <TableCell>{performance.status === "Completed" ? performance.rating.toFixed(1) : "-"}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        performance.status === "Completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : performance.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {performance.status}
                    </div>
                  </TableCell>
                  <TableCell>{format(performance.reviewDate, "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    {performance.currency} {performance.salary.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
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
                        {canUpdatePerformanceReview && <DropdownMenuItem>Edit Review</DropdownMenuItem>}
                        {canUpdatePerformanceReview && performance.status !== "Completed" && (
                          <DropdownMenuItem>Complete Review</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {canDeletePerformanceReview && (
                          <DropdownMenuItem className="text-red-600">Delete Review</DropdownMenuItem>
                        )}
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
