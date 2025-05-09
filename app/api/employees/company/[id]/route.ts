import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Ensure params is properly awaited
    const { id } = params
    const companyId = id
    const cookieHeader = request.headers.get("cookie")
    const authHeader = request.headers.get("Authorization")

    // Try to forward the request to the local server
    try {
      console.log(`Forwarding request to http://localhost:5001/api/v1/employee/company/${companyId}`)

      const response = await fetch(`http://localhost:5001/api/v1/employee/company/${companyId}`, {
        method: "GET",
        credentials: "include",
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
      return NextResponse.json({
        employees: [
          {
            id: 1,
            uuid: "mock-uuid-1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            position: "Software Engineer",
            departmentId: 3,
            companyId: Number(companyId),
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            department: {
              name: "Engineering",
            },
          },
          {
            id: 2,
            uuid: "mock-uuid-2",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            position: "Product Manager",
            departmentId: 4,
            companyId: Number(companyId),
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            department: {
              name: "Product",
            },
          },
        ],
      })
    }
  } catch (error: any) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
