import { streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

const SYSTEM_PROMPT = `You are an AI system that generates structured multi-slide carousel content.

Your ONLY output must be a valid JSON object. 
Never add explanations, comments, or text outside of JSON.

TASK:
Based on the user's input (topic + platform), generate:
1. A carousel outline (8–10 slides)
2. Text for each slide
3. A structured JSON schema for rendering

CONTENT RULES:
- Slide 1 = hook (short title)
- Slide 2 = context or problem
- Middle slides = insights, steps, key ideas
- Last slide = conclusion + CTA
- Use short, scannable sentences.
- No emojis unless the user asks.
- Max 35–50 words per slide.
- For lists, use "bullets".

OUTPUT FORMAT (STRICT):

{
  "topic": "",
  "platform": "",
  "slides": [
    {
      "index": 1,
      "type": "title | text | list | quote | cta",
      "title": "",
      "body": "",
      "bullets": []
    }
  ],
  "summary": ""
}

FORMAT RULES:
- "title" required when type = "title"
- "body" required when type = "text"
- "bullets" ONLY when type = "list"
- No markdown, no formatting, no commentary.
- Must be valid JSON parsable by JSON.parse().`

/**
 * Generates mock carousel data for testing or local development without calling the LLM backend.
 *
 * @param {string} topic - The carousel subject requested by the user.
 * @param {string} platform - The target platform used to tailor tone and CTA language.
 * @returns {{ topic: string, platform: string, slides: Array<Record<string, unknown>>, summary: string }}
 * A structured mock carousel payload that mirrors the production response shape.
 * @example
 * generateMockCarousel("time management", "instagram")
 * // => { topic: "time management", platform: "instagram", slides: [...], summary: "..." }
 */
function generateMockCarousel(topic: string, platform: string) {
  return {
    topic: topic,
    platform: platform,
    slides: [
      {
        index: 1,
        type: "title",
        title: `How to Master ${topic}`,
        hook: `How to Master ${topic}`,
        layers: []
      },
      {
        index: 2,
        type: "text",
        body: `Understanding ${topic} is crucial for success. Many people struggle with this, but with the right approach, you can excel.`,
        content: `Understanding ${topic} is crucial for success. Many people struggle with this, but with the right approach, you can excel.`,
        layers: []
      },
      {
        index: 3,
        type: "list",
        body: "Key strategies to get started:",
        bullets: [
          "Start with the fundamentals",
          "Practice consistently",
          "Learn from experts",
          "Track your progress"
        ],
        layers: []
      },
      {
        index: 4,
        type: "text",
        body: `The most important aspect of ${topic} is building a strong foundation. Without this, advanced techniques won't help.`,
        content: `The most important aspect of ${topic} is building a strong foundation. Without this, advanced techniques won't help.`,
        layers: []
      },
      {
        index: 5,
        type: "text",
        body: "Common mistakes to avoid: rushing the process, skipping basics, and not seeking feedback. Take your time and build properly.",
        content: "Common mistakes to avoid: rushing the process, skipping basics, and not seeking feedback. Take your time and build properly.",
        layers: []
      },
      {
        index: 6,
        type: "list",
        body: "Advanced techniques:",
        bullets: [
          "Optimize your workflow",
          "Automate repetitive tasks",
          "Scale your approach",
          "Measure and iterate"
        ],
        layers: []
      },
      {
        index: 7,
        type: "text",
        body: "Remember: consistency beats intensity. Small daily actions compound into significant results over time.",
        content: "Remember: consistency beats intensity. Small daily actions compound into significant results over time.",
        layers: []
      },
      {
        index: 8,
        type: "cta",
        body: `Ready to master ${topic}? Start implementing these strategies today and track your progress.`,
        content: `Ready to master ${topic}? Start implementing these strategies today and track your progress.`,
        layers: []
      }
    ],
    summary: `A comprehensive guide to ${topic} covering fundamentals, strategies, and advanced techniques for ${platform}.`
  }
}

/**
 * POST /api/generate – Produces a JSON carousel outline tailored to the requested topic and platform.
 *
 * Request body format: `{ topic: string, platform: string, goal?: string, tone?: string }`.
 * Responds with `{ topic, platform, slides: Array, summary }` on success, or `{ error, details? }` with
 * HTTP 400 for validation errors and 500 for unexpected server issues.
 *
 * @param {Request} request - The incoming HTTP request containing carousel generation parameters in JSON format.
 * @returns {Promise<Response>} A response wrapping the generated carousel payload or an error description.
 * @throws {SyntaxError} If the request body cannot be parsed as JSON.
 * @example
 * // Client usage
 * await fetch("/api/generate", {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify({
 *     topic: "AI prompts",
 *     platform: "linkedin",
 *     goal: "educate founders",
 *     tone: "authoritative"
 *   })
 * })
 *
 * @example
 * // Example success response body
 * {
 *   "topic": "AI prompts",
 *   "platform": "linkedin",
 *   "slides": [],
 *   "summary": "High-level recap for carousel readers."
 * }
 *
 * @example
 * // Example validation error (HTTP 400)
 * {
 *   "error": "Topic and platform are required"
 * }
 *
 * @example
 * // Example server error (HTTP 500)
 * {
 *   "error": "Internal server error",
 *   "details": "Optional stack trace information"
 * }
 */
export async function POST(request: Request) {
  try {
    const { topic, platform } = await request.json()
    console.log("API Request received:", { topic, platform })

    if (!topic || !platform) {
      return new Response(JSON.stringify({ error: "Topic and platform are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Return mock data for now (replacing AI generation)
    console.log("Returning mock carousel data")
    const mockData = generateMockCarousel(topic, platform)
    
    // Simulate a small delay to mimic API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return new Response(JSON.stringify(mockData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("API Route Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    console.error("Error details:", errorMessage)
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
