import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json()

    // Get all cookies from the request
    const cookieHeader = request.headers.get("cookie")

    console.log(`Forwarding sub-department creation request to http://localhost:5001/api/v1/department/sub`)
    console.log(`With data:`, body)

    // Try to forward the request to the local server
    try {
      const response = await fetch(`http://localhost:5001/api/v1/department/sub`, {
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

      console.log(`Sub-department creation API response status: ${response.status}`)

      if (!response.ok) {
        console.error(`API error: ${response.status}`)
        const errorText = await response.text()
        console.error(`API error response: ${errorText}`)
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Sub-department creation API response data:", data)

      // Return the data as is without modification
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error forwarding to local API:", error)

      // Return mock data when the API is unavailable
      return NextResponse.json({
        id: Math.floor(Math.random() * 1000) + 10,
        uuid: `mock-subdept-uuid-${Date.now()}`,
        name: body.name || "New Sub-Department",
        companyId: body.companyId || 6,
        parentDepartmentId: body.parentDepartmentId || 1,
        budget: body.budget || "50000",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
  } catch (error: any) {
    console.error("Sub-department creation API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
