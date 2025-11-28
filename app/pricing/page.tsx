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

const coinPackages = [
  {
    name: "Starter Pack",
    price: 9,
    coins: 10,
    pricePerCoin: 0.9,
    features: [
      "10 coins for AI generations",
      "Great for testing your first posts",
      "High-quality slide exports",
      "Use coins any time",
    ],
    popular: false,
  },
  {
    name: "Growth Pack",
    price: 19,
    coins: 30,
    pricePerCoin: 0.63,
    savings: "Best value",
    features: [
      "30 coins for LinkedIn carousel generations",
      "LinkedIn-optimized writing",
      "Priority generation queue",
      "Use coins across multiple projects",
    ],
    popular: true,
  },
  {
    name: "Pro Pack",
    price: 49,
    coins: 100,
    pricePerCoin: 0.49,
    savings: "Most coins",
    features: [
      "100 coins for power users",
      "Export-ready LinkedIn carousels",
      "Team-friendly for frequent posting",
      "Priority support",
    ],
    popular: false,
  },
]

const faqs = [
  {
    question: "What is a coin?",
    answer:
      "One coin equals one AI-powered carousel generation. Each generation includes 8-10 optimized slides designed for maximum engagement on LinkedIn.",
  },
  {
    question: "Do coins expire?",
    answer:
      "No, your coins never expire. Use them whenever you need to create high-performing LinkedIn content that drives engagement and results.",
  },
  {
    question: "Which platforms are supported?",
    answer:
      "cropdot specializes exclusively in LinkedIn. Our platform is built specifically for creating high-performing LinkedIn content that drives engagement and results. LinkedIn is our expertise.",
  },
  {
    question: "Can I purchase more coins later?",
    answer:
      "Yes! You can purchase additional coin packages at any time. Your new coins will be added to your existing balance.",
  },
  {
    question: "How long does it take to generate a LinkedIn post?",
    answer:
      "Create high-performing LinkedIn content in just a couple clicks. Our LinkedIn-specialized AI crafts optimized content in seconds, delivering posts designed for maximum performance.",
  },
  {
    question: "Can I edit the generated content?",
    answer:
      "After generation, you can edit any slide text, reorder slides, or regenerate specific parts until you're happy with the result.",
  },
  {
    question: "What makes cropdot different?",
    answer:
      "cropdot specializes exclusively in LinkedIn. Our platform is built for creating high-performing content that drives real results. We focus on LinkedIn performance optimization, not generic social media tools.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "We offer refunds within 24 hours of purchase if you haven't used any coins. Please contact support@cropdot.ai for assistance.",
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
              fontFamily: "var(--font-inter-tight), sans-serif",
              backgroundImage: "linear-gradient(to bottom, #ffffff, #888888)",
            }}
          >
            Buy coins and keep generating
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Purchase coins for fast, LinkedIn-ready carousels. Each generation costs 1 coin.
          </p>
          <p className="text-xs text-muted-foreground mt-2">Current balance: {coins} coin{coins === 1 ? "" : "s"}</p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-24">
          {coinPackages.map((plan) => (
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
                      <CardTitle className="text-xl" style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}>
                        {plan.name}
                      </CardTitle>
                      <div className="mt-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}>
                            ${plan.price}
                          </span>
                        </div>
                        <CardDescription className="mt-1.5 text-xs">
                          {plan.coins} coins • ${plan.pricePerCoin.toFixed(2)} per coin
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
                          Buy coins
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              ) : (
                <Card className="relative h-full flex flex-col border-2 border-border hover:border-primary/30 hover:shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl" style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}>
                      {plan.name}
                    </CardTitle>
                    <div className="mt-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}>
                          ${plan.price}
                        </span>
                      </div>
                      <CardDescription className="mt-1.5 text-xs">
                        {plan.coins} coins • ${plan.pricePerCoin.toFixed(2)} per coin
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
                      Buy coins
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          ))}
        </div>

        {/* Value proposition */}
        <div className="max-w-4xl mx-auto mb-24">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}>
                  Why choose cropdot?
                </h2>
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">10x</div>
                    <p className="text-sm text-muted-foreground">Faster content creation</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">100%</div>
                    <p className="text-sm text-muted-foreground">LinkedIn-focused</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">∞</div>
                    <p className="text-sm text-muted-foreground">Coins never expire</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ section */}
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-semibold mb-12 text-center bg-clip-text text-transparent"
            style={{
              fontFamily: "var(--font-inter-tight), sans-serif",
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
