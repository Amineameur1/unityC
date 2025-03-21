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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Plus, Search, Users, Building2, UserCog } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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
]

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState(initialDepartments)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isChangeManagerDialogOpen, setIsChangeManagerDialogOpen] = useState(false)
  const [currentDepartment, setCurrentDepartment] = useState<any>(null)
  const { toast } = useToast()

  // New department form state
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    manager: "",
    company: "",
  })

  // Filter departments based on search query
  const filteredDepartments = departments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      department.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      department.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      department.company.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle input change for new department form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewDepartment((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select change for new department form
  const handleSelectChange = (name: string, value: string) => {
    setNewDepartment((prev) => ({ ...prev, [name]: value }))
  }

  // Handle create department
  const handleCreateDepartment = () => {
    if (!newDepartment.name || !newDepartment.manager || !newDepartment.company) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    const newId = departments.length > 0 ? Math.max(...departments.map((d) => d.id)) + 1 : 1
    const departmentToAdd = {
      id: newId,
      name: newDepartment.name,
      description: newDepartment.description,
      manager: newDepartment.manager,
      employeeCount: 0,
      company: newDepartment.company,
      createdAt: new Date(),
    }

    setDepartments([...departments, departmentToAdd])
    setNewDepartment({
      name: "",
      description: "",
      manager: "",
      company: "",
    })
    setIsCreateDialogOpen(false)

    toast({
      title: "تم إنشاء القسم",
      description: "تم إنشاء القسم الجديد بنجاح",
    })
  }

  // Handle edit department
  const handleEditDepartment = (department: any) => {
    setCurrentDepartment(department)
    setNewDepartment({
      name: department.name,
      description: department.description,
      manager: department.manager,
      company: department.company,
    })
    setIsEditDialogOpen(true)
  }

  // Handle update department
  const handleUpdateDepartment = () => {
    if (!newDepartment.name || !newDepartment.manager || !newDepartment.company) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
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
            company: newDepartment.company,
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
      company: "",
    })

    toast({
      title: "تم تحديث القسم",
      description: "تم تحديث معلومات القسم بنجاح",
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
        title: "خطأ",
        description: "يرجى اختيار مدير للقسم",
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
      company: "",
    })

    toast({
      title: "تم تغيير مدير القسم",
      description: "تم تغيير مدير القسم بنجاح",
    })
  }

  // Handle delete department
  const handleDeleteDepartment = (id: number) => {
    setDepartments(departments.filter((dept) => dept.id !== id))
    toast({
      title: "تم حذف القسم",
      description: "تم حذف القسم بنجاح",
    })
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">الأقسام</h1>
          <p className="text-muted-foreground">إدارة أقسام المؤسسة ومدراء الأقسام</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              إضافة قسم
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة قسم جديد</DialogTitle>
              <DialogDescription>أدخل معلومات القسم الجديد</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">اسم القسم</Label>
                <Input
                  id="name"
                  name="name"
                  value={newDepartment.name}
                  onChange={handleInputChange}
                  placeholder="أدخل اسم القسم"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">وصف القسم</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newDepartment.description}
                  onChange={handleInputChange}
                  placeholder="أدخل وصف القسم"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">الشركة</Label>
                <Select value={newDepartment.company} onValueChange={(value) => handleSelectChange("company", value)}>
                  <SelectTrigger id="company">
                    <SelectValue placeholder="اختر الشركة" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.name}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="manager">مدير القسم</Label>
                <Select value={newDepartment.manager} onValueChange={(value) => handleSelectChange("manager", value)}>
                  <SelectTrigger id="manager">
                    <SelectValue placeholder="اختر مدير القسم" />
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
                إلغاء
              </Button>
              <Button onClick={handleCreateDepartment}>إضافة القسم</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="البحث عن قسم..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">تصفية</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأقسام</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">في جميع الشركات</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الموظفين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.reduce((sum, dept) => sum + dept.employeeCount, 0)}</div>
            <p className="text-xs text-muted-foreground">في جميع الأقسام</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط حجم القسم</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(departments.reduce((sum, dept) => sum + dept.employeeCount, 0) / departments.length)}
            </div>
            <p className="text-xs text-muted-foreground">موظف لكل قسم</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الشركات</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(departments.map((dept) => dept.company)).size}</div>
            <p className="text-xs text-muted-foreground">لديها أقسام</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>الأقسام</CardTitle>
          <CardDescription>قائمة بجميع الأقسام في المؤسسة</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم القسم</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>مدير القسم</TableHead>
                <TableHead>الشركة</TableHead>
                <TableHead className="text-right">عدد الموظفين</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">{department.name}</TableCell>
                  <TableCell>{department.description}</TableCell>
                  <TableCell>{department.manager}</TableCell>
                  <TableCell>{department.company}</TableCell>
                  <TableCell className="text-right">{department.employeeCount}</TableCell>
                  <TableCell className="text-right">{department.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">الإجراءات</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditDepartment(department)}>
                          تعديل القسم
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeManager(department)}>
                          تغيير مدير القسم
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteDepartment(department.id)}
                        >
                          حذف القسم
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

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل القسم</DialogTitle>
            <DialogDescription>تعديل معلومات القسم</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">اسم القسم</Label>
              <Input
                id="edit-name"
                name="name"
                value={newDepartment.name}
                onChange={handleInputChange}
                placeholder="أدخل اسم القسم"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">وصف القسم</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={newDepartment.description}
                onChange={handleInputChange}
                placeholder="أدخل وصف القسم"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-company">الشركة</Label>
              <Select value={newDepartment.company} onValueChange={(value) => handleSelectChange("company", value)}>
                <SelectTrigger id="edit-company">
                  <SelectValue placeholder="اختر الشركة" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.name}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-manager">مدير القسم</Label>
              <Select value={newDepartment.manager} onValueChange={(value) => handleSelectChange("manager", value)}>
                <SelectTrigger id="edit-manager">
                  <SelectValue placeholder="اختر مدير القسم" />
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
              إلغاء
            </Button>
            <Button onClick={handleUpdateDepartment}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Manager Dialog */}
      <Dialog open={isChangeManagerDialogOpen} onOpenChange={setIsChangeManagerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تغيير مدير القسم</DialogTitle>
            <DialogDescription>تغيير مدير قسم {currentDepartment?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
              <UserCog className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-medium">المدير الحالي</h3>
                <p className="text-sm text-muted-foreground">{currentDepartment?.manager}</p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-manager">المدير الجديد</Label>
              <Select value={newDepartment.manager} onValueChange={(value) => handleSelectChange("manager", value)}>
                <SelectTrigger id="new-manager">
                  <SelectValue placeholder="اختر مدير القسم الجديد" />
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
              إلغاء
            </Button>
            <Button onClick={handleUpdateManager}>تغيير المدير</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

