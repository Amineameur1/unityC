import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json()

    // Get all cookies from the request
    const cookieHeader = request.headers.get("cookie")

    console.log(
      `Forwarding sub-department creation request to http://localhost:5001/api/v1/subDepartment/${body.parentDepartmentId}`,
    )
    console.log(`With data:`, { name: body.name, budget: body.budget })

    // Try to forward the request to the local server
    try {
      const response = await fetch(`http://localhost:5001/api/v1/subDepartment/${body.parentDepartmentId}`, {
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
        body: JSON.stringify({
          name: body.name,
          budget: body.budget,
        }),
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
      throw error
    }
  } catch (error: any) {
    console.error("Sub-department creation API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
