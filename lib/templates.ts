import type { Slide } from "./carousel-types"

export interface Template {
  id: string
  name: string
  description: string
  preview: {
    backgroundColor: string
    accentColor: string
    pattern?: "dots" | "cells" | "lines" | "grid" | "diagonal" | "waves" | null
    layout: "centered" | "top" | "split" | "minimal"
  }
  apply: (slide: Slide) => Slide
}

export const templates: Template[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple design",
    preview: {
      backgroundColor: "#1a1a1a",
      accentColor: "#ffffff",
      layout: "centered",
    },
    apply: (slide) => ({
      ...slide,
      background: {
        type: "color",
        color: "#1a1a1a",
        accentColor: "#ffffff",
      },
    }),
  },
  {
    id: "bold",
    name: "Bold",
    description: "High contrast with vibrant colors",
    preview: {
      backgroundColor: "#000000",
      accentColor: "#ff6b6b",
      pattern: "grid",
      layout: "centered",
    },
    apply: (slide) => ({
      ...slide,
      background: {
        type: "color",
        color: "#000000",
        accentColor: "#ff6b6b",
        pattern: {
          enabled: true,
          type: "grid",
          opacity: 0.3,
          opacityEnabled: true,
          scale: 1,
          scaleEnabled: false,
        },
      },
    }),
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated with subtle patterns",
    preview: {
      backgroundColor: "#2d2d2d",
      accentColor: "#d4af37",
      pattern: "dots",
      layout: "centered",
    },
    apply: (slide) => ({
      ...slide,
      background: {
        type: "color",
        color: "#2d2d2d",
        accentColor: "#d4af37",
        pattern: {
          enabled: true,
          type: "dots",
          opacity: 0.2,
          opacityEnabled: true,
          scale: 1.2,
          scaleEnabled: true,
        },
      },
    }),
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary with geometric patterns",
    preview: {
      backgroundColor: "#0f172a",
      accentColor: "#3b82f6",
      pattern: "diagonal",
      layout: "top",
    },
    apply: (slide) => ({
      ...slide,
      background: {
        type: "color",
        color: "#0f172a",
        accentColor: "#3b82f6",
        pattern: {
          enabled: true,
          type: "diagonal",
          opacity: 0.15,
          opacityEnabled: true,
          scale: 1,
          scaleEnabled: false,
        },
      },
    }),
  },
  {
    id: "warm",
    name: "Warm",
    description: "Cozy and inviting tones",
    preview: {
      backgroundColor: "#3a2e1f",
      accentColor: "#f59e0b",
      pattern: "waves",
      layout: "centered",
    },
    apply: (slide) => ({
      ...slide,
      background: {
        type: "color",
        color: "#3a2e1f",
        accentColor: "#f59e0b",
        pattern: {
          enabled: true,
          type: "waves",
          opacity: 0.25,
          opacityEnabled: true,
          scale: 1.5,
          scaleEnabled: true,
        },
      },
    }),
  },
  {
    id: "tech",
    name: "Tech",
    description: "Futuristic with grid patterns",
    preview: {
      backgroundColor: "#0a0a0a",
      accentColor: "#00ff88",
      pattern: "cells",
      layout: "split",
    },
    apply: (slide) => ({
      ...slide,
      background: {
        type: "color",
        color: "#0a0a0a",
        accentColor: "#00ff88",
        pattern: {
          enabled: true,
          type: "cells",
          opacity: 0.2,
          opacityEnabled: true,
          scale: 0.8,
          scaleEnabled: true,
        },
      },
    }),
  },
  {
    id: "soft",
    name: "Soft",
    description: "Gentle pastel colors",
    preview: {
      backgroundColor: "#2a1f2e",
      accentColor: "#c084fc",
      pattern: "lines",
      layout: "centered",
    },
    apply: (slide) => ({
      ...slide,
      background: {
        type: "color",
        color: "#2a1f2e",
        accentColor: "#c084fc",
        pattern: {
          enabled: true,
          type: "lines",
          opacity: 0.1,
          opacityEnabled: true,
          scale: 1,
          scaleEnabled: false,
        },
      },
    }),
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Professional and clean",
    preview: {
      backgroundColor: "#1e293b",
      accentColor: "#64748b",
      layout: "minimal",
    },
    apply: (slide) => ({
      ...slide,
      background: {
        type: "color",
        color: "#1e293b",
        accentColor: "#64748b",
      },
    }),
  },
]

