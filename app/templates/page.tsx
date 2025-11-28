"use client"

import Link from "next/link"
import { Inter_Tight } from "next/font/google"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBackground } from "@/components/page-background"
import { templates, type Template } from "@/lib/templates"
import { getPatternBackground } from "@/lib/helpers"
import { cn } from "@/lib/utils"

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" })

export default function TemplatesPage() {

  const renderTemplatePreview = (template: Template) => {
    return (
      <div 
        className="aspect-[4/5] relative overflow-hidden rounded-t-lg"
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
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1
            className="text-3xl md:text-4xl font-semibold mb-4 bg-clip-text text-transparent"
            style={{
              fontFamily: "var(--font-inter-tight), sans-serif",
              backgroundImage: "linear-gradient(to bottom, #ffffff, #888888)",
            }}
          >
            LinkedIn Post Templates
          </h1>
          <p className="text-sm text-white/60 max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates to create high-performing LinkedIn content. 
            Each template is optimized for maximum engagement and results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/templates/${template.id}`}
              className="group relative block cursor-pointer"
            >
              {/* Animated gradient border wrapper - only visible on hover */}
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
                {/* Template Preview */}
                <div className="overflow-hidden">
                  {renderTemplatePreview(template)}
                </div>
                
                {/* Template Info */}
                <div className="p-4 border-t border-white/10 bg-background/80 backdrop-blur-sm group-hover:bg-background/90 transition-colors">
                  <div className="font-medium text-sm mb-1 text-white">{template.name}</div>
                  <div className="text-xs text-white/50 group-hover:text-white/70 transition-colors">{template.description}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-white/40">
            All templates are optimized for LinkedIn and designed to maximize engagement and performance.
          </p>
        </div>
      </main>

      <Footer />
    </PageBackground>
  )
}

