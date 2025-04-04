"use client"

import { DialogFooter } from "@/components/ui/dialog"

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
import { MoreHorizontal, Plus, Search, Users, Building2, UserCog, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { fetchWithAuth } from "@/services/api-client"

// Sample department data
const initialDepartments = [
  {
    id: 1,
    name: "Engineering",
    description: "Software development and engineering team",
    manager: "David Wilson",
    employeeCount: 25,
    company: "Acme Corporation",
    createdAt: new Date(2022, 5, 15),
  },
  {
    id: 2,
    name: "Marketing",
    description: "Marketing and brand management",
    manager: "Sarah Johnson",
    employeeCount: 15,
    company: "Acme Corporation",
    createdAt: new Date(2022, 6, 10),
  },
  {
    id: 3,
    name: "Finance",
    description: "Financial operations and accounting",
    manager: "Michael Brown",
    employeeCount: 10,
    company: "Globex Industries",
    createdAt: new Date(2022, 4, 20),
  },
  {
    id: 4,
    name: "Human Resources",
    description: "Employee management and recruitment",
    manager: "Emily Davis",
    employeeCount: 8,
    company: "Initech Solutions",
    createdAt: new Date(2022, 7, 5),
  },
  {
    id: 5,
    name: "Sales",
    description: "Sales and client relationships",
    manager: "Jessica Martinez",
    employeeCount: 20,
    company: "Stark Industries",
    createdAt: new Date(2022, 3, 12),
  },
]

// Sample employees data for manager selection
const employees = [
  { id: 1, name: "David Wilson", position: "Lead Developer", department: "Engineering" },
  { id: 2, name: "Sarah Johnson", position: "Marketing Manager", department: "Marketing" },
  { id: 3, name: "Michael Brown", position: "Financial Analyst", department: "Finance" },
  { id: 4, name: "Emily Davis", position: "HR Specialist", department: "Human Resources" },
  { id: 5, name: "Jessica Martinez", position: "Sales Representative", department: "Sales" },
  { id: 6, name: "Robert Taylor", position: "Product Manager", department: "Product" },
  { id: 7, name: "Jennifer Anderson", position: "Support Specialist", department: "Customer Support" },
  { id: 8, name: "Mohammed Abdullah", position: "IT Manager", department: "IT" },
]

// Sample companies data
const companies = [
  { id: 1, name: "Acme Corporation" },
  { id: 2, name: "Globex Industries" },
  { id: 3, name: "Initech Solutions" },
  { id: 4, name: "Stark Industries" },
  { id: 5, name: "Wayne Enterprises" },
  { id: 6, name: "Your Company" },
]

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState(initialDepartments)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isChangeManagerDialogOpen, setIsChangeManagerDialogOpen] = useState(false)
  const [currentDepartment, setCurrentDepartment] = useState<any>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth() // Get the authenticated user

  // Get the user's company ID
  const userCompanyId = user?.company || 6 // Default to ID 6 if not available

  // Find the company name based on the user's company ID
  const userCompanyName = companies.find((c) => c.id === userCompanyId)?.name || "Your Company"

  // New department form state
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    manager: "",
    company: userCompanyName,
    budget: "0",
  })

  // Handle input change for text fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewDepartment((prevDepartment) => ({
      ...prevDepartment,
      [name]: value,
    }))
  }

  // Handle select change for dropdown fields
  const handleSelectChange = (name: string, value: string) => {
    setNewDepartment((prevDepartment) => ({
      ...prevDepartment,
      [name]: value,
    }))
  }

  // Updated fetchDepartments function using fetchWithAuth
  useEffect(() => {
    const fetchDepartments = async () => {
      // Always try to connect to API first
      setApiError(null) // Reset error state before attempting connection

      try {
        // Use our fetchWithAuth utility to get departments
        // No need to send companyId, the API will use the authenticated user's company
        const response = await fetchWithAuth(`/api/departments`)

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()
        console.log("Fetched departments:", data)

        // تعديل هنا: التحقق مما إذا كانت البيانات مصفوفة مباشرة أو مغلفة في خاصية departments
        const departmentsArray = Array.isArray(data) ? data : data.departments || []

        if (departmentsArray.length > 0) {
          const formattedDepartments = departmentsArray.map((dept) => ({
            id: dept.id,
            name: dept.name,
            description: dept.description || "No description available",
            manager: dept.manager || "Not assigned",
            employeeCount: dept.employeeCount || 0,
            company: userCompanyName,
            companyId: dept.companyId,
            budget: Number.parseInt(dept.budget) || 0,
            createdAt: new Date(dept.createdAt),
          }))

          // Set the departments state with the formatted data
          setDepartments(formattedDepartments)
          console.log("Formatted Departments:", formattedDepartments)
        } else {
          console.log("No departments found in the response")
          setApiError("No departments found in the response")
        }
      } catch (error) {
        console.error("Error fetching departments:", error)

        // Store error message to display in UI
        if (error instanceof Error) {
          setApiError(error.message)
        } else {
          setApiError("Unknown error occurred while connecting to server")
        }

        // Show warning message
        toast({
          title: "Failed to connect to server",
          description: "Could not fetch departments from API. Using sample data instead.",
          variant: "destructive",
        })
      }
    }

    // Call the function
    fetchDepartments()
  }, [userCompanyName, toast])

  // Filter departments based on search query
  const filteredDepartments = departments.filter((department) => {
    return (
      department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      department.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      department.manager.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Updated handleCreateDepartment function using fetchWithAuth
  const handleCreateDepartment = async () => {
    if (!newDepartment.name || !newDepartment.budget) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Validate that budget is a number
    if (!/^\d+$/.test(newDepartment.budget)) {
      toast({
        title: "Error",
        description: "Budget must be a valid number",
        variant: "destructive",
      })
      return
    }

    // Try to create a new department via API
    try {
      console.log("Sending department creation request with data:", {
        name: newDepartment.name,
        budget: Number.parseInt(newDepartment.budget),
      })

      // Use our fetchWithAuth utility
      const response = await fetchWithAuth("/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newDepartment.name,
          budget: Number.parseInt(newDepartment.budget),
          // No need to send companyId, the API will use the authenticated user's company
        }),
      })

      console.log("Department creation response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.error || errorData.message || `API Error: ${response.status}`)
        } catch (e) {
          throw new Error(`API Error: ${response.status} - ${errorText.substring(0, 100)}`)
        }
      }

      const createdDepartment = await response.json()
      console.log("Department created:", createdDepartment)

      const departmentToAdd = {
        id: createdDepartment.id,
        name: createdDepartment.name,
        description: newDepartment.description || "",
        manager: newDepartment.manager || "Not assigned",
        employeeCount: 0,
        company: userCompanyName,
        companyId: createdDepartment.companyId,
        budget: Number.parseInt(createdDepartment.budget),
        createdAt: new Date(createdDepartment.createdAt),
      }

      setDepartments([...departments, departmentToAdd])
      setNewDepartment({
        name: "",
        description: "",
        manager: "",
        company: userCompanyName,
        budget: "0",
      })
      setIsCreateDialogOpen(false)

      toast({
        title: "Department Created",
        description: `Department "${createdDepartment.name}" created successfully with ID ${createdDepartment.id}`,
      })
    } catch (error) {
      console.error("Error creating department:", error)

      // Show more detailed error message
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: `Error creating department: ${error.message}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Unknown error occurred while creating department",
          variant: "destructive",
        })
      }
    }
  }

  // Handle edit department
  const handleEditDepartment = (department: any) => {
    setCurrentDepartment(department)
    setNewDepartment({
      name: department.name,
      description: department.description,
      manager: department.manager,
      company: department.company,
      budget: department.budget?.toString() || "0",
    })
    setIsEditDialogOpen(true)
  }

  // Handle update department
  const handleUpdateDepartment = () => {
    if (!newDepartment.name || !newDepartment.manager) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const updatedDepartments = departments.map((dept) =>
      dept.id === currentDepartment.id
        ? {
            ...dept,
            name: newDepartment.name,
            description: newDepartment.description,
            manager: newDepartment.manager,
          }
        : dept,
    )

    setDepartments(updatedDepartments)
    setIsEditDialogOpen(false)
    setCurrentDepartment(null)
    setNewDepartment({
      name: "",
      description: "",
      manager: "",
      company: userCompanyName,
      budget: "0",
    })

    toast({
      title: "Department Updated",
      description: "Department information has been updated successfully",
    })
  }

  // Handle change department manager
  const handleChangeManager = (department: any) => {
    setCurrentDepartment(department)
    setNewDepartment({
      ...newDepartment,
      manager: department.manager,
    })
    setIsChangeManagerDialogOpen(true)
  }

  // Handle update department manager
  const handleUpdateManager = () => {
    if (!newDepartment.manager) {
      toast({
        title: "Error",
        description: "Please select a manager for the department",
        variant: "destructive",
      })
      return
    }

    const updatedDepartments = departments.map((dept) =>
      dept.id === currentDepartment.id
        ? {
            ...dept,
            manager: newDepartment.manager,
          }
        : dept,
    )

    setDepartments(updatedDepartments)
    setIsChangeManagerDialogOpen(false)
    setCurrentDepartment(null)
    setNewDepartment({
      name: "",
      description: "",
      manager: "",
      company: userCompanyName,
      budget: "0",
    })

    toast({
      title: "Manager Changed",
      description: "Department manager has been changed successfully",
    })
  }

  // Handle delete department
  const handleDeleteDepartment = (id: number) => {
    setDepartments(departments.filter((dept) => dept.id !== id))
    toast({
      title: "Department Deleted",
      description: "Department has been deleted successfully",
    })
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">Manage organization departments and department managers</p>
        </div>
        <div className="flex items-center gap-4">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
                <DialogDescription>Enter new department information</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newDepartment.name}
                    onChange={handleInputChange}
                    placeholder="Enter department name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Department Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newDepartment.description}
                    onChange={handleInputChange}
                    placeholder="Enter department description"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    value={newDepartment.budget}
                    onChange={handleInputChange}
                    placeholder="Enter department budget"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="manager">Department Manager</Label>
                  <Select value={newDepartment.manager} onValueChange={(value) => handleSelectChange("manager", value)}>
                    <SelectTrigger id="manager">
                      <SelectValue placeholder="Select department manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.name}>
                          {employee.name} - {employee.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateDepartment}>Add Department</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Display error message if present */}
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

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for department..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">In your company</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.reduce((sum, dept) => sum + dept.employeeCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Department Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departments.length > 0
                ? Math.round(departments.reduce((sum, dept) => sum + dept.employeeCount, 0) / departments.length)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Employees per department</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
          <CardDescription>List of all departments in the organization</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Department Manager</TableHead>
                <TableHead className="text-right">Employee Count</TableHead>
                <TableHead className="text-right">Creation Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>{department.description}</TableCell>
                    <TableCell>{department.manager}</TableCell>
                    <TableCell className="text-right">{department.employeeCount}</TableCell>
                    <TableCell className="text-right">
                      {new Date(department.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
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
                          <DropdownMenuItem onClick={() => handleEditDepartment(department)}>
                            Edit Department
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeManager(department)}>
                            Change Department Manager
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteDepartment(department.id)}
                          >
                            Delete Department
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No departments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>Edit department information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Department Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={newDepartment.name}
                onChange={handleInputChange}
                placeholder="Enter department name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Department Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={newDepartment.description}
                onChange={handleInputChange}
                placeholder="Enter department description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-manager">Department Manager</Label>
              <Select value={newDepartment.manager} onValueChange={(value) => handleSelectChange("manager", value)}>
                <SelectTrigger id="edit-manager">
                  <SelectValue placeholder="Select department manager" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.name}>
                      {employee.name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDepartment}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Manager Dialog */}
      <Dialog open={isChangeManagerDialogOpen} onOpenChange={setIsChangeManagerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Department Manager</DialogTitle>
            <DialogDescription>Change manager for {currentDepartment?.name} department</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
              <UserCog className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-medium">Current Manager</h3>
                <p className="text-sm text-muted-foreground">{currentDepartment?.manager}</p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-manager">New Manager</Label>
              <Select value={newDepartment.manager} onValueChange={(value) => handleSelectChange("manager", value)}>
                <SelectTrigger id="new-manager">
                  <SelectValue placeholder="Select new department manager" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.name}>
                      {employee.name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangeManagerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateManager}>Change Manager</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

