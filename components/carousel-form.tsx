"use client"

import type React from "react"

import { useState } from "react"
import type { CarouselData, Platform } from "@/lib/carousel-types"
import { Loader2, Check } from "lucide-react"

interface CarouselFormProps {
  onGenerate: (data: CarouselData) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const platforms: { value: Platform; label: string; color: string }[] = [
  { value: "linkedin", label: "LinkedIn", color: "#0077B5" },
  { value: "instagram", label: "Instagram", color: "#E4405F" },
  { value: "telegram", label: "Telegram", color: "#0088cc" },
  { value: "threads", label: "Threads", color: "#000000" },
]

const tones: { value: string; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "bold", label: "Bold" },
  { value: "storytelling", label: "Storytelling" },
]

export function CarouselForm({ onGenerate, isLoading, setIsLoading }: CarouselFormProps) {
  const [topic, setTopic] = useState("")
  const [platform, setPlatform] = useState<Platform>("linkedin")
  const [goal, setGoal] = useState("")
  const [tone, setTone] = useState("professional")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!topic.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, goal, tone }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        })
        let errorMessage = `Failed to generate carousel: ${response.status} ${response.statusText}`
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.error || errorMessage
        } catch {
          // If not JSON, use the text as is
          if (errorText) errorMessage = errorText
        }
        throw new Error(errorMessage)
      }

      // Handle JSON response (mock data or non-streaming API)
      const contentType = response.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        const data = await response.json() as CarouselData
        onGenerate(data)
      } else {
        // Handle streaming response (for future AI integration)
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let fullText = ""

        if (!reader) {
          throw new Error("Response body is not readable")
        }

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          if (value) {
            fullText += decoder.decode(value, { stream: true })
          }
        }

        console.log("Full response text:", fullText.substring(0, 500))

        const jsonMatch = fullText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            const data = JSON.parse(jsonMatch[0]) as CarouselData
            onGenerate(data)
          } catch (parseError) {
            console.error("JSON Parse Error:", parseError)
            console.error("Received text:", fullText)
            throw new Error("Failed to parse carousel data. Check console for details.")
          }
        } else {
          console.error("No JSON found in response. Full text:", fullText)
          throw new Error(`No valid JSON response from API. Received: ${fullText.substring(0, 100)}...`)
        }
      }
    } catch (error) {
      console.error("Error generating carousel:", error)
      alert(error instanceof Error ? error.message : "Failed to generate carousel. Please check the console for details.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground" htmlFor="carousel-topic">Topic</label>
        <p id="carousel-topic-description" className="sr-only">
          Enter the main subject you want the carousel to cover.
        </p>
        <input
          id="carousel-topic"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-muted-foreground transition-colors"
          placeholder="How to grow on LinkedIn in 2025"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          aria-describedby="carousel-topic-description"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground" htmlFor="carousel-goal">Goal</label>
        <p id="carousel-goal-description" className="sr-only">
          Describe the outcome you want readers to achieve after viewing the carousel.
        </p>
        <textarea
          id="carousel-goal"
          rows={3}
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-muted-foreground transition-colors"
          placeholder="Explain what the user will learn, why it matters, and what action they should take."
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          aria-describedby="carousel-goal-description"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Platform</label>
        <div className="grid grid-cols-2 gap-2">
          {platforms.map((p) => {
            const isSelected = platform === p.value
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setPlatform(p.value)}
                className={`
                  relative flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all cursor-pointer
                  ${isSelected 
                    ? "border-white/30 bg-white/10 shadow-lg shadow-black/20" 
                    : "border-border bg-background hover:border-white/20 hover:bg-white/5"
                  }
                `}
                style={isSelected ? { borderColor: `${p.color}80` } : {}}
                aria-label={`Select ${p.label} as platform`}
                aria-pressed={isSelected}
              >
                <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-muted-foreground"}`}>
                  {p.label}
                </span>
                {isSelected && (
                  <>
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: p.color }} />
                    <div 
                      className="absolute inset-0 rounded-lg opacity-10 pointer-events-none"
                      style={{ backgroundColor: p.color }}
                    />
                  </>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Tone</label>
        <div className="grid grid-cols-2 gap-2">
          {tones.map((t) => {
            const isSelected = tone === t.value
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setTone(t.value)}
                className={`
                  relative flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all cursor-pointer
                  ${isSelected 
                    ? "border-white/30 bg-white/10 shadow-lg shadow-black/20" 
                    : "border-border bg-background hover:border-white/20 hover:bg-white/5"
                  }
                `}
                aria-label={`Use a ${t.label.toLowerCase()} tone`}
                aria-pressed={isSelected}
              >
                <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-muted-foreground"}`}>
                  {t.label}
                </span>
                {isSelected && (
                  <Check className="w-4 h-4 flex-shrink-0 text-white" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !topic.trim()}
        className="mt-1 w-full rounded-lg bg-[#e8e4df] py-2 text-sm font-medium text-[#1a1a1a] hover:bg-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        aria-label="Generate carousel with AI"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate with AI"
        )}
      </button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        AI will generate 8–10 slides optimized for your selected platform. You can edit the text manually after.
      </p>
    </form>
  )
}
