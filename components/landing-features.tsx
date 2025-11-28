import { LayoutTemplate, Share2, Sparkles, Linkedin } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI-powered generation",
    description: "Turn a topic into a complete LinkedIn carousel with optimized hooks, headlines, and slide copy.",
  },
  {
    icon: LayoutTemplate,
    title: "Proven templates",
    description: "Start fast with layouts that are already performing on LinkedIn. Swap colors and brand details instantly.",
  },
  {
    icon: Share2,
    title: "Export options",
    description: "Download slides, copy text, or export a ready-to-publish PDF for your LinkedIn post in seconds.",
  },
  {
    icon: Linkedin,
    title: "LinkedIn-optimized",
    description: "Everything is tuned for LinkedIn: pacing, CTA placement, and formatting that boosts reach.",
  },
]

export function LandingFeatures() {
  return (
    <section className="space-y-4">
      <div className="space-y-2 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">Why creators choose cropdot</p>
        <h2
          className="text-2xl md:text-3xl font-semibold"
          style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}
        >
          Build magnetic carousels in record time
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
          Everything you need to go from idea to LinkedIn-ready in one flow.
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card/70 p-5 shadow-sm hover:-translate-y-1 transition-transform"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <feature.icon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}>
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
