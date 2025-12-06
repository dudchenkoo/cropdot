#!/usr/bin/env tsx

/**
 * Script to create a Linear task for expanding Cropdot functionality
 * with new AI-powered features and brand kit
 */

import { createLinearIssue, getLinearViewer } from "../lib/linear"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.local" })

async function createFeatureExpansionTask() {
  try {
    console.log("Creating feature expansion task in Linear...")

    // Get current user for auto-assignment
    const viewerResponse = await getLinearViewer()
    const assigneeId = viewerResponse.data?.viewer.id

    if (!assigneeId) {
      throw new Error("Could not get current user ID from Linear")
    }

    const title = "Expand functionality: AI Post Generator, Insights, and Brand Kit"
    
    const description = `# Feature Expansion: AI-Powered Content Tools & Brand Kit

## Overview
Expand Cropdot functionality with AI-powered content generation tools and brand customization features to provide a complete LinkedIn content creation platform.

---

## 1. LinkedIn Post Generator (AI)

### Description
AI-powered tool that generates ready-to-use LinkedIn posts from a simple topic or rough idea.

### Input
- Topic or rough idea (text input)
- Optional: Style preference (casual / expert / storytelling)

### Output
- Ready-to-use LinkedIn post with:
  - **Hook**: Attention-grabbing opening
  - **Structure**: Well-organized body content
  - **CTA**: Clear call-to-action
- Optional: Multiple variations based on style preference

### Technical Requirements
- [ ] Create new API endpoint: \`/api/generate-post\`
- [ ] Integrate with AI model (GPT/Claude) trained on LinkedIn best practices
- [ ] UI component: Post generator form with topic input and style selector
- [ ] Output display: Formatted post preview with copy button
- [ ] Save generated posts to user's content library
- [ ] Support for editing generated posts

### Acceptance Criteria
- [ ] User can input a topic and receive a complete LinkedIn post
- [ ] Generated posts include hook, structured content, and CTA
- [ ] Style variations (casual/expert/storytelling) produce different tones
- [ ] Generated posts can be copied, edited, and saved
- [ ] Posts are saved to user's content library

---

## 2. Carousel Generator (AI) — Simplified Version

### Description
Streamlined carousel generation that produces structured slide content with basic visual preview.

### Input
- Topic (text input)

### Output
- Structured list of slides (text only)
- Basic visual preview (simplified, no full editor)
- Brand settings (color + font) automatically applied to slides

### Technical Requirements
- [ ] Enhance existing \`/api/generate\` endpoint or create simplified version
- [ ] Generate slide structure: Hook → Content Slides → CTA
- [ ] Apply brand kit settings (color + font) to generated slides
- [ ] Create simplified preview component (read-only, no editing)
- [ ] Export option: Download as images or PDF

### Acceptance Criteria
- [ ] User can generate carousel from topic input
- [ ] Generated carousels use brand kit colors and fonts
- [ ] Basic preview shows slide structure and content
- [ ] Users can export generated carousels
- [ ] Option to open in full editor for advanced editing

---

## 3. LinkedIn Insights AI ("Improve My Post")

### Description
AI-powered tool that analyzes user's LinkedIn post and provides improvement suggestions.

### Input
- User post text (textarea input)

### Output
- **Critique + Suggestions**: Detailed feedback on post structure, engagement potential, clarity
- **Improved Version**: AI-generated enhanced version of the post
- **Stronger Hook**: Alternative hook suggestions
- **Optional Simplified Version**: Shorter, more concise version

### Technical Requirements
- [ ] Create new API endpoint: \`/api/improve-post\`
- [ ] AI model trained on LinkedIn engagement patterns
- [ ] UI component: Text input area + analysis results panel
- [ ] Display sections:
  - Critique and suggestions (bullet points)
  - Improved version (editable)
  - Hook alternatives (selectable)
  - Simplified version (optional toggle)
- [ ] Save improved versions to content library

### Acceptance Criteria
- [ ] User can paste their post and receive detailed critique
- [ ] Suggestions are actionable and specific
- [ ] Improved version maintains user's voice while enhancing clarity
- [ ] Multiple hook alternatives are provided
- [ ] Simplified version option is available
- [ ] All versions can be saved and edited

---

## 4. Basic Brand Kit

### Description
User customization settings that apply to all AI-generated content.

### Features
- **Primary Color**: Color picker for brand color
- **Font**: Font family selector (from existing font options)
- **Optional Logo Upload**: Logo image upload and storage

### Technical Requirements
- [ ] Create brand kit data model in database/storage
- [ ] UI: Brand kit settings page/section
- [ ] Color picker component
- [ ] Font selector (reuse existing font options)
- [ ] Logo upload component with image storage
- [ ] Apply brand settings to:
  - Generated carousels
  - Generated posts (if applicable)
  - All new content by default
- [ ] Preview component showing brand kit in action

### Database Schema
\`\`\`
BrandKit {
  userId: string
  primaryColor: string (hex)
  fontFamily: string
  logoUrl?: string
  createdAt: timestamp
  updatedAt: timestamp
}
\`\`\`

### Acceptance Criteria
- [ ] User can set primary brand color
- [ ] User can select brand font from available options
- [ ] User can upload and manage logo (optional)
- [ ] Brand settings are applied to all AI-generated content
- [ ] Brand kit can be previewed before applying
- [ ] Settings persist across sessions

---

## Implementation Priority

1. **Phase 1**: Basic Brand Kit (foundation for other features)
2. **Phase 2**: LinkedIn Post Generator (standalone feature)
3. **Phase 3**: Simplified Carousel Generator (enhance existing)
4. **Phase 4**: LinkedIn Insights AI (advanced feature)

---

## Technical Considerations

### AI Integration
- Determine AI model(s) to use (GPT-4, Claude, or specialized LinkedIn model)
- Cost estimation for API calls
- Rate limiting and usage tracking
- Error handling for AI failures

### Database/Storage
- User brand kit storage (Supabase or localStorage initially)
- Generated content storage
- Logo image storage (Supabase Storage or similar)

### UI/UX
- Consistent design with existing Cropdot interface
- Mobile-responsive components
- Loading states for AI generation
- Error states and retry mechanisms

### Performance
- Caching generated content
- Optimistic UI updates
- Background processing for long AI operations

---

## Success Metrics

- [ ] Users can generate LinkedIn posts in < 30 seconds
- [ ] Generated posts receive positive feedback (user testing)
- [ ] Brand kit adoption rate > 50% of active users
- [ ] Post improvement tool increases user engagement with content
- [ ] Simplified carousel generator reduces time-to-first-carousel by 50%

---

## Dependencies

- AI API access (OpenAI/Anthropic)
- Image storage solution (for logos)
- Database/storage for brand kit and generated content
- Existing carousel generation infrastructure

---

## Notes

- Consider freemium model: Free tier with limited generations, paid tier with unlimited
- Ensure all AI-generated content is clearly marked as AI-generated
- Provide user control to edit and customize all AI outputs
- Maintain focus on LinkedIn-specific best practices`

    const labelNames = ["feature", "ai", "product"]

    const response = await createLinearIssue(
      title,
      description,
      undefined, // teamId - will auto-detect CRO team
      assigneeId,
      labelNames
    )

    if (response.data?.issueCreate.success) {
      const issue = response.data.issueCreate.issue
      console.log(`✅ Task created successfully!`)
      console.log(`   Issue: ${issue.identifier}`)
      console.log(`   Title: ${issue.title}`)
      console.log(`   URL: https://linear.app/peterdudchenko/issue/${issue.identifier}`)
    } else {
      console.error("❌ Failed to create task")
      console.error("Response:", JSON.stringify(response, null, 2))
    }
  } catch (error) {
    console.error("❌ Error creating task:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
    }
    process.exit(1)
  }
}

createFeatureExpansionTask()





