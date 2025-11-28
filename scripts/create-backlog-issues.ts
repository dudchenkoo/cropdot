/**
 * Script to create Linear issues from backlog markdown files
 * 
 * Run with: npm run create-backlog-issues
 * Or: npx tsx scripts/create-backlog-issues.ts
 */

import { config } from "dotenv"
import { resolve } from "path"
import { readFileSync, readdirSync } from "fs"
import { createLinearIssue, getLinearTeams } from "../lib/linear"

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") })

interface BacklogIssue {
  number: string
  title: string
  problemDescription: string
  impact: string
  attemptedFixes: string
  currentState: string
  filesInvolved: string
  futureInvestigation: string
  relatedCode: string
  notes?: string
}

function parseBacklogFile(filePath: string): BacklogIssue | null {
  try {
    const content = readFileSync(filePath, "utf-8")
    const lines = content.split("\n")

    const issue: Partial<BacklogIssue> = {}

    // Extract issue number from filename (e.g., "001-tooltip-positioning.md" -> "001")
    const filename = filePath.split("/").pop() || ""
    issue.number = filename.match(/^(\d+)/)?.[1] || ""

    // Extract title (first line after #)
    const titleMatch = content.match(/^# Issue #\d+: (.+)$/m)
    issue.title = titleMatch?.[1] || "Untitled Issue"

    // Extract sections
    const sections = {
      problemDescription: extractSection(content, "## Problem Description", "## Impact"),
      impact: extractSection(content, "## Impact", "## Attempted Fixes"),
      attemptedFixes: extractSection(content, "## Attempted Fixes", "## Current State"),
      currentState: extractSection(content, "## Current State", "## Files Involved"),
      filesInvolved: extractSection(content, "## Files Involved", "## Future Investigation"),
      futureInvestigation: extractSection(content, "## Future Investigation", "## Related Code"),
      relatedCode: extractSection(content, "## Related Code", "## Notes"),
      notes: extractSection(content, "## Notes", null),
    }

    return {
      number: issue.number || "",
      title: issue.title,
      ...sections,
    } as BacklogIssue
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error)
    return null
  }
}

function extractSection(content: string, startMarker: string, endMarker: string | null): string {
  const startIndex = content.indexOf(startMarker)
  if (startIndex === -1) return ""

  const sectionStart = startIndex + startMarker.length
  const sectionEnd = endMarker ? content.indexOf(endMarker, sectionStart) : content.length

  if (sectionEnd === -1 && endMarker) return content.substring(sectionStart).trim()
  return content.substring(sectionStart, sectionEnd).trim()
}

function formatDescription(issue: BacklogIssue): string {
  let description = `## Problem Description\n\n${issue.problemDescription}\n\n`
  
  if (issue.impact) {
    description += `## Impact\n\n${issue.impact}\n\n`
  }

  if (issue.attemptedFixes) {
    description += `## Attempted Fixes\n\n${issue.attemptedFixes}\n\n`
  }

  if (issue.currentState) {
    description += `## Current State\n\n${issue.currentState}\n\n`
  }

  if (issue.filesInvolved) {
    description += `## Files Involved\n\n${issue.filesInvolved}\n\n`
  }

  if (issue.futureInvestigation) {
    description += `## Future Investigation\n\n${issue.futureInvestigation}\n\n`
  }

  if (issue.relatedCode) {
    description += `## Related Code\n\n${issue.relatedCode}\n\n`
  }

  if (issue.notes) {
    description += `## Notes\n\n${issue.notes}\n\n`
  }

  description += `---\n\n*Created from backlog issue #${issue.number}*`

  return description
}

async function createBacklogIssues() {
  try {
    console.log("📋 Creating Linear issues from backlog...\n")

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

    // Read backlog files
    const backlogDir = resolve(process.cwd(), "docs/backlog")
    const files = readdirSync(backlogDir)
      .filter(file => file.match(/^\d{3}-.+\.md$/) && file !== "README.md")
      .sort()
      .map(file => resolve(backlogDir, file))

    console.log(`📁 Found ${files.length} backlog file(s)\n`)

    // Parse and create issues
    for (const filePath of files) {
      const issue = parseBacklogFile(filePath)

      if (!issue) {
        console.error(`⚠️  Skipping ${filePath} - failed to parse`)
        continue
      }

      console.log(`📝 Creating issue: ${issue.title} (#${issue.number})...`)

      const description = formatDescription(issue)
      const title = `[Backlog #${issue.number}] ${issue.title}`

      const result = await createLinearIssue(
        title,
        description,
        croTeam.id
      )

      if (result.errors) {
        console.error(`❌ Error creating issue #${issue.number}:`, result.errors)
        continue
      }

      if (result.data?.issueCreate.issue) {
        const createdIssue = result.data.issueCreate.issue
        console.log(`✅ Created: ${createdIssue.identifier} - ${createdIssue.title}`)
        console.log(`   ID: ${createdIssue.id}\n`)
      } else {
        console.error(`❌ Issue #${issue.number} was not created\n`)
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    console.log("✨ Done! All backlog issues have been created in Linear.")
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error)
    if (error instanceof Error && error.stack) {
      console.error("Stack:", error.stack)
    }
  }
}

createBacklogIssues()

