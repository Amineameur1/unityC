"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { apiClient } from "@/services/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define interfaces for the API response
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

interface Company {
  id: number
  uuid: string
  name: string
  address: string
  contactEmail: string
  createdAt: string
  updatedAt: string
}

interface Role {
  id: number
  uuid: string
  name: string
  scope: string
  createdAt: string
  updatedAt: string
  EmployeeRole: {
    id: number
    uuid: string
    employeeId: number
    roleId: number
    createdAt: string
    updatedAt: string
  }
}

interface EmployeeData {
  id: number
  uuid: string
  firstName: string
  lastName: string
  email: string
  departmentId: number
  companyId: number
  jobTitle: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  department: Department
  company: Company
  roles: Role[]
}

export default function ProfileSettingsPage() {
  const { user, getAuthHeader } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    jobTitle: "",
    departmentName: "",
    departmentId: 0,
    roleName: "",
    roleScope: "",
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    createdAt: "",
    isActive: false,
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Check if user is admin or employee
      const isAdminOrEmployee = user?.role === "Admin" || user?.role === "Employee"

      let response

      if (isAdminOrEmployee) {
        // Get employee ID and department ID from user context
        const employeeId = user?.employee || 19 // Default to 19 if not available
        const departmentId = user?.departmentId || 1 // Default to 1 if not available

        // Use dynamic values in the API endpoint
        response = await apiClient.get(`/employee/${employeeId}?departmentId=${departmentId}`)
      } else {
        // For other user types, use the original endpoint
        const userId = user?.employee || 19 // Default to 19 if not available
        response = await apiClient.get(`/employee/${userId}`)
      }

      const userData: EmployeeData = response.data

      if (userData) {
        setFormData({
          username: userData.email ? userData.email.split("@")[0] : "",
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: "", // Not provided in API
          bio: "", // Not provided in API
          jobTitle: userData.jobTitle || "",
          departmentName: userData.department?.name || "",
          departmentId: userData.departmentId || 0,
          roleName: userData.roles && userData.roles.length > 0 ? userData.roles[0].name : "",
          roleScope: userData.roles && userData.roles.length > 0 ? userData.roles[0].scope : "",
          companyName: userData.company?.name || "",
          companyAddress: userData.company?.address || "",
          companyEmail: userData.company?.contactEmail || "",
          createdAt: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "",
          isActive: userData.isActive || false,
        })
      } else {
        setError("No user data found in the response")
      }
    } catch (err) {
      console.error("Error fetching user data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch user data")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated data to your API
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button variant="link" onClick={fetchUserData} className="p-0 h-auto font-normal">
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="job">Job Information</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="mt-6 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <>
            <TabsContent value="profile">
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Manage your personal information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Status</Label>
                      <div className="flex items-center space-x-2">
                        {formData.isActive ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-500" /> <span>Active</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-5 w-5 text-red-500" /> <span>Inactive</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Account Created</Label>
                      <div>{formData.createdAt}</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Save Changes</Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>

            <TabsContent value="job">
              <Card>
                <CardHeader>
                  <CardTitle>Job Information</CardTitle>
                  <CardDescription>View your job details and department information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" value={formData.jobTitle} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departmentName">Department</Label>
                    <Input id="departmentName" value={formData.departmentName} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departmentId">Department ID</Label>
                    <Input id="departmentId" value={formData.departmentId.toString()} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roleName">Role</Label>
                    <Input id="roleName" value={formData.roleName} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roleScope">Role Scope</Label>
                    <Input id="roleScope" value={formData.roleScope} readOnly className="bg-gray-50" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>View your company details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" value={formData.companyName} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Company Address</Label>
                    <Input id="companyAddress" value={formData.companyAddress} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Company Email</Label>
                    <Input id="companyEmail" value={formData.companyEmail} readOnly className="bg-gray-50" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
