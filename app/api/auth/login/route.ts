import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Login request body:", body)

    // Check if username and password are provided
    if (!body.username || !body.password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    // Try to forward the request to the local server
    try {
      console.log("Forwarding login request to http://localhost:5001/api/v1/auth/login")
      const response = await fetch("http://localhost:5001/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      console.log("Login response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Login error from API:", errorData)

        // Improve error messages
        if (response.status === 401) {
          return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
        } else if (response.status === 403) {
          return NextResponse.json({ error: "Your account is inactive or has been suspended" }, { status: 403 })
        }

        return NextResponse.json({ error: errorData.message || "Login failed" }, { status: response.status })
      }

      const data = await response.json()
      console.log("Login response data:", data)
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error forwarding to local API:", error)

      // Simulate credential validation when local server is not available
      if (body.username === "test" && body.password === "test") {
        // If the connection to the local server fails, return a fallback response
        // Use the exact format provided by the user
        return NextResponse.json({
          user: {
            employee: 7,
            company: 6,
            department: null,
            role: "Owner",
            username: body.username || "johnئdoe",
          },
          message: "Login successful",
          token: "mock-jwt-token-" + Math.random().toString(36).substring(2),
        })
      } else {
        // If credentials are invalid
        return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
      }
    }
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

