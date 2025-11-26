export interface Layer {
  id: string
  type: "text" | "heading" | "subheading" | "body" | "bullet"
  content: string
  visible: boolean
  style?: {
    highlightColor?: string
    fontFamily?: string
    fontSize?: string
    textTransform?: "uppercase" | "lowercase" | "capitalize" | "none"
  }
}

export interface Slide {
  index: number
  type: "title" | "text" | "list" | "quote" | "cta"
  title?: string
  hook?: string
  body?: string
  content?: string
  bullets?: string[]
  layers: Layer[]
  size?: "4:5" | "9:16" | "1:1"
  layout?: {
    padding?: number
    horizontalAlign?: "left" | "center" | "right"
    verticalAlign?: "top" | "center" | "bottom" | "stretch"
  }
  background?: {
    type?: "color" | "photo"
    color?: string
    photoUrl?: string
    accentColor?: string
    pattern?: {
      type?: "dots" | "cells" | "lines" | "grid" | "diagonal" | "waves" | null
      enabled?: boolean
      opacity?: number
      opacityEnabled?: boolean
      scale?: number
      scaleEnabled?: boolean
    }
  }
}

export interface CarouselData {
  topic: string
  platform: string
  slides: Slide[]
  summary: string
}

export type Platform = "linkedin" | "instagram" | "telegram" | "threads"
