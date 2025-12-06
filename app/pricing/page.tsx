"use client"

import { Check, Sparkles } from "lucide-react"
import { Inter_Tight } from "next/font/google"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBackground } from "@/components/page-background"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { addCoins } from "@/lib/coins"
import { useCoins } from "@/hooks/use-coins"
import { toast } from "sonner"

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" })

const subscriptionPlans = [
  {
    name: "Starter",
    monthlyPrice: 5,
    carouselsPerMonth: 5,
    coins: 10,
    features: [
      "5 carousels per month",
      "Perfect for testing and experimentation",
      "High-quality LinkedIn-optimized content",
      "Export to PDF and images",
    ],
    popular: false,
  },
  {
    name: "Creator",
    monthlyPrice: 12,
    carouselsPerMonth: 20,
    coins: 40,
    features: [
      "20 carousels per month",
      "Ideal for regular content creators",
      "LinkedIn-optimized writing",
      "Priority generation queue",
      "Export-ready carousels",
    ],
    popular: true,
    savings: "Most Popular",
  },
  {
    name: "Pro",
    monthlyPrice: 25,
    carouselsPerMonth: 40,
    coins: 100,
    features: [
      "40 carousels per month",
      "For advanced creators and agencies",
      "Highest quality content",
      "Team-friendly for frequent posting",
      "Priority support",
      "Advanced customization options",
    ],
    popular: false,
  },
]

const faqs = [
  {
    question: "How does the subscription work?",
    answer:
      "Each subscription plan gives you a monthly limit of carousel generations. You receive coins equal to your plan's limit. Each carousel generation uses coins from your balance. Your coins reset monthly with your subscription renewal.",
  },
  {
    question: "Do unused carousels roll over to next month?",
    answer:
      "No, your monthly carousel limit resets each billing cycle. This ensures fair usage and helps us maintain our 99%+ margin. Use your carousels throughout the month to maximize value.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes! You can upgrade or downgrade your subscription at any time. When upgrading, you'll get immediate access to the higher plan. When downgrading, changes take effect at your next billing cycle.",
  },
  {
    question: "What happens if I exceed my monthly limit?",
    answer:
      "If you run out of coins before the end of your billing cycle, you can upgrade to a higher plan or wait until your next billing cycle when your coins reset. We'll notify you when you're running low.",
  },
  {
    question: "How long does it take to generate a carousel?",
    answer:
      "Create high-performing LinkedIn carousels in just a couple clicks. Our LinkedIn-specialized AI crafts optimized content in seconds, delivering complete carousels (Hook → Slides → CTA) designed for maximum performance.",
  },
  {
    question: "Can I edit the generated content?",
    answer:
      "Yes! After generation, you can edit any slide text, reorder slides, customize styling, or regenerate specific slides until you're happy with the result. Full editing control is included in all plans.",
  },
  {
    question: "Which platforms are supported?",
    answer:
      "cropdot specializes exclusively in LinkedIn. Our platform is built specifically for creating high-performing LinkedIn content that drives engagement and results. LinkedIn is our expertise.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, you can cancel your subscription at any time. Your subscription will remain active until the end of your current billing period. You'll retain access to all features and your remaining coins until then.",
  },
]

export default function PricingPage() {
  const { coins, refreshCoins } = useCoins()

  const handlePurchase = (packageName: string, coinsToAdd: number) => {
    const newBalance = addCoins(coinsToAdd)
    refreshCoins()
    toast.success("Coins added", {
      description: `${coinsToAdd} coin${coinsToAdd === 1 ? "" : "s"} from ${packageName} added. You now have ${newBalance} coin${newBalance === 1 ? "" : "s"}.`,
    })
  }

  return (
    <PageBackground className={interTight.variable}>
      <style jsx>{`
        @keyframes borderRun {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>

      <Header />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        {/* Title section */}
        <div className="text-center mb-8 md:mb-12">
          <h1
            className="text-3xl md:text-4xl font-semibold mb-2 bg-clip-text text-transparent"
            style={{
              fontFamily: "var(--font-lora), serif",
              backgroundImage: "linear-gradient(to bottom, #ffffff, #888888)",
            }}
          >
            Choose Your Plan
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Subscribe to get monthly carousel generation limits. Each plan includes coins for AI-powered LinkedIn carousel creation.
          </p>
          <p className="text-xs text-muted-foreground mt-2">Current balance: {coins} coin{coins === 1 ? "" : "s"}</p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-24">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative",
                plan.popular && "md:-mt-4 md:mb-4"
              )}
            >
              {plan.popular ? (
                <div className="relative p-[2px] rounded-xl" style={{
                  background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
                  backgroundSize: "300% 100%",
                  animation: "borderRun 3s linear infinite",
                }}>
                  <Card className="relative h-full flex flex-col border-0 bg-card shadow-lg scale-105">
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 backdrop-blur-sm">
                          <Sparkles className="w-3 h-3" />
                          Most popular
                        </span>
                      </div>
                    )}

                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl" style={{ fontFamily: "var(--font-lora), serif" }}>
                        {plan.name}
                      </CardTitle>
                      <div className="mt-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-lora), serif" }}>
                            ${plan.monthlyPrice}
                          </span>
                          <span className="text-lg text-muted-foreground">/mo</span>
                        </div>
                        <CardDescription className="mt-1.5 text-xs">
                          {plan.carouselsPerMonth} carousels per month • {plan.coins} coins included
                        </CardDescription>
                        {plan.savings && (
                          <div className="mt-1.5">
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                              {plan.savings}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 py-0">
                      <ul className="space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-foreground leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="pt-4">
                      <div className="relative group w-full">
                        {/* Animated gradient border */}
                        <div
                          className="absolute -inset-[2px] rounded-lg opacity-50 blur-sm group-hover:opacity-75 transition-opacity"
                          style={{
                            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
                            backgroundSize: "300% 100%",
                            animation: "borderRun 3s linear infinite",
                          }}
                        />
                        {/* Button */}
                        <Button
                          onClick={() => handlePurchase(plan.name, plan.coins)}
                          className="relative w-full h-10 text-sm font-medium text-white"
                          style={{
                            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
                            backgroundSize: "300% 100%",
                            animation: "borderRun 3s linear infinite",
                          }}
                        >
                          Subscribe
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              ) : (
                <Card className="relative h-full flex flex-col border-2 border-border hover:border-primary/30 hover:shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl" style={{ fontFamily: "var(--font-lora), serif" }}>
                      {plan.name}
                    </CardTitle>
                    <div className="mt-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-lora), serif" }}>
                          ${plan.monthlyPrice}
                        </span>
                        <span className="text-lg text-muted-foreground">/mo</span>
                      </div>
                      <CardDescription className="mt-1.5 text-xs">
                        {plan.carouselsPerMonth} carousels per month • {plan.coins} coins included
                      </CardDescription>
                      {plan.savings && (
                        <div className="mt-1.5">
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {plan.savings}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 py-0">
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-foreground leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-4">
                    <Button
                      variant="outline"
                      className="w-full h-10 text-sm font-medium"
                      onClick={() => handlePurchase(plan.name, plan.coins)}
                    >
                      Subscribe
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          ))}
        </div>

        {/* FAQ section */}
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-semibold mb-12 text-center bg-clip-text text-transparent"
            style={{
              fontFamily: "var(--font-lora), serif",
              backgroundImage: "linear-gradient(to bottom, #ffffff, #888888)",
            }}
          >
            Frequently asked questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <h3 className="text-base font-semibold mb-2 text-foreground">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </PageBackground>
  )
}
