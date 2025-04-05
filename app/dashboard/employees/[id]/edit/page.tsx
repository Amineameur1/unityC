"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Loader2, AlertTriangle, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { fetchWithAuth } from "@/services/api-client"

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
  roles?: any[]
}

export default function EditEmployeePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    departmentId: "",
    jobTitle: "",
    isActive: true,
  })

  // Fetch employee details
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const employeeId = params.id
        if (!employeeId) {
          throw new Error("Employee ID is required")
        }

        const response = await fetchWithAuth(`/api/employees/${employeeId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch employee details: ${response.status}`)
        }

        const data: Employee = await response.json()

        // Set form data from employee details
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          departmentId: data.departmentId ? data.departmentId.toString() : "",
          jobTitle: data.jobTitle || "",
          isActive: data.isActive,
        })
      } catch (error) {
        console.error("Error fetching employee details:", error)
        setError(error instanceof Error ? error.message : "Failed to load employee details")
        toast({
          title: "Error",
          description: "Failed to load employee details. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployeeDetails()
  }, [params.id, toast])

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
        setDepartments(departmentsArray)
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
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const employeeId = params.id
      if (!employeeId) {
        throw new Error("Employee ID is required")
      }

      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email) {
        throw new Error("Please fill in all required fields")
      }

      // Prepare the request body
      const requestBody = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        departmentId: formData.departmentId ? Number.parseInt(formData.departmentId) : null,
        jobTitle: formData.jobTitle || null,
        isActive: formData.isActive,
      }

      // Send the update request
      const response = await fetchWithAuth(`/api/employees/${employeeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update employee")
      }

      toast({
        title: "Success",
        description: "Employee updated successfully!",
      })

      // Redirect back to the employee details page
      router.push(`/dashboard/employees/${employeeId}`)
    } catch (error) {
      console.error("Error updating employee:", error)
      setError(error instanceof Error ? error.message : "Failed to update employee")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update employee. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading employee details...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/employees/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Employee</h1>
          <p className="text-muted-foreground">Update employee information</p>
        </div>
      </div>

      {error && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <h3 className="font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
            <CardDescription>Update the employee's personal and professional details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
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
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="departmentId">Department</Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) => handleSelectChange("departmentId", value)}
                >
                  <SelectTrigger id="departmentId">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-1">None</SelectItem>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id.toString()}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="Enter job title"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="isActive">Active Employee</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/employees/${params.id}`}>Cancel</Link>
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
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

