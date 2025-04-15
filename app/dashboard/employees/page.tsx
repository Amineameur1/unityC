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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Users, Loader2, AlertTriangle, Filter, Eye, Pencil, Trash, UserPlus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { fetchWithAuth } from "@/services/api-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

// Interface for employee data
interface Employee {
  id: number
  uuid: string
  firstName: string
  lastName: string
  email: string
  departmentId: number | null
  companyId: number
  jobTitle: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  department: {
    id: number
    uuid: string
    name: string
    companyId: number
    parentDepartmentId: number | null
    budget: string
    createdAt: string
    updatedAt: string
  } | null
  company: {
    id: number
    uuid: string
    name: string
    address: string
    contactEmail: string
    createdAt: string
    updatedAt: string
  }
}

// Interface for department data
interface Department {
  id: number
  uuid: string
  name: string
  companyId: number
  parentDepartmentId: number | null
  budget: string
  createdAt: string
  updatedAt: string
}

// Interface for API response
interface EmployeeResponse {
  employees: Employee[]
  total: number
  page: number
  limit: number
}

interface DepartmentResponse {
  departments: Department[]
  total: number
  page: number
  limit: number
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    departmentId: "",
    companyId: "",
    jobTitle: "",
    role: "Employee", // Default role
  })
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    employeeId: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [apiError, setApiError] = useState<string | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("firstName")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showInactiveEmployees, setShowInactiveEmployees] = useState(false)

  const { toast } = useToast()
  const { user, getAuthHeader } = useAuth() // Get the authenticated user and auth header
  const router = useRouter()

  // Get the user's company ID
  const userCompanyId = user?.company || 6 // Default to company ID 6 if not available

  // داخل المكون الرئيسي، أضف:
  const userRole = user?.role || "Employee" // افتراضي كموظف إذا لم يتم تحديد الدور

  // تعديل الدالة لإضافة التحقق من الصلاحيات
  const canCreateEmployee = userRole === "Owner"
  const canUpdateEmployee = userRole === "Owner" || userRole === "Admin"
  const canDeleteEmployee = userRole === "Owner"
  const canCreateUserAccount = userRole === "Owner"

  // Fetch employees for the user's company using fetchWithAuth
  const fetchEmployees = async (departmentId?: string) => {
    setIsFetching(true)
    setApiError(null)
    try {
      // Determine the API endpoint based on whether we're filtering by department
      const endpoint =
        departmentId && departmentId !== "all"
          ? `/api/employees/department/${departmentId}?companyId=${userCompanyId}`
          : `/api/employees?companyId=${userCompanyId}`

      console.log(`Fetching employees from: ${endpoint}`)

      // Use our fetchWithAuth utility
      const response = await fetchWithAuth(endpoint)

      if (!response.ok) {
        throw new Error(`Failed to fetch employees: ${response.status}`)
      }

      const data: EmployeeResponse = await response.json()
      setEmployees(data.employees || [])

      toast({
        title: "Employees loaded",
        description: `Successfully loaded ${data.total} employees`,
      })
    } catch (error) {
      console.error("Error fetching employees:", error)
      setApiError(error instanceof Error ? error.message : "Failed to load employees")
      toast({
        title: "Error",
        description: "Failed to load employees. Please try again later.",
        variant: "destructive",
      })

      // Set empty array if fetch fails
      setEmployees([])
    } finally {
      setIsLoading(false)
      setIsFetching(false)
    }
  }

  // Effect to fetch employees when the component mounts or when the selected department changes
  useEffect(() => {
    fetchEmployees(selectedDepartment)
  }, [userCompanyId, selectedDepartment])

  // Fetch departments directly from the API endpoint
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Use the direct API endpoint as specified
        const response = await fetchWithAuth(`/api/departments`)

        if (!response.ok) {
          throw new Error("Failed to fetch departments")
        }

        const data: DepartmentResponse = await response.json()

        // Check if departments is an array or nested in a property
        const departmentsArray = Array.isArray(data) ? data : data.departments || []
        setDepartments(departmentsArray)

        console.log("Fetched departments:", departmentsArray)
      } catch (error) {
        console.error("Error fetching departments:", error)
        toast({
          title: "Error",
          description: "Failed to load departments. Please try again later.",
          variant: "destructive",
        })
      }
    }

    fetchDepartments()
  }, [userCompanyId, toast])

  // Apply filters and sorting to employees
  const filteredEmployees = employees
    .filter((employee) => {
      // Text search filter
      const matchesSearch =
        employee.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department?.name?.toLowerCase().includes(searchQuery.toLowerCase())

      // Department filter
      const matchesDepartment = selectedDepartment === "all" || employee.departmentId?.toString() === selectedDepartment

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && employee.isActive) ||
        (statusFilter === "inactive" && !employee.isActive)

      // Show/hide inactive employees
      const matchesActiveFilter = showInactiveEmployees ? true : employee.isActive

      return matchesSearch && matchesDepartment && matchesStatus && matchesActiveFilter
    })
    .sort((a, b) => {
      // Handle sorting
      let valueA, valueB

      // Determine which field to sort by
      switch (sortField) {
        case "firstName":
          valueA = a.firstName
          valueB = b.firstName
          break
        case "lastName":
          valueA = a.lastName
          valueB = b.lastName
          break
        case "email":
          valueA = a.email
          valueB = b.email
          break
        case "department":
          valueA = a.department?.name || ""
          valueB = b.department?.name || ""
          break
        case "jobTitle":
          valueA = a.jobTitle || ""
          valueB = b.jobTitle || ""
          break
        default:
          valueA = a.firstName
          valueB = b.firstName
      }

      // Sort based on direction
      if (sortDirection === "asc") {
        return valueA.localeCompare(valueB)
      } else {
        return valueB.localeCompare(valueA)
      }
    })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEmployee((prev) => ({ ...prev, [name]: value }))
  }

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewEmployee((prev) => ({ ...prev, [name]: value }))
  }

  // Handle department filter change
  const handleDepartmentFilterChange = (value: string) => {
    setSelectedDepartment(value)
  }

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
  }

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (field === sortField) {
      // If clicking the same field, toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // If clicking a new field, set it as sort field and reset direction to asc
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Updated handleAddEmployee function to use the correct API endpoint and request format
  const handleAddEmployee = async () => {
    setIsSubmitting(true)
    try {
      // Validate required fields
      if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Format the request body according to the API requirements
      const requestBody = {
        employee: {
          firstName: newEmployee.firstName,
          lastName: newEmployee.lastName,
          email: newEmployee.email,
          departmentId: newEmployee.departmentId || "1", // Default to 1 if not selected
          companyId: userCompanyId.toString(),
          jobTitle: newEmployee.jobTitle || "Employee",
          role: newEmployee.role,
        },
      }

      console.log("Sending employee creation request:", requestBody)

      // Use the correct API endpoint for employee registration
      const response = await fetchWithAuth("/api/employees/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create employee")
      }

      const data = await response.json()
      console.log("Employee created successfully:", data)

      // Refresh the employee list
      await fetchEmployees(selectedDepartment)

      // Reset the form
      setNewEmployee({
        firstName: "",
        lastName: "",
        email: "",
        departmentId: "",
        companyId: userCompanyId.toString(),
        jobTitle: "",
        role: "Employee",
      })

      toast({
        title: "Success",
        description: "Employee created successfully!",
      })

      setIsDialogOpen(false)
    } catch (error: any) {
      console.error("Error creating employee:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create employee. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle creating a user account for an employee
  const handleCreateUserAccount = async () => {
    setIsSubmitting(true)
    try {
      // Validate required fields
      if (!newUser.username || !newUser.password || !newUser.employeeId) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Format the request body according to the API requirements
      const requestBody = {
        user: {
          username: newUser.username,
          password: newUser.password,
          employeeId: Number.parseInt(newUser.employeeId),
        },
      }

      console.log("Sending user creation request:", requestBody)

      // Use the correct API endpoint for user registration
      const response = await fetchWithAuth("/api/employees/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create user account")
      }

      const data = await response.json()
      console.log("User account created successfully:", data)

      // Reset the form
      setNewUser({
        username: "",
        password: "",
        employeeId: "",
      })

      toast({
        title: "Success",
        description: "User account created successfully!",
      })

      setIsUserDialogOpen(false)
    } catch (error: any) {
      console.error("Error creating user account:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create user account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to handle employee deletion
  const handleDeleteEmployee = async () => {
    if (!deleteEmployeeId) return

    setIsDeleting(true)
    try {
      const response = await fetchWithAuth(`/api/employees/${deleteEmployeeId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete employee")
      }

      // Refresh the employee list
      await fetchEmployees(selectedDepartment)

      toast({
        title: "Success",
        description: "Employee deleted successfully!",
      })
    } catch (error: any) {
      console.error("Error deleting employee:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete employee. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setDeleteEmployeeId(null)
    }
  }

  // Function to open the delete confirmation dialog
  const confirmDelete = (employeeId: number) => {
    setDeleteEmployeeId(employeeId)
    setIsDeleteDialogOpen(true)
  }

  // Function to navigate to the edit employee page
  const navigateToEdit = (employeeId: number) => {
    router.push(`/dashboard/employees/${employeeId}/edit`)
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Manage your organization's employees and their details</p>
        </div>
        <div className="flex gap-2">
          {canCreateUserAccount && (
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  Create User Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create User Account</DialogTitle>
                  <DialogDescription>
                    Create a user account for an existing employee to allow them to log in to the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="employeeId">Employee</Label>
                    <Select
                      value={newUser.employeeId}
                      onValueChange={(value) => setNewUser((prev) => ({ ...prev, employeeId: value }))}
                    >
                      <SelectTrigger id="employeeId">
                        <SelectValue placeholder="Select employee" />
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
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={newUser.username}
                      onChange={handleUserInputChange}
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={newUser.password}
                      onChange={handleUserInputChange}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUserDialogOpen(false)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateUserAccount} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create User Account"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {canCreateEmployee && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new employee to add to your organization.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={newEmployee.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={newEmployee.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newEmployee.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="departmentId">Department</Label>
                    <Select
                      value={newEmployee.departmentId}
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
                  <div className="grid gap-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      value={newEmployee.jobTitle}
                      onChange={handleInputChange}
                      placeholder="Enter job title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newEmployee.role} onValueChange={(value) => handleSelectChange("role", value)}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Owner">Owner</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmployee} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Add Employee"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Display API error if present */}
      {apiError && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <h3 className="font-medium text-red-800">API Connection Error</h3>
                <p className="text-sm text-red-600">{apiError}</p>
                <p className="text-sm text-red-600 mt-1">
                  Using mock data instead. The system will automatically connect to the API when available.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employees..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedDepartment} onValueChange={handleDepartmentFilterChange}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Department" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.id.toString()}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortField} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Sort By" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="firstName">First Name</SelectItem>
              <SelectItem value="lastName">Last Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="jobTitle">Job Title</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={sortDirection === "asc" ? "default" : "secondary"}
            size="icon"
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            className="w-10 h-10"
          >
            {sortDirection === "asc" ? "↑" : "↓"}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="showInactive"
          checked={showInactiveEmployees}
          onCheckedChange={(checked) => setShowInactiveEmployees(checked as boolean)}
        />
        <label
          htmlFor="showInactive"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show inactive employees
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">{employees.filter((e) => e.isActive).length} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
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
              <rect width="8" height="8" x="3" y="3" rx="2" />
              <rect width="8" height="8" x="13" y="3" rx="2" />
              <rect width="8" height="8" x="3" y="13" rx="2" />
              <rect width="8" height="8" x="13" y="13" rx="2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">Across the company</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.filter((e) => e.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Currently active employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.filter((e) => !e.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Currently inactive employees</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>A list of all employees in your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading employees...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No employees found. Add your first employee using the "Add Employee" button.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        {employee.firstName} {employee.lastName}
                      </TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.department?.name || "Not Assigned"}</TableCell>
                      <TableCell>{employee.jobTitle || "Not Specified"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            employee.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {employee.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/employees/${employee.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          {canUpdateEmployee && (
                            <Button variant="ghost" size="icon" onClick={() => navigateToEdit(employee.id)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          )}
                          {canDeleteEmployee && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => confirmDelete(employee.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the employee from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmployee}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
