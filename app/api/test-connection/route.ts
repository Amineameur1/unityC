import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Testing connection to http://localhost:5001/api/v1/health")

    const response = await fetch("http://localhost:5001/api/v1/health", {
      method: "GET",
      credentials: "include", // Add credentials include
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Connection test failed", status: response.status },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json({
      message: "Connection successful",
      apiResponse: data,
    })
  } catch (error: any) {
    console.error("Connection test error:", error)
    return NextResponse.json(
      {
        error: "Connection test failed",
        message: error.message,
        details: "Could not connect to the API server. Make sure it's running at http://localhost:5001.",
      },
      { status: 500 },
    )
  }
}
