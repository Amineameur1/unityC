"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProfileSettingsPage() {
  const { toast } = useToast()
  const [profileData, setProfileData] = useState({
    username: "mohammed_a",
    firstName: "Mohammed",
    lastName: "Abdullah",
    email: "mohammed@example.com",
    phone: "+966 50 123 4567",
    bio: "Software developer with experience in web and mobile application development.",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [companyData, setCompanyData] = useState({
    name: "Tech Solutions Ltd",
    industry: "Information Technology",
    size: "50-100",
    registrationNumber: "REG123456789",
    taxId: "TAX987654321",
    foundedYear: "2015",
    website: "https://techsolutions.example.com",
    address: "123 Business Park, Riyadh, Saudi Arabia",
    phone: "+966 11 234 5678",
    email: "info@techsolutions.example.com",
    description:
      "A leading technology solutions provider specializing in enterprise software development and IT consulting services.",
  })

  const [departments, setDepartments] = useState([
    { id: 1, name: "Engineering", description: "Software development and engineering", employeeCount: 25 },
    { id: 2, name: "Marketing", description: "Marketing and sales", employeeCount: 15 },
    { id: 3, name: "Human Resources", description: "Employee management and recruitment", employeeCount: 8 },
    { id: 4, name: "Finance", description: "Financial operations and accounting", employeeCount: 10 },
  ])

  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    employeeCount: 0,
  })

  const [editingDepartment, setEditingDepartment] = useState<null | {
    id: number
    name: string
    description: string
    employeeCount: number
  }>(null)

  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false)
  const [isEditDepartmentOpen, setIsEditDepartmentOpen] = useState(false)

  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: 1,
      type: "project",
      title: "E-commerce Website",
      description: "Developed a full-stack e-commerce platform with React and Node.js",
      link: "https://example.com/project1",
      year: "2023",
    },
    {
      id: 2,
      type: "education",
      title: "Computer Science Degree",
      description: "Bachelor's degree in Computer Science",
      link: "",
      year: "2020",
    },
    {
      id: 3,
      type: "skill",
      title: "React.js",
      description: "Advanced proficiency in React.js and related libraries",
      link: "",
      year: "",
    },
  ])

  const [newPortfolioItem, setNewPortfolioItem] = useState({
    type: "project",
    title: "",
    description: "",
    link: "",
    year: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCompanyData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCompanyIndustryChange = (value: string) => {
    setCompanyData((prev) => ({ ...prev, industry: value }))
  }

  const handleCompanySizeChange = (value: string) => {
    setCompanyData((prev) => ({ ...prev, size: value }))
  }

  const handleNewDepartmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewDepartment((prev) => ({
      ...prev,
      [name]: name === "employeeCount" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleEditingDepartmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingDepartment) return

    const { name, value } = e.target
    setEditingDepartment({
      ...editingDepartment,
      [name]: name === "employeeCount" ? Number.parseInt(value) || 0 : value,
    })
  }

  const handleAddDepartment = () => {
    if (!newDepartment.name) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      })
      return
    }

    const newItem = {
      id: Date.now(),
      ...newDepartment,
    }

    setDepartments([...departments, newItem])
    setNewDepartment({
      name: "",
      description: "",
      employeeCount: 0,
    })
    setIsAddDepartmentOpen(false)

    toast({
      title: "Department Added",
      description: "The department has been added successfully",
    })
  }

  const handleEditDepartment = (department: (typeof departments)[0]) => {
    setEditingDepartment(department)
    setIsEditDepartmentOpen(true)
  }

  const handleUpdateDepartment = () => {
    if (!editingDepartment) return

    if (!editingDepartment.name) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      })
      return
    }

    setDepartments(departments.map((dept) => (dept.id === editingDepartment.id ? editingDepartment : dept)))
    setIsEditDepartmentOpen(false)
    setEditingDepartment(null)

    toast({
      title: "Department Updated",
      description: "The department has been updated successfully",
    })
  }

  const handleDeleteDepartment = (id: number) => {
    setDepartments(departments.filter((dept) => dept.id !== id))
    toast({
      title: "Department Deleted",
      description: "The department has been deleted successfully",
    })
  }

  const handlePortfolioItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewPortfolioItem((prev) => ({ ...prev, [name]: value }))
  }

  const handlePortfolioTypeChange = (value: string) => {
    setNewPortfolioItem((prev) => ({ ...prev, type: value }))
  }

  const handleAddPortfolioItem = () => {
    if (!newPortfolioItem.title || !newPortfolioItem.type) {
      toast({
        title: "Error",
        description: "Title and type are required",
        variant: "destructive",
      })
      return
    }

    const newItem = {
      id: Date.now(),
      ...newPortfolioItem,
    }

    setPortfolioItems([...portfolioItems, newItem])
    setNewPortfolioItem({
      type: "project",
      title: "",
      description: "",
      link: "",
      year: "",
    })

    toast({
      title: "Portfolio Item Added",
      description: "Your portfolio item has been added successfully",
    })
  }

  const handleDeletePortfolioItem = (id: number) => {
    setPortfolioItems(portfolioItems.filter((item) => item.id !== id))
    toast({
      title: "Portfolio Item Deleted",
      description: "Your portfolio item has been deleted successfully",
    })
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully",
    })
  }

  const handleCompanyUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Company Information Updated",
      description: "Your company information has been updated successfully",
    })
  }

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (profileData.newPassword !== profileData.confirmPassword) {
      toast({
        title: "Error",
        description: "New password and confirmation do not match",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully",
    })
    setProfileData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }))
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your profile, company, and account information</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information here.</CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleChange}
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
                    value={profileData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={profileData.phone} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Write a short bio about yourself"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your username and password here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Username Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Username</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    toast({
                      title: "Username Updated",
                      description: "Your username has been updated successfully",
                    })
                  }}
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        value={profileData.username}
                        onChange={handleChange}
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        This is your public username that will be displayed to other users.
                      </p>
                    </div>
                    <Button type="submit">Update Username</Button>
                  </div>
                </form>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Password</h3>
                <form onSubmit={handlePasswordUpdate}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={profileData.currentPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={profileData.newPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <Button type="submit">Update Password</Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details here.</CardDescription>
            </CardHeader>
            <form onSubmit={handleCompanyUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="name"
                    value={companyData.name}
                    onChange={handleCompanyChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={companyData.industry} onValueChange={handleCompanyIndustryChange}>
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Construction">Construction</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Company Size</Label>
                    <Select value={companyData.size} onValueChange={handleCompanySizeChange}>
                      <SelectTrigger id="size">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="50-100">50-100 employees</SelectItem>
                        <SelectItem value="101-500">101-500 employees</SelectItem>
                        <SelectItem value="501-1000">501-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      name="registrationNumber"
                      value={companyData.registrationNumber}
                      onChange={handleCompanyChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID</Label>
                    <Input id="taxId" name="taxId" value={companyData.taxId} onChange={handleCompanyChange} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="foundedYear">Founded Year</Label>
                    <Input
                      id="foundedYear"
                      name="foundedYear"
                      value={companyData.foundedYear}
                      onChange={handleCompanyChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={companyData.website}
                      onChange={handleCompanyChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Address</Label>
                  <Input
                    id="companyAddress"
                    name="address"
                    value={companyData.address}
                    onChange={handleCompanyChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Phone</Label>
                    <Input id="companyPhone" name="phone" value={companyData.phone} onChange={handleCompanyChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email</Label>
                    <Input
                      id="companyEmail"
                      name="email"
                      type="email"
                      value={companyData.email}
                      onChange={handleCompanyChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyDescription">Description</Label>
                  <Textarea
                    id="companyDescription"
                    name="description"
                    value={companyData.description}
                    onChange={handleCompanyChange}
                    rows={4}
                    placeholder="Describe your company"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Save Company Information</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
