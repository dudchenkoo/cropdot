/**
 * Script to create a Linear task for regenerate functionality (single slide + full carousel)
 * 
 * Usage: npm run create:regenerate-feature-task
 */

import { config } from "dotenv"
import { resolve } from "path"
import { createLinearIssue, getLinearTeams, getLinearViewer } from "../lib/linear"

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") })

const TASK_TITLE = "Add Regenerate Functionality (Single Slide & Full Carousel)"

const TASK_DESCRIPTION = `## Overview
Add regenerate functionality allowing users to regenerate individual slides or the entire carousel if they don't like the AI-generated results. This provides users with more control and flexibility over the generated content.

## User Stories

### Story 1: Regenerate Single Slide
As a user, I want to regenerate a specific slide without regenerating the entire carousel, so that I can improve individual slides that don't meet my expectations.

### Story 2: Regenerate Full Carousel
As a user, I want to regenerate the entire carousel with new AI-generated content, so that I can get a completely fresh version if the initial result doesn't meet my needs.

## Implementation Tasks

### Part 1: Regenerate Single Slide

#### 1.1 UI Component for Single Slide
- **File**: \`components/carousel-preview.tsx\` or \`components/slide-card.tsx\`
- Add a regenerate button/icon to each slide in the preview
- Button placement options:
  - Top-right corner (always visible)
  - Bottom-right corner (part of slide actions)
  - Hover-only (appears on hover)
  - Slide toolbar (part of slide-specific actions)
- Use appropriate icon (RefreshCw, RotateCw from lucide-react)
- Style button to match existing design system
- Show loading state on the specific slide being regenerated

#### 1.2 Single Slide Regeneration Logic
- **File**: \`components/carousel-generator.tsx\`
- Create \`handleRegenerateSlide(slideIndex: number)\` function
- Function should:
  - Call AI generation API with slide context (topic, previous slides, etc.)
  - Replace only the specified slide with new AI-generated content
  - Preserve other slides unchanged
  - Update carousel data state
  - Show loading state during regeneration
  - Handle errors gracefully
  - Update undo/redo history

#### 1.3 API Support for Single Slide
- **File**: \`app/api/generate/route.ts\` or new endpoint
- Add support for regenerating a single slide
- Endpoint should accept:
  - Topic/context
  - Slide index to regenerate
  - Previous slides for context
  - User preferences (tone, style, etc.)
- Return only the regenerated slide data

### Part 2: Regenerate Full Carousel

#### 2.1 UI Component for Full Carousel
- **File**: \`components/carousel-generator.tsx\` or \`components/carousel-preview.tsx\`
- Add "Regenerate Carousel" button in the carousel editor
- Button placement options:
  - Top toolbar (next to Export, Save & Exit)
  - Bottom action panel
  - Carousel preview header
- Use clear label: "Regenerate All" or "Regenerate Carousel"
- Show loading state for entire carousel during regeneration
- Disable button during regeneration

#### 2.2 Full Carousel Regeneration Logic
- **File**: \`components/carousel-generator.tsx\`
- Create \`handleRegenerateCarousel()\` function
- Function should:
  - Use existing carousel generation logic
  - Preserve user's topic and preferences
  - Replace all slides with new AI-generated content
  - Update carousel data state
  - Show loading state
  - Handle errors gracefully
  - Update undo/redo history
  - Optionally: Ask for confirmation before regenerating (to prevent accidental loss)

#### 2.3 API Support for Full Carousel
- **File**: \`app/api/generate/route.ts\`
- Reuse existing carousel generation endpoint
- Ensure it can be called multiple times with same parameters
- Return complete carousel data

### Part 3: Shared Functionality

#### 3.1 State Management
- **File**: \`components/carousel-generator.tsx\`
- Add loading states:
  - \`isRegeneratingSlide: number | null\` - Track which slide is regenerating
  - \`isRegeneratingCarousel: boolean\` - Track full carousel regeneration
- Update history/undo-redo to support both regeneration types
- Ensure proper state updates after regeneration

#### 3.2 User Experience Enhancements
- Show loading indicators:
  - Individual slide: spinner/loading overlay on the specific slide
  - Full carousel: loading overlay on entire preview area
- Disable buttons during regeneration to prevent duplicates
- Show success/error toast notifications
- Add "Undo regenerate" functionality (via existing undo system)
- Consider: Add animation/transition when content updates
- Consider: Show preview of changes before applying (optional)

#### 3.3 Error Handling
- Handle API failures gracefully
- Show user-friendly error messages
- Allow retry on failure
- Preserve existing content if regeneration fails
- Handle edge cases:
  - Regeneration when slide is being edited
  - Regeneration of first slide (hook slide)
  - Regeneration when carousel has only one slide
  - Multiple simultaneous regeneration attempts

## Design Considerations

### Button Styles
- **Single slide button**: Secondary/ghost style, icon-only or icon + text
- **Full carousel button**: Primary or secondary style, clear label
- Icon size: 16-20px for slide buttons, 18-24px for carousel button
- Hover states: Subtle background change
- Loading states: Spinner icon or disabled state

### Visual Feedback
- Loading overlay on regenerating slide/carousel
- Success animation (optional)
- Error message display
- Toast notifications for completion

## Acceptance Criteria

### Single Slide Regeneration
- [ ] Regenerate button visible on each slide in carousel preview
- [ ] Button triggers regeneration of only the selected slide
- [ ] Other slides remain unchanged during regeneration
- [ ] Loading state shown on the specific slide being regenerated
- [ ] Success/error feedback provided to user
- [ ] Regeneration works for any slide (first, middle, last)
- [ ] Regeneration preserves slide styling (background, layout, etc.)
- [ ] Regeneration updates undo/redo history
- [ ] Button disabled during regeneration to prevent duplicates

### Full Carousel Regeneration
- [ ] "Regenerate Carousel" button visible in carousel editor
- [ ] Button triggers regeneration of entire carousel
- [ ] All slides replaced with new AI-generated content
- [ ] Loading state shown during regeneration
- [ ] Success/error feedback provided to user
- [ ] User preferences (topic, tone, style) preserved
- [ ] Regeneration updates undo/redo history
- [ ] Button disabled during regeneration
- [ ] Optionally: Confirmation dialog before regenerating

### General Requirements
- [ ] Both features work correctly with existing carousel features
- [ ] Works with templates system
- [ ] Respects user's tone/style preferences
- [ ] Handles errors gracefully
- [ ] No data loss during regeneration
- [ ] Proper state management and cleanup

## Technical Notes

- Reuse existing AI generation logic where possible
- Single slide regeneration needs slide context (previous slides, topic, goal)
- Full carousel regeneration can use existing generation flow
- Ensure regenerated content maintains same structure as original
- Test with different slide types (title, text, list, etc.)
- Consider rate limiting for regeneration requests
- May need to track regeneration count per carousel/slide

## Files to Modify

1. \`components/carousel-preview.tsx\` - Add regenerate button UI for slides
2. \`components/carousel-generator.tsx\` - Add regenerate logic and full carousel button
3. \`components/slide-card.tsx\` - Add regenerate button to individual slides (if needed)
4. \`app/api/generate/route.ts\` - Add single slide regeneration endpoint (if needed)
5. \`lib/carousel-types.ts\` - Verify types support regeneration

## Related Features

- Integrates with existing AI generation system
- Works with template system
- Respects user preferences and settings
- Uses existing undo/redo functionality
`

async function main() {
  try {
    console.log("🚀 Creating Linear task for regenerate functionality...\n")

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

