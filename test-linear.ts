/**
 * Test script for Linear API integration
 * 
 * Run with: npm run test:linear
 * Or: npx tsx test-linear.ts
 */

import { createLinearIssue, getLinearTeams } from "./lib/linear"

async function testLinearIssue() {
  try {
    console.log("Testing Linear API...")
    console.log("LINEAR_API_KEY:", process.env.LINEAR_API_KEY ? "✓ Set" : "✗ Missing")
    
    // Use CRO team ID directly (cro is the teamId)
    const teamId = process.env.LINEAR_TEAM_ID || "cro"
    
    console.log(`\n📝 Creating test issue in CRO team (ID: ${teamId})...`)
    const result = await createLinearIssue(
      "Test issue from Cursor",
      "This issue was created via Linear API for the CRO team",
      teamId
    )
    
    if (result.errors) {
      console.error("\n❌ Error creating issue:", result.errors)
      return
    }
    
    console.log("\n✅ Success! Issue created:")
    console.log("Response:", JSON.stringify(result, null, 2))
    
    if (result.data?.issueCreate.issue) {
      const issue = result.data.issueCreate.issue
      console.log(`\n🎉 Issue created: ${issue.identifier} - ${issue.title}`)
      console.log(`   ID: ${issue.id}`)
    }
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error)
    if (error instanceof Error && error.stack) {
      console.error("Stack:", error.stack)
    }
  }
}

testLinearIssue()

