import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get the employee ID from the URL
    const url = new URL(request.url)
    const employeeId = url.searchParams.get("employeeId")

    if (!employeeId) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 })
    }

    // Get all cookies from the request
    const cookieHeader = request.headers.get("cookie")

    // Try to forward the request to the local server
    try {
      console.log(`Forwarding my tasks request to http://localhost:5001/api/v1/task/employee/${employeeId}`)
      const response = await fetch(`http://localhost:5001/api/v1/task/employee/${employeeId}`, {
        method: "GET",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
          // Forward authorization header if present
          ...(request.headers.get("Authorization")
            ? { Authorization: request.headers.get("Authorization") as string }
            : {}),
        },
      })

      console.log(`My tasks API response status: ${response.status}`)

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
          title: "Prepare Monthly Sales Report",
          description: "Create a detailed report on last month's sales and performance analysis",
          assignedTo: Number(employeeId),
          departmentId: 2,
          status: "In Progress",
          priority: "High",
          deadline: new Date(2023, 5, 15).toISOString(),
          createdAt: new Date(2023, 4, 1).toISOString(),
          updatedAt: new Date(2023, 4, 1).toISOString(),
          employee: {
            id: Number(employeeId),
            firstName: "Current",
            lastName: "User",
          },
          department: {
            id: 2,
            name: "Sales",
          },
        },
        {
          id: 2,
          title: "Update Customer Database",
          description: "Update customer information and add new customers to the database",
          assignedTo: Number(employeeId),
          departmentId: 3,
          status: "Pending",
          priority: "Medium",
          deadline: new Date(2023, 5, 18).toISOString(),
          createdAt: new Date(2023, 4, 5).toISOString(),
          updatedAt: new Date(2023, 4, 5).toISOString(),
          employee: {
            id: Number(employeeId),
            firstName: "Current",
            lastName: "User",
          },
          department: {
            id: 3,
            name: "Customer Support",
          },
        },
      ])
    }
  } catch (error: any) {
    console.error("My tasks API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
