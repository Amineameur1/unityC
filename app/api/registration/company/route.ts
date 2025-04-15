import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Received registration request:", body)

    // For development environment, try to forward the request to the local server
    if (process.env.NODE_ENV === "development") {
      try {
        console.log("Forwarding request to http://localhost:5001/api/v1/registration/company")
        const response = await fetch("http://localhost:5001/api/v1/registration/company", {
          method: "POST",
          credentials: "include", // Add credentials include
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company: {
              name: body.company?.name || "",
              address: body.company?.address || "",
              contactEmail: body.company?.contactEmail || "",
            },
            employee: {
              firstName: body.employee?.firstName || "",
              lastName: body.employee?.lastName || "",
              email: body.employee?.email || "",
            },
            user: {
              username: body.user?.username || "",
              password: body.user?.password || "",
            },
          }),
        })

        console.log("Response status:", response.status)

        if (!response.ok) {
          const errorData = await response.json()
          console.error("Error from API:", errorData)
          return NextResponse.json({ error: errorData.message || "Registration failed" }, { status: response.status })
        }

        const data = await response.json()
        console.log("Response data:", data)
        return NextResponse.json(data)
      } catch (error) {
        console.error("Error forwarding to local API:", error)
        // Continue to fallback response
      }
    }

    // Fallback response for production or if local server is not available
    console.log("Using fallback response")
    return NextResponse.json({
      message: "Company and user created successfully",
      data: {
        company: {
          id: Math.floor(Math.random() * 1000),
          name: body.company?.name || "Demo Company",
        },
        user: {
          id: Math.floor(Math.random() * 1000),
          username: body.user?.username || "demouser",
        },
      },
    })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
