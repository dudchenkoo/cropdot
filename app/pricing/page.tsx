"use client"

import { Check, Sparkles } from "lucide-react"
import { Inter_Tight } from "next/font/google"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBackground } from "@/components/page-background"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" })

const pricingPlans = [
  {
    name: "Starter",
    price: 9,
    credits: 5,
    pricePerCredit: 1.8,
    features: [
      "5 high-performing LinkedIn posts",
      "LinkedIn-optimized content",
      "High-quality slide exports",
      "AI-powered content writing",
    ],
    popular: false,
  },
  {
    name: "Basic",
    price: 19,
    credits: 20,
    pricePerCredit: 0.95,
    savings: "47% savings",
    features: [
      "20 high-performing LinkedIn posts",
      "LinkedIn carousel posts",
      "High-quality slide exports",
      "AI-powered content writing",
      "Priority generation queue",
    ],
    popular: true,
  },
  {
    name: "Pro",
    price: 29,
    credits: 50,
    pricePerCredit: 0.58,
    savings: "68% savings",
    features: [
      "50 high-performing LinkedIn posts",
      "LinkedIn carousel posts",
      "High-quality slide exports",
      "AI-powered content writing",
      "Priority generation queue",
      "Custom brand colors",
    ],
    popular: false,
  },
]

const faqs = [
  {
    question: "What is a credit?",
    answer:
      "One credit equals one high-performing LinkedIn post. Each post includes 8-10 optimized slides designed for maximum engagement and performance on LinkedIn.",
  },
  {
    question: "Do credits expire?",
    answer:
      "No, your credits never expire. Use them whenever you need to create high-performing LinkedIn content that drives engagement and results.",
  },
  {
    question: "Which platforms are supported?",
    answer:
      "cropdot specializes exclusively in LinkedIn. Our platform is built specifically for creating high-performing LinkedIn content that drives engagement and results. LinkedIn is our expertise.",
  },
  {
    question: "Can I purchase more credits later?",
    answer:
      "Yes! You can purchase additional credit packages at any time. Your new credits will be added to your existing balance.",
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
      "We offer refunds within 24 hours of purchase if you haven't used any credits. Please contact support@cropdot.ai for assistance.",
  },
]

export default function PricingPage() {
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
            Simple, transparent pricing
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Buy credits and create high-performing LinkedIn content in just a couple clicks.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-24">
          {pricingPlans.map((plan) => (
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
                          {plan.credits} credits • ${plan.pricePerCredit.toFixed(2)} per post
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
                          className="relative w-full h-10 text-sm font-medium text-white"
                          style={{
                            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
                            backgroundSize: "300% 100%",
                            animation: "borderRun 3s linear infinite",
                          }}
                        >
                          Get started
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
                        {plan.credits} credits • ${plan.pricePerCredit.toFixed(2)} per post
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
                    <Button variant="outline" className="w-full h-10 text-sm font-medium">
                      Get started
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
                    <p className="text-sm text-muted-foreground">Credits never expire</p>
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
