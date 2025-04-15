"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, Building2, Briefcase, Calendar, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { fetchWithAuth } from "@/services/api-client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, Pencil, Shield } from "lucide-react"

interface EmployeeRole {
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
  roles?: EmployeeRole[]
}

export default function EmployeeDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>("Owner") // Mocked user role
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  })

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

        const data = await response.json()
        setEmployee(data)
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading employee details...</p>
      </div>
    )
  }

  if (error || !employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Error Loading Employee</h2>
        <p className="text-muted-foreground mb-4">{error || "Employee not found"}</p>
        <Button asChild>
          <Link href="/dashboard/employees">Back to Employees</Link>
        </Button>
      </div>
    )
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateUser = async () => {
    if (!userData.username || !userData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsCreatingUser(true)
    try {
      const response = await fetch("/api/employees/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            username: userData.username,
            password: userData.password,
            employeeId: employee.id,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create user account")
      }

      const data = await response.json()
      toast({
        title: "Success",
        description: "User account created successfully!",
      })
      setIsUserDialogOpen(false)
      setUserData({
        username: "",
        password: "",
      })
    } catch (error: any) {
      console.error("Error creating user account:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create user account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingUser(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/employees">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employee Details</h1>
          <p className="text-muted-foreground">View detailed information about this employee</p>
        </div>
        <div className="ml-auto">
          <Button asChild className="mr-2">
            <Link href={`/dashboard/employees/${employee.id}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Employee
            </Link>
          </Button>
          {userRole === "Owner" && (
            <Button onClick={() => setIsUserDialogOpen(true)}>
              <Shield className="h-4 w-4 mr-2" />
              Create User Account
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Personal details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={`/placeholder-graphic.png?key=x23uz&key=2s34h&height=80&width=80`}
                  alt={`${employee.firstName} ${employee.lastName}`}
                />
                <AvatarFallback className="text-lg">
                  {employee.firstName.charAt(0)}
                  {employee.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">
                  {employee.firstName} {employee.lastName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {employee.roles && employee.roles.length > 0 ? employee.roles[0].name : "Employee"}
                  </Badge>
                  <Badge
                    variant={employee.isActive ? "outline" : "destructive"}
                    className={employee.isActive ? "bg-green-100 text-green-800 border-green-200" : ""}
                  >
                    {employee.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">{employee.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Job Title</p>
                  <p className="text-muted-foreground">{employee.jobTitle || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Department</p>
                  <p className="text-muted-foreground">{employee.department?.name || "Not assigned"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Joined</p>
                  <p className="text-muted-foreground">{formatDate(employee.createdAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Details about the employee's company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Company</p>
                  <p className="text-muted-foreground">{employee.company.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Company Email</p>
                  <p className="text-muted-foreground">{employee.company.contactEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Company Address</p>
                  <p className="text-muted-foreground">{employee.company.address}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Roles & Permissions</h3>
              <div className="space-y-2">
                {employee.roles && employee.roles.length > 0 ? (
                  employee.roles.map((role) => (
                    <div key={role.id} className="flex items-center gap-2 p-2 rounded-md bg-muted">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>{role.name}</span>
                      <Badge variant="outline" className="ml-auto">
                        {role.scope}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Employee</span>
                    <Badge variant="outline" className="ml-auto">
                      default
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* User Account Creation Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create User Account</DialogTitle>
            <DialogDescription>
              Create a user account for {employee?.firstName} {employee?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={userData.username}
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
                value={userData.password}
                onChange={handleUserInputChange}
                placeholder="Enter password"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)} disabled={isCreatingUser}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} disabled={isCreatingUser}>
              {isCreatingUser ? (
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
    </div>
  )
}
