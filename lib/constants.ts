import type { Platform, Slide } from "./carousel-types"

export const DEFAULT_PADDING = 24
export const DEFAULT_HORIZONTAL_ALIGN: Slide["layout"]!["horizontalAlign"] = "left"
export const DEFAULT_VERTICAL_ALIGN: Slide["layout"]!["verticalAlign"] = "stretch"
export const DEFAULT_FONT_FAMILY = "Inter"
export const DEFAULT_FONT_SIZE = "base"
export const DEFAULT_HIGHLIGHT_COLOR = "#ffffff"
export const DEFAULT_BACKGROUND_COLOR = "#1a1a1a"
export const DEFAULT_ACCENT_COLOR = "#ffffff"
export const DEFAULT_PATTERN_OPACITY = 0.5
export const DEFAULT_PATTERN_SCALE = 1
export const DEFAULT_SIZE: Slide["size"] = "4:5"
export const DEFAULT_BACKGROUND_TYPE: NonNullable<Slide["background"]>["type"] = "color"

export const LAYER_CONTENT_DEFAULTS = {
  heading: "New heading",
  subheading: "New subheading",
  bullet: "New bullet point",
  body: "New text",
  slideHeading: "New slide",
} as const

export const PLATFORM_OPTIONS: { value: Platform; label: string; color: string }[] = [
  { value: "linkedin", label: "LinkedIn", color: "#0077B5" },
  { value: "instagram", label: "Instagram", color: "#E4405F" },
  { value: "telegram", label: "Telegram", color: "#0088cc" },
  { value: "threads", label: "Threads", color: "#000000" },
]

export const DEFAULT_PLATFORM: Platform = PLATFORM_OPTIONS[0].value

export const TONE_OPTIONS: { value: string; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "bold", label: "Bold" },
  { value: "storytelling", label: "Storytelling" },
]

export const DEFAULT_TONE = TONE_OPTIONS[0].value

export const FONT_FAMILY_OPTIONS = ["Inter", "Roboto", "Open Sans", "Montserrat", "Poppins", "Lato"] as const
export type FontFamily = (typeof FONT_FAMILY_OPTIONS)[number]

export const FONT_SIZE_OPTIONS = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"] as const
export type FontSize = (typeof FONT_SIZE_OPTIONS)[number]

export const PATTERN_TYPES = ["dots", "cells", "lines", "grid", "diagonal", "waves"] as const
export type PatternType = (typeof PATTERN_TYPES)[number]

export const SIZE_OPTIONS: { value: Slide["size"]; label: string }[] = [
  { value: "4:5", label: "Carousel" },
  { value: "9:16", label: "Stories" },
  { value: "1:1", label: "Square" },
]

export const BACKGROUND_TYPES: NonNullable<Slide["background"]>["type"][] = ["color", "photo"]

export const PADDING_RANGE = { min: 0, max: 80, step: 4 }
export const PATTERN_OPACITY_RANGE = { min: 0, max: 1, step: 0.1 }
export const PATTERN_SCALE_RANGE = { min: 0.5, max: 2, step: 0.1 }
