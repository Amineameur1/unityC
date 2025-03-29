"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, FileText, Search, Shield, Users, Database, Settings } from "lucide-react"
import { format } from "date-fns"

// Sample audit log data
const initialLogs = [
  {
    id: 1,
    event: "User Login",
    description: "User logged in successfully",
    user: "admin@example.com",
    ipAddress: "192.168.1.1",
    timestamp: new Date(2023, 6, 15, 10, 45),
    category: "Authentication",
    severity: "Info",
  },
  {
    id: 2,
    event: "Company Created",
    description: "New company 'TechSolutions Inc.' was created",
    user: "john@example.com",
    ipAddress: "192.168.1.2",
    timestamp: new Date(2023, 6, 14, 14, 30),
    category: "Data",
    severity: "Info",
  },
  {
    id: 3,
    event: "Permission Changed",
    description: "User permissions were modified for 'sarah@example.com'",
    user: "admin@example.com",
    ipAddress: "192.168.1.1",
    timestamp: new Date(2023, 6, 14, 9, 15),
    category: "Security",
    severity: "Warning",
  },
  {
    id: 4,
    event: "Failed Login Attempt",
    description: "Multiple failed login attempts detected",
    user: "unknown",
    ipAddress: "203.0.113.1",
    timestamp: new Date(2023, 6, 13, 22, 10),
    category: "Security",
    severity: "Critical",
  },
  {
    id: 5,
    event: "Employee Added",
    description: "New employee 'Sarah Johnson' was added to 'Marketing'",
    user: "sarah@example.com",
    ipAddress: "192.168.1.3",
    timestamp: new Date(2023, 6, 13, 15, 45),
    category: "Data",
    severity: "Info",
  },
  {
    id: 6,
    event: "System Backup",
    description: "Automated system backup completed successfully",
    user: "system",
    ipAddress: "127.0.0.1",
    timestamp: new Date(2023, 6, 12, 3, 0),
    category: "System",
    severity: "Info",
  },
  {
    id: 7,
    event: "Configuration Changed",
    description: "System configuration parameters were modified",
    user: "admin@example.com",
    ipAddress: "192.168.1.1",
    timestamp: new Date(2023, 6, 11, 11, 20),
    category: "System",
    severity: "Warning",
  },
  {
    id: 8,
    event: "Salary Updated",
    description: "Salary information updated for multiple employees",
    user: "finance@example.com",
    ipAddress: "192.168.1.4",
    timestamp: new Date(2023, 6, 10, 16, 30),
    category: "Data",
    severity: "Info",
  },
  {
    id: 9,
    event: "Unauthorized Access Attempt",
    description: "Attempt to access restricted resource detected",
    user: "employee@example.com",
    ipAddress: "192.168.1.5",
    timestamp: new Date(2023, 6, 9, 14, 15),
    category: "Security",
    severity: "Critical",
  },
  {
    id: 10,
    event: "Department Deleted",
    description: "Department 'Research' was deleted",
    user: "admin@example.com",
    ipAddress: "192.168.1.1",
    timestamp: new Date(2023, 6, 8, 10, 0),
    category: "Data",
    severity: "Warning",
  },
]

export default function AuditLogsPage() {
  const [logs, setLogs] = useState(initialLogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  // Filter logs based on search query and filters
  const filteredLogs = logs.filter((log) => {
    // Search filter
    const matchesSearch =
      log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter

    // Severity filter
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter

    // Date range filter
    const matchesDateRange =
      (!dateRange.from || log.timestamp >= dateRange.from) && (!dateRange.to || log.timestamp <= dateRange.to)

    return matchesSearch && matchesCategory && matchesSeverity && matchesDateRange
  })

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Authentication":
        return <Shield className="h-4 w-4 text-blue-500" />
      case "Data":
        return <Database className="h-4 w-4 text-purple-500" />
      case "Security":
        return <Shield className="h-4 w-4 text-red-500" />
      case "System":
        return <Settings className="h-4 w-4 text-gray-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Critical
          </Badge>
        )
      case "Warning":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Warning
          </Badge>
        )
      case "Info":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Info
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            {severity}
          </Badge>
        )
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">View and analyze system audit logs</p>
        </div>
        <Button variant="outline" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search logs..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 md:w-40">
          <span className="text-sm font-medium">Category</span>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Authentication">Authentication</SelectItem>
              <SelectItem value="Data">Data</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="System">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 md:w-40">
          <span className="text-sm font-medium">Severity</span>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="Info">Info</SelectItem>
              <SelectItem value="Warning">Warning</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Date Range</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange as any}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLogs.length}</div>
            <p className="text-xs text-muted-foreground">Matching your filters</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLogs.filter((log) => log.category === "Security").length}</div>
            <p className="text-xs text-muted-foreground">Security-related events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
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
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLogs.filter((log) => log.severity === "Critical").length}</div>
            <p className="text-xs text-muted-foreground">Critical severity events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Actions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLogs.filter((log) => log.user.includes("admin")).length}</div>
            <p className="text-xs text-muted-foreground">Actions by admin users</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Log Entries</CardTitle>
          <CardDescription>Detailed log of all system events and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.event}</TableCell>
                  <TableCell className="max-w-xs truncate">{log.description}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.ipAddress}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(log.category)}
                      <span>{log.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                  <TableCell className="text-right">{format(log.timestamp, "MMM d, yyyy HH:mm")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

