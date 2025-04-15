import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get the company ID from the URL
    const url = new URL(request.url)
    const companyId = url.searchParams.get("companyId")

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }

    // Try to forward the request to the local server
    try {
      // Get all cookies from the request to forward them
      const cookies = request.headers.get("cookie") || ""

      console.log(`Forwarding employee request to http://localhost:5001/api/v1/employee/company/${companyId}`)
      console.log(`Forwarding cookies: ${cookies}`)

      const response = await fetch(`http://localhost:5001/api/v1/employee/company/${companyId}`, {
        credentials: "include", // Add credentials include
        headers: {
          "Content-Type": "application/json",
          Cookie: cookies, // Forward cookies
        },
      })

      console.log(`Employee API response status: ${response.status}`)

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
            departmentId: 1,
            companyId: Number.parseInt(companyId),
            jobTitle: "Software Engineer",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            department: {
              id: 1,
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
          {
            id: 2,
            uuid: "mock-uuid-2",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            departmentId: 2,
            companyId: Number.parseInt(companyId),
            jobTitle: "Product Manager",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            department: {
              id: 2,
              uuid: "mock-dept-uuid-2",
              name: "Product",
              companyId: Number.parseInt(companyId),
              parentDepartmentId: null,
              budget: "80000",
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
        total: 2,
        page: 1,
        limit: 10,
      })
    }
  } catch (error: any) {
    console.error("Employee API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
