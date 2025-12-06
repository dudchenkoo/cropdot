"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { toast } from "sonner"

import type { PostGenerationResponse } from "@/lib/post-types"
import {
  DEFAULT_PLATFORM,
  DEFAULT_TONE,
  TONE_OPTIONS,
} from "@/lib/constants"
import { postFormSchema, type PostFormValues } from "@/lib/validation"
import { subtractCoins } from "@/lib/coins"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check } from "lucide-react"
import { useForm } from "react-hook-form"
import { useCoins } from "@/hooks/use-coins"

/**
 * Props for the post generation form.
 *
 * @param onGenerate Callback invoked with the generated post payload.
 * @param isLoading Current loading state, used to disable and show progress.
 * @param setIsLoading Setter to toggle loading state during submission.
 */
interface PostFormProps {
  onGenerate: (data: PostGenerationResponse) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

/**
 * Collects user input for topic, platform, goal, and tone before requesting a
 * generated text post from the API. Local `useState` hooks track form fields and
 * leverage `setIsLoading` to coordinate submission feedback with the parent
 * component.
 *
 * @param props - Component props containing generation callback and loading state
 * @returns Form UI for post generation input
 *
 * @example
 * ```tsx
 * <PostForm onGenerate={setPost} isLoading={loading} setIsLoading={setLoading} />
 * ```
 */
export function PostForm({ onGenerate, isLoading, setIsLoading }: PostFormProps) {
  const { coins, refreshCoins } = useCoins()
  const hasEnoughCoins = coins >= 1
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      topic: "",
      platform: DEFAULT_PLATFORM,
      goal: "",
      tone: undefined,
    },
  })

  const selectedTone = watch("tone")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Auto-focus topic input when form is shown
  useEffect(() => {
    const timer = setTimeout(() => {
      const input = document.getElementById("post-topic") as HTMLInputElement
      input?.focus()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (hasEnoughCoins && errorMessage?.includes("coin")) {
      setErrorMessage(null)
    }
  }, [errorMessage, hasEnoughCoins])

  const handleSuccessfulGeneration = (data: PostGenerationResponse) => {
    const remainingCoins = subtractCoins(1)
    refreshCoins()
    toast.success("Generation complete! 1 coin used.", {
      description: `${remainingCoins} coin${remainingCoins === 1 ? "" : "s"} remaining.`,
    })
    onGenerate(data)
  }

  /**
   * Submits the generation request to `/api/generate-post`, gracefully handling
   * JSON and streamed responses, surfacing errors, and toggling loading state
   * for the parent component.
   */
  const onSubmit = handleSubmit(async (data) => {
    if (!hasEnoughCoins) {
      const insufficientCoinsMessage = "You need 1 coin to generate. Get more coins on the Pricing page."
      setErrorMessage(insufficientCoinsMessage)
      toast.error("Insufficient coins", { description: insufficientCoinsMessage })
      return
    }

    setErrorMessage(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/generate-post", {
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
          topic: data.topic,
          platform: data.platform,
        })
        let friendlyMessage = "We couldn't generate your post right now. Please try again in a moment."
        try {
          const errorJson = JSON.parse(errorText)
          friendlyMessage = errorJson.error || friendlyMessage
        } catch {
          if (errorText) friendlyMessage = errorText
        }
        setErrorMessage(friendlyMessage)
        toast.error("Generation failed", {
          description: friendlyMessage,
        })
        return
      }

      const contentType = response.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        const responseData: unknown = await response.json()
        if (
          !responseData ||
          typeof responseData !== "object" ||
          !("content" in responseData) ||
          typeof (responseData as any).content !== "string" ||
          !("topic" in responseData) ||
          typeof (responseData as any).topic !== "string"
        ) {
          console.error("Invalid post payload from API", { responseData })
          const errorMsg = "We couldn't build post from that request. Please try again with a bit more detail."
          setErrorMessage(errorMsg)
          toast.error("Generation failed", {
            description: errorMsg,
          })
          return
        }
        handleSuccessfulGeneration(responseData as PostGenerationResponse)
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
            const responseData: unknown = JSON.parse(jsonMatch[0])
            if (
              !responseData ||
              typeof responseData !== "object" ||
              !("content" in responseData) ||
              typeof (responseData as any).content !== "string"
            ) {
              console.error("Invalid post data from streaming response", { responseData })
              const errorMsg = "We couldn't create post from the response. Please try again."
              setErrorMessage(errorMsg)
              toast.error("Generation failed", {
                description: errorMsg,
              })
              return
            }
            handleSuccessfulGeneration(responseData as PostGenerationResponse)
          } catch (parseError) {
            console.error("JSON Parse Error:", { error: parseError, fullText })
            const errorMsg = "We couldn't read the post response. Please try again."
            setErrorMessage(errorMsg)
            toast.error("Generation failed", {
              description: errorMsg,
            })
          }
        } else {
          console.error("No JSON found in response. Full text:", fullText)
          const errorMsg = "We couldn't parse the response from the server. Please try again in a moment."
          setErrorMessage(errorMsg)
          toast.error("Generation failed", {
            description: errorMsg,
          })
        }
      }
    } catch (error) {
      console.error("Error generating post:", { error, data })
      const fallbackMessage =
        error instanceof Error
          ? error.message
          : "We couldn't generate your post right now. Please check your connection and try again."
      setErrorMessage(fallbackMessage)
      toast.error("Generation failed", {
        description: fallbackMessage,
      })
    } finally {
      setIsLoading(false)
    }
  })

  return (
    <form onSubmit={onSubmit} className="space-y-5 text-sm" noValidate>
      <style jsx>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground" htmlFor="post-topic">Topic</label>
        <p id="post-topic-description" className="sr-only">
          Enter the main subject you want the post to cover.
        </p>
        <input
          id="post-topic"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-muted-foreground transition-colors"
          placeholder="How to grow on LinkedIn in 2025"
          aria-invalid={!!errors.topic}
          aria-describedby="post-topic-description"
          {...register("topic")}
        />
        <p id="post-topic-description" className="sr-only">
          Enter the main topic or subject for your post
        </p>
        {errors.topic && (
          <p className="text-xs text-destructive">{errors.topic.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs text-muted-foreground" htmlFor="post-goal">Goal</label>
        <p id="post-goal-description" className="sr-only">
          Describe the outcome you want readers to achieve after reading the post.
        </p>
        <textarea
          id="post-goal"
          rows={3}
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-muted-foreground transition-colors"
          placeholder="Explain what the user will learn, why it matters, and what action they should take."
          aria-invalid={!!errors.goal}
          aria-describedby="post-goal-description"
          {...register("goal")}
        />
        {errors.goal && (
          <p className="text-xs text-destructive">{errors.goal.message}</p>
        )}
      </div>

      <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Tone</label>
        <div className="flex flex-wrap gap-2">
          {TONE_OPTIONS.map((t) => {
            const isSelected = selectedTone === t.value
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setValue("tone", t.value, { shouldValidate: true })}
                className={`
                  relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer
                  ${isSelected
                    ? "bg-primary text-primary-foreground border border-primary shadow-sm" 
                    : "bg-secondary text-muted-foreground border border-border hover:bg-secondary/80 hover:text-foreground"
                  }
                `}
                aria-label={`Use a ${t.label.toLowerCase()} tone`}
                aria-pressed={isSelected}
              >
                {isSelected && (
                  <Check className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                <span>{t.label}</span>
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

      {!hasEnoughCoins && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-100/40 px-3 py-2 text-xs text-amber-900">
          <span>You need 1 coin to generate. Get more coins on the Pricing page.</span>
          <Link href="/pricing" className="font-medium underline underline-offset-2">
            Pricing
          </Link>
        </div>
      )}

      <div className="relative group mt-1">
        {/* Glow effect */}
        <div
          className="absolute -inset-[3px] rounded-xl opacity-50 blur-md group-hover:opacity-75 transition-opacity"
          style={{
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
            backgroundSize: "300% 100%",
            animation: "gradientFlow 3s linear infinite",
          }}
        />
        {/* Button */}
        <button
          type="submit"
          disabled={!hasEnoughCoins || isLoading}
          className="relative w-full px-6 py-2.5 rounded-lg text-white text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
            backgroundSize: "300% 100%",
            animation: "gradientFlow 3s linear infinite",
          }}
          aria-label="Generate post with AI"
        >
          Generate with AI
        </button>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Our LinkedIn-focused AI creates high-performing content in seconds. Specialized for maximum engagement and results.
      </p>
    </form>
  )
}



