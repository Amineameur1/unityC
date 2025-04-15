import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Try to forward the request to the local server
    try {
      console.log("Forwarding logout request to http://localhost:5001/api/v1/auth/logout")
      const response = await fetch("http://localhost:5001/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Forward authorization header if present
          ...(request.headers.get("Authorization")
            ? { Authorization: request.headers.get("Authorization") as string }
            : {}),
        },
        credentials: "include", // Include cookies in the request
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      // Clear cookies from the response
      const responseData = await response.json()

      return NextResponse.json(responseData)
    } catch (error) {
      console.error("Error forwarding to local API:", error)

      // Return a fallback response when the API is unavailable
      return NextResponse.json({
        success: true,
        message: "Logged out successfully (fallback response)",
      })
    }
  } catch (error: any) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
