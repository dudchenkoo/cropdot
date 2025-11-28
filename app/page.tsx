import { Inter_Tight } from "next/font/google"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { LandingFeatures } from "@/components/landing-features"
import { LandingHero } from "@/components/landing-hero"
import { LandingHowItWorks } from "@/components/landing-how-it-works"
import { PageBackground } from "@/components/page-background"
import { Button } from "@/components/ui/button"

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" })

export default function Home() {
  return (
    <PageBackground className={interTight.variable}>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12 md:space-y-16">
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />

        <section className="rounded-3xl border border-border bg-card/60 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-primary">Pricing</p>
              <h2
                className="text-2xl font-semibold"
                style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}
              >
                Simple, transparent credits
              </h2>
              <p className="text-sm text-muted-foreground">
                Preview plans and find the right package for your LinkedIn content goals.
              </p>
            </div>
            <Button variant="secondary" className="mt-2 md:mt-0" asChild>
              <a href="/pricing">View pricing</a>
            </Button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {["Starter", "Basic", "Pro"].map((plan) => (
              <div key={plan} className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}>
                    {plan}
                  </h3>
                  <span className="text-xs rounded-full bg-primary/10 px-2 py-1 text-primary">Popular</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan === "Starter"
                    ? "Quick experiments and testing new angles"
                    : plan === "Basic"
                      ? "Weekly posting cadence with ready-to-go templates"
                      : "Teams and creators publishing consistently"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </PageBackground>
  )
}
