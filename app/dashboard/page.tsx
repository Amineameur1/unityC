"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Building2,
  ClipboardList,
  Package,
  Users,
  ArrowUp,
  Activity,
  Shield,
  DollarSign,
  FileText,
  Database,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// إضافة استخدام مكون المصادقة
import { useAuth } from "@/components/auth-provider"

export default function DashboardPage() {
  // داخل المكون الرئيسي، أضف:
  const { user } = useAuth()
  const userRole = user?.role || "Employee" // افتراضي كموظف إذا لم يتم تحديد الدور

  return (
    <>
      {userRole === "Employee" ? (
        <div className="flex items-center justify-center h-screen">
          <p>Redirecting to tasks...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
          {/* Header section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{userRole} Dashboard</h1>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <Shield className="h-3 w-3 mr-1" /> {userRole} Access
              </Badge>
            </div>
            <p className="text-muted-foreground">Welcome to EnterpriseOS, here's an overview of your organization</p>
          </div>

          {/* Rest of the dashboard content */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/20">
                <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                <div className="rounded-full bg-blue-500/20 p-1">
                  <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">12</div>
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+2</span>
                  <span className="ml-1">from last month</span>
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
                <div className="text-2xl font-bold">245</div>
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+18</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/20">
                <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                <div className="rounded-full bg-amber-500/20 p-1">
                  <ClipboardList className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">89</div>
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+7</span>
                  <span className="ml-1">from yesterday</span>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/20">
                <CardTitle className="text-sm font-medium">Resources</CardTitle>
                <div className="rounded-full bg-green-500/20 p-1">
                  <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">356</div>
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+24</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* تعديل عرض البطاقات الخاصة بالمالك فقط */}
          {userRole === "Owner" && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="overflow-hidden border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/20">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <div className="rounded-full bg-indigo-500/20 p-1">
                    <DollarSign className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">$1,245,890</div>
                  <div className="flex items-center gap-2">
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+8.2%</span>
                    <span className="ml-1">from last quarter</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-950/50 dark:to-rose-900/20">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <div className="rounded-full bg-rose-500/20 p-1">
                    <Activity className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">98.7%</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>Uptime this month</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-950/50 dark:to-cyan-900/20">
                  <CardTitle className="text-sm font-medium">Audit Logs</CardTitle>
                  <div className="rounded-full bg-cyan-500/20 p-1">
                    <FileText className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">1,245</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>Events in the last 7 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-4 border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>Company performance metrics for the current quarter</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Weekly
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary/10">
                    Monthly
                  </Button>
                  <Button variant="outline" size="sm">
                    Quarterly
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                  <div className="flex h-full items-center justify-center rounded-md border border-dashed p-4">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Activity className="h-8 w-8 text-muted-foreground" />
                      <div className="text-sm font-medium">Performance chart will be displayed here</div>
                      <div className="text-xs text-muted-foreground">Showing company performance metrics</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3 border-none shadow-md">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest activities across your organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "System update completed",
                      description: "System updated to version 2.5.0",
                      timestamp: "1 hour ago",
                      icon: <Database className="h-4 w-4 text-indigo-500" />,
                    },
                    {
                      title: "New company registered",
                      description: "TechSolutions Inc. was added to the system",
                      timestamp: "3 hours ago",
                      icon: <Building2 className="h-4 w-4 text-blue-500" />,
                    },
                    {
                      title: "Salary adjustments approved",
                      description: "Q3 salary adjustments were approved",
                      timestamp: "Yesterday",
                      icon: <DollarSign className="h-4 w-4 text-green-500" />,
                    },
                    {
                      title: "New employee joined",
                      description: "Sarah Johnson joined Marketing department",
                      timestamp: "2 days ago",
                      icon: <Users className="h-4 w-4 text-purple-500" />,
                    },
                    {
                      title: "Security audit completed",
                      description: "Quarterly security audit was completed",
                      timestamp: "3 days ago",
                      icon: <Shield className="h-4 w-4 text-red-500" />,
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2">{activity.icon}</div>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system status and health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "API Services", status: "Operational", health: 100 },
                    { name: "Database", status: "Operational", health: 98 },
                    { name: "Storage", status: "Operational", health: 95 },
                    { name: "Authentication", status: "Operational", health: 100 },
                    { name: "Background Jobs", status: "Operational", health: 97 },
                  ].map((service, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${service.health > 90 ? "bg-green-500" : "bg-yellow-500"}`}
                          ></div>
                          <p className="text-sm font-medium">{service.name}</p>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          {service.status}
                        </Badge>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: `${service.health}%` }} />
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full mt-2">
                    View System Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Recent Audit Logs</CardTitle>
                <CardDescription>Latest system audit events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { event: "User Login", user: "admin@example.com", time: "10:45 AM", type: "auth" },
                    { event: "Company Created", user: "john@example.com", time: "Yesterday", type: "data" },
                    { event: "Permission Changed", user: "admin@example.com", time: "Yesterday", type: "security" },
                    { event: "Employee Added", user: "sarah@example.com", time: "2 days ago", type: "data" },
                    { event: "System Backup", user: "system", time: "3 days ago", type: "system" },
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{log.event}</p>
                        <p className="text-xs text-muted-foreground">By: {log.user}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          log.type === "security"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : log.type === "auth"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : log.type === "data"
                                ? "bg-purple-100 text-purple-800 border-purple-200"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {log.type}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full mt-2">
                    View All Logs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* تعديل عرض قسم "Owner Actions" ليظهر فقط للمالك */}
            {userRole === "Owner" && (
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>Owner Actions</CardTitle>
                  <CardDescription>Quick access to important actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        title: "System Settings",
                        icon: <Database className="h-5 w-5" />,
                        href: "/dashboard/system-settings",
                      },
                      { title: "User Management", icon: <Users className="h-5 w-5" />, href: "/dashboard/users" },
                      { title: "Audit Logs", icon: <FileText className="h-5 w-5" />, href: "/dashboard/audit-logs" },
                      { title: "Salaries", icon: <DollarSign className="h-5 w-5" />, href: "/dashboard/salaries" },
                      { title: "Analytics", icon: <BarChart className="h-5 w-5" />, href: "/dashboard/analytics" },
                      { title: "Security", icon: <Shield className="h-5 w-5" />, href: "/dashboard/security" },
                    ].map((link, index) => (
                      <Link href={link.href} key={index}>
                        <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                          <div className="rounded-full bg-primary/10 p-1">{link.icon}</div>
                          <span>{link.title}</span>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </>
  )
}
