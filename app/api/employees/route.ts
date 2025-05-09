import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get the company ID from the URL
    const url = new URL(request.url)
    const companyId = url.searchParams.get("companyId")

    // Get user role and department from headers or cookies
    const userRole = request.headers.get("X-User-Role") || "Employee"
    const userDepartmentId = request.headers.get("X-User-Department") || null
    const authToken = request.headers.get("Authorization") || ""

    console.log(`API Request - Role: ${userRole}, Department: ${userDepartmentId}, Company: ${companyId}`)
    console.log(`Authorization header: ${authToken ? "Present" : "Not present"}`)

    // تحقق من وجود معرف القسم للمستخدمين من نوع Admin
    if (userRole === "Admin" && !userDepartmentId) {
      console.warn("Admin user without department ID! This should not happen.")

      // محاولة استخراج معرف القسم من التوكن إذا كان موجودًا
      if (authToken && authToken.startsWith("Bearer ")) {
        try {
          const token = authToken.substring(7)
          const base64Url = token.split(".")[1]
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join(""),
          )

          const tokenData = JSON.parse(jsonPayload)
          if (tokenData.department) {
            console.log(`Found department ID in token: ${tokenData.department}`)
            // إعادة توجيه الطلب إلى مسار القسم المحدد
            return NextResponse.redirect(
              new URL(`/api/employees/department/${tokenData.department}?companyId=${companyId}`, request.url),
            )
          }
        } catch (e) {
          console.error("Error extracting department ID from token:", e)
        }
      }
    }

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }

    // إعادة توجيه المستخدمين من نوع Admin إلى مسار القسم المحدد
    if (userRole === "Admin" && userDepartmentId) {
      console.log(
        `Redirecting Admin user to department endpoint: /api/employees/department/${userDepartmentId}?companyId=${companyId}`,
      )
      return NextResponse.redirect(
        new URL(`/api/employees/department/${userDepartmentId}?companyId=${companyId}`, request.url),
      )
    }

    // Try to forward the request to the local server
    try {
      // Get all cookies from the request to forward them
      const cookies = request.headers.get("cookie") || ""

      // Determine the correct endpoint based on user role
      let apiEndpoint = ""

      // For Admin users, always use the department endpoint
      if (userRole === "Admin" && userDepartmentId) {
        console.log(`Admin user detected. Fetching employees for department ${userDepartmentId}`)

        // استخدم معرف القسم من كائن المستخدم مباشرة
        const departmentId = userDepartmentId

        try {
          console.log(`Forwarding employee request to http://localhost:5001/api/v1/employee/department/${departmentId}`)
          console.log(`With Authorization header: ${authToken}`)

          const response = await fetch(`http://localhost:5001/api/v1/employee/department/${departmentId}`, {
            headers: {
              "Content-Type": "application/json",
              Cookie: cookies, // Forward cookies
              Authorization: authToken, // Always include the auth token
            },
          })

          console.log(`Employee API response status: ${response.status}`)

          if (!response.ok) {
            console.error(`API error: ${response.status}`)
            return NextResponse.json(
              { error: "Failed to fetch employees from department" },
              { status: response.status },
            )
          }

          const data = await response.json()
          console.log(`API returned ${data.employees?.length || 0} employees`)
          return NextResponse.json(data)
        } catch (error) {
          console.error("Error fetching employees by department:", error)
          return NextResponse.json({ error: "Internal server error" }, { status: 500 })
        }
      } else {
        // Owner and other roles can see all employees in the company
        apiEndpoint = `http://localhost:5001/api/v1/employee/company/${companyId}`
        console.log(`Non-Admin user - Forwarding request to company endpoint: ${apiEndpoint}`)
      }

      console.log(`Forwarding cookies: ${cookies}`)
      console.log(`Auth header: ${authToken ? "Present" : "Not present"}`)
      console.log(`User role: ${userRole}, Department ID: ${userDepartmentId}`)

      if (userRole !== "Admin" || !userDepartmentId) {
        const response = await fetch(apiEndpoint, {
          credentials: "include", // Add credentials include
          headers: {
            "Content-Type": "application/json",
            Cookie: cookies, // Forward cookies
            Authorization: authToken, // Always include the auth token
          },
        })

        console.log(`Employee API response status: ${response.status}`)

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()
        console.log(`API returned ${data.employees?.length || 0} employees`)
        return NextResponse.json(data)
      }
    } catch (error) {
      console.error("Error forwarding to local API:", error)

      // Return mock data when the API is unavailable
      // If Admin, return only employees from their department
      if (userRole === "Admin" && userDepartmentId) {
        return NextResponse.json({
          employees: [
            {
              id: 1,
              uuid: "mock-uuid-1",
              firstName: "John",
              lastName: "Doe",
              email: "john.doe@example.com",
              departmentId: Number(userDepartmentId),
              companyId: Number.parseInt(companyId),
              jobTitle: "Software Engineer",
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              department: {
                id: Number(userDepartmentId),
                uuid: "mock-dept-uuid-1",
                name: "Your Department",
                companyId: Number.parseInt(companyId),
                parentDepartmentId: null,
                budget: "100000",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              company: {
                id: Number.parseInt(companyId),
                uuid: "mock-company-uuid-1",
                name: "Acme Inc",
                address: "123 Main St",
                contactEmail: "contact@acme.com",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            },
          ],
          total: 1,
          page: 1,
          limit: 10,
        })
      }

      // For non-Admin users, return all mock employees
      return NextResponse.json({
        employees: [
          {
            id: 1,
            uuid: "mock-uuid-1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            departmentId: 1,
            companyId: Number.parseInt(companyId),
            jobTitle: "Software Engineer",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            department: {
              id: 1,
              uuid: "mock-dept-uuid-1",
              name: "Engineering",
              companyId: Number.parseInt(companyId),
              parentDepartmentId: null,
              budget: "100000",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            company: {
              id: Number.parseInt(companyId),
              uuid: "mock-company-uuid-1",
              name: "Acme Inc",
              address: "123 Main St",
              contactEmail: "contact@acme.com",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
          {
            id: 2,
            uuid: "mock-uuid-2",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            departmentId: 2,
            companyId: Number.parseInt(companyId),
            jobTitle: "Product Manager",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            department: {
              id: 2,
              uuid: "mock-dept-uuid-2",
              name: "Product",
              companyId: Number.parseInt(companyId),
              parentDepartmentId: null,
              budget: "80000",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            company: {
              id: Number.parseInt(companyId),
              uuid: "mock-company-uuid-1",
              name: "Acme Inc",
              address: "123 Main St",
              contactEmail: "contact@acme.com",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
      })
    }
  } catch (error: any) {
    console.error("Employee API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
