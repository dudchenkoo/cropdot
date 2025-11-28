import { CarouselGenerator } from "@/components/carousel-generator"
import { ErrorBoundary } from "@/components/error-boundary"
import { PageBackground } from "@/components/page-background"

export default function Home() {
  return (
    <PageBackground>
      <ErrorBoundary componentName="HomePage">
        <CarouselGenerator />
      </ErrorBoundary>
    </PageBackground>
  )
}
