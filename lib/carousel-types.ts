export const layerTypes = ["text", "heading", "subheading", "body", "bullet"] as const
export type LayerType = (typeof layerTypes)[number]

export const slideTypes = ["title", "text", "list", "quote", "cta"] as const
export type SlideType = (typeof slideTypes)[number]

export const platforms = ["linkedin", "instagram", "telegram", "threads"] as const
export type Platform = (typeof platforms)[number]

export const backgroundTypes = ["color", "photo"] as const
export type BackgroundType = (typeof backgroundTypes)[number]

export const textTransforms = ["uppercase", "lowercase", "capitalize", "none"] as const
export type TextTransform = (typeof textTransforms)[number]

export const patternTypes = ["dots", "cells", "lines", "grid", "diagonal", "waves"] as const
export type PatternType = (typeof patternTypes)[number] | null

export const carouselSizes = ["4:5", "9:16", "1:1"] as const
export type CarouselSize = (typeof carouselSizes)[number]

export const horizontalAlignments = ["left", "center", "right"] as const
export type HorizontalAlignment = (typeof horizontalAlignments)[number]

export const verticalAlignments = ["top", "center", "bottom", "stretch"] as const
export type VerticalAlignment = (typeof verticalAlignments)[number]

export interface LayerStyle {
  highlightColor?: string
  fontFamily?: string
  fontSize?: string
  textTransform?: TextTransform
}

export interface Layer {
  id: string
  type: LayerType
  content: string
  visible: boolean
  style?: LayerStyle
}

export interface SlideLayout {
  padding?: number
  horizontalAlign?: HorizontalAlignment
  verticalAlign?: VerticalAlignment
}

export interface BackgroundPattern {
  type?: PatternType
  enabled?: boolean
  opacity?: number
  opacityEnabled?: boolean
  scale?: number
  scaleEnabled?: boolean
}

export interface SlideBackground {
  type?: BackgroundType
  color?: string
  photoUrl?: string
  accentColor?: string
  pattern?: BackgroundPattern
}

export interface Slide {
  index: number
  type: SlideType
  title?: string
  hook?: string
  body?: string
  content?: string
  bullets?: string[]
  layers: Layer[]
  size?: CarouselSize
  layout?: SlideLayout
  background?: SlideBackground
}

export interface CarouselData {
  topic: string
  platform: Platform
  slides: Slide[]
  summary: string
  header?: {
    enabled: boolean
    text: string
  }
  footer?: {
    enabled: boolean
    text: string
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || typeof value === "string"

const isOptionalNumber = (value: unknown): value is number | undefined =>
  value === undefined || typeof value === "number"

const isOptionalBoolean = (value: unknown): value is boolean | undefined =>
  value === undefined || typeof value === "boolean"

const isOptionalTextTransform = (value: unknown): value is TextTransform | undefined =>
  value === undefined || textTransforms.includes(value as TextTransform)

const isOptionalPatternType = (value: unknown): value is PatternType | undefined =>
  value === undefined || value === null || patternTypes.includes(value as Exclude<PatternType, null>)

const isLayerStyle = (value: unknown): value is LayerStyle =>
  isRecord(value) &&
  isOptionalString(value.highlightColor) &&
  isOptionalString(value.fontFamily) &&
  isOptionalString(value.fontSize) &&
  isOptionalTextTransform(value.textTransform)

export const isLayer = (value: unknown): value is Layer =>
  isRecord(value) &&
  typeof value.id === "string" &&
  layerTypes.includes(value.type as LayerType) &&
  typeof value.content === "string" &&
  typeof value.visible === "boolean" &&
  (value.style === undefined || isLayerStyle(value.style))

const isSlideLayout = (value: unknown): value is SlideLayout =>
  isRecord(value) &&
  isOptionalNumber(value.padding) &&
  (value.horizontalAlign === undefined || horizontalAlignments.includes(value.horizontalAlign as HorizontalAlignment)) &&
  (value.verticalAlign === undefined || verticalAlignments.includes(value.verticalAlign as VerticalAlignment))

const isBackgroundPattern = (value: unknown): value is BackgroundPattern =>
  isRecord(value) &&
  isOptionalPatternType(value.type) &&
  isOptionalBoolean(value.enabled) &&
  isOptionalNumber(value.opacity) &&
  isOptionalBoolean(value.opacityEnabled) &&
  isOptionalNumber(value.scale) &&
  isOptionalBoolean(value.scaleEnabled)

const isSlideBackground = (value: unknown): value is SlideBackground =>
  isRecord(value) &&
  (value.type === undefined || backgroundTypes.includes(value.type as BackgroundType)) &&
  isOptionalString(value.color) &&
  isOptionalString(value.photoUrl) &&
  isOptionalString(value.accentColor) &&
  (value.pattern === undefined || isBackgroundPattern(value.pattern))

export const isSlide = (value: unknown): value is Slide =>
  isRecord(value) &&
  typeof value.index === "number" &&
  slideTypes.includes(value.type as SlideType) &&
  isOptionalString(value.title) &&
  isOptionalString(value.hook) &&
  isOptionalString(value.body) &&
  isOptionalString(value.content) &&
  (value.bullets === undefined || (Array.isArray(value.bullets) && value.bullets.every((b) => typeof b === "string"))) &&
  Array.isArray(value.layers) &&
  value.layers.every(isLayer) &&
  (value.size === undefined || carouselSizes.includes(value.size as CarouselSize)) &&
  (value.layout === undefined || isSlideLayout(value.layout)) &&
  (value.background === undefined || isSlideBackground(value.background))

const isHeaderFooter = (value: unknown): value is { enabled: boolean; text: string } =>
  isRecord(value) &&
  typeof value.enabled === "boolean" &&
  typeof value.text === "string"

export const isCarouselData = (value: unknown): value is CarouselData =>
  isRecord(value) &&
  typeof value.topic === "string" &&
  platforms.includes(value.platform as Platform) &&
  typeof value.summary === "string" &&
  Array.isArray(value.slides) &&
  value.slides.every(isSlide) &&
  (value.header === undefined || isHeaderFooter(value.header)) &&
  (value.footer === undefined || isHeaderFooter(value.footer))
