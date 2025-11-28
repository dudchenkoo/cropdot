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
    
    // First, get all teams to find the CRO team
    console.log("\n📋 Fetching teams...")
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
    
    // Find CRO team (Cropdot)
    const croTeam = teams.find(team => 
      team.name.toLowerCase().includes("cropdot") || 
      team.key.toLowerCase() === "cro"
    )
    
    if (!croTeam) {
      console.error("\n❌ CRO team (Cropdot) not found!")
      console.log("Available teams:", teams.map(t => t.name).join(", "))
      return
    }
    
    console.log(`\n✅ Found CRO team: ${croTeam.name} (ID: ${croTeam.id})`)
    
    // Create test issue in CRO team
    console.log("\n📝 Creating test issue...")
    const result = await createLinearIssue(
      "Test issue from Cursor",
      "This issue was created via Linear API for the CRO team",
      croTeam.id
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

