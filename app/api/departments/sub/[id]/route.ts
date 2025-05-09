import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Ensure params is properly awaited
    const { id } = params
    const parentDepartmentId = id
    const cookieHeader = request.headers.get("cookie")
    const authHeader = request.headers.get("Authorization")

    // Try to forward the request to the local server
    try {
      console.log(`Forwarding request to http://localhost:5001/api/v1/subDepartment/${parentDepartmentId}`)

      const response = await fetch(`http://localhost:5001/api/v1/subDepartment/${parentDepartmentId}`, {
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
      throw error
    }
  } catch (error: any) {
    console.error("Error fetching sub-departments:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

// Add PUT method for updating a subdepartment
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Ensure params is properly awaited
    const { id } = params
    const subdepartmentId = id
    const body = await request.json()
    const cookieHeader = request.headers.get("cookie")
    const authHeader = request.headers.get("Authorization")

    console.log(`Forwarding update request to http://localhost:5001/api/v1/subDepartment/${subdepartmentId}`)
    console.log(`With data:`, body)

    try {
      const response = await fetch(`http://localhost:5001/api/v1/subDepartment/${subdepartmentId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API error response: ${errorText}`)
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error forwarding to local API:", error)
      throw error
    }
  } catch (error: any) {
    console.error("Error updating sub-department:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

// Add DELETE method for deleting a subdepartment
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Ensure params is properly awaited
    const { id } = params
    const subdepartmentId = id
    const cookieHeader = request.headers.get("cookie")
    const authHeader = request.headers.get("Authorization")

    console.log(`Forwarding delete request to http://localhost:5001/api/v1/subDepartment/${subdepartmentId}`)

    try {
      const response = await fetch(`http://localhost:5001/api/v1/subDepartment/${subdepartmentId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API error response: ${errorText}`)
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error forwarding to local API:", error)
      throw error
    }
  } catch (error: any) {
    console.error("Error deleting sub-department:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
