"use client"

import { useState } from "react"
import type { CarouselData } from "@/lib/carousel-types"
import { SlideCard } from "./slide-card"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Layers, Square, Grid3x3, Plus, ChevronLeft, ChevronRight, Copy, Trash2, AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, AlignVerticalDistributeCenter, Shuffle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CarouselPreviewProps {
  data: CarouselData | null
  isLoading: boolean
  currentSlide?: number
  onSlideChange?: (index: number) => void
  onAddSlide?: (afterIndex: number) => void
  onDeleteSlide?: (index: number) => void
  onDuplicateSlide?: (index: number) => void
  onReorderSlides?: (fromIndex: number, toIndex: number) => void
  onCycleHorizontalAlign?: (index: number) => void
  onCycleVerticalAlign?: (index: number) => void
  onRandomBackgroundColor?: (index: number) => void
}

export function CarouselPreview({ data, isLoading, currentSlide: controlledSlide, onSlideChange, onAddSlide, onDeleteSlide, onDuplicateSlide, onReorderSlides, onCycleHorizontalAlign, onCycleVerticalAlign, onRandomBackgroundColor }: CarouselPreviewProps) {
  const [internalSlide, setInternalSlide] = useState(0)
  const [viewMode, setViewMode] = useState<"single" | "grid">("single")
  const [draggedSlideIndex, setDraggedSlideIndex] = useState<number | null>(null)
  const [hoveredDropIndex, setHoveredDropIndex] = useState<number | null>(null)
  
  // Use controlled slide if provided, otherwise use internal state
  const currentSlide = controlledSlide !== undefined ? controlledSlide : internalSlide
  const setCurrentSlide = (index: number) => {
    if (onSlideChange) {
      onSlideChange(index)
    } else {
      setInternalSlide(index)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-border rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
        <p className="mt-4 text-muted-foreground">Generating your carousel...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Layers className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No LinkedIn post yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Enter a topic to create high-performing LinkedIn content in just a couple clicks
        </p>
      </div>
    )
  }

  const slides = data.slides || []

  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={0}>
      <div className="relative">
        {/* Controls in top right corner */}
        <div className="absolute top-0 right-0 z-20 flex items-center gap-2">
          <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-background/95 backdrop-blur-sm">
            <Tooltip>
              <TooltipTrigger asChild>
          <Button
            variant={viewMode === "single" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8 hover:bg-accent hover:scale-105 transition-all"
            onClick={() => setViewMode("single")}
          >
                  <Square className="w-4 h-4" />
          </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Single view</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={viewMode === "grid" ? "secondary" : "ghost"} 
                  size="icon"
                  className="h-8 w-8 hover:bg-accent hover:scale-105 transition-all"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="w-4 h-4" />
          </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Grid view</p>
              </TooltipContent>
            </Tooltip>
        </div>
      </div>

      {viewMode === "single" ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="flex flex-col items-center gap-6">
            {/* Action buttons at the top */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-background/95 backdrop-blur-sm">
                <Tooltip>
                  <TooltipTrigger asChild>
            <Button
                      variant="ghost"
              size="icon"
                      className="h-8 w-8 hover:bg-accent hover:scale-105 transition-all"
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Previous slide</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
            <Button
                      variant="ghost"
              size="icon"
                      className="h-8 w-8 hover:bg-accent hover:scale-105 transition-all"
              onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === slides.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Next slide</p>
                  </TooltipContent>
                </Tooltip>
                {onDuplicateSlide && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-accent hover:scale-105 transition-all"
                        onClick={() => onDuplicateSlide(currentSlide)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Duplicate slide</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {onDeleteSlide && slides.length > 1 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 hover:scale-105 transition-all"
                        onClick={() => onDeleteSlide(currentSlide)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete slide</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 relative max-w-5xl mx-auto">
            {/* Previous Slide - left side */}
            {currentSlide > 0 ? (
              <div className="relative opacity-40 pointer-events-none">
                <SlideCard 
                  slide={slides[currentSlide - 1]} 
                  index={currentSlide - 1} 
                  total={slides.length}
                  onDelete={onDeleteSlide}
                  header={data.header}
                  footer={data.footer}
                />
              </div>
            ) : (
              <div className="w-80" />
            )}

            {/* Add Slide Button - between previous and current */}
            {onAddSlide && currentSlide > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onAddSlide(currentSlide - 1)}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-border flex items-center justify-center transition-all hover:scale-110 cursor-pointer z-10"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add slide</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Current Slide - center */}
            <div className="relative z-10" key={`slide-wrapper-${currentSlide}-${slides[currentSlide]?.layers?.map(l => `${l.id}-${l.style ? JSON.stringify(l.style) : 'no-style'}`).join('-') || ''}`}>
              <SlideCard 
                slide={slides[currentSlide]} 
                index={currentSlide} 
                total={slides.length}
                onDelete={onDeleteSlide}
                header={data.header}
                footer={data.footer}
              />
            </div>

            {/* Add Slide Button - between current and next */}
            {onAddSlide && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onAddSlide(currentSlide)}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-border flex items-center justify-center transition-all hover:scale-110 cursor-pointer z-10"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add slide</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Next Slide - right side */}
            {currentSlide < slides.length - 1 ? (
              <div className="relative opacity-40 pointer-events-none">
                <SlideCard 
                  slide={slides[currentSlide + 1]} 
                  index={currentSlide + 1} 
                  total={slides.length}
                  onDelete={onDeleteSlide}
                  header={data.header}
                  footer={data.footer}
                />
              </div>
            ) : (
              <div className="w-80" />
            )}
            </div>

            {/* Alignment and random color controls */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-background/95 backdrop-blur-sm">
                {/* Horizontal Alignment */}
                {onCycleHorizontalAlign && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-accent hover:scale-105 transition-all"
                        onClick={() => onCycleHorizontalAlign(currentSlide)}
                      >
                        {(() => {
                          const currentAlign = slides[currentSlide]?.layout?.horizontalAlign || "left"
                          if (currentAlign === "left") return <AlignLeft className="w-4 h-4" />
                          if (currentAlign === "center") return <AlignCenter className="w-4 h-4" />
                          return <AlignRight className="w-4 h-4" />
                        })()}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Horizontal alignment</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Vertical Alignment */}
                {onCycleVerticalAlign && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-accent hover:scale-105 transition-all"
                        onClick={() => onCycleVerticalAlign(currentSlide)}
                      >
                        {(() => {
                          const currentAlign = slides[currentSlide]?.layout?.verticalAlign || "stretch"
                          if (currentAlign === "top") return <AlignVerticalJustifyStart className="w-4 h-4" />
                          if (currentAlign === "center") return <AlignVerticalJustifyCenter className="w-4 h-4" />
                          if (currentAlign === "bottom") return <AlignVerticalJustifyEnd className="w-4 h-4" />
                          return <AlignVerticalDistributeCenter className="w-4 h-4" />
                        })()}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Vertical alignment</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Random Color Button */}
              {onRandomBackgroundColor && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 border border-border rounded-lg bg-background/95 backdrop-blur-sm hover:bg-accent hover:scale-105 hover:border-accent transition-all"
                      onClick={() => onRandomBackgroundColor(currentSlide)}
                    >
                      <Shuffle className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Random background color</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-12">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {slides.map((slide, i) => (
            <div
              key={i}
              draggable={onReorderSlides ? true : false}
              onDragStart={(e) => {
                if (onReorderSlides) {
                  setDraggedSlideIndex(i)
                  e.dataTransfer.effectAllowed = "move"
                }
              }}
              onDragEnter={(e) => {
                if (onReorderSlides && draggedSlideIndex !== null && draggedSlideIndex !== i) {
                  e.preventDefault()
                  setHoveredDropIndex(i)
                }
              }}
              onDragLeave={(e) => {
                // Only clear if we're actually leaving the element (not just entering a child)
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                const x = e.clientX
                const y = e.clientY
                if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                  setHoveredDropIndex(null)
                }
              }}
              onDragOver={(e) => {
                if (onReorderSlides && draggedSlideIndex !== null && draggedSlideIndex !== i) {
                  e.preventDefault()
                  e.dataTransfer.dropEffect = "move"
                  setHoveredDropIndex(i)
                }
              }}
              onDrop={(e) => {
                e.preventDefault()
                if (onReorderSlides && draggedSlideIndex !== null && draggedSlideIndex !== i) {
                  onReorderSlides(draggedSlideIndex, i)
                  setDraggedSlideIndex(null)
                  setHoveredDropIndex(null)
                }
              }}
              onDragEnd={() => {
                setDraggedSlideIndex(null)
                setHoveredDropIndex(null)
              }}
              className={cn(
                "cursor-pointer transition-all duration-200",
                draggedSlideIndex === i ? "opacity-50 scale-95" : "",
                hoveredDropIndex === i && draggedSlideIndex !== null && draggedSlideIndex !== i
                  ? "ring-2 ring-accent ring-offset-2 ring-offset-background scale-105 bg-accent/10 rounded-xl"
                  : "",
                onReorderSlides ? "cursor-grab active:cursor-grabbing" : ""
              )}
              onClick={() => {
                setCurrentSlide(i)
                setViewMode("single")
              }}
            >
                       <SlideCard
                         slide={slide}
                         index={i}
                         total={slides.length}
                         compact
                         onDelete={onDeleteSlide}
                         header={data.header}
                         footer={data.footer}
                       />
            </div>
          ))}
        </div>
        </div>
      )}
    </div>
    </TooltipProvider>
  )
}
