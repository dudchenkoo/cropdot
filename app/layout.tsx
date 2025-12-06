import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Roboto, Open_Sans, Montserrat, Poppins, Lato, Lora } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
  preload: true,
})
const lora = Lora({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"], 
  variable: "--font-lora",
  display: "swap",
  preload: true,
})
// Load carousel fonts with lower priority (preload: false)
const roboto = Roboto({ 
  subsets: ["latin"], 
  weight: ["400", "700"], 
  variable: "--font-roboto",
  display: "swap",
  preload: false,
})
const openSans = Open_Sans({ 
  subsets: ["latin"], 
  variable: "--font-open-sans",
  display: "swap",
  preload: false,
})
const montserrat = Montserrat({ 
  subsets: ["latin"], 
  variable: "--font-montserrat",
  display: "swap",
  preload: false,
})
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "700"], 
  variable: "--font-poppins",
  display: "swap",
  preload: false,
})
const lato = Lato({ 
  subsets: ["latin"], 
  weight: ["400", "700"], 
  variable: "--font-lato",
  display: "swap",
  preload: false,
})

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
      <body className={`${inter.variable} ${lora.variable} ${roboto.variable} ${openSans.variable} ${montserrat.variable} ${poppins.variable} ${lato.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
