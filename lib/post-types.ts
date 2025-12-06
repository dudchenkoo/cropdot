export type Platform = "linkedin"

export interface TextPost {
  id: string
  topic: string
  platform: Platform
  content: string
  summary: string
  createdAt: number
  updatedAt: number
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

export const isTextPost = (value: unknown): value is TextPost =>
  isRecord(value) &&
  typeof value.id === "string" &&
  typeof value.topic === "string" &&
  value.platform === "linkedin" &&
  typeof value.content === "string" &&
  typeof value.summary === "string" &&
  typeof value.createdAt === "number" &&
  typeof value.updatedAt === "number"

export interface PostGenerationRequest {
  topic: string
  platform: Platform
  goal?: string
  tone?: string
}

export interface PostGenerationResponse {
  topic: string
  platform: Platform
  content: string
  summary: string
}



