import { CarouselGenerator } from "@/components/carousel-generator"
import { ErrorBoundary } from "@/components/error-boundary"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ErrorBoundary componentName="HomePage">
        <CarouselGenerator />
      </ErrorBoundary>
    </main>
  )
}
