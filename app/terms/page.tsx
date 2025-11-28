"use client"

import { Inter_Tight } from "next/font/google"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBackground } from "@/components/page-background"

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" })

export default function TermsPage() {
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
            Terms of Service
          </h1>
          
          <p className="text-sm text-white/60 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-white/80">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-sm leading-relaxed">
                By accessing and using cropdot, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p className="text-sm leading-relaxed">
                cropdot is a specialized platform for creating high-performing LinkedIn content. Our service uses AI to generate 
                LinkedIn-optimized posts that are designed to drive engagement and results. We focus exclusively on LinkedIn 
                content creation to provide the best possible results for our users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. User Accounts and Credits</h2>
              <p className="text-sm leading-relaxed mb-3">
                To use cropdot, you may need to create an account and purchase credits. Each credit allows you to generate 
                one high-performing LinkedIn post.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed ml-4">
                <li>Credits are non-refundable once used</li>
                <li>Unused credits do not expire</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree to notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Content and Intellectual Property</h2>
              <p className="text-sm leading-relaxed mb-3">
                When you use cropdot to generate LinkedIn content:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed ml-4">
                <li>You own the content generated for your use</li>
                <li>You are responsible for the content you create and publish</li>
                <li>You grant cropdot a license to use anonymized data to improve our services</li>
                <li>You agree not to use the service to create content that violates LinkedIn's terms of service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Prohibited Uses</h2>
              <p className="text-sm leading-relaxed mb-3">
                You agree not to use cropdot:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed ml-4">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Service Availability</h2>
              <p className="text-sm leading-relaxed">
                We strive to provide reliable service, but we do not guarantee that the service will be available at all times. 
                We reserve the right to modify, suspend, or discontinue the service at any time without notice. We are not liable 
                for any loss or damage resulting from service unavailability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Refund Policy</h2>
              <p className="text-sm leading-relaxed">
                We offer refunds within 24 hours of purchase if you haven't used any credits. Once credits are used, they are 
                non-refundable. To request a refund, please contact support@cropdot.ai.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
              <p className="text-sm leading-relaxed">
                cropdot shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including 
                without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use 
                of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Changes to Terms</h2>
              <p className="text-sm leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any material changes by updating 
                the "Last updated" date at the top of this page. Your continued use of the service after such changes constitutes 
                your acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Contact Information</h2>
              <p className="text-sm leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at support@cropdot.ai.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </PageBackground>
  )
}

