#!/usr/bin/env tsx

/**
 * Script to create a Linear task for researching Taplio
 * and analyzing what features we can adopt for Cropdot
 */

import { createLinearIssue, getLinearViewer } from "../lib/linear"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.local" })

async function createTaplioResearchTask() {
  try {
    console.log("Creating Taplio research task in Linear...")

    // Get current user for auto-assignment
    const viewerResponse = await getLinearViewer()
    const assigneeId = viewerResponse.data?.viewer.id

    if (!assigneeId) {
      throw new Error("Could not get current user ID from Linear")
    }

    const title = "Research Taplio and identify features for Cropdot"
    
    const description = `## Research Taplio (https://taplio.com/)

### Objective
Research Taplio's features, UX, and business model to identify opportunities for Cropdot.

### Key Areas to Investigate

#### 1. Content Creation Features
- AI-powered content creation (trained on 500+ million LinkedIn posts)
- Post generation and editing workflow
- Carousel generation capabilities
- Content inspiration library (5+ million viral posts)
- Text formatting tools

#### 2. User Experience & Interface
- Dashboard layout and navigation
- Content editor interface
- Scheduling interface
- Analytics dashboard design
- Mobile experience

#### 3. Business Model & Pricing
- Pricing structure and tiers
- Free trial approach
- Feature gating strategy
- Value proposition messaging

#### 4. Advanced Features
- LinkedIn Chrome Extension functionality
- Engagement tools
- Analytics and tracking
- Kanban view for content management
- AI-powered engagement features

#### 5. What We Can Adopt
- [ ] Feature ideas that align with Cropdot's vision
- [ ] UX patterns that improve our workflow
- [ ] Pricing strategies we could consider
- [ ] Marketing/positioning insights
- [ ] Technical approaches worth exploring

### Deliverables
- [ ] Document key findings in a markdown file
- [ ] Create a prioritized list of features to consider
- [ ] Identify UX improvements we can implement
- [ ] Note any competitive advantages we should maintain

### Resources
- Website: https://taplio.com/
- Free tools to test: LinkedIn Carousel Generator, LinkedIn Text Formatter
- Chrome Extension: Taplio X

### Notes
Focus on features that align with Cropdot's core value proposition: fast, high-quality LinkedIn carousel generation.`

    const labelNames = ["research", "competitor-analysis", "product"]

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

createTaplioResearchTask()








