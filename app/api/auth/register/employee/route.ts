import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password, inviteCode } = body

    // Simple validation
    if (!firstName || !lastName || !email || !password || !inviteCode) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate invite code (simple check for demo)
    if (inviteCode !== "DEMO123" && inviteCode !== "EMP-1234-ABCD") {
      return NextResponse.json({ error: "Invalid invite code" }, { status: 400 })
    }

    // In a real app, you would save this data to a database
    // For this demo, we'll just return a success response

    const user = {
      id: 2,
      firstName,
      lastName,
      email,
      role: "Employee",
      company: 1,
      department: 1,
    }

    const token = "mock-jwt-token-" + Math.random().toString(36).substring(2)

    return NextResponse.json({ token, user })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
