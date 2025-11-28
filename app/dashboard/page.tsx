"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CarouselGenerator } from "@/components/carousel-generator"
import { ErrorBoundary } from "@/components/error-boundary"
import { Header } from "@/components/header"
import { PageBackground } from "@/components/page-background"
import { useSession } from "next-auth/react"

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/")
    }
  }, [status, router])

  if (status === "loading" || !session) {
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
