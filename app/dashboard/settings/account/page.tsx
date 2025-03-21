"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Building2, User, Shield, BellRing } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AccountSettingsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("account")

  // Use client-side only code to get URL parameters
  useEffect(() => {
    const tabParam = new URLSearchParams(window.location.search).get("tab")
    if (tabParam && ["account", "personal", "company", "notifications"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [])

  // Account information state
  const [accountData, setAccountData] = useState({
    username: "mohammed.abdullah",
    email: "mohammed@example.com",
    language: "english",
    timezone: "UTC+3",
    twoFactorEnabled: true,
  })

  // Personal information state
  const [personalData, setPersonalData] = useState({
    firstName: "Mohammed",
    lastName: "Abdullah",
    jobTitle: "Software Engineer",
    department: "IT",
    phone: "+966 50 123 4567",
    address: "123 Main St, Riyadh, Saudi Arabia",
    dateOfBirth: "1990-05-15",
  })

  // Company information state (for company managers)
  const [companyData, setCompanyData] = useState({
    companyName: "Tech Solutions Inc.",
    industry: "Information Technology",
    size: "50-100",
    website: "https://techsolutions.example.com",
    registrationNumber: "REG123456789",
    taxId: "TAX987654321",
    address: "456 Business Ave, Riyadh, Saudi Arabia",
    phone: "+966 11 234 5678",
    email: "info@techsolutions.example.com",
    description:
      "Tech Solutions Inc. is a leading provider of innovative software solutions for businesses of all sizes.",
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    taskAssignments: true,
    taskUpdates: true,
    announcements: true,
    systemUpdates: false,
  })

  // Handle tab change and update URL
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Update URL with tab parameter
    if (value === "account") {
      router.push("/dashboard/settings/account")
    } else {
      router.push(`/dashboard/settings/account?tab=${value}`)
    }
  }

  // Handle account data changes
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAccountData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle personal data changes
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPersonalData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle company data changes
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCompanyData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle toggle changes
  const handleToggleChange = (name: string, checked: boolean) => {
    if (name.startsWith("notification")) {
      const settingName = name.replace("notification-", "")
      setNotificationSettings((prev) => ({ ...prev, [settingName]: checked }))
    } else {
      setAccountData((prev) => ({ ...prev, [name]: checked }))
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setAccountData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submissions
  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Account Settings Updated",
      description: "Your account settings have been updated successfully",
    })
  }

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Personal Information Updated",
      description: "Your personal information has been updated successfully",
    })
  }

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Company Information Updated",
      description: "Your company information has been updated successfully",
    })
  }

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been updated successfully",
    })
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account, personal, and company information</p>
      </div>

      <Suspense fallback={<div className="text-center p-4">Loading settings...</div>}>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Account
            </TabsTrigger>
            <TabsTrigger
              value="personal"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Personal Information
            </TabsTrigger>
            <TabsTrigger
              value="company"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Company Information
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Account Settings Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account settings and preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <form onSubmit={handleAccountSubmit}>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={accountData.username}
                      onChange={handleAccountChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={accountData.email}
                      onChange={handleAccountChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={accountData.language}
                        onValueChange={(value) => handleSelectChange("language", value)}
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="arabic">Arabic</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={accountData.timezone}
                        onValueChange={(value) => handleSelectChange("timezone", value)}
                      >
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                          <SelectItem value="UTC+1">UTC+1 (Paris, Berlin)</SelectItem>
                          <SelectItem value="UTC+2">UTC+2 (Cairo)</SelectItem>
                          <SelectItem value="UTC+3">UTC+3 (Riyadh, Moscow)</SelectItem>
                          <SelectItem value="UTC+4">UTC+4 (Dubai)</SelectItem>
                          <SelectItem value="UTC+5">UTC+5 (Karachi)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactorEnabled" className="text-base">
                        Two-Factor Authentication
                      </Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      id="twoFactorEnabled"
                      checked={accountData.twoFactorEnabled}
                      onCheckedChange={(checked) => handleToggleChange("twoFactorEnabled", checked)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6">
                  <Button type="submit" size="lg">
                    Save Account Settings
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your personal information and details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <form onSubmit={handlePersonalSubmit}>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={personalData.firstName}
                        onChange={handlePersonalChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={personalData.lastName}
                        onChange={handlePersonalChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        value={personalData.jobTitle}
                        onChange={handlePersonalChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        value={personalData.department}
                        onChange={handlePersonalChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" value={personalData.phone} onChange={handlePersonalChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={personalData.address}
                      onChange={handlePersonalChange}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={personalData.dateOfBirth}
                      onChange={handlePersonalChange}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6">
                  <Button type="submit" size="lg">
                    Save Personal Information
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Company Information Tab */}
          <TabsContent value="company">
            <Card>
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                    <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>Manage your company details and information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <form onSubmit={handleCompanySubmit}>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={companyData.companyName}
                      onChange={handleCompanyChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        name="industry"
                        value={companyData.industry}
                        onChange={handleCompanyChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size">Company Size</Label>
                      <Input id="size" name="size" value={companyData.size} onChange={handleCompanyChange} />
                    </div>
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
                  <div className="grid grid-cols-2 gap-6">
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
                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Company Address</Label>
                    <Textarea
                      id="companyAddress"
                      name="address"
                      value={companyData.address}
                      onChange={handleCompanyChange}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Company Phone</Label>
                      <Input id="companyPhone" name="phone" value={companyData.phone} onChange={handleCompanyChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Company Email</Label>
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
                    <Label htmlFor="description">Company Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={companyData.description}
                      onChange={handleCompanyChange}
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6">
                  <Button type="submit" size="lg">
                    Save Company Information
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <BellRing className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <form onSubmit={handleNotificationSubmit}>
                <CardContent className="space-y-6 pt-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="space-y-0.5">
                      <Label htmlFor="notification-emailNotifications" className="text-base">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="notification-emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleToggleChange("notification-emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="space-y-0.5">
                      <Label htmlFor="notification-taskAssignments" className="text-base">
                        Task Assignments
                      </Label>
                      <p className="text-sm text-muted-foreground">Get notified when you are assigned a new task</p>
                    </div>
                    <Switch
                      id="notification-taskAssignments"
                      checked={notificationSettings.taskAssignments}
                      onCheckedChange={(checked) => handleToggleChange("notification-taskAssignments", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="space-y-0.5">
                      <Label htmlFor="notification-taskUpdates" className="text-base">
                        Task Updates
                      </Label>
                      <p className="text-sm text-muted-foreground">Get notified when there are updates to your tasks</p>
                    </div>
                    <Switch
                      id="notification-taskUpdates"
                      checked={notificationSettings.taskUpdates}
                      onCheckedChange={(checked) => handleToggleChange("notification-taskUpdates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="space-y-0.5">
                      <Label htmlFor="notification-announcements" className="text-base">
                        Announcements
                      </Label>
                      <p className="text-sm text-muted-foreground">Get notified about company announcements</p>
                    </div>
                    <Switch
                      id="notification-announcements"
                      checked={notificationSettings.announcements}
                      onCheckedChange={(checked) => handleToggleChange("notification-announcements", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="space-y-0.5">
                      <Label htmlFor="notification-systemUpdates" className="text-base">
                        System Updates
                      </Label>
                      <p className="text-sm text-muted-foreground">Get notified about system updates and maintenance</p>
                    </div>
                    <Switch
                      id="notification-systemUpdates"
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={(checked) => handleToggleChange("notification-systemUpdates", checked)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6">
                  <Button type="submit" size="lg">
                    Save Notification Settings
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </Suspense>
    </div>
  )
}

