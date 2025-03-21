"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Cookies from "js-cookie"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // الحصول على مسار العودة من معلمات الاستعلام إن وجد
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"

  // التحقق مما إذا كان المستخدم مسجل دخوله بالفعل
  useEffect(() => {
    const authToken = Cookies.get("auth-token")
    if (authToken) {
      router.push(callbackUrl)
    }
  }, [callbackUrl, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // التحقق من صحة البيانات
    if (!email || !password) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // في تطبيق حقيقي، ستقوم بإرسال طلب إلى الخادم للتحقق من بيانات المستخدم
      // هنا نقوم بمحاكاة عملية تسجيل الدخول

      // تأخير لمحاكاة طلب الشبكة
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // تعيين token في الكوكيز
      // في تطبيق حقيقي، سيتم إرجاع هذا الـ token من الخادم
      const expirationDays = rememberMe ? 30 : 1
      Cookies.set("auth-token", "sample-auth-token-123456", { expires: expirationDays })

      // تخزين معلومات المستخدم في localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "محمد عبدالله",
          email: email,
          role: "Company Manager",
        }),
      )

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في نظام إدارة المؤسسات",
      })

      // إعادة التوجيه إلى لوحة التحكم أو مسار العودة
      router.push(callbackUrl)
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ أثناء محاولة تسجيل الدخول. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-background p-6 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">مرحباً بعودتك</h1>
          <p className="text-muted-foreground">أدخل بيانات الاعتماد للوصول إلى حسابك</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة المرور</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm font-normal mr-2">
                تذكرني لمدة 30 يوم
              </Label>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="text-primary hover:underline">
            إنشاء حساب
          </Link>
        </div>
      </div>
    </div>
  )
}

