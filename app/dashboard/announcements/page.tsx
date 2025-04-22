"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import {
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  AlertTriangle,
  Info,
  CheckCircle2,
  Users,
  Building2,
  Loader2,
  Trash2,
  Edit,
  ArrowDownUp,
} from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

// Import auth provider
import { useAuth } from "@/components/auth-provider"
import { announcementService } from "@/services/api"

// Interface for announcement
interface Announcement {
  id: number
  uuid?: string
  title: string
  content: string
  priority: string
  departmentId?: number | null
  employeeId?: number
  createdAt: string
  updatedAt: string
  department?: {
    name?: string
  } | null
  employee?: {
    firstName: string
    lastName: string
  }
}

// Interface for editing announcement
interface EditAnnouncementData {
  id: number
  title: string
  content: string
  priority: string
  departmentId?: number | null
}

export default function AnnouncementsPage() {
  const { toast } = useToast()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    priority: "Medium",
    departmentId: null as number | null,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editAnnouncement, setEditAnnouncement] = useState<EditAnnouncementData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [priorityFilter, setPriorityFilter] = useState("all")
  const [targetFilter, setTargetFilter] = useState("company")
  const [sortOrder, setSortOrder] = useState("newest")

  // Get user from auth context
  const { user } = useAuth()
  const userRole = user?.role || "Employee" // Default as employee if role not specified

  // Check permissions - Allow Admin to create/update/delete announcements
  const canCreateAnnouncement = userRole === "Owner" || userRole === "Admin"
  const canUpdateAnnouncement = userRole === "Owner" || userRole === "Admin"
  const canDeleteAnnouncement = userRole === "Owner" || userRole === "Admin"

  // Fetch announcements from API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoading(true)
      try {
        let data

        // Use different endpoints based on user role
        if (userRole === "Owner") {
          // Owners can see all announcements
          data = await announcementService.getAnnouncements()
        } else {
          // Admins and Employees use the globals endpoint
          data = await announcementService.getGlobalAnnouncements()
        }

        setAnnouncements(data)
      } catch (error) {
        console.error("Failed to fetch announcements:", error)
        toast({
          title: "Error",
          description: "Failed to load announcements. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnnouncements()
  }, [toast, user, userRole])

  const filteredAnnouncements = announcements
    .filter((announcement) => {
      // Text search filter
      const matchesSearch =
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (announcement.employee &&
          `${announcement.employee.firstName} ${announcement.employee.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (announcement.department?.name &&
          announcement.department.name.toLowerCase().includes(searchQuery.toLowerCase()))

      // Priority filter
      const matchesPriority = priorityFilter === "all" || announcement.priority === priorityFilter

      // Target filter (company-wide or department-specific)
      const matchesTarget =
        targetFilter === "company" ? announcement.departmentId === null : announcement.departmentId !== null

      return matchesSearch && matchesPriority && matchesTarget
    })
    .sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editAnnouncement) return
    const { name, value } = e.target
    setEditAnnouncement((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSelectChange = (name: string, value: string) => {
    if (!editAnnouncement) return
    setEditAnnouncement((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleAddAnnouncement = async () => {
    setIsSubmitting(true)

    try {
      const response = await announcementService.createAnnouncement(newAnnouncement)

      // Add the new announcement to the state
      setAnnouncements((prev) => [...prev, response])

      // Reset form
      setNewAnnouncement({
        title: "",
        content: "",
        priority: "Medium",
        departmentId: null,
      })

      toast({
        title: "Success",
        description: "Announcement created successfully!",
      })

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to create announcement:", error)
      toast({
        title: "Error",
        description: "Failed to create announcement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateAnnouncement = async () => {
    if (!editAnnouncement) return

    setIsSubmitting(true)

    try {
      const response = await announcementService.updateAnnouncement(
        editAnnouncement.id,
        editAnnouncement.departmentId || 0,
        editAnnouncement,
      )

      // Update the announcement in the state
      setAnnouncements((prev) =>
        prev.map((announcement) => (announcement.id === editAnnouncement.id ? response : announcement)),
      )

      toast({
        title: "Success",
        description: "Announcement updated successfully!",
      })

      setIsEditDialogOpen(false)
      setEditAnnouncement(null)
    } catch (error) {
      console.error("Failed to update announcement:", error)
      toast({
        title: "Error",
        description: "Failed to update announcement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAnnouncement = async (id: number, departmentId?: number | null) => {
    setIsDeleting(true)

    try {
      await announcementService.deleteAnnouncement(id, departmentId || 0)

      // Remove the announcement from the state
      setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== id))

      toast({
        title: "Success",
        description: "Announcement deleted successfully!",
      })
    } catch (error) {
      console.error("Failed to delete announcement:", error)
      toast({
        title: "Error",
        description: "Failed to delete announcement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const openEditDialog = (announcement: Announcement) => {
    setEditAnnouncement({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      departmentId: announcement.departmentId || null,
    })
    setIsEditDialogOpen(true)
  }

  // Calculate statistics
  const totalAnnouncements = announcements.length
  const companyAnnouncements = announcements.filter((a) => a.departmentId === null).length
  const departmentAnnouncements = announcements.filter((a) => a.departmentId !== null).length

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "Medium":
        return <Info className="h-5 w-5 text-orange-500" />
      case "Low":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getTargetIcon = (departmentId: number | null | undefined) => {
    if (departmentId === null || departmentId === undefined) {
      return <Building2 className="h-5 w-5 text-primary" />
    } else {
      return <Users className="h-5 w-5 text-primary" />
    }
  }

  // Format date from ISO string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "MMMM d, yyyy")
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">Manage company announcements</p>
        </div>
        {canCreateAnnouncement && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
                <DialogDescription>Create a new announcement for your organization.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newAnnouncement.title}
                    onChange={handleInputChange}
                    placeholder="Enter announcement title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={newAnnouncement.content}
                    onChange={handleInputChange}
                    placeholder="Enter announcement content"
                    rows={5}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newAnnouncement.priority}
                    onValueChange={(value) => handleSelectChange("priority", value)}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleAddAnnouncement} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Edit Announcement Dialog */}
      {editAnnouncement && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Announcement</DialogTitle>
              <DialogDescription>Update the announcement details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={editAnnouncement.title}
                  onChange={handleEditInputChange}
                  placeholder="Enter announcement title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  name="content"
                  value={editAnnouncement.content}
                  onChange={handleEditInputChange}
                  placeholder="Enter announcement content"
                  rows={5}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={editAnnouncement.priority}
                  onValueChange={(value) => handleEditSelectChange("priority", value)}
                >
                  <SelectTrigger id="edit-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleUpdateAnnouncement} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search announcements..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select defaultValue="all" onValueChange={(value) => setPriorityFilter(value)}>
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <SelectValue placeholder="Priority" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="company" onValueChange={(value) => setTargetFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <SelectValue placeholder="Target" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="company">Company-wide</SelectItem>
              <SelectItem value="department">Department</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="newest" onValueChange={(value) => setSortOrder(value)}>
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center gap-2">
                <ArrowDownUp className="h-4 w-4" />
                <SelectValue placeholder="Sort By" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnnouncements}</div>
            <p className="text-xs text-muted-foreground">Published announcements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company-wide</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyAnnouncements}</div>
            <p className="text-xs text-muted-foreground">Company-wide announcements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Department</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentAnnouncements}</div>
            <p className="text-xs text-muted-foreground">Department-specific announcements</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        {isLoading ? (
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 text-muted-foreground mb-4 animate-spin" />
            <p className="text-muted-foreground text-center">Loading announcements...</p>
          </CardContent>
        ) : filteredAnnouncements.length === 0 ? (
          <CardContent className="flex flex-col items-center justify-center py-10">
            <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No announcements found</p>
          </CardContent>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    {getPriorityIcon(announcement.priority)}
                    <div>
                      <CardTitle>{announcement.title}</CardTitle>
                      <CardDescription>
                        {announcement.createdAt ? formatDate(announcement.createdAt) : "No date"}
                        {announcement.employee &&
                          ` • ${announcement.employee.firstName} ${announcement.employee.lastName}`}
                        {announcement.department?.name && ` • ${announcement.department.name}`}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTargetIcon(announcement.departmentId)}
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
                        {canUpdateAnnouncement && (
                          <DropdownMenuItem onClick={() => openEditDialog(announcement)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {canDeleteAnnouncement && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteAnnouncement(announcement.id, announcement.departmentId)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{announcement.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <div className="text-xs text-muted-foreground">
                  {announcement.departmentId === null
                    ? "Visible to all employees"
                    : announcement.department?.name
                      ? `Visible to ${announcement.department.name} department`
                      : "Visibility not specified"}
                </div>
                <Button variant="ghost" size="sm">
                  Read More
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </Card>
    </div>
  )
}
