import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// هذه الدالة تحدد ما إذا كان المستخدم قد سجل دخوله أم لا
// في تطبيق حقيقي، ستتحقق من وجود token صالح أو جلسة مستخدم
function isAuthenticated(request: NextRequest): boolean {
  // تحقق من وجود token في الكوكيز
  const authToken = request.cookies.get("auth-token")?.value

  // في بيئة الإنتاج، ستقوم بالتحقق من صلاحية الـ token
  // هنا نقوم بتحقق بسيط للتوضيح فقط
  return !!authToken
}

export function middleware(request: NextRequest) {
  // تحقق مما إذا كان المسار يبدأ بـ /dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // تحقق من حالة المصادقة
    if (!isAuthenticated(request)) {
      // إذا لم يكن المستخدم مصرح له، قم بإعادة توجيهه إلى صفحة تسجيل الدخول
      // مع تخزين المسار الأصلي كمعلمة استعلام للعودة إليه بعد تسجيل الدخول
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// تحديد المسارات التي سيتم تطبيق الـ middleware عليها
export const config = {
  matcher: ["/dashboard/:path*"],
}

