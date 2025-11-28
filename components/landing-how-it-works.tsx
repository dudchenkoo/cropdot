const steps = [
  {
    title: "Sign in with Google",
    description: "Connect with Google to sync your profile basics and personalize recommendations.",
  },
  {
    title: "Create your content",
    description: "Choose a template, describe your topic, and let the AI craft a complete carousel for LinkedIn.",
  },
  {
    title: "Export and publish",
    description: "Download slides, copy captions, and share directly to LinkedIn with confidence.",
  },
]

export function LandingHowItWorks() {
  return (
    <section className="rounded-3xl border border-border bg-card/60 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">How it works</p>
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}
          >
            From sign-in to publish in 3 steps
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-xl">
          A guided flow that keeps you focused on the message while we handle structure, pacing, and formatting.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="relative rounded-2xl border border-border/70 bg-background/60 p-5">
            <div className="absolute -top-3 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold">
              {index + 1}
            </div>
            <div className="mt-6 space-y-2">
              <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}>
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
