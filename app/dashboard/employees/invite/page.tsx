"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clipboard, Copy, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

// Sample invite codes data
const initialInviteCodes = [
  {
    id: 1,
    code: "EMP-1234-ABCD",
    role: "Employee",
    department: "IT",
    status: "Unused",
    createdAt: new Date(2023, 5, 15),
  },
  {
    id: 2,
    code: "MGR-5678-EFGH",
    role: "Department Manager",
    department: "HR",
    status: "Unused",
    createdAt: new Date(2023, 5, 16),
  },
  {
    id: 3,
    code: "EMP-9012-IJKL",
    role: "Employee",
    department: "Sales",
    status: "Used",
    createdAt: new Date(2023, 5, 10),
  },
]

export default function InviteEmployeesPage() {
  const [inviteCodes, setInviteCodes] = useState(initialInviteCodes)
  const [newInvite, setNewInvite] = useState({
    role: "Employee",
    department: "",
  })
  const [generatedCode, setGeneratedCode] = useState("")
  const { toast } = useToast()
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false)
  const [newDepartmentName, setNewDepartmentName] = useState("")

  const handleSelectChange = (name: string, value: string) => {
    setNewInvite((prev) => ({ ...prev, [name]: value }))
  }

  const generateRandomCode = () => {
    const prefix = newInvite.role === "Employee" ? "EMP" : "MGR"
    const randomPart1 = Math.floor(1000 + Math.random() * 9000)
    const randomPart2 = Array.from(
      { length: 4 },
      () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)],
    ).join("")
    return `${prefix}-${randomPart1}-${randomPart2}`
  }

  const handleGenerateCode = () => {
    if (!newInvite.department) {
      toast({
        title: "Error",
        description: "Please select a department",
        variant: "destructive",
      })
      return
    }

    const code = generateRandomCode()
    setGeneratedCode(code)

    // Add to the list of invite codes
    const newId = inviteCodes.length > 0 ? Math.max(...inviteCodes.map((c) => c.id)) + 1 : 1
    const newCode = {
      id: newId,
      code,
      role: newInvite.role,
      department: newInvite.department,
      status: "Unused",
      createdAt: new Date(),
    }
    setInviteCodes([...inviteCodes, newCode])

    toast({
      title: "Code Generated",
      description: "You can now share this code with the employee",
    })
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode)
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    })
  }

  const handleRegenerateCode = () => {
    const code = generateRandomCode()
    setGeneratedCode(code)

    // Update the last code in the list
    const updatedCodes = [...inviteCodes]
    updatedCodes[updatedCodes.length - 1].code = code
    setInviteCodes(updatedCodes)

    toast({
      title: "Code Regenerated",
      description: "A new code has been generated",
    })
  }

  const handleAddNewDepartment = () => {
    // Logic to add the new department
    console.log("Adding new department:", newDepartmentName)
    setIsAddDepartmentOpen(false)
    setNewDepartmentName("")
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invite Employees</h1>
          <p className="text-muted-foreground">Generate invite codes for new employees to join the system</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generate New Invite Code</CardTitle>
            <CardDescription>Create an invite code for new employees to join the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newInvite.role} onValueChange={(value) => handleSelectChange("role", value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Employee">Employee</SelectItem>
                  <SelectItem value="Department Manager">Department Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <div className="flex items-center space-x-2">
                <Select value={newInvite.department} onValueChange={(value) => handleSelectChange("department", value)}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Customer Support">Customer Support</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Add Department
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Department</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={newDepartmentName}
                          onChange={(e) => setNewDepartmentName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    {/* Rest of the content */}
                    <Button onClick={handleAddNewDepartment}>Add Department</Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <Button onClick={handleGenerateCode} className="w-full">
              Generate Invite Code
            </Button>

            {generatedCode && (
              <div className="mt-4 space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clipboard className="h-5 w-5 text-muted-foreground" />
                      <span className="font-mono text-lg">{generatedCode}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={handleCopyCode}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleRegenerateCode}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Share this code with the new employee. They will need this code to register in the system.</p>
                  <p>This code is valid for one-time use only.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Invite Codes</CardTitle>
            <CardDescription>List of generated invite codes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inviteCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-mono">{code.code}</TableCell>
                    <TableCell>{code.role}</TableCell>
                    <TableCell>{code.department}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          code.status === "Unused"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {code.status}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
