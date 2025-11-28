"use client"

import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authenticate } from "@/lib/auth"

export function LandingHero() {
  const router = useRouter()

  const handleContinue = () => {
    authenticate("you@google.com")
    router.push("/dashboard")
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-background to-muted p-8 md:p-12 shadow-lg">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.08),transparent_25%),radial-gradient(circle_at_60%_80%,rgba(139,92,246,0.08),transparent_25%)]" />
      <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            AI-built carousels for LinkedIn
          </div>
          <div className="space-y-3">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight bg-clip-text text-transparent"
              style={{
                fontFamily: "var(--font-inter-tight), sans-serif",
                backgroundImage: "linear-gradient(120deg, #ffffff, #c4c4c4, #9ca3af)",
              }}
            >
              Create high-performing LinkedIn carousels in minutes
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
              Go from topic to publish-ready LinkedIn carousel in a couple clicks. Our AI optimizes each slide for engagement, clarity, and growth.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Button size="lg" className="gap-2" onClick={handleContinue}>
              Continue with Google
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              No credit card required
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1 bg-background/60 backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              Join 1,200+ marketers creating top-performing carousels
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1 bg-background/60 backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Built for LinkedIn performance
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-foreground/5 to-transparent blur-3xl" />
          <div className="relative rounded-2xl border border-border bg-background/80 p-6 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">LinkedIn carousel</p>
                <h3 className="text-xl font-semibold" style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}>
                  LinkedIn Growth in 2025
                </h3>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">8 slides</span>
            </div>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border/60 bg-muted/50 p-4">
                <p className="text-xs font-medium text-primary mb-1">Hook</p>
                <p className="text-foreground font-medium">"Copy these 5 AI workflows to triple your reach this quarter."</p>
              </div>
              <div className="grid gap-3">
                {["Carousel outline", "Slide headlines", "CTA optimized"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/70 px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item}</p>
                      <p className="text-xs text-muted-foreground">Crafted for clarity and engagement</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
