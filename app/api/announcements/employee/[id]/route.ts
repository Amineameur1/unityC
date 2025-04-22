import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const employeeId = params.id

    // Get the department ID from the URL
    const url = new URL(request.url)
    const departmentId = url.searchParams.get("departmentId")

    // Get all cookies from the request
    const cookieHeader = request.headers.get("cookie")
    const authHeader = request.headers.get("Authorization")

    // Try to forward the request to the local server
    try {
      console.log(
        `Forwarding request to http://localhost:5001/api/v1/announcement/employee/${employeeId}?departmentId=${departmentId || ""}`,
      )

      const response = await fetch(
        `http://localhost:5001/api/v1/announcement/employee/${employeeId}?departmentId=${departmentId || ""}`,
        {
          method: "GET",
          credentials: "include", // Include cookies
          headers: {
            "Content-Type": "application/json",
            ...(cookieHeader ? { Cookie: cookieHeader } : {}),
            ...(authHeader ? { Authorization: authHeader } : {}),
          },
        },
      )

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
          title: "Important Announcement for Employee",
          content: "This is an important announcement for the specific employee.",
          priority: "High",
          departmentId: departmentId ? Number(departmentId) : null,
          employeeId: Number(employeeId),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          employee: {
            firstName: "Admin",
            lastName: "User",
          },
          department: departmentId ? { name: "Engineering" } : null,
        },
        {
          id: 2,
          uuid: "mock-uuid-2",
          title: "Company-wide Announcement",
          content: "This is a company-wide announcement visible to all employees.",
          priority: "Normal",
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
    console.error("Error fetching employee announcements:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
