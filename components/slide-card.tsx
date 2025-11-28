import type { Slide, Layer } from "@/lib/carousel-types"
import { cn } from "@/lib/utils"
import { Quote } from "lucide-react"
import Image from "next/image"
import React, { memo, useMemo } from "react"
import { getBackgroundStyle, getContentFromLayers, getLayerStyles } from "@/lib/helpers"
import { DEFAULT_HIGHLIGHT_COLOR } from "@/lib/constants"

interface SlideCardProps {
  slide: Slide
  index: number
  total: number
  compact?: boolean
  onDelete?: (index: number) => void
  header?: { enabled: boolean; text: string }
  footer?: { enabled: boolean; text: string }
}

// Helper function to parse and render text with ==highlight== markers
function renderTextWithHighlights(text: string, highlightColor: string | undefined, defaultHighlightColor: string, className: string, style: React.CSSProperties): React.ReactNode {
  if (!text.includes('==')) {
    return <span className={className} style={style}>{text}</span>
  }
  
  // Use the provided highlightColor, or fall back to defaultHighlightColor, or yellow as last resort
  const colorToUse = highlightColor || defaultHighlightColor || '#ffff00'
  
  const parts: React.ReactNode[] = []
  const regex = /==([^=]+)==/g
  let lastIndex = 0
  let match
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before the highlight
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`} className={className} style={style}>
          {text.substring(lastIndex, match.index)}
        </span>
      )
    }
    
    // Add highlighted text with the synced color
    parts.push(
      <span
        key={`highlight-${match.index}`}
        className={className}
        style={{
          ...style,
          backgroundColor: colorToUse,
          padding: '0.125rem 0.25rem',
          borderRadius: '0.25rem',
          display: 'inline-block',
        }}
      >
        {match[1]}
      </span>
    )
    
    lastIndex = regex.lastIndex
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`} className={className} style={style}>
        {text.substring(lastIndex)}
      </span>
    )
  }
  
  return <>{parts}</>
}

function SlideCardComponent({ slide, index, total, compact = false, onDelete, header, footer }: SlideCardProps) {
  const isFirst = index === 0
  const isLast = index === total - 1

  const content = useMemo(() => getContentFromLayers(slide.layers, slide), [slide])
  const backgroundStyle = useMemo(() => getBackgroundStyle(slide.background), [slide.background])
  const backgroundPhoto = slide.background?.type === "photo" ? slide.background.photoUrl : null
  const containerStyle = useMemo(
    () => (backgroundPhoto ? { ...backgroundStyle, backgroundImage: undefined } : backgroundStyle),
    [backgroundPhoto, backgroundStyle],
  )
  const overlayOpacity = slide.background?.overlayOpacity ?? 0
  const overlayColor = slide.background?.overlayColor ?? "#000000"

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
      style={containerStyle}
    >
      {backgroundPhoto && (
        <Image
          src={backgroundPhoto}
          alt="Slide background"
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover pointer-events-none"
          loading="lazy"
          priority={false}
        />
      )}
      {backgroundPhoto && overlayOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
          aria-hidden
        />
      )}
      {/* Header */}
      {header?.enabled && header.text && (
        <div className="absolute top-0 left-0 right-0 px-4 py-2 text-xs text-muted-foreground border-b border-white/10 bg-background/50 backdrop-blur-sm z-10">
          {header.text}
        </div>
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
                      layer.style?.listType ? (
                        <div className={cn("font-semibold text-foreground", compact ? "text-xs" : "text-2xl", styleClass)} style={style}>
                          {layer.style.listType === "ordered" ? (
                            <ol className="list-decimal list-inside space-y-1">
                              {layer.content.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                            </ol>
                          ) : (
                            <ul className="list-disc list-inside space-y-1">
                              {layer.content.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <h3 className={cn("font-semibold text-foreground", compact ? "text-xs" : "text-2xl", styleClass)}>
                          {renderTextWithHighlights(layer.content, layer.style?.highlightColor, DEFAULT_HIGHLIGHT_COLOR, styleClass, style)}
                        </h3>
                      )
                    )}
                    {layer.type === "subheading" && (
                      layer.style?.listType ? (
                        <div className={cn("text-muted-foreground font-medium", compact ? "text-xs" : "text-base", styleClass)} style={style}>
                          {layer.style.listType === "ordered" ? (
                            <ol className="list-decimal list-inside space-y-1">
                              {layer.content.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                            </ol>
                          ) : (
                            <ul className="list-disc list-inside space-y-1">
                              {layer.content.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <h4 className={cn("text-muted-foreground font-medium", compact ? "text-xs" : "text-base", styleClass)}>
                          {renderTextWithHighlights(layer.content, layer.style?.highlightColor, DEFAULT_HIGHLIGHT_COLOR, styleClass, style)}
                        </h4>
                      )
                    )}
                    {layer.type === "body" && (
                      layer.style?.listType ? (
                        <div className={cn("text-muted-foreground leading-relaxed", compact ? "text-xs line-clamp-4" : "text-sm", styleClass)} style={style}>
                          {layer.style.listType === "ordered" ? (
                            <ol className="list-decimal list-inside space-y-1">
                              {layer.content.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                            </ol>
                          ) : (
                            <ul className="list-disc list-inside space-y-1">
                              {layer.content.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <p className={cn("text-muted-foreground leading-relaxed", compact ? "text-xs line-clamp-4" : "text-sm", styleClass)}>
                          {renderTextWithHighlights(layer.content, layer.style?.highlightColor, DEFAULT_HIGHLIGHT_COLOR, styleClass, style)}
                        </p>
                      )
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

      {/* Footer */}
      {footer?.enabled && footer.text && (
        <div className="absolute bottom-0 left-0 right-0 px-4 py-2 text-xs text-muted-foreground border-t border-white/10 bg-background/50 backdrop-blur-sm z-10">
          {footer.text}
        </div>
      )}
    </div>
  )
}

export const SlideCard = memo(SlideCardComponent)
