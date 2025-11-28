import type { CarouselData, Layer, Slide } from "./carousel-types"
import type React from "react"

const FONT_VARIABLE_MAP: Record<string, string> = {
  Inter: "var(--font-inter)",
  Roboto: "var(--font-roboto)",
  "Open Sans": "var(--font-open-sans)",
  Montserrat: "var(--font-montserrat)",
  Poppins: "var(--font-poppins)",
  Lato: "var(--font-lato)",
}

/**
 * Generates a unique identifier for carousel layers.
 * @returns A unique layer ID string.
 */
export function generateLayerId(): string {
  return `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Converts a font family name to its configured CSS variable fallback.
 * Falls back to the provided name when no mapping exists.
 * @param fontFamily The font family name to convert.
 * @returns A CSS font-family declaration using the mapped variable when available.
 */
export function fontNameToCSSVariable(fontFamily: string): string {
  const cssVariable = FONT_VARIABLE_MAP[fontFamily]
  return cssVariable ? `${cssVariable}, ${fontFamily}, sans-serif` : fontFamily
}

/**
 * Converts a hex color string to an rgba() string with the provided opacity.
 * @param hex Hex color string (e.g. "#ff00aa").
 * @param opacity Opacity value between 0 and 1.
 * @returns A valid CSS rgba() color string.
 */
export function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

/**
 * Formats a date into a human-readable string.
 * @param date Date instance or date-like string.
 * @param locale BCP 47 locale string for formatting.
 * @param options Intl date formatting options.
 * @returns A formatted date string.
 */
export function formatDate(
  date: Date | string,
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
): string {
  const formatter = new Intl.DateTimeFormat(locale, options)
  return formatter.format(typeof date === "string" ? new Date(date) : date)
}

/**
 * Formats a time string with optional timezone and locale controls.
 * @param date Date instance or date-like string.
 * @param locale BCP 47 locale string for formatting.
 * @param options Intl time formatting options.
 * @returns A formatted time string.
 */
export function formatTime(
  date: Date | string,
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" }
): string {
  const formatter = new Intl.DateTimeFormat(locale, options)
  return formatter.format(typeof date === "string" ? new Date(date) : date)
}

/**
 * Truncates a string to the specified length, optionally adding an ellipsis.
 * @param text Input text to truncate.
 * @param maxLength Maximum allowed length of the returned string.
 * @param suffix Suffix to append when truncating (defaults to an ellipsis).
 * @returns The truncated string.
 */
export function truncate(text: string, maxLength: number, suffix: string = "…"): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, Math.max(0, maxLength - suffix.length))}${suffix}`
}

/**
 * Capitalizes the first character of the provided string.
 * @param text String to capitalize.
 * @returns The capitalized string.
 */
