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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, MoreHorizontal, Package, Plus, Search } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

// إضافة استخدام مكون المصادقة
import { useAuth } from "@/components/auth-provider"

export default function ResourcesPage() {
  // داخل المكون الرئيسي، أضف:
  const { user } = useAuth()
  const userRole = user?.role || "Employee" // افتراضي كموظف إذا لم يتم تحديد الدور

  const [resources, setResources] = useState<Array<any>>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [newResource, setNewResource] = useState({
    name: "",
    type: "",
    category: "",
    status: "Available",
    assignedTo: "",
    department: "",
    purchaseDate: new Date(),
    value: 0,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())

  // تعديل الدالة لإضافة التحقق من الصلاحيات
  const canCreateResource = userRole === "Owner" || userRole === "Admin"
  const canUpdateResource = userRole === "Owner" || userRole === "Admin"
  const canDeleteResource = userRole === "Owner"

  const filteredResources = resources.filter(
    (resource) =>
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.assignedTo && resource.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (resource.department && resource.department.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewResource((prev) => ({
      ...prev,
      [name]: name === "value" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewResource((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date)
      setNewResource((prev) => ({ ...prev, purchaseDate: date }))
    }
  }

  const handleAddResource = () => {
    const newId = resources.length > 0 ? Math.max(...resources.map((r) => r.id)) + 1 : 1
    const resourceToAdd = {
      id: newId,
      name: newResource.name,
      type: newResource.type,
      category: newResource.category,
      status: newResource.status,
      assignedTo: newResource.assignedTo || null,
      department: newResource.department || null,
      purchaseDate: newResource.purchaseDate,
      value: newResource.value,
    }
    setResources([...resources, resourceToAdd])
    setNewResource({
      name: "",
      type: "",
      category: "",
      status: "Available",
      assignedTo: "",
      department: "",
      purchaseDate: new Date(),
      value: 0,
    })
    setIsDialogOpen(false)
  }

  // Calculate statistics
  const totalResources = resources.length
  const allocatedResources = resources.filter((r) => r.status === "Allocated").length
  const availableResources = resources.filter((r) => r.status === "Available").length
  const totalValue = resources.reduce((sum, r) => sum + r.value, 0)

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground">Manage and track all resources across your organization</p>
        </div>
        {canCreateResource && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
                <DialogDescription>Add a new resource to your inventory.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Resource Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newResource.name}
                    onChange={handleInputChange}
                    placeholder="Enter resource name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={newResource.type} onValueChange={(value) => handleSelectChange("type", value)}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hardware">Hardware</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Service">Service</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={newResource.category}
                      onChange={handleInputChange}
                      placeholder="Enter category"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={newResource.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Allocated">Allocated</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="value">Value ($)</Label>
                    <Input
                      id="value"
                      name="value"
                      type="number"
                      value={newResource.value.toString()}
                      onChange={handleInputChange}
                      placeholder="Enter value"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                {newResource.status === "Allocated" && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="assignedTo">Assigned To</Label>
                      <Select
                        value={newResource.assignedTo}
                        onValueChange={(value) => handleSelectChange("assignedTo", value)}
                      >
                        <SelectTrigger id="assignedTo">
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="John Smith">John Smith</SelectItem>
                          <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                          <SelectItem value="Michael Brown">Michael Brown</SelectItem>
                          <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                          <SelectItem value="David Wilson">David Wilson</SelectItem>
                          <SelectItem value="Jessica Martinez">Jessica Martinez</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={newResource.department}
                        onValueChange={(value) => handleSelectChange("department", value)}
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Human Resources">Human Resources</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Facilities">Facilities</SelectItem>
                          <SelectItem value="Office Management">Office Management</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddResource}>Add Resource</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search resources..."
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
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResources}</div>
            <p className="text-xs text-muted-foreground">All resources in inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Allocated</CardTitle>
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
            <div className="text-2xl font-bold">{allocatedResources}</div>
            <p className="text-xs text-muted-foreground">Resources currently assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
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
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableResources}</div>
            <p className="text-xs text-muted-foreground">Resources ready for allocation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
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
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">Total inventory value</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>A list of all resources in your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.name}</TableCell>
                  <TableCell>{resource.type}</TableCell>
                  <TableCell>{resource.category}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        resource.status === "Available"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : resource.status === "Allocated"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            : resource.status === "Maintenance"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {resource.status}
                    </div>
                  </TableCell>
                  <TableCell>{resource.assignedTo || "-"}</TableCell>
                  <TableCell>{resource.department || "-"}</TableCell>
                  <TableCell>
                    $
                    {resource.value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        {canUpdateResource && <DropdownMenuItem>Edit Resource</DropdownMenuItem>}
                        {canUpdateResource && resource.status === "Available" && (
                          <DropdownMenuItem>Allocate</DropdownMenuItem>
                        )}
                        {canUpdateResource && resource.status === "Allocated" && (
                          <DropdownMenuItem>Deallocate</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {canDeleteResource && (
                          <DropdownMenuItem className="text-red-600">
                            {resource.status !== "Retired" ? "Mark as Retired" : "Delete"}
                          </DropdownMenuItem>
                        )}
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
