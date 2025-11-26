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

// Mock data generator for testing
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
