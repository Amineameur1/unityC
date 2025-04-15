"use client"

import React from "react"

import { DialogFooter } from "@/components/ui/dialog"

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
import {
  MoreHorizontal,
  Plus,
  Search,
  Users,
  Building2,
  UserCog,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { departmentService, employeeService } from "@/services/api"

// Interface for employee data
interface Employee {
  id: number
  name: string
  position: string
  department?: string
}

// Sample companies data
const companies = [
  { id: 1, name: "Acme Corporation" },
  { id: 2, name: "Globex Industries" },
  { id: 3, name: "Initech Solutions" },
  { id: 4, name: "Stark Industries" },
  { id: 5, name: "Wayne Enterprises" },
  { id: 6, name: "Your Company" },
]

// Interface for department data
interface Department {
  id: number
  uuid?: string
  name: string
  description?: string
  manager?: string
  employeeCount?: number
  company?: string
  companyId?: number
  parentDepartmentId: number | null
  budget: string | number
  createdAt: Date | string
  updatedAt?: Date | string
  subDepartments?: Department[]
  isExpanded?: boolean
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreateSubDialogOpen, setIsCreateSubDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isChangeManagerDialogOpen, setIsChangeManagerDialogOpen] = useState(false)
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth() // Get the authenticated user
  const userRole = user?.role || "Employee" // افتراضي كموظف إذا لم يتم تحديد الدور

  // تعديل الدالة لإضافة التحقق من الصلاحيات
  const canCreateDepartment = userRole === "Owner"
  const canCreateSubDepartment = userRole === "Owner" || userRole === "Admin"
  const canUpdateDepartment =
    userRole === "Owner" || (userRole === "Admin" && currentDepartment?.manager === user?.name)
  const canDeleteDepartment =
    userRole === "Owner" || (userRole === "Admin" && currentDepartment?.parentDepartmentId !== null)

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
    parentDepartmentId: "",
  })

  // Fetch active employees for the company
  const fetchActiveEmployees = async () => {
    try {
      const response = await employeeService.getActiveEmployees(userCompanyId)
      console.log("Fetched active employees:", response)

      // Format the employee data
      const formattedEmployees = response.map((emp) => ({
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
        position: emp.position || "Employee",
        department: emp.departmentName,
      }))

      setEmployees(formattedEmployees)
    } catch (error) {
      console.error("Error fetching active employees:", error)
      // Use sample data if API fails
      setEmployees([
        { id: 1, name: "David Wilson", position: "Lead Developer", department: "Engineering" },
        { id: 2, name: "Sarah Johnson", position: "Marketing Manager", department: "Marketing" },
        { id: 3, name: "Michael Brown", position: "Financial Analyst", department: "Finance" },
        { id: 4, name: "Emily Davis", position: "HR Specialist", department: "Human Resources" },
        { id: 5, name: "Jessica Martinez", position: "Sales Representative", department: "Sales" },
        { id: 6, name: "Robert Taylor", position: "Product Manager", department: "Product" },
        { id: 7, name: "Jennifer Anderson", position: "Support Specialist", department: "Customer Support" },
        { id: 8, name: "Mohammed Abdullah", position: "IT Manager", department: "IT" },
      ])
    }
  }

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

  // Updated fetchDepartments function using departmentService
  const fetchDepartments = async () => {
    // Always try to connect to API first
    setApiError(null) // Reset error state before attempting connection

    try {
      // Use our departmentService to get departments
      const departmentsData = await departmentService.getDepartments()
      console.log("Fetched departments:", departmentsData)

      if (departmentsData && departmentsData.length > 0) {
        const formattedDepartments = await Promise.all(
          departmentsData.map(async (dept) => {
            // Only fetch sub-departments for parent departments
            let subDepartments = []
            if (dept.parentDepartmentId === null) {
              try {
                subDepartments = await departmentService.getSubDepartments(dept.id)
                console.log(`Sub-departments for ${dept.id}:`, subDepartments)
              } catch (error) {
                console.error(`Error fetching sub-departments for department ${dept.id}:`, error)
                subDepartments = []
              }
            }

            return {
              id: dept.id,
              uuid: dept.uuid,
              name: dept.name,
              description: dept.description || "No description available",
              manager: dept.manager || "Not assigned",
              employeeCount: dept.employeeCount || 0,
              company: userCompanyName,
              companyId: dept.companyId,
              parentDepartmentId: dept.parentDepartmentId,
              budget: dept.budget,
              createdAt: new Date(dept.createdAt),
              updatedAt: dept.updatedAt ? new Date(dept.updatedAt) : undefined,
              subDepartments: subDepartments.map((subDept) => ({
                ...subDept,
                createdAt: new Date(subDept.createdAt),
                updatedAt: subDept.updatedAt ? new Date(subDept.updatedAt) : undefined,
                description: subDept.description || "No description available",
                manager: subDept.manager || "Not assigned",
                employeeCount: subDept.employeeCount || 0,
              })),
              isExpanded: false,
            }
          }),
        )

        // Filter to only show parent departments in the main list
        const parentDepartments = formattedDepartments.filter((dept) => dept.parentDepartmentId === null)

        // Set the departments state with the formatted data
        setDepartments(parentDepartments)
        console.log("Formatted Departments:", parentDepartments)
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

  // Call fetchDepartments and fetchActiveEmployees on component mount
  useEffect(() => {
    fetchDepartments()
    fetchActiveEmployees()
  }, [userCompanyId, toast])

  // Toggle department expansion to show/hide sub-departments
  const toggleDepartmentExpansion = (departmentId: number) => {
    setDepartments((prevDepartments) =>
      prevDepartments.map((dept) => (dept.id === departmentId ? { ...dept, isExpanded: !dept.isExpanded } : dept)),
    )
  }

  // Filter departments based on search query
  const filteredDepartments = departments.filter((department) => {
    const matchesSearch =
      department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      department.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false ||
      department.manager?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false

    // Also check sub-departments
    const hasMatchingSubDepartment = department.subDepartments?.some(
      (subDept) =>
        subDept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subDept.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false ||
        subDept.manager?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false,
    )

    return matchesSearch || hasMatchingSubDepartment
  })

  // Updated handleCreateDepartment function using departmentService
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

      const createdDepartment = await departmentService.createDepartment({
        name: newDepartment.name,
        budget: Number.parseInt(newDepartment.budget),
        companyId: userCompanyId,
      })

      console.log("Department created:", createdDepartment)

      // Refresh the departments list
      await fetchDepartments()

      setNewDepartment({
        name: "",
        description: "",
        manager: "",
        company: userCompanyName,
        budget: "0",
        parentDepartmentId: "",
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

  // Handle create sub-department
  const handleCreateSubDepartment = async () => {
    if (!newDepartment.name || !newDepartment.budget || !newDepartment.parentDepartmentId) {
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

    try {
      console.log("Creating sub-department with data:", {
        name: newDepartment.name,
        budget: Number.parseInt(newDepartment.budget),
        parentDepartmentId: newDepartment.parentDepartmentId,
      })

      const createdSubDepartment = await departmentService.createSubDepartment({
        name: newDepartment.name,
        budget: Number.parseInt(newDepartment.budget),
        parentDepartmentId: Number.parseInt(newDepartment.parentDepartmentId),
        companyId: userCompanyId,
      })

      console.log("Sub-department created:", createdSubDepartment)

      // Refresh the departments list
      await fetchDepartments()

      setNewDepartment({
        name: "",
        description: "",
        manager: "",
        company: userCompanyName,
        budget: "0",
        parentDepartmentId: "",
      })
      setIsCreateSubDialogOpen(false)

      toast({
        title: "Sub-Department Created",
        description: `Sub-department "${createdSubDepartment.name}" created successfully`,
      })
    } catch (error) {
      console.error("Error creating sub-department:", error)

      if (error instanceof Error) {
        toast({
          title: "Error",
          description: `Error creating sub-department: ${error.message}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Unknown error occurred while creating sub-department",
          variant: "destructive",
        })
      }
    }
  }

  // Handle edit department
  const handleEditDepartment = (department: Department) => {
    setCurrentDepartment(department)
    setNewDepartment({
      name: department.name,
      description: department.description || "",
      manager: department.manager || "",
      company: userCompanyName,
      budget: typeof department.budget === "number" ? department.budget.toString() : department.budget,
      parentDepartmentId: department.parentDepartmentId ? department.parentDepartmentId.toString() : "",
    })
    setIsEditDialogOpen(true)
  }

  // Handle update department
  const handleUpdateDepartment = async () => {
    if (!currentDepartment || !newDepartment.name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const updatedDepartment = await departmentService.updateDepartment(currentDepartment.id, {
        name: newDepartment.name,
        budget: newDepartment.budget,
        parentDepartmentId: newDepartment.parentDepartmentId ? Number.parseInt(newDepartment.parentDepartmentId) : null,
        companyId: userCompanyId,
      })

      console.log("Department updated:", updatedDepartment)

      // Refresh the departments list
      await fetchDepartments()

      setIsEditDialogOpen(false)
      setCurrentDepartment(null)
      setNewDepartment({
        name: "",
        description: "",
        manager: "",
        company: userCompanyName,
        budget: "0",
        parentDepartmentId: "",
      })

      toast({
        title: "Department Updated",
        description: "Department information has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating department:", error)

      if (error instanceof Error) {
        toast({
          title: "Error",
          description: `Error updating department: ${error.message}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Unknown error occurred while updating department",
          variant: "destructive",
        })
      }
    }
  }

  // Handle change department manager
  const handleChangeManager = (department: Department) => {
    setCurrentDepartment(department)
    setNewDepartment({
      ...newDepartment,
      manager: department.manager || "",
    })
    setIsChangeManagerDialogOpen(true)
  }

  // Handle update department manager
  const handleUpdateManager = async () => {
    if (!currentDepartment || !newDepartment.manager) {
      toast({
        title: "Error",
        description: "Please select a manager for the department",
        variant: "destructive",
      })
      return
    }

    try {
      // Call API to update the department manager
      const updatedDepartment = await departmentService.updateDepartmentManager(currentDepartment.id, {
        manager: newDepartment.manager,
      })

      console.log("Department manager updated:", updatedDepartment)

      // Refresh the departments list
      await fetchDepartments()

      setIsChangeManagerDialogOpen(false)
      setCurrentDepartment(null)
      setNewDepartment({
        name: "",
        description: "",
        manager: "",
        company: userCompanyName,
        budget: "0",
        parentDepartmentId: "",
      })

      toast({
        title: "Manager Changed",
        description: "Department manager has been changed successfully",
      })
    } catch (error) {
      console.error("Error updating department manager:", error)

      if (error instanceof Error) {
        toast({
          title: "Error",
          description: `Error updating department manager: ${error.message}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Unknown error occurred while updating department manager",
          variant: "destructive",
        })
      }
    }
  }

  // Handle delete department
  const handleDeleteDepartment = async (id: number) => {
    try {
      // Call the API to delete the department
      await departmentService.deleteDepartment(id)

      // Refresh the departments list
      await fetchDepartments()

      toast({
        title: "Department Deleted",
        description: "Department has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting department:", error)

      toast({
        title: "Error",
        description: "Failed to delete department. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Calculate total departments (including sub-departments)
  const totalDepartments = departments.reduce((total, dept) => {
    return total + 1 + (dept.subDepartments?.length || 0)
  }, 0)

  // Calculate total employees across all departments
  const totalEmployees = departments.reduce((total, dept) => {
    const deptEmployees = dept.employeeCount || 0
    const subDeptEmployees =
      dept.subDepartments?.reduce((subTotal, subDept) => {
        return subTotal + (subDept.employeeCount || 0)
      }, 0) || 0

    return total + deptEmployees + subDeptEmployees
  }, 0)

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">Manage organization departments and department managers</p>
        </div>
        <div className="flex items-center gap-4">
          {canCreateSubDepartment && (
            <Dialog open={isCreateSubDialogOpen} onOpenChange={setIsCreateSubDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Add Sub-Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Sub-Department</DialogTitle>
                  <DialogDescription>Create a sub-department under an existing department</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="parentDepartmentId">Parent Department</Label>
                    <Select
                      value={newDepartment.parentDepartmentId}
                      onValueChange={(value) => handleSelectChange("parentDepartmentId", value)}
                    >
                      <SelectTrigger id="parentDepartmentId">
                        <SelectValue placeholder="Select parent department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sub-name">Sub-Department Name</Label>
                    <Input
                      id="sub-name"
                      name="name"
                      value={newDepartment.name}
                      onChange={handleInputChange}
                      placeholder="Enter sub-department name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sub-description">Sub-Department Description</Label>
                    <Textarea
                      id="sub-description"
                      name="description"
                      value={newDepartment.description}
                      onChange={handleInputChange}
                      placeholder="Enter sub-department description"
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sub-budget">Budget</Label>
                    <Input
                      id="sub-budget"
                      name="budget"
                      type="number"
                      value={newDepartment.budget}
                      onChange={handleInputChange}
                      placeholder="Enter sub-department budget"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sub-manager">Department Manager</Label>
                    <Select
                      value={newDepartment.manager}
                      onValueChange={(value) => handleSelectChange("manager", value)}
                    >
                      <SelectTrigger id="sub-manager">
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
                  <Button variant="outline" onClick={() => setIsCreateSubDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSubDepartment}>Add Sub-Department</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {canCreateDepartment && (
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
                    <Select
                      value={newDepartment.manager}
                      onValueChange={(value) => handleSelectChange("manager", value)}
                    >
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
          )}
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
            <div className="text-2xl font-bold">{totalDepartments}</div>
            <p className="text-xs text-muted-foreground">In your company</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
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
              {totalDepartments > 0 ? Math.round(totalEmployees / totalDepartments) : 0}
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
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Creation Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((department) => (
                  <React.Fragment key={department.id}>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleDepartmentExpansion(department.id)}
                            className="mr-2 focus:outline-none"
                            aria-label={department.isExpanded ? "Collapse department" : "Expand department"}
                          >
                            {department.subDepartments && department.subDepartments.length > 0 ? (
                              department.isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )
                            ) : null}
                          </button>
                          {department.name}
                        </div>
                      </TableCell>
                      <TableCell>{department.description}</TableCell>
                      <TableCell>{department.manager}</TableCell>
                      <TableCell className="text-right">{department.budget}</TableCell>
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
                            {canUpdateDepartment && (
                              <DropdownMenuItem onClick={() => handleEditDepartment(department)}>
                                Edit Department
                              </DropdownMenuItem>
                            )}
                            {canUpdateDepartment && (
                              <DropdownMenuItem onClick={() => handleChangeManager(department)}>
                                Change Department Manager
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {canDeleteDepartment && (
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteDepartment(department.id)}
                              >
                                Delete Department
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    {/* Render sub-departments if expanded */}
                    {department.isExpanded &&
                      department.subDepartments &&
                      department.subDepartments.map((subDept) => (
                        <TableRow key={`sub-${subDept.id}`} className="bg-muted/30">
                          <TableCell className="font-medium pl-10">└─ {subDept.name}</TableCell>
                          <TableCell>{subDept.description}</TableCell>
                          <TableCell>{subDept.manager}</TableCell>
                          <TableCell className="text-right">{subDept.budget}</TableCell>
                          <TableCell className="text-right">
                            {new Date(subDept.createdAt).toLocaleDateString("en-US", {
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
                                <DropdownMenuItem onClick={() => handleEditDepartment(subDept)}>
                                  Edit Sub-Department
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleChangeManager(subDept)}>
                                  Change Manager
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteDepartment(subDept.id)}
                                >
                                  Delete Sub-Department
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </React.Fragment>
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
              <Label htmlFor="edit-budget">Budget</Label>
              <Input
                id="edit-budget"
                name="budget"
                type="number"
                value={newDepartment.budget}
                onChange={handleInputChange}
                placeholder="Enter department budget"
                required
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
