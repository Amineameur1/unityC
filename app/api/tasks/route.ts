import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Task creation request body:", body)

    // Get all cookies from the request
    const cookieHeader = request.headers.get("cookie")

    // Try to forward the request to the local server
    try {
      console.log("Forwarding task creation request to http://localhost:5001/api/v1/task/create")
      const response = await fetch("http://localhost:5001/api/v1/task/create", {
        method: "POST",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
          // Forward authorization header if present
          ...(request.headers.get("Authorization")
            ? { Authorization: request.headers.get("Authorization") as string }
            : {}),
        },
        body: JSON.stringify(body),
      })

      console.log("Task creation response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error from API:", errorData)
        return NextResponse.json({ error: errorData.message || "Failed to create task" }, { status: response.status })
      }

      const data = await response.json()
      console.log("Task creation response data:", data)
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error forwarding to local API:", error)

      // Return mock success response when the API is unavailable
      return NextResponse.json({
        success: true,
        message: "Task created successfully (mock response)",
        task: {
          id: Math.floor(Math.random() * 1000) + 10,
          title: body.title,
          description: body.description,
          assignedTo: body.assignedTo,
          departmentId: body.departmentId,
          priority: body.priority,
          deadline: body.deadline,
          status: "Pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
    }
  } catch (error: any) {
    console.error("Task creation error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Get all cookies from the request
    const cookieHeader = request.headers.get("cookie")

    // Try to forward the request to the local server
    try {
      console.log("Forwarding task request to http://localhost:5001/api/v1/task")
      const response = await fetch("http://localhost:5001/api/v1/task", {
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

      console.log("Task API response status:", response.status)

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
          title: "Quarterly Budget Review",
          description: "Review and finalize Q2 budget allocations for all departments",
          assignedTo: 3,
          departmentId: 2,
          status: "In Progress",
          priority: "High",
          deadline: new Date(2023, 5, 15).toISOString(),
          createdAt: new Date(2023, 4, 1).toISOString(),
          updatedAt: new Date(2023, 4, 1).toISOString(),
          employee: {
            id: 3,
            firstName: "Michael",
            lastName: "Brown",
          },
          department: {
            id: 2,
            name: "Finance",
          },
        },
        {
          id: 2,
          title: "Website Redesign Meeting",
          description: "Discuss new website design concepts with the design team",
          assignedTo: 2,
          departmentId: 3,
          status: "Pending",
          priority: "Medium",
          deadline: new Date(2023, 5, 18).toISOString(),
          createdAt: new Date(2023, 4, 5).toISOString(),
          updatedAt: new Date(2023, 4, 5).toISOString(),
          employee: {
            id: 2,
            firstName: "Sarah",
            lastName: "Johnson",
          },
          department: {
            id: 3,
            name: "Marketing",
          },
        },
      ])
    }
  } catch (error: any) {
    console.error("Task API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
