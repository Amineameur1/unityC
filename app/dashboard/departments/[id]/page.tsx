"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2, Calendar, Mail, Phone, UserCog, Users } from "lucide-react"
import Link from "next/link"

// Import the useAuth hook at the top of the file with the other imports
import { useAuth } from "@/components/auth-provider"

// Sample department data
const departmentsData = [
  {
    id: 1,
    name: "Engineering",
    description:
      "Software development and engineering team responsible for building and maintaining our products. The team works on frontend, backend, mobile, and infrastructure projects.",
    manager: "David Wilson",
    managerEmail: "david.wilson@example.com",
    managerPhone: "+1 (555) 123-4567",
    employeeCount: 25,
    company: "Acme Corporation",
    createdAt: new Date(2022, 5, 15),
    location: "Floor 3, Building A",
    budget: 1500000,
    projects: [
      { id: 1, name: "Product Redesign", status: "In Progress", deadline: new Date(2023, 8, 30) },
      { id: 2, name: "Mobile App Development", status: "Planning", deadline: new Date(2023, 9, 15) },
      { id: 3, name: "API Refactoring", status: "Completed", deadline: new Date(2023, 7, 10) },
    ],
    employees: [
      {
        id: 1,
        name: "John Smith",
        position: "Senior Developer",
        email: "john.smith@example.com",
        joinDate: new Date(2022, 1, 15),
      },
      {
        id: 2,
        name: "Sarah Johnson",
        position: "UX Designer",
        email: "sarah.johnson@example.com",
        joinDate: new Date(2022, 3, 10),
      },
      {
        id: 3,
        name: "Michael Brown",
        position: "Backend Developer",
        email: "michael.brown@example.com",
        joinDate: new Date(2022, 5, 22),
      },
      {
        id: 4,
        name: "Emily Davis",
        position: "QA Engineer",
        email: "emily.davis@example.com",
        joinDate: new Date(2022, 2, 8),
      },
      {
        id: 5,
        name: "David Wilson",
        position: "Engineering Manager",
        email: "david.wilson@example.com",
        joinDate: new Date(2021, 11, 5),
      },
    ],
  },
  {
    id: 2,
    name: "Marketing",
    description:
      "Marketing and brand management team responsible for company branding, marketing campaigns, and customer acquisition strategies.",
    manager: "Sarah Johnson",
    managerEmail: "sarah.johnson@example.com",
    managerPhone: "+1 (555) 234-5678",
    employeeCount: 15,
    company: "Acme Corporation",
    createdAt: new Date(2022, 6, 10),
    location: "Floor 2, Building B",
    budget: 800000,
    projects: [
      { id: 1, name: "Q3 Marketing Campaign", status: "In Progress", deadline: new Date(2023, 8, 15) },
      { id: 2, name: "Brand Refresh", status: "Planning", deadline: new Date(2023, 10, 1) },
    ],
    employees: [
      {
        id: 1,
        name: "Jessica Martinez",
        position: "Marketing Specialist",
        email: "jessica.martinez@example.com",
        joinDate: new Date(2022, 2, 15),
      },
      {
        id: 2,
        name: "Robert Taylor",
        position: "Content Writer",
        email: "robert.taylor@example.com",
        joinDate: new Date(2022, 4, 10),
      },
      {
        id: 3,
        name: "Sarah Johnson",
        position: "Marketing Manager",
        email: "sarah.johnson@example.com",
        joinDate: new Date(2021, 10, 5),
      },
    ],
  },
]

// In the DepartmentDetailsPage component, add the following code to get the user's company ID
export default function DepartmentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [department, setDepartment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth() // Get the authenticated user

  // Get the user's company ID
  const userCompanyId = user?.company || null

  useEffect(() => {
    // In a real application, you would fetch the department data from an API
    // For this example, we'll use the sample data
    const departmentId = Number(params.id)
    const foundDepartment = departmentsData.find((dept) => dept.id === departmentId)

    if (foundDepartment) {
      // In a real app, you would check if the department belongs to the user's company
      // if (foundDepartment.companyId !== userCompanyId) {
      //   router.push("/dashboard/departments")
      //   return
      // }

      setDepartment(foundDepartment)
    } else {
      // If department not found, redirect to departments list
      router.push("/dashboard/departments")
    }

    setLoading(false)
  }, [params.id, router, userCompanyId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading department data...</p>
        </div>
      </div>
    )
  }

  if (!department) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground">The requested department was not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/departments">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{department.name}</h1>
          <p className="text-muted-foreground">{department.company}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employee Count</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{department.employeeCount}</div>
            <p className="text-xs text-muted-foreground">employees in department</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{department.projects.length}</div>
            <p className="text-xs text-muted-foreground">active projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${department.budget?.toLocaleString() || "0"}</div>
            <p className="text-xs text-muted-foreground">annual budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Creation Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{department.createdAt.toLocaleDateString()}</div>
            <p className="text-xs text-muted-foreground">department creation date</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Department Information</CardTitle>
            <CardDescription>Details and information about the department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{department.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Company</h3>
                <p className="text-sm text-muted-foreground">{department.company}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Location</h3>
                <p className="text-sm text-muted-foreground">{department.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Department Manager</CardTitle>
            <CardDescription>Information about the department manager</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`/placeholder.svg?height=64&width=64`} alt={department.manager} />
                <AvatarFallback className="text-lg">
                  {department.manager
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">{department.manager}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserCog className="h-4 w-4" />
                  <span>Department Manager</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{department.managerEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{department.managerPhone}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="employees" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Employees</CardTitle>
              <CardDescription>List of all employees in the department</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Join Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {department.employees.map((employee: any) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell className="text-right">{employee.joinDate.toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projects" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Projects</CardTitle>
              <CardDescription>List of current department projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Deadline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {department.projects.map((project: any) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            project.status === "Completed"
                              ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                              : project.status === "In Progress"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
                          }
                        >
                          {project.status === "Completed"
                            ? "Completed"
                            : project.status === "In Progress"
                              ? "In Progress"
                              : "Planning"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{project.deadline.toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
