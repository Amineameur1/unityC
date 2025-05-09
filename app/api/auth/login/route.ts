import { NextResponse } from "next/server"
import { TEST_ACCOUNT } from "@/services/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Login request body:", body)

    // Check if username and password are provided
    if (!body.username || !body.password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    // Check if using test account
    if (body.username === TEST_ACCOUNT.username && body.password === TEST_ACCOUNT.password) {
      return NextResponse.json({
        user: TEST_ACCOUNT.userData,
        accessToken: "test-access-token-" + Math.random().toString(36).substring(2),
        refreshToken: "test-refresh-token-" + Math.random().toString(36).substring(2),
        message: "Login successful (Test Account)",
      })
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

      // Get the response data
      const data = await response.json()
      console.log("Login response data:", data)

      // Extract both tokens from response
      const accessToken = data.accessToken || null
      const refreshToken = data.refreshToken || null

      // Create a new response with user data and tokens
      const newResponse = NextResponse.json({
        user: {
          ...(data.user || data.employee),
          // تأكد من أن معرف القسم موجود في كائن المستخدم
          departmentId: data.user?.department || data.employee?.department || null,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
        message: data.message || "Login successful",
      })

      // Get the Set-Cookie header(s)
      const setCookieHeader = response.headers.get("set-cookie")
      console.log("Set-Cookie header:", setCookieHeader)

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

      // Simulate credential validation when local server is not available
      if (body.username === "test" && body.password === "test") {
        // If the connection to the local server fails, return a fallback response with mock tokens
        return NextResponse.json({
          user: {
            employee: 7,
            company: 6,
            department: null,
            role: "Owner",
            username: body.username || "johnئdoe",
          },
          accessToken: "mock-access-token-" + Math.random().toString(36).substring(2),
          refreshToken: "mock-refresh-token-" + Math.random().toString(36).substring(2),
          message: "Login successful",
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
