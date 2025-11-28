/**
 * Test script for Linear API integration
 * 
 * Run with: npm run test:linear
 * Or: npx tsx test-linear.ts
 */

import { config } from "dotenv"
import { resolve } from "path"

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") })

import { createLinearIssue, getLinearTeams, getLinearViewer } from "./lib/linear"

async function testLinearIssue() {
  try {
    console.log("Testing Linear API...")
    console.log("LINEAR_API_KEY:", process.env.LINEAR_API_KEY ? "✓ Set" : "✗ Missing")
    
    // Get teams to find CRO team UUID
    console.log("\n📋 Fetching teams to find CRO team...")
    const teamsResponse = await getLinearTeams()
    
    if (teamsResponse.errors) {
      console.error("Error fetching teams:", teamsResponse.errors)
      return
    }
    
    const teams = teamsResponse.data?.teams.nodes || []
    console.log(`Found ${teams.length} team(s):`)
    teams.forEach(team => {
      console.log(`  - ${team.name} (${team.key}): ${team.id}`)
    })
    
    // Find CRO team by key "cro" or name containing "cropdot"
    const croTeam = teams.find(team => 
      team.key.toLowerCase() === "cro" ||
      team.name.toLowerCase().includes("cropdot")
    )
    
    if (!croTeam) {
      console.error("\n❌ CRO team not found!")
      console.log("Available teams:", teams.map(t => `${t.name} (${t.key})`).join(", "))
      return
    }
    
    console.log(`\n✅ Found CRO team: ${croTeam.name} (Key: ${croTeam.key}, UUID: ${croTeam.id})`)
    
    // Get current user for auto-assignment
    console.log("\n👤 Getting current user for auto-assignment...")
    const viewerResponse = await getLinearViewer()
    
    let assigneeId: string | undefined
    if (!viewerResponse.errors && viewerResponse.data?.viewer) {
      const viewer = viewerResponse.data.viewer
      assigneeId = viewer.id
      console.log(`✅ Will assign to: ${viewer.name} (${viewer.email})`)
    } else {
      console.log("⚠️  Could not get current user, issue will be unassigned")
    }
    
    // Use the UUID as teamId
    const teamId = croTeam.id
    
    console.log(`\n📝 Creating test issue in CRO team (UUID: ${teamId})...`)
    const result = await createLinearIssue(
      "Test issue from Cursor",
      "This issue was created via Linear API for the CRO team",
      teamId,
      assigneeId // Auto-assign to current user if available
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

