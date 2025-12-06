/**
 * Script to list all available labels in Linear workspace
 * 
 * Usage: npm run list:labels
 */

import { config } from "dotenv"
import { resolve } from "path"
import { getLinearLabels } from "../lib/linear"

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") })

async function main() {
  try {
    console.log("📋 Fetching labels from Linear workspace...\n")

    // Check for API key
    if (!process.env.LINEAR_API_KEY) {
      throw new Error("LINEAR_API_KEY is not set in .env.local")
    }

    const labelsResponse = await getLinearLabels()
    
    if (!labelsResponse.data?.issueLabels.nodes) {
      console.log("No labels found in Linear workspace.")
      return
    }

    const labels = labelsResponse.data.issueLabels.nodes

    if (labels.length === 0) {
      console.log("No labels found in Linear workspace.")
      console.log("\n💡 To create labels:")
      console.log("   1. Go to Linear workspace")
      console.log("   2. Navigate to Settings → Labels")
      console.log("   3. Create labels: backend, frontend, integrations, database, feature, etc.")
      return
    }

    console.log(`✅ Found ${labels.length} label(s):\n`)
    
    labels.forEach((label, index) => {
      console.log(`${index + 1}. ${label.name} (ID: ${label.id})`)
      console.log(`   Color: ${label.color}`)
    })

    console.log("\n💡 To add more labels:")
    console.log("   1. Go to Linear workspace")
    console.log("   2. Navigate to Settings → Labels")
    console.log("   3. Create the labels you need")
  } catch (error) {
    console.error("\n❌ Error:", error)
    if (error instanceof Error) {
      console.error(`   ${error.message}`)
    }
    process.exit(1)
  }
}

main()








