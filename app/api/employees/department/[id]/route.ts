import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const departmentId = params.id

    // Get the company ID from the URL
    const url = new URL(request.url)
    const companyId = url.searchParams.get("companyId")

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }

    // Get all cookies from the request
    const cookieHeader = request.headers.get("cookie")

    // Try to forward the request to the local server
    try {
      console.log(`Forwarding request to http://localhost:5001/api/v1/employee/department/${departmentId}`)
      const response = await fetch(`http://localhost:5001/api/v1/employee/department/${departmentId}`, {
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
            departmentId: Number.parseInt(departmentId),
            companyId: Number.parseInt(companyId),
            jobTitle: "Software Engineer",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            department: {
              id: Number.parseInt(departmentId),
              uuid: "mock-dept-uuid-1",
              name: "Engineering",
              companyId: Number.parseInt(companyId),
              parentDepartmentId: null,
              budget: "100000",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            company: {
              id: Number.parseInt(companyId),
              uuid: "mock-company-uuid-1",
              name: "Acme Inc",
              address: "123 Main St",
              contactEmail: "contact@acme.com",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      })
    }
  } catch (error: any) {
    console.error("Error fetching employees by department:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
