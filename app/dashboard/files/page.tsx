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
import {
  FileBox,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileCode,
  FileIcon as FilePdf,
  FileArchive,
  MoreHorizontal,
  Search,
  Upload,
  Download,
  Eye,
  Trash,
  Share2,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample file data
const initialFiles = [
  {
    id: 1,
    name: "Q2 Financial Report.pdf",
    type: "PDF",
    size: 2.4,
    owner: "Michael Brown",
    department: "Finance",
    accessLevel: "Department",
    lastModified: new Date(2023, 5, 15),
  },
  {
    id: 2,
    name: "Marketing Campaign Assets.zip",
    type: "Archive",
    size: 156.8,
    owner: "Sarah Johnson",
    department: "Marketing",
    accessLevel: "Department",
    lastModified: new Date(2023, 5, 10),
  },
  {
    id: 3,
    name: "Product Roadmap 2023.xlsx",
    type: "Spreadsheet",
    size: 1.2,
    owner: "Robert Taylor",
    department: "Product",
    accessLevel: "Company",
    lastModified: new Date(2023, 5, 8),
  },
  {
    id: 4,
    name: "Employee Handbook.docx",
    type: "Document",
    size: 3.5,
    owner: "Emily Davis",
    department: "Human Resources",
    accessLevel: "Company",
    lastModified: new Date(2023, 4, 28),
  },
  {
    id: 5,
    name: "Website Mockups.png",
    type: "Image",
    size: 8.7,
    owner: "David Wilson",
    department: "Engineering",
    accessLevel: "Department",
    lastModified: new Date(2023, 5, 12),
  },
  {
    id: 6,
    name: "Sales Presentation.pptx",
    type: "Presentation",
    size: 5.3,
    owner: "Jessica Martinez",
    department: "Sales",
    accessLevel: "Department",
    lastModified: new Date(2023, 5, 5),
  },
  {
    id: 7,
    name: "API Documentation.md",
    type: "Code",
    size: 0.5,
    owner: "John Smith",
    department: "Engineering",
    accessLevel: "Department",
    lastModified: new Date(2023, 5, 14),
  },
  {
    id: 8,
    name: "Customer Survey Results.xlsx",
    type: "Spreadsheet",
    size: 2.1,
    owner: "Jennifer Anderson",
    department: "Customer Support",
    accessLevel: "Private",
    lastModified: new Date(2023, 5, 3),
  },
]

export default function FilesPage() {
  const [files, setFiles] = useState(initialFiles)
  const [searchQuery, setSearchQuery] = useState("")
  const [newFile, setNewFile] = useState({
    name: "",
    type: "",
    size: 0,
    owner: "",
    department: "",
    accessLevel: "Private",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FilePdf className="h-4 w-4" />
      case "Image":
        return <FileImage className="h-4 w-4" />
      case "Spreadsheet":
        return <FileSpreadsheet className="h-4 w-4" />
      case "Document":
        return <FileText className="h-4 w-4" />
      case "Code":
        return <FileCode className="h-4 w-4" />
      case "Archive":
        return <FileArchive className="h-4 w-4" />
      default:
        return <FileBox className="h-4 w-4" />
    }
  }

  const filteredFiles = files.filter(
    (file) =>
      (activeTab === "all" || file.type.toLowerCase() === activeTab.toLowerCase()) &&
      (file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.department.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewFile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewFile((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddFile = () => {
    const newId = files.length > 0 ? Math.max(...files.map((f) => f.id)) + 1 : 1
    const fileToAdd = {
      id: newId,
      name: newFile.name,
      type: newFile.type,
      size: newFile.size,
      owner: newFile.owner,
      department: newFile.department,
      accessLevel: newFile.accessLevel,
      lastModified: new Date(),
    }
    setFiles([...files, fileToAdd])
    setNewFile({
      name: "",
      type: "",
      size: 0,
      owner: "",
      department: "",
      accessLevel: "Private",
    })
    setIsDialogOpen(false)
  }

  // Calculate statistics
  const totalFiles = files.length
  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  const fileTypes = [...new Set(files.map((file) => file.type))]
  const departmentFiles = [...new Set(files.map((file) => file.department))].length

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Files</h1>
          <p className="text-muted-foreground">Manage and organize your organization's files</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Upload New File</DialogTitle>
              <DialogDescription>Upload a new file to your organization's storage.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">File Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newFile.name}
                  onChange={handleInputChange}
                  placeholder="Enter file name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">File Type</Label>
                  <Select value={newFile.type} onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Document">Document</SelectItem>
                      <SelectItem value="Spreadsheet">Spreadsheet</SelectItem>
                      <SelectItem value="Presentation">Presentation</SelectItem>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="Image">Image</SelectItem>
                      <SelectItem value="Code">Code</SelectItem>
                      <SelectItem value="Archive">Archive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="size">File Size (MB)</Label>
                  <Input
                    id="size"
                    name="size"
                    type="number"
                    value={newFile.size.toString()}
                    onChange={handleInputChange}
                    placeholder="Enter file size"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="owner">Owner</Label>
                <Select value={newFile.owner} onValueChange={(value) => handleSelectChange("owner", value)}>
                  <SelectTrigger id="owner">
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="John Smith">John Smith</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Michael Brown">Michael Brown</SelectItem>
                    <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                    <SelectItem value="David Wilson">David Wilson</SelectItem>
                    <SelectItem value="Jessica Martinez">Jessica Martinez</SelectItem>
                    <SelectItem value="Robert Taylor">Robert Taylor</SelectItem>
                    <SelectItem value="Jennifer Anderson">Jennifer Anderson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select value={newFile.department} onValueChange={(value) => handleSelectChange("department", value)}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Customer Support">Customer Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="accessLevel">Access Level</Label>
                <Select value={newFile.accessLevel} onValueChange={(value) => handleSelectChange("accessLevel", value)}>
                  <SelectTrigger id="accessLevel">
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Department">Department</SelectItem>
                    <SelectItem value="Company">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fileUpload">File Upload</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="fileUpload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        SVG, PNG, JPG, GIF, PDF, DOCX, XLSX, PPTX (MAX. 100MB)
                      </p>
                    </div>
                    <input id="fileUpload" type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFile}>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search files..."
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
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileBox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFiles}</div>
            <p className="text-xs text-muted-foreground">Files in storage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSize.toFixed(1)} MB</div>
            <p className="text-xs text-muted-foreground">Total storage used</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">File Types</CardTitle>
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
              <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M2 15h10" />
              <path d="m9 18 3-3-3-3" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fileTypes.length}</div>
            <p className="text-xs text-muted-foreground">Different file formats</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
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
              <rect width="8" height="8" x="3" y="3" rx="2" />
              <rect width="8" height="8" x="13" y="3" rx="2" />
              <rect width="8" height="8" x="3" y="13" rx="2" />
              <rect width="8" height="8" x="13" y="13" rx="2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentFiles}</div>
            <p className="text-xs text-muted-foreground">Departments with files</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Files</CardTitle>
          <CardDescription>Browse and manage your organization's files.</CardDescription>
          <Tabs defaultValue="all" className="mt-4" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-7 w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="document">Documents</TabsTrigger>
              <TabsTrigger value="spreadsheet">Spreadsheets</TabsTrigger>
              <TabsTrigger value="presentation">Presentations</TabsTrigger>
              <TabsTrigger value="pdf">PDFs</TabsTrigger>
              <TabsTrigger value="image">Images</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Access Level</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.type)}
                      {file.name}
                    </div>
                  </TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{file.size} MB</TableCell>
                  <TableCell>{file.owner}</TableCell>
                  <TableCell>{file.department}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        file.accessLevel === "Private"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : file.accessLevel === "Department"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {file.accessLevel}
                    </div>
                  </TableCell>
                  <TableCell>
                    {file.lastModified.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
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
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
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
    </div>
  )
}

