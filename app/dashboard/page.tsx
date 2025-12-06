"use client"

import dynamic from "next/dynamic"
import { ErrorBoundary } from "@/components/error-boundary"

const CarouselGenerator = dynamic(() => import("@/components/carousel-generator").then(mod => ({ default: mod.CarouselGenerator })), {
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  ),
  ssr: false,
})

export default function DashboardPage() {
  return (
    <ErrorBoundary componentName="DashboardPage">
      <CarouselGenerator />
    </ErrorBoundary>
  )
}
