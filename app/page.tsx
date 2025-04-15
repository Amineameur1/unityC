import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle, Layers } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="rounded-md bg-primary p-1">
              <Layers className="h-6 w-6 text-primary-foreground" />
            </div>
            EnterpriseOS
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-background to-muted">
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
                    <Button size="lg" className="w-full group">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/demo">
                    <Button size="lg" variant="outline" className="w-full">
                      View Demo
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Integrated company and department management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Efficient task and resource tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Advanced reporting and analytics</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-full md:h-[450px] lg:h-[500px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border shadow-lg p-4">
                    <div className="h-full w-full rounded-xl bg-background/80 backdrop-blur-sm flex flex-col overflow-hidden">
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
                            <div className="h-20 rounded-lg bg-primary/10 shadow-sm"></div>
                            <div className="h-20 rounded-lg bg-secondary/10 shadow-sm"></div>
                          </div>
                          <div className="h-40 rounded-lg bg-muted/70 shadow-sm mb-4"></div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="h-16 rounded-lg bg-muted/50 shadow-sm"></div>
                            <div className="h-16 rounded-lg bg-muted/50 shadow-sm"></div>
                            <div className="h-16 rounded-lg bg-muted/50 shadow-sm"></div>
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

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover how our system can improve your organization's efficiency and streamline daily operations
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
              {[
                {
                  title: "Company Management",
                  description:
                    "Comprehensive management of companies, branches, and departments in an easy and flexible way",
                },
                {
                  title: "Employee Management",
                  description: "Complete tracking of employees, their performance, tasks, and evaluations",
                },
                {
                  title: "Task Management",
                  description: "Organize and distribute tasks and track their completion with high efficiency",
                },
                {
                  title: "Resource Management",
                  description: "Track available resources and distribute them between departments and projects",
                },
                {
                  title: "Reports & Analytics",
                  description: "Detailed reports and accurate statistics to help you make decisions",
                },
                {
                  title: "Announcements & Alerts",
                  description: "Integrated system for announcements and alerts to ensure effective communication",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="rounded-full bg-primary/10 p-2 mb-2">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 bg-background">
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
