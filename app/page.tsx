import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Link2, BarChart3, Palette, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <Link2 className="h-4 w-4 text-background" />
            </div>
            <span className="text-xl font-bold text-foreground">LinkHub</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
              One Link to Share
              <span className="block text-muted-foreground">Everything You Create</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
              Create a beautiful landing page for all your important links. Share one simple link
              that connects your audience to your content, products, and social profiles.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/sign-up">
                <Button size="lg" className="gap-2">
                  Create Your Page
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Everything you need to share your links
              </h2>
              <p className="mt-4 text-muted-foreground">
                Simple, powerful, and designed to help you grow your audience.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/10">
                  <Link2 className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Unlimited Links</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add as many links as you need. Organize them with drag and drop.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/10">
                  <BarChart3 className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Detailed Analytics</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Track clicks, see where your traffic comes from, and optimize.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/10">
                  <Palette className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Custom Themes</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose from beautiful themes or customize colors to match your brand.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto flex max-w-xl flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground">
                <Zap className="h-8 w-8 text-background" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-foreground">
                Ready to get started?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Create your free page in under a minute. No credit card required.
              </p>
              <Link href="/auth/sign-up" className="mt-8">
                <Button size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground">
              <Link2 className="h-3 w-3 text-background" />
            </div>
            <span>LinkHub</span>
          </div>
          <p>Built with Next.js and Supabase</p>
        </div>
      </footer>
    </div>
  )
}
