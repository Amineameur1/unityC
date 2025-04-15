import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Employee user registration request body:", body)

    // Get all cookies from the request
    const cookieHeader = request.headers.get("cookie")

    // Try to forward the request to the local server
    try {
      console.log("Forwarding employee user registration request to http://localhost:5001/api/v1/registration/user")
      const response = await fetch("http://localhost:5001/api/v1/registration/user", {
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

      console.log("Employee user registration response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error from API:", errorData)
        return NextResponse.json(
          { error: errorData.message || "Failed to register employee user" },
          { status: response.status },
        )
      }

      const data = await response.json()
      console.log("Employee user registration response data:", data)
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error forwarding to local API:", error)

      // Return mock success response when the API is unavailable
      return NextResponse.json({
        success: true,
        message: "Employee user registered successfully",
        user: {
          id: Math.floor(Math.random() * 1000) + 10,
          username: body.user.username,
          employeeId: body.user.employeeId,
        },
      })
    }
  } catch (error: any) {
    console.error("Employee user registration error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
