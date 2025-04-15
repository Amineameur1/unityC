"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Download, Search, Users, Building2, BarChart, ArrowUp, ArrowDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// إضافة استخدام مكون المصادقة
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

// Sample salary data
const initialSalaries = [
  {
    id: 1,
    employee: "John Smith",
    position: "Software Engineer",
    department: "Engineering",
    company: "Acme Corporation",
    baseSalary: 95000,
    bonus: 5000,
    totalCompensation: 100000,
    currency: "USD",
    lastReview: new Date(2023, 5, 15),
    status: "Active",
  },
  {
    id: 2,
    employee: "Sarah Johnson",
    position: "Marketing Manager",
    department: "Marketing",
    company: "Acme Corporation",
    baseSalary: 85000,
    bonus: 7500,
    totalCompensation: 92500,
    currency: "USD",
    lastReview: new Date(2023, 4, 10),
    status: "Active",
  },
  {
    id: 3,
    employee: "Michael Brown",
    position: "Financial Analyst",
    department: "Finance",
    company: "Globex Industries",
    baseSalary: 78000,
    bonus: 3000,
    totalCompensation: 81000,
    currency: "USD",
    lastReview: new Date(2023, 3, 20),
    status: "Active",
  },
  {
    id: 4,
    employee: "Emily Davis",
    position: "HR Specialist",
    department: "Human Resources",
    company: "Initech Solutions",
    baseSalary: 72000,
    bonus: 2000,
    totalCompensation: 74000,
    currency: "USD",
    lastReview: new Date(2023, 2, 5),
    status: "Active",
  },
  {
    id: 5,
    employee: "David Wilson",
    position: "Lead Developer",
    department: "Engineering",
    company: "Acme Corporation",
    baseSalary: 110000,
    bonus: 15000,
    totalCompensation: 125000,
    currency: "USD",
    lastReview: new Date(2023, 5, 1),
    status: "Active",
  },
  {
    id: 6,
    employee: "Jessica Martinez",
    position: "Sales Representative",
    department: "Sales",
    company: "Globex Industries",
    baseSalary: 65000,
    bonus: 12000,
    totalCompensation: 77000,
    currency: "USD",
    lastReview: new Date(2023, 4, 15),
    status: "Active",
  },
  {
    id: 7,
    employee: "Robert Taylor",
    position: "Product Manager",
    department: "Product",
    company: "Initech Solutions",
    baseSalary: 98000,
    bonus: 8000,
    totalCompensation: 106000,
    currency: "USD",
    lastReview: new Date(2023, 3, 10),
    status: "Active",
  },
  {
    id: 8,
    employee: "Jennifer Anderson",
    position: "Support Specialist",
    department: "Customer Support",
    company: "Acme Corporation",
    baseSalary: 62000,
    bonus: 1500,
    totalCompensation: 63500,
    currency: "USD",
    lastReview: new Date(2023, 2, 20),
    status: "Active",
  },
  {
    id: 9,
    employee: "Mohammed Abdullah",
    position: "CTO",
    department: "Engineering",
    company: "TechSolutions Inc.",
    baseSalary: 180000,
    bonus: 30000,
    totalCompensation: 210000,
    currency: "USD",
    lastReview: new Date(2023, 5, 20),
    status: "Active",
  },
  {
    id: 10,
    employee: "Lisa Wong",
    position: "CFO",
    department: "Finance",
    company: "TechSolutions Inc.",
    baseSalary: 175000,
    bonus: 35000,
    totalCompensation: 210000,
    currency: "USD",
    lastReview: new Date(2023, 4, 25),
    status: "Active",
  },
]

