import type { Slide, Layer } from "@/lib/carousel-types"
import { cn } from "@/lib/utils"
import { Quote, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type React from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { getBackgroundStyle, getContentFromLayers, getLayerStyles } from "@/lib/helpers"

interface SlideCardProps {
  slide: Slide
  index: number
  total: number
  compact?: boolean
  onDelete?: (index: number) => void
  header?: { enabled: boolean; text: string }
  footer?: { enabled: boolean; text: string }
}

export function SlideCard({ slide, index, total, compact = false, onDelete, header, footer }: SlideCardProps) {
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
      {/* Header */}
      {header?.enabled && header.text && (
        <div className="absolute top-0 left-0 right-0 px-4 py-2 text-xs text-muted-foreground border-b border-white/10 bg-background/50 backdrop-blur-sm z-10">
          {header.text}
        </div>
      )}

      {onDelete && total > 1 && (
        <Tooltip>
          <TooltipTrigger asChild>
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
              >
                <Trash2 className={cn(compact ? "w-3 h-3" : "w-4 h-4")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center gap-2">
                <span className="text-xs">Delete slide</span>
                <KbdGroup>
                  <Kbd>Del</Kbd>
                  <span className="text-[10px] text-muted-foreground">or</span>
                  <Kbd>Backspace</Kbd>
                </KbdGroup>
              </div>
            </TooltipContent>
          </Tooltip>
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
                        {layer.style?.listType === "ordered" ? (
                          <ol className="list-decimal list-inside space-y-1">
                            {layer.content.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                          </ol>
                        ) : layer.style?.listType === "unordered" ? (
                          <ul className="list-disc list-inside space-y-1">
                            {layer.content.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                          </ul>
                        ) : (
                          layer.content
                        )}
                      </h3>
                    )}
                    {layer.type === "subheading" && (
                      <h4 className={cn("text-muted-foreground font-medium", compact ? "text-xs" : "text-sm", styleClass)} style={style}>
                        {layer.style?.listType === "ordered" ? (
                          <ol className="list-decimal list-inside space-y-1">
                            {layer.content.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                          </ol>
                        ) : layer.style?.listType === "unordered" ? (
                          <ul className="list-disc list-inside space-y-1">
                            {layer.content.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
                          </ul>
                        ) : (
                          layer.content
                        )}
                      </h4>
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
                        <p className={cn("text-muted-foreground leading-relaxed", compact ? "text-xs line-clamp-4" : "text-sm", styleClass)} style={style}>
                          {layer.content}
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

      {/* Footer - only show if enabled */}
      {footer?.enabled === true && footer.text ? (
        <div className="mt-4 pt-3 border-t border-white/10 text-xs text-muted-foreground">
          {footer.text}
        </div>
      ) : !footer && !compact ? (
        // Show default slide info only if footer doesn't exist at all
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{slide.type}</span>
          <span className="text-xs text-muted-foreground">
            {index + 1}/{total}
          </span>
        </div>
      ) : null}
    </div>
  )
}
