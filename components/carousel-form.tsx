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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!topic.trim()) {
      setErrorMessage("Please enter a topic so we can generate your carousel.")
      return
    }

    setErrorMessage(null)
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
          topic,
          platform,
        })
        let friendlyMessage = "We couldn't generate your carousel right now. Please try again in a moment."
        try {
          const errorJson = JSON.parse(errorText)
          friendlyMessage = errorJson.error || friendlyMessage
        } catch {
          if (errorText) friendlyMessage = errorText
        }
        setErrorMessage(friendlyMessage)
        return
      }

      const contentType = response.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        const data = await response.json() as CarouselData
        if (!data || !Array.isArray(data.slides) || data.slides.length === 0) {
          console.error("Empty carousel payload from API", { data })
          setErrorMessage("We couldn't build slides from that request. Please try again with a bit more detail.")
          return
        }
        onGenerate(data)
      } else {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let fullText = ""

        if (!reader) {
          setErrorMessage("We received an unexpected response from the server. Please try again.")
          return
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
            if (!data || !Array.isArray(data.slides) || data.slides.length === 0) {
              console.error("Streaming response did not include slides", { data })
              setErrorMessage("We couldn't create slides from the response. Please try again.")
              return
            }
            onGenerate(data)
          } catch (parseError) {
            console.error("JSON Parse Error:", { error: parseError, fullText })
            setErrorMessage("We couldn't read the carousel response. Please try again.")
          }
        } else {
          console.error("No JSON found in response. Full text:", fullText)
          setErrorMessage("We couldn't parse the response from the server. Please try again in a moment.")
        }
      }
    } catch (error) {
      console.error("Error generating carousel:", { error, topic, platform, goal, tone })
      const fallbackMessage =
        error instanceof Error
          ? error.message
          : "We couldn't generate your carousel right now. Please check your connection and try again."
      setErrorMessage(fallbackMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Topic</label>
        <input
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-muted-foreground transition-colors"
          placeholder="How to grow on LinkedIn in 2025"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Goal</label>
        <textarea
          rows={3}
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-muted-foreground transition-colors"
          placeholder="Explain what the user will learn, why it matters, and what action they should take."
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
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

      {errorMessage ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading || !topic.trim()}
        className="mt-1 w-full rounded-lg bg-[#e8e4df] py-2 text-sm font-medium text-[#1a1a1a] hover:bg-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
