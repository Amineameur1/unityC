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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Plus, Search, Users, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

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

// Interface for API response
interface EmployeeResponse {
  employees: Employee[]
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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [departments, setDepartments] = useState([])
  const { toast } = useToast()
  const { user } = useAuth() // Get the authenticated user

  // Get the user's company ID
  const userCompanyId = user?.company || 6 // Default to company ID 6 if not available

  // Fetch employees for the user's company
  const fetchEmployees = async () => {
    setIsFetching(true)
    try {
      // Use the internal API endpoint instead of direct endpoint
      const response = await fetch(`/api/employees?companyId=${userCompanyId}`)

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

  useEffect(() => {
    fetchEmployees()
  }, [userCompanyId, toast])

  // Fetch departments for the dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Use the internal API endpoint instead of direct endpoint
        const response = await fetch(`/api/departments?companyId=${userCompanyId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch departments")
        }
        const data = await response.json()
        setDepartments(data.departments || [])
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

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEmployee((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewEmployee((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddEmployee = async () => {
    setIsLoading(true)
    try {
      // Format the request body according to the API requirements
      const requestBody = {
        employee: {
          firstName: newEmployee.firstName,
          lastName: newEmployee.lastName,
          email: newEmployee.email,
          departmentId: newEmployee.departmentId ? Number.parseInt(newEmployee.departmentId) : null,
          companyId: userCompanyId,
          jobTitle: newEmployee.jobTitle,
          role: newEmployee.role,
        },
      }

      // Make the API call to the internal endpoint
      const response = await fetch("/api/employees/register", {
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

      // Refresh the employee list
      await fetchEmployees()

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
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Manage your organization's employees and their details</p>
        </div>
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
              <DialogDescription>Enter the details of the new employee to add to your organization.</DialogDescription>
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
                    {departments.map((department: any) => (
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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleAddEmployee} disabled={isLoading}>
                {isLoading ? (
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
      </div>
      <div className="flex items-center gap-4">
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
        <Button variant="outline">Filter</Button>
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
            <CardTitle className="text-sm font-medium">Company</CardTitle>
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
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
              <path d="M3 9h4" />
              <path d="M17 9h4" />
              <path d="M13 9h2" />
              <path d="M9 9h2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length > 0 ? employees[0].company.name : "Loading..."}</div>
            <p className="text-xs text-muted-foreground">Company name</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Owner, Admin, Employee</p>
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
                        <div
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            employee.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {employee.isActive ? "Active" : "Inactive"}
                        </div>
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
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuItem>Assign Tasks</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              {employee.isActive ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