export function capitalize(text: string): string {
  if (!text) return ""
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Converts a slide definition into its default layer list.
 * @param slide Slide data to transform.
 * @returns A normalized list of layers for the slide.
 */
export function slideToLayers(slide: CarouselData["slides"][0]): Layer[] {
  const layers: Layer[] = []
  if (slide.title || slide.hook) {
    layers.push({ id: generateLayerId(), type: "heading", content: slide.title || slide.hook || "", visible: true })
  }
  if (slide.content) {
    layers.push({ id: generateLayerId(), type: "body", content: slide.content, visible: true })
  }
  if (slide.bullets) {
    slide.bullets.forEach((bullet) => {
      layers.push({ id: generateLayerId(), type: "bullet", content: bullet, visible: true })
    })
  }
  return layers
}

/**
 * Builds a CSS background image string for pattern previews.
 * @param pattern Pattern type to render.
 * @param color Hex color used for the pattern.
 * @param opacity Pattern opacity value between 0 and 1.
 * @returns A CSS background-image value for the requested pattern.
 */
export function getPatternBackground(
  pattern: "dots" | "cells" | "lines" | "grid" | "diagonal" | "waves",
  color: string,
  opacity: number
): string {
  const rgba = hexToRgba(color, opacity)

  switch (pattern) {
    case "dots":
      return `radial-gradient(circle, ${rgba} 1px, transparent 1px)`
    case "cells":
      return `linear-gradient(${rgba} 1px, transparent 1px), linear-gradient(90deg, ${rgba} 1px, transparent 1px)`
    case "lines":
      return `repeating-linear-gradient(0deg, ${rgba}, ${rgba} 1px, transparent 1px, transparent 20px)`
    case "grid":
      return `linear-gradient(${rgba} 1px, transparent 1px), linear-gradient(90deg, ${rgba} 1px, transparent 1px)`
    case "diagonal":
      return `repeating-linear-gradient(45deg, ${rgba}, ${rgba} 1px, transparent 1px, transparent 20px)`
    case "waves":
      return `radial-gradient(ellipse at center, ${rgba} 1px, transparent 1px)`
    default:
      return ""
  }
}

/**
 * Derives a slide's content blocks from its layers with sensible fallbacks.
 * @param layers The layer collection to read from.
 * @param slide Slide metadata providing defaults when layers are absent.
 * @returns An object containing heading, subheading, body, and bullet content values.
 */
export function getContentFromLayers(layers: Layer[] | undefined, slide: Slide) {
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

/**
 * Builds inline style and className helpers for rendering a layer preview.
 * @param layer Layer configuration to render.
 * @param compact When true, uses compact sizing scales.
 * @returns An object containing style and className entries for the layer.
 */
export function getLayerStyles(layer: Layer, compact: boolean): { style: React.CSSProperties; className: string } {
  const style: React.CSSProperties = {}
  const classes: string[] = []

  if (layer.style?.fontFamily) {
    style.fontFamily = fontNameToCSSVariable(layer.style.fontFamily)
  }

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

  if (layer.style?.textTransform) {
    style.textTransform = layer.style.textTransform
  }

  if (layer.style?.bold) {
    style.fontWeight = "bold"
  }

  if (layer.style?.italic) {
    style.fontStyle = "italic"
  }

  if (layer.style?.underline) {
    style.textDecoration = "underline"
  }

  if (layer.style?.strikethrough) {
    style.textDecoration = layer.style.underline ? "underline line-through" : "line-through"
  }

  // Note: highlightColor is not applied here - it's only used for text wrapped in == markers
  // and is handled separately in renderTextWithHighlights function

  return { style, className: classes.join(" ") }
}

/**
 * Builds a background style definition for rendering slides.
 * @param background Background configuration from a slide.
 * @returns Inline CSSProperties representing the slide background.
 */
export function getBackgroundStyle(background: Slide["background"]): React.CSSProperties {
  const style: React.CSSProperties = {}

  if (!background) return style

  if (background.type === "photo" && background.photoUrl) {
    style.backgroundImage = `url(${background.photoUrl})`
    style.backgroundSize = "cover"
    style.backgroundPosition = "center"
    
    // Apply overlay if specified
    if (background.overlayColor && background.overlayOpacity !== undefined) {
      const overlayRgba = hexToRgba(background.overlayColor, background.overlayOpacity)
      style.backgroundImage = `linear-gradient(${overlayRgba}, ${overlayRgba}), url(${background.photoUrl})`
    }
  } else {
    style.backgroundColor = background.color || "#1a1a1a"
  }

  if (background.pattern?.enabled && background.pattern.type) {
    const patternOpacity = background.pattern.opacityEnabled ? background.pattern.opacity || 0.5 : 0.5
    const patternScale = background.pattern.scaleEnabled ? background.pattern.scale || 1 : 1
    const accentColor = background.accentColor || "#ffffff"
    const accentRgba = hexToRgba(accentColor, patternOpacity)

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

    if (style.backgroundImage) {
      patterns.push(style.backgroundImage as string)
    }
    style.backgroundImage = patterns.length > 0 ? patterns.join(", ") : undefined
  }

  return style
}

export const stringUtils = {
  truncate,
  capitalize,
}
