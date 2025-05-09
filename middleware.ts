import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function determines if the user is authenticated
function isAuthenticated(request: NextRequest): boolean {
  // For demo purposes, we'll check for a cookie that would be set on login
  const hasAuthCookie = request.cookies.has("auth")

  // In a real application, you would verify the token's validity
  return hasAuthCookie
}

// Add employee redirect logic to middleware
// Update the middleware function:

export function middleware(request: NextRequest) {
  // For demo purposes, we'll bypass authentication
  // In a real application, you would check authentication status

  // Check if the user is an employee and trying to access the dashboard root
  const cookies = request.cookies
  const userCookie = cookies.get("user")
  const accessTokenCookie = cookies.get("accessToken") || cookies.get("token")
  let userData = null

  console.log("Middleware executing for path:", request.nextUrl.pathname)

  // لا يمكن استخدام cookies.keys() لأنها ليست دالة
  // بدلاً من ذلك، نتحقق من وجود ملفات تعريف الارتباط المحددة
  console.log("User cookie exists:", !!userCookie)
  console.log("Access token cookie exists:", !!accessTokenCookie)

  // استخراج معلومات المستخدم من sessionStorage
  try {
    // محاولة استخراج معلومات المستخدم من ملف تعريف الارتباط
    if (userCookie) {
      userData = JSON.parse(decodeURIComponent(userCookie.value))
      console.log("User data from cookie:", userData)
    }
    // إذا لم تكن متوفرة، حاول استخراجها من JWT token
    else if (accessTokenCookie) {
      const token = accessTokenCookie.value
      console.log("Access token found:", token.substring(0, 20) + "...")

      // استخراج البيانات من التوكن (JWT)
      try {
        const base64Url = token.split(".")[1]
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
        )

        userData = JSON.parse(jsonPayload)
        console.log("User data extracted from token:", userData)
      } catch (e) {
        console.error("Error decoding JWT token:", e)
      }
    }

    // Redirect employee users to my-tasks
    if (userData && userData.role === "Employee" && request.nextUrl.pathname === "/dashboard") {
      return NextResponse.redirect(new URL("/dashboard/tasks/my-tasks", request.url))
    }
  } catch (error) {
    console.error("Error parsing user data in middleware:", error)
  }

  // إضافة معلومات المستخدم إلى الرؤوس
  if (userData) {
    // إنشاء نسخة من الرؤوس الحالية
    const headers = new Headers(request.headers)

    // إضافة معلومات المستخدم إلى الرؤوس
    headers.set("X-User-Id", userData.id?.toString() || userData.employee?.toString() || "")
    headers.set("X-Company-Id", userData.company?.toString() || "")
    headers.set("X-User-Role", userData.role || "")

    // تأكد من إضافة معرف القسم إذا كان موجودًا
    if (userData.department) {
      headers.set("X-User-Department", userData.department.toString())
      console.log(`Setting X-User-Department header to ${userData.department}`)
    } else if (userData.departmentId) {
      headers.set("X-User-Department", userData.departmentId.toString())
      console.log(`Setting X-User-Department header to ${userData.departmentId}`)
    }

    // إضافة التوكن إلى الرؤوس إذا كان موجودًا
    if (accessTokenCookie) {
      headers.set("Authorization", `Bearer ${accessTokenCookie.value}`)
      console.log("Setting Authorization header")
    }

    // إنشاء طلب جديد بالرؤوس المحدثة
    // استخدام Request بدلاً من NextRequest
    const newRequest = new Request(request.url, {
      headers,
      method: request.method,
      body: request.body,
      redirect: request.redirect,
      signal: request.signal,
    })

    return NextResponse.next({
      request: newRequest,
    })
  }

  return NextResponse.next()
}

// Define which paths the middleware applies to
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
}
