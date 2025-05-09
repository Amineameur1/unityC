"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from "@/services/api-client"

export default function ProfileSettingsPage() {
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [companyData, setCompanyData] = useState({
    name: "",
    industry: "",
    size: "",
    registrationNumber: "",
    taxId: "",
    foundedYear: "",
    website: "",
    address: "",
    phone: "",
    email: "",
    description: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("/api/auth/me")
        const userData = response.data

        setProfileData({
          username: userData.username || "",
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          bio: userData.bio || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })

        // If user has company data
        if (userData.company) {
          setCompanyData({
            name: userData.company.name || "",
            industry: userData.company.industry || "",
            size: userData.company.size || "",
            registrationNumber: userData.company.registrationNumber || "",
            taxId: userData.company.taxId || "",
            foundedYear: userData.company.foundedYear || "",
            website: userData.company.website || "",
            address: userData.company.address || "",
            phone: userData.company.phone || "",
            email: userData.company.email || "",
            description: userData.company.description || "",
          })
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchUserData()
  }, [])

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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.put("/api/auth/profile", {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        bio: profileData.bio,
      })

      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully",
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCompanyUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.put("/api/company", companyData)

      toast({
        title: "Company Information Updated",
        description: "Your company information has been updated successfully",
      })
    } catch (error) {
      console.error("Failed to update company information:", error)
      toast({
        title: "Error",
        description: "Failed to update company information. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (profileData.newPassword !== profileData.confirmPassword) {
      toast({
        title: "Error",
        description: "New password and confirmation do not match",
      })
      return
    }

    try {
      await apiClient.put("/api/auth/password", {
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword,
      })

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
    } catch (error) {
      console.error("Failed to update password:", error)
      toast({
        title: "Error",
        description: "Failed to update password. Please check your current password and try again.",
        variant: "destructive",
      })
    }
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
