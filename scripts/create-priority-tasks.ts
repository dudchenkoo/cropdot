/**
 * Script to create high-priority Linear issues from suggested tasks
 * 
 * Run with: npm run create-priority-tasks
 * Or: npx tsx scripts/create-priority-tasks.ts
 */

import { config } from "dotenv"
import { resolve } from "path"
import { createLinearIssue, getLinearTeams } from "../lib/linear"

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") })

interface Task {
  title: string
  description: string
  priority: "high" | "medium" | "low"
}

const priorityTasks: Task[] = [
  {
    title: "Implement Real AI Generation",
    description: `## Problem
Currently, the API route uses mock data instead of real AI generation. This is a core functionality issue.

## Current State
- Location: \`app/api/generate/route.ts\` (line 193-195)
- Uses \`generateMockCarousel()\` function
- \`streamText\` from \`@ai-sdk/anthropic\` is already imported but not used

## Acceptance Criteria
- Replace \`generateMockCarousel()\` with real Anthropic API call
- Use \`streamText\` from \`@ai-sdk/anthropic\` (already imported)
- Handle streaming responses properly
- Maintain error handling and validation
- Ensure response matches expected \`CarouselData\` format
- Add rate limiting and error recovery
- Test with various topics and tones

## Technical Details
- System prompt already defined in \`SYSTEM_PROMPT\` constant
- Need to parse streaming JSON response
- Handle partial responses and errors
- Maintain backward compatibility with existing code

## Related Files
- \`app/api/generate/route.ts\`
- \`components/carousel-form.tsx\`
- \`lib/carousel-types.ts\``,
    priority: "high",
  },
  {
    title: "Add Error Reporting to Linear",
    description: `## Problem
Errors are currently only logged to console. There's no automatic tracking or reporting system.

## Current State
- ErrorBoundary catches errors but only logs them
- API errors are logged but not tracked
- No way to know about production errors

## Acceptance Criteria
- Automatically create Linear issues when critical errors occur
- Include error message, stack trace, and user context
- Use existing \`createLinearIssue\` function from \`lib/linear.ts\`
- Add error severity levels (critical, warning, info)
- Prevent duplicate issue creation for same error
- Add user-friendly error messages

## Implementation
- Update \`components/error-boundary.tsx\` to create Linear issues
- Add error reporting in \`app/api/generate/route.ts\`
- Create error deduplication logic
- Add error context (user ID, page, action)

## Related Files
- \`components/error-boundary.tsx\`
- \`app/api/generate/route.ts\`
- \`lib/linear.ts\``,
    priority: "high",
  },
  {
    title: "Improve Export Quality and Options",
    description: `## Problem
Current export functionality is basic. Users may need higher quality exports and more format options.

## Current State
- Basic PDF and PNG export exists
- No resolution options
- Limited format support
- No progress indicators

## Acceptance Criteria
- Add export resolution options (1x, 2x, 3x for retina displays)
- Support multiple image formats (PNG, JPG, WebP)
- Add export progress indicator
- Optimize file sizes
- Add batch export with progress tracking
- Include metadata in exports (title, date, etc.)

## Technical Details
- Update \`lib/export.ts\` functions
- Add resolution multiplier to \`html2canvas\` options
- Implement progress callbacks
- Add format selection UI

## Related Files
- \`lib/export.ts\`
- \`components/carousel-generator.tsx\` (export panel)`,
    priority: "high",
  },
  {
    title: "Add Carousel Duplication Feature",
    description: `## Problem
Users can duplicate slides but not entire carousels. This forces users to recreate similar carousels manually.

## Current State
- Slide duplication exists
- No carousel-level duplication
- Users must manually recreate similar carousels

## Acceptance Criteria
- Add "Duplicate carousel" button in dashboard
- Create copy with new ID and timestamp
- Allow renaming duplicated carousel
- Preserve all settings and content
- Update saved carousels list

## Implementation
- Add duplicate button to saved carousel cards
- Create \`duplicateCarousel()\` function in \`lib/storage.ts\`
- Update dashboard UI to show duplicate option
- Add confirmation dialog

## Related Files
- \`components/carousel-generator.tsx\` (dashboard view)
- \`lib/storage.ts\``,
    priority: "medium",
  },
  {
    title: "Add Image Upload for Backgrounds",
    description: `## Problem
Currently only URL input exists for background images. Users must host images externally.

## Current State
- Only URL input for background photos
- No file upload capability
- Users need external image hosting

## Acceptance Criteria
- Add file upload input for background images
- Support common formats (JPG, PNG, WebP)
- Image compression and optimization
- Preview uploaded image before applying
- Store images (localStorage or cloud storage)
- Add image cropping/resizing options

## Technical Details
- Use FileReader API for local uploads
- Compress images before storing
- Add image preview component
- Consider cloud storage for production

## Related Files
- \`components/carousel-generator.tsx\` (background settings)
- \`lib/helpers.ts\` (image handling)`,
    priority: "medium",
  },
]

async function createPriorityTasks() {
  try {
    console.log("📋 Creating priority Linear issues...\n")

    // Get CRO team
    console.log("🔍 Finding CRO team...")
    const teamsResponse = await getLinearTeams()

    if (teamsResponse.errors) {
      console.error("Error fetching teams:", teamsResponse.errors)
      return
    }

    const teams = teamsResponse.data?.teams.nodes || []
    const croTeam = teams.find(team => team.key === "CRO")

    if (!croTeam) {
      console.error("❌ CRO team not found!")
      return
    }

    console.log(`✅ Found CRO team: ${croTeam.name} (UUID: ${croTeam.id})\n`)

    // Create issues
    for (const task of priorityTasks) {
      console.log(`📝 Creating issue: ${task.title} (${task.priority} priority)...`)

      const title = `[${task.priority.toUpperCase()}] ${task.title}`

      const result = await createLinearIssue(
        title,
        task.description,
        croTeam.id
      )

      if (result.errors) {
        console.error(`❌ Error creating issue "${task.title}":`, result.errors)
        continue
      }

      if (result.data?.issueCreate.issue) {
        const createdIssue = result.data.issueCreate.issue
        console.log(`✅ Created: ${createdIssue.identifier} - ${createdIssue.title}`)
        console.log(`   ID: ${createdIssue.id}\n`)
      } else {
        console.error(`❌ Issue "${task.title}" was not created\n`)
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    console.log("✨ Done! All priority issues have been created in Linear.")
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error)
    if (error instanceof Error && error.stack) {
      console.error("Stack:", error.stack)
    }
  }
}

createPriorityTasks()

