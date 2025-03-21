import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
              <path d="M18 14h-8" />
              <path d="M15 18h-5" />
              <path d="M10 6h8v4h-8V6Z" />
            </svg>
            EnterpriseOS
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Comprehensive Enterprise Management
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Streamline your business operations with our all-in-one platform. Manage companies, departments,
                    employees, resources, and more.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/dashboard/demo">
                    <Button size="lg" variant="outline" className="w-full">
                      View Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-full md:h-[450px] lg:h-[500px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg border p-4">
                    <div className="h-full w-full rounded-md bg-muted/30 backdrop-blur-sm flex flex-col">
                      <div className="flex items-center border-b p-4">
                        <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                        <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <div className="mx-auto text-xs text-muted-foreground">Enterprise Dashboard</div>
                      </div>
                      <div className="flex flex-1">
                        <div className="w-1/4 border-r p-2">
                          <div className="h-4 w-full rounded bg-muted mb-2"></div>
                          <div className="h-4 w-full rounded bg-muted mb-2"></div>
                          <div className="h-4 w-full rounded bg-muted mb-2"></div>
                          <div className="h-4 w-full rounded bg-muted mb-2"></div>
                          <div className="h-4 w-full rounded bg-muted mb-2"></div>
                        </div>
                        <div className="flex-1 p-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="h-20 rounded bg-muted/70"></div>
                            <div className="h-20 rounded bg-muted/70"></div>
                          </div>
                          <div className="h-40 rounded bg-muted/50 mb-4"></div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="h-16 rounded bg-muted/30"></div>
                            <div className="h-16 rounded bg-muted/30"></div>
                            <div className="h-16 rounded bg-muted/30"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <p className="text-sm text-muted-foreground">© 2024 EnterpriseOS. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

