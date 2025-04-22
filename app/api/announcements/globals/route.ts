import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get all cookies from the request
    const cookieHeader = request.headers.get("cookie")
    const authHeader = request.headers.get("Authorization")

    // Try to forward the request to the local server
    try {
      console.log("Forwarding request to http://localhost:5001/api/v1/announcement/globals")

      const response = await fetch("http://localhost:5001/api/v1/announcement/globals", {
        method: "GET",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error forwarding to local API:", error)

      // Return mock data when the API is unavailable
      return NextResponse.json([
        {
          id: 1,
          uuid: "mock-uuid-1",
          title: "Important Company Announcement",
          content: "This is an important announcement for all employees.",
          priority: "High",
          departmentId: null,
          employeeId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          employee: {
            firstName: "Admin",
            lastName: "User",
          },
          department: null,
        },
        {
          id: 2,
          uuid: "mock-uuid-2",
          title: "System Maintenance",
          content: "The system will be down for maintenance this weekend.",
          priority: "Medium",
          departmentId: null,
          employeeId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          employee: {
            firstName: "System",
            lastName: "Admin",
          },
          department: null,
        },
      ])
    }
  } catch (error: any) {
    console.error("Error fetching global announcements:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
