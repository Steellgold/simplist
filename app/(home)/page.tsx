import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookText, Zap } from "lucide-react"
import { dayJS } from "@/lib/day-js"

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        {/* TODO */}
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto p-6 pb-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  A Modern Blogging API
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Our API simplifies the process of creating, updating, and managing blog posts. Perfect for developers
                  and content creators alike.
                </p>
              </div>
              <div className="space-x-2">
                <Button>
                  <Zap className="h-5 w-5" />
                  Get Started
                </Button>

                <Button variant="outline">
                  <BookText className="h-5 w-5" />
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© {dayJS().format("YYYY")} Simplist.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/terms">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

export default Page;