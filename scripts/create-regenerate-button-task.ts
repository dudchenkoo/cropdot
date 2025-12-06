/**
 * Script to create a Linear task for adding regenerate button to each slide
 * 
 * Usage: npm run create:regenerate-task
 */

import { config } from "dotenv"
import { resolve } from "path"
import { createLinearIssue, getLinearTeams, getLinearViewer } from "../lib/linear"

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") })

const TASK_TITLE = "Add Regenerate Button to Each Slide"

const TASK_DESCRIPTION = `## Overview
Add a regenerate button to each slide in the carousel editor, allowing users to regenerate individual slides if they don't like the AI-generated result.

## User Story
As a user, I want to regenerate a specific slide without regenerating the entire carousel, so that I can improve individual slides that don't meet my expectations.

## Implementation Tasks

### 1. UI Component
- **File**: \`components/carousel-preview.tsx\` or \`components/slide-card.tsx\`
- Add a regenerate button/icon to each slide in the preview
- Button should be visible when hovering over a slide or always visible
- Consider placement: top-right corner, bottom-right, or as part of slide actions
- Use appropriate icon (RefreshCw, RotateCw, or similar from lucide-react)
- Style button to match existing design system

### 2. Regenerate Functionality
- **File**: \`components/carousel-generator.tsx\` or new API route
- Create \`handleRegenerateSlide(slideIndex: number)\` function
- Function should:
  - Call AI generation API with the slide's context (topic, previous slides, etc.)
  - Replace only the specified slide with new AI-generated content
  - Preserve other slides unchanged
  - Update carousel data state
  - Show loading state during regeneration
  - Handle errors gracefully

### 3. API Integration
- **File**: \`app/api/generate/route.ts\` or new endpoint
- Add support for regenerating a single slide
- Endpoint should accept:
  - Topic/context
  - Slide index to regenerate
  - Previous slides for context
  - User preferences (tone, style, etc.)
- Return only the regenerated slide data

### 4. State Management
- **File**: \`components/carousel-generator.tsx\`
- Add loading state for individual slide regeneration
- Track which slide is being regenerated
- Update history/undo-redo to support slide regeneration
- Ensure proper state updates after regeneration

### 5. User Experience
- Show loading indicator on the specific slide being regenerated
- Disable regenerate button during regeneration
- Show success/error toast notifications
- Optionally: Add "Undo regenerate" functionality
- Consider: Add animation/transition when slide content updates

### 6. Edge Cases
- Handle regeneration when slide is being edited
- Handle regeneration of first slide (hook slide)
- Handle regeneration when carousel has only one slide
- Prevent multiple simultaneous regenerations
- Handle API failures gracefully

## Design Considerations

### Button Placement Options
1. **Top-right corner** - Always visible, minimal design
2. **Bottom-right corner** - Part of slide actions
3. **Hover-only** - Appears on hover, cleaner UI
4. **Slide toolbar** - Part of slide-specific actions panel

### Visual Design
- Use secondary/ghost button style
- Icon size: 16-20px
- Padding: 8-12px
- Hover state: subtle background change
- Loading state: spinner icon or disabled state

## Acceptance Criteria

- [ ] Regenerate button visible on each slide in carousel preview
- [ ] Button triggers regeneration of only the selected slide
- [ ] Other slides remain unchanged during regeneration
- [ ] Loading state shown during regeneration
- [ ] Success/error feedback provided to user
- [ ] Regeneration works for any slide (first, middle, last)
- [ ] Regeneration preserves slide styling (background, layout, etc.)
- [ ] Regeneration updates undo/redo history
- [ ] Button disabled during regeneration to prevent duplicates
- [ ] Works correctly with existing carousel features (templates, editing, etc.)

## Technical Notes

- Consider using existing AI generation logic but scoped to single slide
- May need to pass slide context (previous slides, topic, goal) to AI
- Ensure regenerated slide maintains same structure as original
- Test with different slide types (title, text, list, etc.)
- Consider rate limiting for regeneration requests

## Files to Modify

1. \`components/carousel-preview.tsx\` - Add regenerate button UI
2. \`components/carousel-generator.tsx\` - Add regenerate logic
3. \`app/api/generate/route.ts\` - Add single slide regeneration endpoint (if needed)
4. \`lib/carousel-types.ts\` - Verify types support slide regeneration

## Related Features

- May integrate with existing "Regenerate" functionality if it exists
- Should work with template system
- Should respect user's tone/style preferences
`

async function main() {
  try {
    console.log("🚀 Creating Linear task for regenerate button feature...\n")

    // Check for API key
    if (!process.env.LINEAR_API_KEY) {
      throw new Error("LINEAR_API_KEY is not set in .env.local")
    }

    // Find CRO team
    console.log("📋 Fetching teams to find CRO team...")
    const teamsResponse = await getLinearTeams()
    
    if (!teamsResponse.data?.teams.nodes) {
      throw new Error("Failed to fetch teams from Linear")
    }

    const croTeam = teamsResponse.data.teams.nodes.find(
      (team) => team.key === "CRO" || team.name.toLowerCase().includes("cropdot")
    )

    if (!croTeam) {
      throw new Error("CRO team not found in Linear workspace")
    }

    console.log(`✅ Found CRO team: ${croTeam.name} (Key: ${croTeam.key}, UUID: ${croTeam.id})\n`)

    // Get current user for assignment
    console.log("👤 Fetching current user for auto-assignment...")
    const viewerResponse = await getLinearViewer()
    
    if (!viewerResponse.data?.viewer) {
      throw new Error("Failed to fetch current user from Linear")
    }

    const userId = viewerResponse.data.viewer.id
    console.log(`✅ Current user: ${viewerResponse.data.viewer.name} (${viewerResponse.data.viewer.email})\n`)

    // Create the issue
    console.log("📝 Creating Linear issue...")
    const result = await createLinearIssue(
      TASK_TITLE,
      TASK_DESCRIPTION,
      croTeam.id,
      userId,
      ["frontend", "feature"] // Tags: frontend, feature
    )

    if (result.errors) {
      throw new Error(`Linear API errors: ${JSON.stringify(result.errors)}`)
    }

    if (!result.data?.issueCreate.success) {
      throw new Error("Failed to create issue in Linear")
    }

    const issue = result.data.issueCreate.issue
    console.log(`\n🎉 Task created successfully!`)
    console.log(`   Issue: ${issue.identifier}`)
    console.log(`   Title: ${issue.title}`)
    console.log(`   URL: https://linear.app/cropdot/issue/${issue.identifier}`)
    console.log(`   Assigned to: ${viewerResponse.data.viewer.name}\n`)
  } catch (error) {
    console.error("\n❌ Error creating Linear task:", error)
    if (error instanceof Error) {
      console.error(`   ${error.message}`)
    }
    process.exit(1)
  }
}

main()

