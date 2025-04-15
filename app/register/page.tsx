"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Building2, Layers, User } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-background p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full bg-primary/10 p-2">
            <Layers className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">Choose the type of account you want to create</p>
        </div>

        <div className="grid gap-4 pt-6">
          <Link href="/register/company">
            <Button
              variant="outline"
              className="w-full h-24 justify-start gap-4 group hover:border-primary hover:bg-primary/5"
            >
              <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium text-lg">Company Account</span>
                <span className="text-sm text-muted-foreground">Create a new company and become its manager</span>
              </div>
            </Button>
          </Link>

          <Link href="/register/employee">
            <Button
              variant="outline"
              className="w-full h-24 justify-start gap-4 group hover:border-primary hover:bg-primary/5"
            >
              <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium text-lg">Employee Account</span>
                <span className="text-sm text-muted-foreground">Join an existing company with an invite code</span>
              </div>
            </Button>
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">OR</span>
          </div>
        </div>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
