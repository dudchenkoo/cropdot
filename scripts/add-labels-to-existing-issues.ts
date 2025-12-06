/**
 * Script to add labels to existing Linear issues
 * 
 * Usage: npm run add:labels
 * 
 * Edit the ISSUES array below to specify which issues to update and what labels to add.
 */

import { config } from "dotenv"
import { resolve } from "path"
import { updateLinearIssue, getLinearViewer } from "../lib/linear"

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") })

// Define which issues to update and what labels to add
// Note: Labels must exist in Linear workspace. Use "Feature" (capitalized) if "feature" doesn't exist.
// Run "npm run list:labels" to see available labels.
const ISSUES = [
  {
    issueId: "CRO-11", // Supabase and Google Console
    labels: ["Feature"], // Using existing "Feature" label. Add "backend", "integrations", "database" in Linear UI
  },
  {
    issueId: "CRO-12", // Regenerate button (single slide)
    labels: ["Feature"], // Using existing "Feature" label. Add "frontend" in Linear UI
  },
  {
    issueId: "CRO-13", // Regenerate functionality (full)
    labels: ["Feature"], // Using existing "Feature" label. Add "frontend" in Linear UI
  },
  {
    issueId: "CRO-14", // Pricing system
    labels: ["Feature"], // Using existing "Feature" label. Add "backend", "frontend", "integrations", "monetization" in Linear UI
  },
]

async function main() {
  try {
    console.log("🚀 Adding labels to existing Linear issues...\n")

    // Check for API key
    if (!process.env.LINEAR_API_KEY) {
      throw new Error("LINEAR_API_KEY is not set in .env.local")
    }

    // Get current user for verification
    console.log("👤 Verifying Linear connection...")
    const viewerResponse = await getLinearViewer()
    
    if (!viewerResponse.data?.viewer) {
      throw new Error("Failed to fetch current user from Linear")
    }

    console.log(`✅ Connected as: ${viewerResponse.data.viewer.name}\n`)

    // Update each issue
    for (const { issueId, labels } of ISSUES) {
      console.log(`📝 Updating ${issueId} with labels: ${labels.join(", ")}...`)
      
      try {
        const result = await updateLinearIssue(issueId, {
          labelNames: labels,
        })

        if (result.errors) {
          console.error(`   ❌ Error: ${JSON.stringify(result.errors)}`)
          continue
        }

        if (!result.data?.issueUpdate.success) {
          console.error(`   ❌ Failed to update issue`)
          continue
        }

        const issue = result.data.issueUpdate.issue
        console.log(`   ✅ Successfully updated: ${issue.identifier} - ${issue.title}`)
        console.log(`      URL: https://linear.app/cropdot/issue/${issue.identifier}\n`)
      } catch (error) {
        console.error(`   ❌ Error updating ${issueId}:`, error instanceof Error ? error.message : error)
        console.log()
      }
    }

    console.log("🎉 Finished updating issues!\n")
  } catch (error) {
    console.error("\n❌ Error:", error)
    if (error instanceof Error) {
      console.error(`   ${error.message}`)
    }
    process.exit(1)
  }
}

main()

