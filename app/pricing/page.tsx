"use client"

import { Check } from "lucide-react"
import { Inter_Tight } from "next/font/google"
import { Header } from "@/components/header"
import { PageBackground } from "@/components/page-background"

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" })

const pricingPlans = [
  {
    name: "Starter",
    price: 9,
    credits: 5,
    features: [
      "5 carousel generations",
      "LinkedIn, Instagram, Telegram, Threads",
      "High-quality slide exports",
      "AI-powered content writing",
    ],
    popular: false,
  },
  {
    name: "Basic",
    price: 19,
    credits: 20,
    features: [
      "20 carousel generations",
      "LinkedIn, Instagram, Telegram, Threads",
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
    features: [
      "50 carousel generations",
      "LinkedIn, Instagram, Telegram, Threads",
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
      "One credit equals one AI-generated carousel. Each carousel includes 8-10 professional slides with hooks, insights, and call-to-actions.",
  },
  {
    question: "Do credits expire?",
    answer:
      "No, your credits never expire. Use them whenever you need to create engaging carousel content for your social media.",
  },
  {
    question: "Which platforms are supported?",
    answer:
      "cropdot generates carousels optimized for LinkedIn, Instagram, Telegram, and Threads. Each platform gets the perfect dimensions and formatting.",
  },
  {
    question: "Can I purchase more credits later?",
    answer:
      "Yes! You can purchase additional credit packages at any time. Your new credits will be added to your existing balance.",
  },
  {
    question: "How long does it take to generate a carousel?",
    answer:
      "Carousel generation typically takes 15-30 seconds. Our AI crafts compelling copy, structures your slides, and delivers ready-to-post content instantly.",
  },
  {
    question: "Can I edit the generated content?",
    answer:
      "After generation, you can edit any slide text, reorder slides, or regenerate specific parts until you're happy with the result.",
  },
  {
    question: "What makes cropdot different?",
    answer:
      "cropdot uses advanced AI to create carousel content that follows proven engagement patterns - starting with hooks, building context, delivering value, and ending with strong CTAs.",
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
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Title section */}
        <div className="text-center mb-16">
          <h1
            className="text-3xl md:text-4xl font-semibold mb-4 bg-clip-text text-transparent"
            style={{
              fontFamily: "var(--font-inter-tight), sans-serif",
              backgroundImage: "linear-gradient(to bottom, #ffffff, #888888)",
            }}
          >
            Simple, transparent pricing
          </h1>
          <p className="text-white/50 text-base">Buy credits and create engaging carousel content instantly.</p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl p-6 ${plan.popular ? "bg-[#1a1a1a]" : "bg-transparent"}`}
            >
              {plan.popular && (
                <div
                  className="absolute -inset-[1px] rounded-xl opacity-75 blur-[1px] -z-10"
                  style={{
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
                    backgroundSize: "300% 100%",
                    animation: "borderRun 3s linear infinite",
                  }}
                />
              )}

              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/20">
                    Most popular
                  </span>
                </div>
              )}

              <h3 className="text-lg font-medium mb-2" style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}>
                {plan.name}
              </h3>

              <div className="mb-6">
                <span className="text-4xl font-semibold" style={{ fontFamily: "var(--font-inter-tight), sans-serif" }}>
                  ${plan.price}
                </span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-white/70">
                    <Check className="w-4 h-4 text-white/50 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  plan.popular
                    ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    : "bg-white/5 text-white/80 hover:bg-white/10 border border-white/10"
                }`}
              >
                Get started
              </button>
            </div>
          ))}
        </div>

        {/* FAQ section */}
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-semibold mb-12 text-center bg-clip-text text-transparent"
            style={{
              fontFamily: "var(--font-inter-tight), sans-serif",
              backgroundImage: "linear-gradient(to bottom, #ffffff, #888888)",
            }}
          >
            Frequently asked questions
          </h2>

          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-base font-medium mb-2 text-white">{faq.question}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </PageBackground>
  )
}
