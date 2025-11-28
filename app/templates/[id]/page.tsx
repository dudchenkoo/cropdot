"use client"

import { useRouter, useParams } from "next/navigation"
import { Inter_Tight } from "next/font/google"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { SlideCard } from "@/components/slide-card"
import { PageBackground } from "@/components/page-background"
import { templates, type Template } from "@/lib/templates"
import { getPatternBackground, generateLayerId } from "@/lib/helpers"
import type { Slide, CarouselData } from "@/lib/carousel-types"

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" })

export default function TemplatePage() {
  const router = useRouter()
  const params = useParams()
  const templateId = params.id as string
  
  const template = templates.find((t) => t.id === templateId)
  const otherTemplates = templates.filter((t) => t.id !== templateId)

  if (!template) {
    router.push("/templates")
    return null
  }

  const handleStartUsing = () => {
    if (typeof window === "undefined") return
    
    // Create a basic carousel with default slides
    const defaultSlides: Slide[] = [
      {
        index: 1,
        type: "title",
        body: "",
        content: "",
        size: "4:5",
        layers: [
          {
            id: generateLayerId(),
            type: "heading",
            content: "Your Title Here",
            visible: true,
          },
        ],
        layout: {
          padding: 40,
          horizontalAlign: "center",
          verticalAlign: "center",
        },
      },
      {
        index: 2,
        type: "text",
        body: "",
        content: "",
        size: "4:5",
        layers: [
          {
            id: generateLayerId(),
            type: "heading",
            content: "Heading",
            visible: true,
          },
          {
            id: generateLayerId(),
            type: "body",
            content: "Add your content here",
            visible: true,
          },
        ],
        layout: {
          padding: 40,
          horizontalAlign: "left",
          verticalAlign: "top",
        },
      },
      {
        index: 3,
        type: "text",
        body: "",
        content: "",
        size: "4:5",
        layers: [
          {
            id: generateLayerId(),
            type: "heading",
            content: "Another Slide",
            visible: true,
          },
          {
            id: generateLayerId(),
            type: "body",
            content: "Customize this content",
            visible: true,
          },
        ],
        layout: {
          padding: 40,
          horizontalAlign: "left",
          verticalAlign: "top",
        },
      },
    ]

    // Apply template to all slides
    const slidesWithTemplate = defaultSlides.map((slide) => template.apply(slide))

    // Create carousel data
    const carouselData: CarouselData = {
      topic: template.name,
      platform: "linkedin",
      slides: slidesWithTemplate,
      summary: `Start creating with the ${template.name} template`,
    }

    // Store in localStorage to load directly into canvas
    localStorage.setItem("templateCarouselData", JSON.stringify(carouselData))
    
    // Navigate to home page
    router.push("/")
  }

  // Create mock slides to show template preview
  const createMockSlides = (template: Template): Slide[] => {
    const mockSlides: Slide[] = [
      {
        index: 1,
        type: "title",
        body: "",
        content: "",
        size: "4:5",
        background: {
          type: "color",
          color: template.preview.backgroundColor,
          accentColor: template.preview.accentColor,
          pattern: template.preview.pattern ? {
            enabled: true,
            type: template.preview.pattern,
            opacity: 0.2,
            opacityEnabled: true,
            scale: 1,
            scaleEnabled: false,
          } : undefined,
        },
        layout: {
          padding: 40,
          horizontalAlign: template.preview.layout === "centered" ? "center" : template.preview.layout === "top" ? "left" : "left",
          verticalAlign: template.preview.layout === "centered" ? "center" : template.preview.layout === "top" ? "top" : "stretch",
        },
        layers: [
          {
            id: "1",
            type: "heading",
            content: "Slide 1",
            visible: true,
          },
        ],
      },
      {
        index: 2,
        type: "text",
        body: "",
        content: "",
        size: "4:5",
        background: {
          type: "color",
          color: template.preview.backgroundColor,
          accentColor: template.preview.accentColor,
          pattern: template.preview.pattern ? {
            enabled: true,
            type: template.preview.pattern,
            opacity: 0.2,
            opacityEnabled: true,
            scale: 1,
            scaleEnabled: false,
          } : undefined,
        },
        layout: {
          padding: 40,
          horizontalAlign: template.preview.layout === "centered" ? "center" : template.preview.layout === "top" ? "left" : "left",
          verticalAlign: template.preview.layout === "centered" ? "center" : template.preview.layout === "top" ? "top" : "stretch",
        },
        layers: [
          {
            id: "2",
            type: "heading",
            content: "Slide 2",
            visible: true,
          },
        ],
      },
      {
        index: 3,
        type: "text",
        body: "",
        content: "",
        size: "4:5",
        background: {
          type: "color",
          color: template.preview.backgroundColor,
          accentColor: template.preview.accentColor,
          pattern: template.preview.pattern ? {
            enabled: true,
            type: template.preview.pattern,
            opacity: 0.2,
            opacityEnabled: true,
            scale: 1,
            scaleEnabled: false,
          } : undefined,
        },
        layout: {
          padding: 40,
          horizontalAlign: template.preview.layout === "centered" ? "center" : template.preview.layout === "top" ? "left" : "left",
          verticalAlign: template.preview.layout === "centered" ? "center" : template.preview.layout === "top" ? "top" : "stretch",
        },
        layers: [
          {
            id: "3",
            type: "heading",
            content: "Slide 3",
            visible: true,
          },
        ],
      },
    ]
    return mockSlides.map((slide) => template.apply(slide))
  }

  const mockSlides = createMockSlides(template)

  const renderTemplatePreview = (template: Template) => {
    return (
      <div 
        className="aspect-[4/5] relative overflow-hidden rounded-lg"
        style={{
          backgroundColor: template.preview.backgroundColor,
          backgroundImage: template.preview.pattern 
            ? getPatternBackground(
                template.preview.pattern,
                template.preview.accentColor,
                0.2
              )
            : undefined,
          backgroundSize: template.preview.pattern ? "20px 20px" : undefined,
        }}
      >
        {/* Layout Preview */}
        {template.preview.layout === "centered" && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-3/4 space-y-2">
              <div className="h-2 bg-white/30 rounded" style={{ width: "80%" }} />
              <div className="h-2 bg-white/20 rounded" style={{ width: "60%" }} />
            </div>
          </div>
        )}
        {template.preview.layout === "top" && (
          <div className="absolute top-8 left-8 right-8 space-y-2">
            <div className="h-2 bg-white/30 rounded" style={{ width: "90%" }} />
            <div className="h-2 bg-white/20 rounded" style={{ width: "70%" }} />
          </div>
        )}
        {template.preview.layout === "split" && (
          <div className="absolute inset-0 flex">
            <div className="flex-1 p-4 space-y-2">
              <div className="h-2 bg-white/30 rounded" />
              <div className="h-2 bg-white/20 rounded" />
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex-1 p-4 space-y-2">
              <div className="h-2 bg-white/20 rounded" />
              <div className="h-2 bg-white/10 rounded" />
            </div>
          </div>
        )}
        {template.preview.layout === "minimal" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2/3 h-1 bg-white/20 rounded" />
          </div>
        )}
      </div>
    )
  }

  return (
    <PageBackground className={interTight.variable}>
      <div className="flex h-screen overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          topic={template.name}
          onBack={() => router.push("/templates")}
          onLogoClick={() => router.push("/")}
        />

          {/* Template Title Section - similar to dashboard */}
          <div className="border-b border-border px-6 py-4 bg-background">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/templates")}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                  aria-label="Back to templates"
                >
                  <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <h1 className="text-lg font-semibold text-foreground">{template.name}</h1>
                <span className="text-sm text-muted-foreground">{mockSlides.length} slides</span>
              </div>
              <div className="relative">
                {/* Animated gradient border */}
                <div
                  className="absolute -inset-[2px] rounded-lg opacity-75 blur-[2px]"
                  style={{
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
                    backgroundSize: "300% 100%",
                    animation: "borderRun 3s linear infinite",
                  }}
                />
                {/* Button */}
                <button
                  aria-label="Start using this template"
                  onClick={handleStartUsing}
                  className="relative px-5 py-2 rounded-lg bg-background text-foreground text-sm font-medium cursor-pointer hover:bg-secondary transition-colors"
                >
                  Start using
                </button>
              </div>
            </div>
          </div>

          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* All Slides Preview */}
              <div className="mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockSlides.map((slide, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-full max-w-sm">
                        <SlideCard
                          slide={slide}
                          index={index}
                          total={mockSlides.length}
                          compact={true}
                        />
                        <div className="mt-2 text-center">
                          <span className="text-xs text-muted-foreground">Slide {index + 1}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Templates Section */}
              {otherTemplates.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Other Templates</h2>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {otherTemplates.slice(0, 6).map((otherTemplate) => (
                      <button
                        key={otherTemplate.id}
                        onClick={() => router.push(`/templates/${otherTemplate.id}`)}
                        className="group relative text-left cursor-pointer w-full"
                      >
                        {/* Animated gradient border - only visible on hover */}
                        <div
                          className="absolute -inset-[0.5px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                          style={{
                            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
                            backgroundSize: "300% 100%",
                            animation: "borderRun 3s linear infinite",
                          }}
                        />
                        
                        {/* Card content - always visible */}
                        <div className="relative rounded-lg border border-white/10 group-hover:border-transparent bg-white/5 group-hover:bg-white/15 transition-colors overflow-hidden">
                          <div 
                            className="aspect-[4/5] relative overflow-hidden"
                            style={{
                              backgroundColor: otherTemplate.preview.backgroundColor,
                              backgroundImage: otherTemplate.preview.pattern 
                                ? getPatternBackground(
                                    otherTemplate.preview.pattern,
                                    otherTemplate.preview.accentColor,
                                    0.2
                                  )
                                : undefined,
                              backgroundSize: otherTemplate.preview.pattern ? "20px 20px" : undefined,
                            }}
                          >
                            {/* Minimal layout preview */}
                            {otherTemplate.preview.layout === "centered" && (
                              <div className="absolute inset-0 flex items-center justify-center p-2">
                                <div className="w-2/3 h-1 bg-white/20 rounded" />
                              </div>
                            )}
                            {otherTemplate.preview.layout === "top" && (
                              <div className="absolute top-2 left-2 right-2">
                                <div className="h-0.5 bg-white/20 rounded" />
                              </div>
                            )}
                            {otherTemplate.preview.layout === "split" && (
                              <div className="absolute inset-0 flex">
                                <div className="flex-1 p-1">
                                  <div className="h-0.5 bg-white/20 rounded mb-1" />
                                </div>
                                <div className="w-px bg-white/10" />
                                <div className="flex-1 p-1">
                                  <div className="h-0.5 bg-white/10 rounded" />
                                </div>
                              </div>
                            )}
                            {otherTemplate.preview.layout === "minimal" && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-1/2 h-0.5 bg-white/20 rounded" />
                              </div>
                            )}
                          </div>
                          <div className="p-2 border-t border-white/10 bg-background/80 backdrop-blur-sm group-hover:bg-background/90 transition-colors">
                            <div className="font-medium text-xs text-white truncate">{otherTemplate.name}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </PageBackground>
  )
}

