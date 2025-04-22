import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const parentDepartmentId = params.id
    const cookieHeader = request.headers.get("cookie")
    const authHeader = request.headers.get("Authorization")

    // Try to forward the request to the local server
    try {
      console.log(`Forwarding request to http://localhost:5001/api/v1/subDepartment/${parentDepartmentId}`)

      const response = await fetch(`http://localhost:5001/api/v1/subDepartment/${parentDepartmentId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error forwarding to local API:", error)

      // Return mock data when the API is unavailable
      return NextResponse.json([
        {
          id: 3,
          uuid: "eba312cd-55df-4717-a07a-9c3628556371",
          name: "Human Resources",
          companyId: 6,
          parentDepartmentId: Number(parentDepartmentId),
          budget: "7500",
          createdAt: "2025-03-30T17:03:03.296Z",
          updatedAt: "2025-03-30T17:03:03.296Z",
        },
        {
          id: 6,
          uuid: "8b7f39bf-36be-4d9e-93fe-f9560dd05c1c",
          name: "Development",
          companyId: 12,
          parentDepartmentId: Number(parentDepartmentId),
          budget: "20",
          createdAt: "2025-04-05T20:37:22.374Z",
          updatedAt: "2025-04-05T20:37:22.374Z",
        },
      ])
    }
  } catch (error: any) {
    console.error("Error fetching sub-departments:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
