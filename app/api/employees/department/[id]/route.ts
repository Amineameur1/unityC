import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get the department ID from the URL
    const departmentId = params.id

    // Get the company ID from the URL
    const url = new URL(request.url)
    const companyId = url.searchParams.get("companyId")

    // Get user role and department from headers
    const userRole = request.headers.get("X-User-Role") || "Employee"
    const userDepartmentId = request.headers.get("X-User-Department") || null
    const authToken = request.headers.get("Authorization") || ""

    console.log(
      `API Request - Department/${departmentId} - Role: ${userRole}, Department: ${userDepartmentId}, Company: ${companyId}`,
    )
    console.log(`Authorization header: ${authToken ? "Present" : "Not present"}`)

    if (!departmentId) {
      return NextResponse.json({ error: "Department ID is required" }, { status: 400 })
    }

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }

    // Admin users can only access their own department
    if (userRole === "Admin" && userDepartmentId && departmentId !== userDepartmentId.toString()) {
      return NextResponse.json({ error: "Admin users can only access their own department" }, { status: 403 })
    }

    // Try to forward the request to the local server
    try {
      // Get all cookies from the request to forward them
      const cookies = request.headers.get("cookie") || ""

      console.log(`Forwarding employee request to http://localhost:5001/api/v1/employee/department/${departmentId}`)
      console.log(`With Authorization header: ${authToken}`)

      const response = await fetch(`http://localhost:5001/api/v1/employee/department/${departmentId}`, {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookies, // Forward cookies
          Authorization: authToken, // Always include the auth token
        },
      })

      console.log(`Employee API response status: ${response.status}`)

      if (!response.ok) {
        console.error(`API error: ${response.status}`)
        return NextResponse.json({ error: "Failed to fetch employees from department" }, { status: response.status })
      }

      const data = await response.json()
      console.log(`API returned ${data.employees?.length || 0} employees`)

      // إضافة سجل تصحيح لعرض البيانات المستلمة
      console.log("Employees data from API:", data.employees)

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
            departmentId: Number(departmentId),
            companyId: Number.parseInt(companyId),
            jobTitle: "Software Engineer",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            department: {
              id: Number(departmentId),
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
            departmentId: Number(departmentId),
            companyId: Number.parseInt(companyId),
            jobTitle: "Product Manager",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            department: {
              id: Number(departmentId),
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
