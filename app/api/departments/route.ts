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
      console.log(`Forwarding department request to http://localhost:5001/api/v1/department/company/${companyId}`)
      const response = await fetch(`http://localhost:5001/api/v1/department/company/${companyId}`, {
        headers: {
          "Content-Type": "application/json",
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
        departments: [
          {
            id: 1,
            uuid: "mock-dept-uuid-1",
            name: "Engineering",
            companyId: Number.parseInt(companyId),
            parentDepartmentId: null,
            budget: "100000",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 2,
            uuid: "mock-dept-uuid-2",
            name: "Product",
            companyId: Number.parseInt(companyId),
            parentDepartmentId: null,
            budget: "80000",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 3,
            uuid: "mock-dept-uuid-3",
            name: "Marketing",
            companyId: Number.parseInt(companyId),
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

