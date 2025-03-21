"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Building2, User } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-background p-6 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">Choose the type of account you want to create</p>
        </div>

        <div className="grid gap-4 pt-4">
          <Link href="/register/company">
            <Button variant="outline" className="w-full h-20 justify-start gap-4">
              <Building2 className="h-6 w-6" />
              <div className="flex flex-col items-start">
                <span className="font-medium">Company Account</span>
                <span className="text-xs text-muted-foreground">Create a new company and become its manager</span>
              </div>
            </Button>
          </Link>

          <Link href="/register/employee">
            <Button variant="outline" className="w-full h-20 justify-start gap-4">
              <User className="h-6 w-6" />
              <div className="flex flex-col items-start">
                <span className="font-medium">Employee Account</span>
                <span className="text-xs text-muted-foreground">Join an existing company with an invite code</span>
              </div>
            </Button>
          </Link>
        </div>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

