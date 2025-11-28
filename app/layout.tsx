import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Roboto, Open_Sans, Montserrat, Poppins, Lato } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-roboto" })
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-poppins" })
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato" })

// Updated metadata for carousel generator app
export const metadata: Metadata = {
  title: "cropdot - LinkedIn Content Creator | High-Performing Posts in Seconds",
  description: "Create high-performing LinkedIn content in just a couple clicks. Our LinkedIn specialization helps you drive engagement and results.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${roboto.variable} ${openSans.variable} ${montserrat.variable} ${poppins.variable} ${lato.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
