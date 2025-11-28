/**
 * Test script for Linear API integration
 * 
 * Run with: npm run test:linear
 * Or: npx tsx test-linear.ts
 */

import { createLinearIssue } from "./lib/linear"

async function testLinearIssue() {
  try {
    console.log("Testing Linear API...")
    console.log("LINEAR_API_KEY:", process.env.LINEAR_API_KEY ? "✓ Set" : "✗ Missing")
    
    // Replace "abcdefg" with your actual teamId from Linear
    const teamId = process.env.LINEAR_TEAM_ID || "abcdefg" // Your teamId from Linear
    
    const result = await createLinearIssue(
      "Test issue from Cursor",
      "This issue was created via Linear API",
      teamId
    )
    
    console.log("\n✅ Success!")
    console.log("Response:", JSON.stringify(result, null, 2))
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error)
    if (error instanceof Error && error.stack) {
      console.error("Stack:", error.stack)
    }
  }
}

testLinearIssue()

