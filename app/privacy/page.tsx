"use client"

import { Inter_Tight } from "next/font/google"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBackground } from "@/components/page-background"

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" })

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          
          <p className="text-sm text-white/60 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-white/80">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="text-sm leading-relaxed">
                At cropdot, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you use our LinkedIn content creation service. Please read this 
                policy carefully to understand our practices regarding your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Information We Collect</h2>
              <p className="text-sm leading-relaxed mb-3">
                We collect information that you provide directly to us and information that is automatically collected when 
                you use our service:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed ml-4">
                <li><strong>Account Information:</strong> Email address, username, and password when you create an account</li>
                <li><strong>Content Data:</strong> LinkedIn posts and carousel content you create using our service</li>
                <li><strong>Usage Data:</strong> Information about how you use our service, including features accessed and time spent</li>
                <li><strong>Payment Information:</strong> Billing details processed through secure third-party payment processors</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <p className="text-sm leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed ml-4">
                <li>Provide, maintain, and improve our LinkedIn content creation service</li>
                <li>Process your transactions and manage your account</li>
                <li>Send you service-related communications and updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Analyze usage patterns to improve our AI models and service quality</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Comply with legal obligations and enforce our terms of service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Data Storage and Security</h2>
              <p className="text-sm leading-relaxed mb-3">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed ml-4">
                <li>Data is stored locally in your browser for saved LinkedIn posts</li>
                <li>We use encryption to protect data in transit</li>
                <li>Access to your data is restricted to authorized personnel only</li>
                <li>We regularly review and update our security practices</li>
              </ul>
              <p className="text-sm leading-relaxed mt-3">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive 
                to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-sm leading-relaxed mb-3">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed ml-4">
                <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (e.g., payment processing, analytics)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to respond to legal process</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you have given us explicit permission to share your information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="text-sm leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. 
                Cookies are files with a small amount of data that are stored on your device. You can instruct your browser to 
                refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may 
                not be able to use some portions of our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Your Rights and Choices</h2>
              <p className="text-sm leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed ml-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Data portability (receive your data in a structured format)</li>
                <li>Withdraw consent at any time where we rely on consent to process your data</li>
              </ul>
              <p className="text-sm leading-relaxed mt-3">
                To exercise these rights, please contact us at support@cropdot.ai.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Children's Privacy</h2>
              <p className="text-sm leading-relaxed">
                Our service is not intended for children under the age of 13. We do not knowingly collect personal information 
                from children under 13. If you are a parent or guardian and believe your child has provided us with personal 
                information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. International Data Transfers</h2>
              <p className="text-sm leading-relaxed">
                Your information may be transferred to and maintained on computers located outside of your state, province, 
                country, or other governmental jurisdiction where data protection laws may differ. By using our service, you 
                consent to the transfer of your information to these facilities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-sm leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy 
                Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">11. Contact Us</h2>
              <p className="text-sm leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at support@cropdot.ai.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </PageBackground>
  )
}

