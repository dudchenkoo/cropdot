"use client"

import { Inter_Tight } from "next/font/google"
import { Mail, MessageCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBackground } from "@/components/page-background"

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" })

export default function ContactPage() {
  return (
    <PageBackground className={interTight.variable}>
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-invert max-w-none">
          <h1
            className="text-3xl md:text-4xl font-semibold mb-8 bg-clip-text text-transparent"
            style={{
              fontFamily: "var(--font-inter-tight), sans-serif",
              backgroundImage: "linear-gradient(to bottom, #ffffff, #888888)",
            }}
          >
            Contact Us
          </h1>
          
          <div className="space-y-8 text-white/80">
            <section>
              <p className="text-sm leading-relaxed mb-6">
                We'd love to hear from you! Whether you have a question, feedback, or need support, 
                we're here to help. Reach out to us through any of the following channels.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-background/50">
                <Mail className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">Email Support</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    For general inquiries, support, or feedback, send us an email:
                  </p>
                  <a 
                    href="mailto:support@cropdot.ai" 
                    className="text-sm text-primary hover:underline cursor-pointer"
                  >
                    support@cropdot.ai
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-background/50">
                <MessageCircle className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">Response Time</h2>
                  <p className="text-sm text-muted-foreground">
                    We typically respond to all inquiries within 24-48 hours during business days. 
                    For urgent matters, please include "URGENT" in your subject line.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium text-white mb-2">How do I get started?</h3>
                  <p className="text-sm text-muted-foreground">
                    Simply click "Start generating" on the homepage, enter your topic and goal, 
                    and let our AI create high-performing LinkedIn content for you.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-medium text-white mb-2">How do credits work?</h3>
                  <p className="text-sm text-muted-foreground">
                    Each credit allows you to generate one LinkedIn post. Credits don't expire, 
                    so you can use them whenever you need. Check out our pricing page for more details.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-medium text-white mb-2">Can I customize the generated content?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes! After generation, you can edit all slides, change text, adjust layouts, 
                    and customize colors to match your brand.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </PageBackground>
  )
}

