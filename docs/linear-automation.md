# Linear API Automation

## Overview

The project is integrated with Linear API for automatic issue creation. This allows automating the process of creating issues from various parts of the application.

## Setup

### 1. API Key

The Linear API key should be configured and stored in `.env.local`:

```bash
LINEAR_API_KEY=[YOUR_LINEAR_API_KEY]
```

⚠️ **Important**: Never commit API keys to the repository. Store them securely in `.env.local` which is gitignored.

### 2. CRO Team

The project is configured to work with the **CRO (Cropdot)** team in Linear:
- **Team name**: cropdot
- **Team key**: CRO
- **Team UUID**: automatically detected when using the functions

## Available Functions

### `createLinearIssue(title, description, teamId, assigneeId, labelNames)`

Creates a new issue in Linear.

**Parameters:**
- `title` (string) - Issue title
- `description` (string, optional) - Issue description
- `teamId` (string, optional) - Team UUID in Linear (will auto-find CRO team if not provided)
- `assigneeId` (string, optional) - User UUID to assign the issue to
- `labelNames` (string[], optional) - Array of label names to add to the issue (e.g., `["backend", "frontend", "feature"]`)

**Labels:**
Common labels used in the project:
- `backend` - Backend development tasks
- `frontend` - Frontend development tasks
- `integrations` - Integration with external services
- `database` - Database-related tasks
- `feature` - New features
- `bug` - Bug fixes
- `ui/ux` - Design and UX tasks
- `monetization` - Monetization-related tasks
- `performance` - Performance optimization
- `security` - Security tasks
- `testing` - Testing and QA
- `documentation` - Documentation tasks

See `docs/linear-labels.md` for complete label guide.

**Returns:**
```typescript
{
  data?: {
    issueCreate: {
      success: boolean
      issue: {
        id: string
        title: string
        identifier: string  // e.g., "CRO-1"
      }
    }
  }
  errors?: Array<{
    message: string
  }>
}
```

**Usage Example:**

```typescript
import { createLinearIssue } from "@/lib/linear"

// Create an issue in the CRO team with labels
const result = await createLinearIssue(
  "Fix bug in carousel generator",
  "Issue with preview display on mobile devices",
  "b013153c-d03b-4f78-a8b6-f374e664b3ab", // CRO team UUID (optional)
  undefined, // assigneeId (optional)
  ["frontend", "bug"] // Labels: frontend, bug
)

if (result.data?.issueCreate.success) {
  const issue = result.data.issueCreate.issue
  console.log(`Issue created: ${issue.identifier} - ${issue.title}`)
}
```

### `getLinearTeams()`

Retrieves a list of all teams in Linear. Useful for finding team UUIDs.

### `getLinearLabels()`

Retrieves a list of all labels in Linear workspace. Useful for finding available labels.

**Returns:**
```typescript
{
  data?: {
    issueLabels: {
      nodes: Array<{
        id: string      // Label UUID
        name: string    // Label name (e.g., "backend", "frontend")
        color: string   // Label color
      }>
    }
  }
}
```

**Usage Example:**

```typescript
import { getLinearLabels } from "@/lib/linear"

const labels = await getLinearLabels()
const backendLabel = labels.data?.issueLabels.nodes.find(label => label.name === "backend")
console.log(`Backend label ID: ${backendLabel?.id}`)
```

**Returns:**
```typescript
{
  data?: {
    teams: {
      nodes: Array<{
        id: string      // Team UUID
        name: string    // Team name
        key: string     // Team key (e.g., "CRO")
      }>
    }
  }
}
```

**Usage Example:**

```typescript
import { getLinearTeams } from "@/lib/linear"

const teams = await getLinearTeams()
const croTeam = teams.data?.teams.nodes.find(team => team.key === "CRO")
console.log(`CRO team UUID: ${croTeam?.id}`)
```

## Testing

To test issue creation, use the `test-linear.ts` script:

```bash
npm run test:linear
```

The script:
1. Automatically loads environment variables from `.env.local`
2. Finds the CRO team by key
3. Creates a test issue "Test issue from Cursor"
4. Outputs the result to the console

**Example Output:**
```
✅ Found CRO team: cropdot (Key: CRO, UUID: b013153c-d03b-4f78-a8b6-f374e664b3ab)
🎉 Issue created: CRO-1 - Test issue from Cursor
```

## Usage in API Routes

Functions can be used in Next.js API routes for automatic issue creation:

```typescript
// app/api/bug-report/route.ts
import { createLinearIssue, getLinearTeams } from "@/lib/linear"

export async function POST(request: Request) {
  const { title, description } = await request.json()
  
  // Find CRO team
  const teams = await getLinearTeams()
  const croTeam = teams.data?.teams.nodes.find(team => team.key === "CRO")
  
  if (!croTeam) {
    return Response.json({ error: "CRO team not found" }, { status: 500 })
  }
  
  // Create issue
  const result = await createLinearIssue(
    title,
    description,
    croTeam.id
  )
  
  if (result.errors) {
    return Response.json({ error: result.errors }, { status: 500 })
  }
  
  return Response.json({ 
    success: true,
    issue: result.data?.issueCreate.issue 
  })
}
```

## Usage in Server Components

Functions can be called in Next.js Server Components:

```typescript
// app/bug-report/page.tsx
import { createLinearIssue, getLinearTeams } from "@/lib/linear"

export default async function BugReportPage() {
  // Create issue on page load
  const teams = await getLinearTeams()
  const croTeam = teams.data?.teams.nodes.find(team => team.key === "CRO")
  
  if (croTeam) {
    await createLinearIssue(
      "Automatic issue from Server Component",
      "This issue was created automatically",
      croTeam.id
    )
  }
  
  return <div>Issue created!</div>
}
```

## Use Cases

### 1. Automatic Issue Creation on Errors

```typescript
// In error boundary or error handler
try {
  // application code
} catch (error) {
  await createLinearIssue(
    `Error: ${error.message}`,
    `Stack trace: ${error.stack}`,
    croTeamId
  )
}
```

### 2. Creating Issues from Feedback Forms

```typescript
// When submitting feedback form
const result = await createLinearIssue(
  `Feedback: ${formData.subject}`,
  formData.message,
  croTeamId
)
```

### 3. Automatic Bug Issue Creation

```typescript
// When detecting a bug in the system
await createLinearIssue(
  `Bug: ${bugTitle}`,
  `Description: ${bugDescription}\nSteps to reproduce: ${steps}`,
  croTeamId
)
```

## Requirements

- `LINEAR_API_KEY` must be set in `.env.local`
- API key must have permissions to create issues in the CRO team
- Functions work only on the server (API routes, Server Components)

## Linear API Documentation

Full Linear GraphQL API documentation:
- [Linear API Docs](https://developers.linear.app/docs/graphql/working-with-the-graphql-api)
- [Issue Mutations](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#mutations)

## Files

- `lib/linear.ts` - Main functions for working with Linear API
- `test-linear.ts` - Test script for verifying issue creation
- `.env.local` - Environment variables (not committed to git)

## Security

⚠️ **Important:**
- API key is stored in `.env.local` and not committed to git
- `.env.local` file is added to `.gitignore`
- Do not pass API key to client-side code
- Use functions only in Server Components or API routes