export default function SalariesPage() {
  const [salaries, setSalaries] = useState(initialSalaries)
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")
  const [sortField, setSortField] = useState("employee")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // داخل المكون الرئيسي، أضف:
  const { user } = useAuth()
  const userRole = user?.role || "Employee" // افتراضي كموظف إذا لم يتم تحديد الدور
  const router = useRouter()
  const { toast } = useToast()

  // تعديل الدالة لإضافة التحقق من الصلاحيات
  const canViewSalaries = userRole === "Owner"
  const canUpdateSalaries = userRole === "Owner"

  // إضافة تحقق من الصلاحيات في بداية المكون
  useEffect(() => {
    // إذا لم يكن المستخدم مالكاً، قم بتوجيهه إلى لوحة التحكم
    if (!canViewSalaries) {
      router.push("/dashboard")
      toast({
        title: "Access Denied",
        description: "You don't have permission to view salary information",
        variant: "destructive",
      })
    }
  }, [canViewSalaries, router, toast])

  // Get unique departments and companies for filters
  const departments = [...new Set(salaries.map((s) => s.department))]
  const companies = [...new Set(salaries.map((s) => s.company))]

  // Filter salaries based on search query and filters
  const filteredSalaries = salaries
    .filter((salary) => {
      // Search filter
      const matchesSearch =
        salary.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salary.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salary.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salary.company.toLowerCase().includes(searchQuery.toLowerCase())

      // Department filter
      const matchesDepartment = departmentFilter === "all" || salary.department === departmentFilter

      // Company filter
      const matchesCompany = companyFilter === "all" || salary.company === companyFilter

      return matchesSearch && matchesDepartment && matchesCompany
    })
    .sort((a, b) => {
      // Sort based on selected field and direction
      const fieldA = a[sortField as keyof typeof a]
      const fieldB = b[sortField as keyof typeof b]

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
      } else {
        return sortDirection === "asc"
          ? (fieldA as number) - (fieldB as number)
          : (fieldB as number) - (fieldA as number)
      }
    })

  // Calculate statistics
  const totalEmployees = filteredSalaries.length
  const totalSalaries = filteredSalaries.reduce((sum, s) => sum + s.totalCompensation, 0)
  const averageSalary = totalEmployees > 0 ? totalSalaries / totalEmployees : 0
  const highestSalary = filteredSalaries.length > 0 ? Math.max(...filteredSalaries.map((s) => s.totalCompensation)) : 0

  // Handle sort
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (field !== sortField) return null
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Salary Management</h1>
          <p className="text-muted-foreground">View and manage employee compensation data</p>
        </div>
        <Button variant="outline" className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

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
        <div className="flex flex-col gap-2 md:w-48">
          <span className="text-sm font-medium">Department</span>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 md:w-48">
          <span className="text-sm font-medium">Company</span>
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Employees with salary data</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compensation</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalSalaries.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">Total annual compensation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${averageSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">Average annual compensation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Salary</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${highestSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">Highest annual compensation</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Compensation</CardTitle>
          <CardDescription>Detailed salary information for all employees</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("employee")}>
                  <div className="flex items-center">Employee {renderSortIndicator("employee")}</div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("position")}>
                  <div className="flex items-center">Position {renderSortIndicator("position")}</div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("department")}>
                  <div className="flex items-center">Department {renderSortIndicator("department")}</div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("company")}>
                  <div className="flex items-center">Company {renderSortIndicator("company")}</div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("baseSalary")}>
                  <div className="flex items-center justify-end">Base Salary {renderSortIndicator("baseSalary")}</div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("bonus")}>
                  <div className="flex items-center justify-end">Bonus {renderSortIndicator("bonus")}</div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("totalCompensation")}>
                  <div className="flex items-center justify-end">Total {renderSortIndicator("totalCompensation")}</div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSalaries.map((salary) => (
                <TableRow key={salary.id}>
                  <TableCell className="font-medium">{salary.employee}</TableCell>
                  <TableCell>{salary.position}</TableCell>
                  <TableCell>{salary.department}</TableCell>
                  <TableCell>{salary.company}</TableCell>
                  <TableCell className="text-right">
                    ${salary.baseSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell className="text-right">
                    ${salary.bonus.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${salary.totalCompensation.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Open menu</span>
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        {canUpdateSalaries && <DropdownMenuItem>Edit Salary</DropdownMenuItem>}
                        <DropdownMenuItem>Salary History</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Performance Review</DropdownMenuItem>
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
