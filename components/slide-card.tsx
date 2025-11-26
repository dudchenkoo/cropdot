import type { Slide, Layer } from "@/lib/carousel-types"
import { cn } from "@/lib/utils"
import { Quote, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type React from "react"

interface SlideCardProps {
  slide: Slide
  index: number
  total: number
  compact?: boolean
  onDelete?: (index: number) => void
}

function getContentFromLayers(layers: Layer[] | undefined, slide: Slide) {
  if (!layers || layers.length === 0) {
    return {
      heading: slide.title || slide.hook || "",
      body: slide.body || slide.content || "",
      bullets: slide.bullets || [],
    }
  }

  const visibleLayers = layers.filter((l) => l.visible)
  const heading = visibleLayers.find((l) => l.type === "heading")?.content || ""
  const subheading = visibleLayers.find((l) => l.type === "subheading")?.content || ""
  const body = visibleLayers.find((l) => l.type === "body")?.content || ""
  const bullets = visibleLayers.filter((l) => l.type === "bullet").map((l) => l.content)

  return {
    heading,
    subheading,
    body,
    bullets,
  }
}

function getLayerStyles(layer: Layer, compact: boolean) {
  const style: React.CSSProperties = {}
  const classes: string[] = []

  // Font family - map to CSS variable if available
  if (layer.style?.fontFamily) {
    // Map font names to their CSS variable names
    const fontVariableMap: Record<string, string> = {
      "Inter": "var(--font-inter)",
      "Roboto": "var(--font-roboto)",
      "Open Sans": "var(--font-open-sans)",
      "Montserrat": "var(--font-montserrat)",
      "Poppins": "var(--font-poppins)",
      "Lato": "var(--font-lato)",
    }
    const cssVariable = fontVariableMap[layer.style.fontFamily]
    if (cssVariable) {
      style.fontFamily = `${cssVariable}, ${layer.style.fontFamily}, sans-serif`
    } else {
      style.fontFamily = layer.style.fontFamily
    }
  }

  // Font size
  if (layer.style?.fontSize) {
    const fontSizeMap: Record<string, string> = {
      xs: compact ? "0.625rem" : "0.75rem",
      sm: compact ? "0.75rem" : "0.875rem",
      base: compact ? "0.875rem" : "1rem",
      lg: compact ? "1rem" : "1.125rem",
      xl: compact ? "1.125rem" : "1.25rem",
      "2xl": compact ? "1.25rem" : "1.5rem",
      "3xl": compact ? "1.5rem" : "1.875rem",
    }
    style.fontSize = fontSizeMap[layer.style.fontSize] || fontSizeMap.base
  }

  // Text transform
  if (layer.style?.textTransform) {
    style.textTransform = layer.style.textTransform
  }

  // Highlight color (background)
  if (layer.style?.highlightColor) {
    style.backgroundColor = layer.style.highlightColor
    style.padding = "0.125rem 0.25rem"
    style.borderRadius = "0.25rem"
    style.display = "inline-block"
  }

  return { style, className: cn(classes) }
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

function getBackgroundStyle(background: Slide["background"]): React.CSSProperties {
  const style: React.CSSProperties = {}
  
  if (!background) return style

  // Background color or photo
  if (background.type === "photo" && background.photoUrl) {
    style.backgroundImage = `url(${background.photoUrl})`
    style.backgroundSize = "cover"
    style.backgroundPosition = "center"
  } else {
    style.backgroundColor = background.color || "#1a1a1a"
  }

  // Pattern overlay
  if (background.pattern?.enabled && background.pattern.type) {
    const patternOpacity = background.pattern.opacityEnabled ? (background.pattern.opacity || 0.5) : 0.5
    const patternScale = background.pattern.scaleEnabled ? (background.pattern.scale || 1) : 1
    const accentColor = background.accentColor || "#ffffff"
    const accentRgba = hexToRgba(accentColor, patternOpacity)
    
    // Create pattern using CSS
    const patternSize = 20 * patternScale
    const patterns: string[] = []
    
    switch (background.pattern.type) {
      case "dots":
        patterns.push(`radial-gradient(circle, ${accentRgba} 1px, transparent 1px)`)
        style.backgroundSize = `${patternSize}px ${patternSize}px`
        break
      case "cells":
        patterns.push(
          `linear-gradient(${accentRgba} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${accentRgba} 1px, transparent 1px)`
        )
        style.backgroundSize = `${patternSize}px ${patternSize}px`
        break
      case "lines":
        patterns.push(`repeating-linear-gradient(0deg, ${accentRgba}, ${accentRgba} 1px, transparent 1px, transparent ${patternSize}px)`)
        style.backgroundSize = `100% ${patternSize}px`
        break
      case "grid":
        patterns.push(
          `linear-gradient(${accentRgba} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${accentRgba} 1px, transparent 1px)`
        )
        style.backgroundSize = `${patternSize}px ${patternSize}px`
        break
      case "diagonal":
        patterns.push(`repeating-linear-gradient(45deg, ${accentRgba}, ${accentRgba} 1px, transparent 1px, transparent ${patternSize}px)`)
        style.backgroundSize = `${patternSize}px ${patternSize}px`
        break
      case "waves":
        patterns.push(`radial-gradient(ellipse at center, ${accentRgba} 1px, transparent 1px)`)
        style.backgroundSize = `${patternSize * 2}px ${patternSize}px`
        break
    }
    
    // Combine patterns with existing background
    if (style.backgroundImage) {
      patterns.push(style.backgroundImage as string)
    }
    style.backgroundImage = patterns.length > 0 ? patterns.join(", ") : undefined
  }

  return style
}

export function SlideCard({ slide, index, total, compact = false, onDelete }: SlideCardProps) {
  const isFirst = index === 0
  const isLast = index === total - 1

  const content = getContentFromLayers(slide.layers, slide)
  const backgroundStyle = getBackgroundStyle(slide.background)

  // Determine aspect ratio based on slide size
  const getAspectRatio = () => {
    if (slide.size === "9:16") return "aspect-[9/16]"
    if (slide.size === "1:1") return "aspect-square"
    return "aspect-[4/5]" // default 4:5
  }

  return (
    <div
      className={cn(
        "border border-border rounded-xl overflow-hidden relative group",
        "flex flex-col justify-between",
        compact ? `w-full ${getAspectRatio()} p-4` : `w-80 ${getAspectRatio()} p-6`,
      )}
      style={backgroundStyle}
    >
      {onDelete && total > 1 && (
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(index)
          }}
          className={cn(
            "absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity",
            "text-destructive hover:text-destructive hover:bg-destructive/10",
            compact ? "h-6 w-6" : "h-8 w-8"
          )}
          title="Delete slide"
          aria-label={`Delete slide ${index + 1}`}
        >
          <Trash2 className={cn(compact ? "w-3 h-3" : "w-4 h-4")} />
        </Button>
      )}
      <div 
        className={cn(
          "flex-1 flex flex-col",
          slide.layout?.verticalAlign === "top" && "justify-start",
          slide.layout?.verticalAlign === "center" && "justify-center",
          slide.layout?.verticalAlign === "bottom" && "justify-end",
          (!slide.layout?.verticalAlign || slide.layout?.verticalAlign === "stretch") && "justify-center"
        )}
        style={{
          padding: slide.layout?.padding !== undefined ? `${slide.layout.padding}px` : undefined,
        }}
      >
        {slide.layers && slide.layers.length > 0 ? (
          // Render layers with styles applied
          <div 
            className={cn(
              "space-y-2 w-full",
              slide.layout?.horizontalAlign === "left" && "text-left",
              slide.layout?.horizontalAlign === "center" && "text-center",
              slide.layout?.horizontalAlign === "right" && "text-right",
              (!slide.layout?.horizontalAlign || slide.layout?.horizontalAlign === "left") && "text-left"
            )}
          >
            {slide.layers
              .filter((l) => l.visible)
              .map((layer) => {
                const { style, className: styleClass } = getLayerStyles(layer, compact)
                // Create a key that includes style to force re-render when style changes
                const styleKey = layer.style ? JSON.stringify(layer.style) : 'no-style'
                return (
                  <div key={`${layer.id}-${styleKey}`}>
                    {layer.type === "heading" && (
                      <h3 className={cn("font-semibold text-foreground", compact ? "text-xs" : "text-lg", styleClass)} style={style}>
                        {layer.content}
                      </h3>
                    )}
                    {layer.type === "subheading" && (
                      <h4 className={cn("text-muted-foreground font-medium", compact ? "text-xs" : "text-sm", styleClass)} style={style}>
                        {layer.content}
                      </h4>
                    )}
                    {layer.type === "body" && (
                      <p className={cn("text-muted-foreground leading-relaxed", compact ? "text-xs line-clamp-4" : "text-sm", styleClass)} style={style}>
                        {layer.content}
                      </p>
                    )}
                    {layer.type === "bullet" && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-accent mt-1">•</span>
                        <span className={cn(compact ? "text-xs line-clamp-1" : "text-sm", styleClass)} style={style}>
                          {layer.content}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        ) : (
          // Fallback to old rendering for slides without layers
          <div 
            className={cn(
              "w-full",
              slide.layout?.horizontalAlign === "left" && "text-left",
              slide.layout?.horizontalAlign === "center" && "text-center",
              slide.layout?.horizontalAlign === "right" && "text-right",
              (!slide.layout?.horizontalAlign || slide.layout?.horizontalAlign === "left") && "text-left"
            )}
          >
            {slide.type === "title" && (
              <h2 className={cn("font-bold text-foreground text-balance", compact ? "text-sm" : "text-2xl")}>
                {content.heading}
              </h2>
            )}

            {slide.type === "text" && (
              <div className="space-y-2">
                {content.heading && (
                  <h3 className={cn("font-semibold text-foreground", compact ? "text-xs" : "text-lg")}>
                    {content.heading}
                  </h3>
                )}
                {content.subheading && (
                  <h4 className={cn("text-muted-foreground font-medium", compact ? "text-xs" : "text-sm")}>
                    {content.subheading}
                  </h4>
                )}
                <p className={cn("text-muted-foreground leading-relaxed", compact ? "text-xs line-clamp-4" : "text-sm")}>
                  {content.body}
                </p>
              </div>
            )}

            {slide.type === "list" && (
              <div className="space-y-2">
                {content.heading && (
                  <h3 className={cn("font-semibold text-foreground", compact ? "text-xs" : "text-lg")}>
                    {content.heading}
                  </h3>
                )}
                <ul className={cn("space-y-1", compact ? "text-xs" : "text-sm")}>
                  {content.bullets?.slice(0, compact ? 3 : undefined).map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-accent mt-1">•</span>
                      <span className={compact ? "line-clamp-1" : ""}>{bullet}</span>
                    </li>
                  ))}
                  {compact && content.bullets && content.bullets.length > 3 && (
                    <li className="text-muted-foreground">+{content.bullets.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}

            {slide.type === "quote" && (
              <div className="space-y-3">
                <Quote className={cn("text-accent", compact ? "w-4 h-4" : "w-6 h-6")} />
                <blockquote className={cn("italic text-foreground", compact ? "text-xs line-clamp-4" : "text-lg")}>
                  {content.body || content.heading}
                </blockquote>
              </div>
            )}

            {slide.type === "cta" && (
              <div className="space-y-3 text-center">
                {content.heading && (
                  <h3 className={cn("font-bold text-foreground", compact ? "text-sm" : "text-xl")}>{content.heading}</h3>
                )}
                {content.body && (
                  <p className={cn("text-muted-foreground", compact ? "text-xs line-clamp-2" : "text-sm")}>
                    {content.body}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={cn("flex items-center justify-between mt-4 pt-4 border-t border-border", compact && "hidden")}>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{slide.type}</span>
        <span className="text-xs text-muted-foreground">
          {index + 1}/{total}
        </span>
      </div>
    </div>
  )
}
