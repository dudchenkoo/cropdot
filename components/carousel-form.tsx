"use client"

import type React from "react"

import type { CarouselData, Platform } from "@/lib/carousel-types"
import { isCarouselData } from "@/lib/carousel-types"
import {
  DEFAULT_PLATFORM,
  DEFAULT_TONE,
  PLATFORM_OPTIONS,
  TONE_OPTIONS,
} from "@/lib/constants"
import { carouselFormSchema, type CarouselFormValues } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Check } from "lucide-react"
import { useForm } from "react-hook-form"

/**
 * Props for the carousel generation form.
 *
 * @param onGenerate Callback invoked with the generated carousel payload.
 * @param isLoading Current loading state, used to disable and show progress.
 * @param setIsLoading Setter to toggle loading state during submission.
 */
interface CarouselFormProps {
  onGenerate: (data: CarouselData) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

/**
 * Collects user input for topic, platform, goal, and tone before requesting a
 * generated carousel from the API. Local `useState` hooks track form fields and
 * leverage `setIsLoading` to coordinate submission feedback with the parent
 * component.
 *
 * @param props - Component props containing generation callback and loading state
 * @returns Form UI for carousel generation input
 *
 * @example
 * ```tsx
 * <CarouselForm onGenerate={setCarousel} isLoading={loading} setIsLoading={setLoading} />
 * ```
 */
export function CarouselForm({ onGenerate, isLoading, setIsLoading }: CarouselFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CarouselFormValues>({
    resolver: zodResolver(carouselFormSchema),
    defaultValues: {
      topic: "",
      platform: DEFAULT_PLATFORM,
      goal: "",
      tone: DEFAULT_TONE,
    },
  })

  const selectedPlatform = watch("platform")
  const selectedTone = watch("tone")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  /**
   * Submits the generation request to `/api/generate`, gracefully handling
   * JSON and streamed responses, surfacing errors, and toggling loading state
   * for the parent component.
   */
  const onSubmit = handleSubmit(async (data) => {
    setErrorMessage(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
        const data: unknown = await response.json()
        if (!isCarouselData(data)) {
          console.error("Invalid carousel payload from API", { data })
          setErrorMessage("We couldn't build slides from that request. Please try again with a bit more detail.")
          return
        }
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
<<<<<<< HEAD
            const data: unknown = JSON.parse(jsonMatch[0])
            if (!isCarouselData(data)) {
              console.error("Invalid carousel data from streaming response", { data })
              setErrorMessage("We couldn't create slides from the response. Please try again.")
              return
            }
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
      console.error("Error generating carousel:", { error, data })
      const fallbackMessage =
        error instanceof Error
          ? error.message
          : "We couldn't generate your carousel right now. Please check your connection and try again."
      setErrorMessage(fallbackMessage)
    } finally {
      setIsLoading(false)
    }
  })

  return (
    <form onSubmit={onSubmit} className="space-y-3 text-sm" noValidate>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground" htmlFor="carousel-topic">Topic</label>
        <p id="carousel-topic-description" className="sr-only">
          Enter the main subject you want the carousel to cover.
        </p>
        <input
          id="carousel-topic"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-muted-foreground transition-colors"
          placeholder="How to grow on LinkedIn in 2025"
          aria-invalid={!!errors.topic}
          aria-describedby="carousel-topic-description"
          {...register("topic")}
        />
        <p id="carousel-topic-description" className="sr-only">
          Enter the main topic or subject for your carousel
        </p>
        {errors.topic && (
          <p className="text-xs text-destructive">{errors.topic.message}</p>
        )}
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
          aria-invalid={!!errors.goal}
          aria-describedby="carousel-goal-description"
          {...register("goal")}
        />
        {errors.goal && (
          <p className="text-xs text-destructive">{errors.goal.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Platform</label>
        <div className="grid grid-cols-2 gap-2">
          {PLATFORM_OPTIONS.map((p) => {
            const isSelected = selectedPlatform === p.value
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setValue("platform", p.value, { shouldValidate: true })}
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
        {errors.platform && (
          <p className="text-xs text-destructive">{errors.platform.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Tone</label>
        <div className="grid grid-cols-2 gap-2">
          {TONE_OPTIONS.map((t) => {
            const isSelected = selectedTone === t.value
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setValue("tone", t.value, { shouldValidate: true })}
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
        {errors.tone && (
          <p className="text-xs text-destructive">{errors.tone.message}</p>
        )}
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading || !watch("topic")?.trim()}
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
