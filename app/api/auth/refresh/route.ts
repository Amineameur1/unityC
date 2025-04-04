import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Get the refresh token from the request body
    const body = await request.json()
    const refreshToken = body.refreshToken

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token is required" }, { status: 400 })
    }

    // Try to forward the request to the local server
    try {
      console.log("Forwarding refresh token request to http://localhost:5001/api/v1/auth/refresh")
      const response = await fetch("http://localhost:5001/api/v1/auth/refresh", {
        method: "POST",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      // Get the response data
      const data = await response.json()

      // Create a new response with the new tokens
      const newResponse = NextResponse.json({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken, // In case a new refresh token is issued
        message: "Token refreshed successfully",
      })

      // Get the Set-Cookie header
      const setCookieHeader = response.headers.get("set-cookie")

      // Forward cookies from the original response if they exist
      if (setCookieHeader) {
        // Split multiple cookies if they exist (they're separated by commas)
        const cookies = setCookieHeader.split(", ")
        for (const cookie of cookies) {
          newResponse.headers.append("Set-Cookie", cookie)
        }
      }

      return newResponse
    } catch (error) {
      console.error("Error forwarding to local API:", error)
      return NextResponse.json({ error: "Failed to refresh token" }, { status: 401 })
    }
  } catch (error: any) {
    console.error("Refresh token error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

