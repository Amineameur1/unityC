"use client"

import type React from "react"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building2, MoreHorizontal, Plus, Search, Users, Grid2X2, LayoutList } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

// Sample company data
const initialCompanies = [
  {
    id: 1,
    name: "Acme Corporation",
    industry: "Technology",
    employees: 1200,
    location: "New York, USA",
    departments: 8,
    status: "Active",
  },
  {
    id: 2,
    name: "Globex Industries",
    industry: "Manufacturing",
    employees: 850,
    location: "Chicago, USA",
    departments: 6,
    status: "Active",
  },
  {
    id: 3,
    name: "Initech Solutions",
    industry: "Software",
    employees: 450,
    location: "San Francisco, USA",
    departments: 5,
    status: "Active",
  },
  {
    id: 4,
    name: "Umbrella Corporation",
    industry: "Pharmaceuticals",
    employees: 2000,
    location: "Boston, USA",
    departments: 12,
    status: "Active",
  },
  {
    id: 5,
    name: "Stark Industries",
    industry: "Technology",
    employees: 1500,
    location: "Los Angeles, USA",
    departments: 10,
    status: "Active",
  },
  {
    id: 6,
    name: "Wayne Enterprises",
    industry: "Conglomerate",
    employees: 3000,
    location: "Gotham City, USA",
    departments: 15,
    status: "Active",
  },
  {
    id: 7,
    name: "Cyberdyne Systems",
    industry: "Robotics",
    employees: 750,
    location: "Sunnyvale, USA",
    departments: 7,
    status: "Inactive",
  },
  {
    id: 8,
    name: "Massive Dynamic",
    industry: "Research",
    employees: 1200,
    location: "New York, USA",
    departments: 9,
    status: "Active",
  },
]

export default function CompaniesPage() {
  const [companies, setCompanies] = useState(initialCompanies)
  const [searchQuery, setSearchQuery] = useState("")
  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "",
    location: "",
    description: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState("table")

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCompany((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCompany = () => {
    if (!newCompany.name) {
      toast({
        title: "Error",
        description: "Company name is required",
        variant: "destructive",
      })
      return
    }

    const newId = companies.length > 0 ? Math.max(...companies.map((c) => c.id)) + 1 : 1
    const companyToAdd = {
      id: newId,
      name: newCompany.name,
      industry: newCompany.industry || "Technology",
      location: newCompany.location || "Not specified",
      employees: 0,
      departments: 0,
      status: "Active",
    }

    setCompanies([...companies, companyToAdd])
    setNewCompany({
      name: "",
      industry: "",
      location: "",
      description: "",
    })

    setIsDialogOpen(false)

    toast({
      title: "Company added",
      description: `${companyToAdd.name} has been added successfully`,
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">Manage your organization's companies and their details</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
              <DialogDescription>Enter the details of the new company to add to your organization.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newCompany.name}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  name="industry"
                  value={newCompany.industry}
                  onChange={handleInputChange}
                  placeholder="Enter industry"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={newCompany.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newCompany.description}
                  onChange={handleInputChange}
                  placeholder="Enter company description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCompany}>Add Company</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search companies..."
            className="w-full rounded-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
            <TabsList className="grid w-auto grid-cols-2">
              <TabsTrigger value="table" className="px-3">
                <LayoutList className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="grid" className="px-3">
                <Grid2X2 className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" className="rounded-full">
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/20">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <div className="rounded-full bg-blue-500/20 p-1">
              <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{companies.length}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>{companies.filter((c) => c.status === "Active").length} active</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/20">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <div className="rounded-full bg-purple-500/20 p-1">
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {companies.reduce((sum, company) => sum + company.employees, 0).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>Across all companies</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/20">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <div className="rounded-full bg-amber-500/20 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-amber-600 dark:text-amber-400"
              >
                <rect width="8" height="8" x="3" y="3" rx="2" />
                <rect width="8" height="8" x="13" y="3" rx="2" />
                <rect width="8" height="8" x="3" y="13" rx="2" />
                <rect width="8" height="8" x="13" y="13" rx="2" />
              </svg>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{companies.reduce((sum, company) => sum + company.departments, 0)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>Across all companies</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/20">
            <CardTitle className="text-sm font-medium">Average Size</CardTitle>
            <div className="rounded-full bg-green-500/20 p-1">
              <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {Math.round(
                companies.reduce((sum, company) => sum + company.employees, 0) / companies.length,
              ).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>Employees per company</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {viewMode === "table" ? (
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader>
            <CardTitle>Companies</CardTitle>
            <CardDescription>A list of all companies in your organization.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Employees</TableHead>
                  <TableHead className="text-right">Departments</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.industry}</TableCell>
                    <TableCell>{company.location}</TableCell>
                    <TableCell className="text-right">{company.employees.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{company.departments}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          company.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200"
                        }`}
                      >
                        {company.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Company</DropdownMenuItem>
                          <DropdownMenuItem>Manage Departments</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            {company.status === "Active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="border-none shadow-md overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle>{company.name}</CardTitle>
                    <CardDescription>{company.industry}</CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      company.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200"
                    }`}
                  >
                    {company.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="h-4 w-4" />
                      <span>{company.location}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                        <span className="text-lg font-bold">{company.employees.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">Employees</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                        <span className="text-lg font-bold">{company.departments}</span>
                        <span className="text-xs text-muted-foreground">Departments</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          More
                          <MoreHorizontal className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Company</DropdownMenuItem>
                        <DropdownMenuItem>Manage Departments</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          {company.status === "Active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
