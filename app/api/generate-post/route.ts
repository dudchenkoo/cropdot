import { streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

const SYSTEM_PROMPT = `You are an AI system that generates high-quality LinkedIn text posts.

Your ONLY output must be a valid JSON object. 
Never add explanations, comments, or text outside of JSON.

TASK:
Based on the user's input (topic + platform + goal + tone), generate:
1. A well-structured LinkedIn text post (300-500 words)
2. A brief summary of the post

CONTENT RULES:
- Write engaging, professional content optimized for LinkedIn
- Use short paragraphs (2-3 sentences each)
- Include a compelling hook in the first paragraph
- Use line breaks to separate paragraphs
- End with a clear call-to-action or question
- Match the requested tone (professional, friendly, bold, or storytelling)
- No emojis unless specifically requested
- Make it scannable and easy to read

OUTPUT FORMAT (STRICT):

{
  "topic": "",
  "platform": "linkedin",
  "content": "First paragraph...\n\nSecond paragraph...\n\nThird paragraph...",
  "summary": "Brief summary of the post"
}

FORMAT RULES:
- "content" must be the full post text with \\n\\n for paragraph breaks
- "summary" should be 1-2 sentences describing the post
- No markdown, no formatting, no commentary.
- Must be valid JSON parsable by JSON.parse().`

/**
 * Generates mock post data for testing or local development without calling the LLM backend.
 *
 * @param {string} topic - The post subject requested by the user.
 * @param {string} platform - The target platform used to tailor tone and CTA language.
 * @param {string} goal - Optional goal for the post.
 * @param {string} tone - Optional tone for the post.
 * @returns {{ topic: string, platform: string, content: string, summary: string }}
 * A structured mock post payload that mirrors the production response shape.
 */
function generateMockPost(topic: string, platform: string, goal?: string, tone?: string) {
  const toneText = tone || "professional"
  const goalText = goal ? ` The goal is: ${goal}.` : ""
  
  return {
    topic: topic,
    platform: platform,
    content: `Here's what I've learned about ${topic}.\n\n${goalText}\n\nThis is something that many people struggle with, but understanding the fundamentals can make all the difference.\n\nThe key is to start with a clear strategy and build from there.\n\nWhat's your experience with ${topic}? Share your thoughts below.`,
    summary: `A LinkedIn post about ${topic} that provides insights and encourages engagement.`
  }
}

/**
 * POST /api/generate-post – Produces a JSON text post tailored to the requested topic and platform.
 *
 * Request body format: `{ topic: string, platform: string, goal?: string, tone?: string }`.
 * Responds with `{ topic, platform, content, summary }` on success, or `{ error, details? }` with
 * HTTP 400 for validation errors and 500 for unexpected server issues.
 *
 * @param {Request} request - The incoming HTTP request containing post generation parameters in JSON format.
 * @returns {Promise<Response>} A response wrapping the generated post payload or an error description.
 * @throws {SyntaxError} If the request body cannot be parsed as JSON.
 */
export async function POST(request: Request) {
  try {
    const { topic, platform = "linkedin", goal, tone } = await request.json()
    console.log("API Request received:", { topic, platform, goal, tone })

    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Return mock data for now (replacing AI generation)
    console.log("Returning mock post data")
    const mockData = generateMockPost(topic, platform, goal, tone)
    
    // Simulate a small delay to mimic API call (skip in tests for speed)
    if (process.env.NODE_ENV !== "test") {
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
    
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



