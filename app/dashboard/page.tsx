"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CarouselGenerator } from "@/components/carousel-generator"
import { ErrorBoundary } from "@/components/error-boundary"
import { Header } from "@/components/header"
import { PageBackground } from "@/components/page-background"
import { isAuthenticated } from "@/lib/auth"

export default function DashboardPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    const authenticated = isAuthenticated()
    setAuthed(authenticated)

    if (!authenticated) {
      router.replace("/")
    }
  }, [router])

  if (!authed) {
    return null
  }

  return (
    <PageBackground>
      <Header subtitle="Dashboard" />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <ErrorBoundary componentName="DashboardPage">
          <CarouselGenerator />
        </ErrorBoundary>
      </main>
    </PageBackground>
  )
}
