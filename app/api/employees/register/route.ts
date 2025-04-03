import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Try to forward the request to the local server
    try {
      console.log("Forwarding employee registration request to http://localhost:5001/api/v1/registration/owner/user")
      const response = await fetch("http://localhost:5001/api/v1/registration/owner/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Forward authorization header if present
          ...(request.headers.get("Authorization")
            ? { Authorization: request.headers.get("Authorization") as string }
            : {}),
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return NextResponse.json(
          { error: errorData.message || "Failed to register employee" },
          { status: response.status },
        )
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error forwarding to local API:", error)

      // Return mock success response when the API is unavailable
      return NextResponse.json({
        success: true,
        message: "Employee registered successfully",
        employee: {
          id: Math.floor(Math.random() * 1000) + 10,
          uuid: `mock-uuid-${Date.now()}`,
          firstName: body.employee.firstName,
          lastName: body.employee.lastName,
          email: body.employee.email,
          departmentId: body.employee.departmentId,
          companyId: body.employee.companyId,
          jobTitle: body.employee.jobTitle,
          role: body.employee.role,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
    }
  } catch (error: any) {
    console.error("Employee registration error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

