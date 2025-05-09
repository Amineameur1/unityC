"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { fetchWithAuth } from "@/services/api-client"

// Interface for employee data
interface Employee {
  id: number
  uuid?: string
  firstName: string
  lastName: string
  email: string
  departmentId: number | null
  companyId: number
  jobTitle: string | null
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  department?: {
    id: number
    name: string
  } | null
}

// Interface for department data
interface Department {
  id: number
  name: string
}

export default function EditEmployeePage() {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userDepartmentId, setUserDepartmentId] = useState<number | null>(null)

  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  // Get the employee ID from the URL
  const employeeId = params.id as string

  // Get the department ID from the URL query parameters (for Admin users)
  const departmentIdParam = searchParams.get("departmentId")

  // Get the user's role
  const userRole = user?.role || "Employee"

  // Fetch the user's department ID if they are an Admin
  useEffect(() => {
    const fetchUserDepartment = async () => {
      if (userRole === "Admin" && user?.id) {
        try {
          const response = await fetchWithAuth(`/api/employees/${user.id}`)
          if (response.ok) {
            const userData = await response.json()
            if (userData.departmentId) {
              setUserDepartmentId(userData.departmentId)
            }
          }
        } catch (error) {
          console.error("Error fetching user department:", error)
        }
      }
    }

    fetchUserDepartment()
  }, [user, userRole])

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetchWithAuth(`/api/employees/${employeeId}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch employee: ${response.status}`)
        }

        const data = await response.json()

        // For Admin users, check if the employee belongs to their department
        if (userRole === "Admin" && userDepartmentId && data.departmentId !== userDepartmentId) {
          setError("You do not have permission to edit employees from other departments")
          setEmployee(null)
          setIsLoading(false)
          return
        }

        setEmployee(data)
      } catch (error) {
        console.error("Error fetching employee:", error)
        setError("Failed to load employee data. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load employee data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (employeeId) {
      fetchEmployee()
    }
  }, [employeeId, toast, userRole, userDepartmentId])

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetchWithAuth(`/api/departments`)
        if (!response.ok) {
          throw new Error("Failed to fetch departments")
        }

        const data = await response.json()

        // Check if departments is an array or nested in a property
        const departmentsArray = Array.isArray(data) ? data : data.departments || []

        // For Admin users, filter to only show their department
        if (userRole === "Admin" && userDepartmentId) {
          const filteredDepartments = departmentsArray.filter((dept) => dept.id === userDepartmentId)
          setDepartments(filteredDepartments)
        } else {
          setDepartments(departmentsArray)
        }
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
  }, [toast, userRole, userDepartmentId])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (employee) {
      setEmployee({ ...employee, [name]: value })
    }
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    if (employee) {
      setEmployee({ ...employee, [name]: name === "departmentId" ? Number(value) : value })
    }
  }

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    if (employee) {
      setEmployee({ ...employee, isActive: checked })
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!employee) return

    setIsSaving(true)
    try {
      // For Admin users, include their department ID in the URL
      let url = `/api/employees/${employeeId}`
      if (userRole === "Admin" && userDepartmentId) {
        url += `?departmentId=${userDepartmentId}`
      }

      const response = await fetchWithAuth(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": userRole,
          "X-User-Department": userDepartmentId?.toString() || "",
        },
        body: JSON.stringify(employee),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update employee")
      }

      toast({
        title: "Success",
        description: "Employee updated successfully!",
      })

      // Navigate back to the employees list
      router.push("/dashboard/employees")
    } catch (error: any) {
      console.error("Error updating employee:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update employee. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    router.push("/dashboard/employees")
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="outline" onClick={handleCancel} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Employees
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Employee</CardTitle>
          <CardDescription>Update employee information</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading employee data...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : employee ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={employee.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={employee.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={employee.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="departmentId">Department</Label>
                  <Select
                    value={employee.departmentId?.toString() || ""}
                    onValueChange={(value) => handleSelectChange("departmentId", value)}
                    disabled={userRole === "Admin"} // Disable for Admin users
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
                  {userRole === "Admin" && (
                    <p className="text-xs text-muted-foreground">
                      As an Admin, you cannot change an employee's department.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" name="jobTitle" value={employee.jobTitle || ""} onChange={handleInputChange} />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="isActive" checked={employee.isActive} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="isActive">Active Employee</Label>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Employee not found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
