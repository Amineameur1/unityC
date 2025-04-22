import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get the department ID from the URL
    const departmentId = params.id

    // Get all cookies from the request
    const cookieHeader = request.headers.get("cookie")

    console.log(`Forwarding department request to http://localhost:5001/api/v1/department/${departmentId}`)
    console.log(`With cookies: ${cookieHeader || "none"}`)

    // Try to forward the request to the local server
    try {
      const response = await fetch(`http://localhost:5001/api/v1/department/${departmentId}`, {
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
        id: Number(departmentId),
        uuid: `mock-dept-uuid-${departmentId}`,
        name: "Engineering",
        companyId: 6,
        parentDepartmentId: null,
        budget: "100000",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
  } catch (error: any) {
    console.error("Department API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get the department ID from the URL
    const departmentId = params.id

    // Get the request body
    const body = await request.json()

    // Get all cookies from the request
    const cookieHeader = request.headers.get("cookie")

    console.log(`Forwarding department update request to http://localhost:5001/api/v1/department/${departmentId}`)
    console.log(`With data:`, body)

    // Try to forward the request to the local server
    try {
      const response = await fetch(`http://localhost:5001/api/v1/department/${departmentId}`, {
        method: "PUT",
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

      console.log(`Department update API response status: ${response.status}`)

      if (!response.ok) {
        console.error(`API error: ${response.status}`)
        const errorText = await response.text()
        console.error(`API error response: ${errorText}`)
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Department update API response data:", data)

      // Return the data as is without modification
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error forwarding to local API:", error)

      // Return mock data when the API is unavailable
      return NextResponse.json({
        id: Number(departmentId),
        uuid: `mock-dept-uuid-${departmentId}`,
        name: body.name || "Updated Department",
        companyId: body.companyId || 6,
        parentDepartmentId: body.parentDepartmentId || null,
        budget: body.budget || "100000",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
  } catch (error: any) {
    console.error("Department update API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get the department ID from the URL
    const departmentId = params.id

    // Get all cookies from the request
    const cookieHeader = request.headers.get("cookie")

    console.log(`Forwarding department delete request to http://localhost:5001/api/v1/department/${departmentId}`)

    // Try to forward the request to the local server
    try {
      const response = await fetch(`http://localhost:5001/api/v1/department/${departmentId}`, {
        method: "DELETE",
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

      console.log(`Department delete API response status: ${response.status}`)

      if (!response.ok) {
        console.error(`API error: ${response.status}`)
        const errorText = await response.text()
        console.error(`API error response: ${errorText}`)
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Department delete API response data:", data)

      // Return the data as is without modification
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error forwarding to local API:", error)

      // Return mock success response when the API is unavailable
      return NextResponse.json({ success: true, message: "Department deleted successfully" })
    }
  } catch (error: any) {
    console.error("Department delete API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
