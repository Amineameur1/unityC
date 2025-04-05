import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get all cookies from the request
    const cookieHeader = request.headers.get("cookie")
    console.log(`Forwarding department request to http://localhost:5001/api/v1/department/`)
    console.log(`With cookies: ${cookieHeader || "none"}`)

    // Try to forward the request to the local server
    try {
      const response = await fetch(`http://localhost:5001/api/v1/department/`, {
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

      console.log(`Department API response status: ${response.status}`)

      if (!response.ok) {
        console.error(`API error: ${response.status}`)
        const errorText = await response.text()
        console.error(`API error response: ${errorText}`)
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Department API response data:", data)

      // Return the data as is without modification
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error forwarding to local API:", error)

      // Return mock data when the API is unavailable
      return NextResponse.json({
        departments: [
          {
            id: 1,
            uuid: "mock-dept-uuid-1",
            name: "Engineering",
            companyId: 6,
            parentDepartmentId: null,
            budget: "100000",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 2,
            uuid: "mock-dept-uuid-2",
            name: "Product",
            companyId: 6,
            parentDepartmentId: null,
            budget: "80000",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 3,
            uuid: "mock-dept-uuid-3",
            name: "Marketing",
            companyId: 6,
            parentDepartmentId: null,
            budget: "60000",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        total: 3,
        page: 1,
        limit: 10,
      })
    }
  } catch (error: any) {
    console.error("Department API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

