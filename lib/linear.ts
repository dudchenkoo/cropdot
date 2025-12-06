/**
 * Linear API helper functions
 * 
 * Provides functions to interact with Linear's GraphQL API
 * for creating issues, fetching teams, and managing assignments.
 */

const LINEAR_API_URL = "https://api.linear.app/graphql"

interface LinearIssueCreateResponse {
  data?: {
    issueCreate: {
      success: boolean
      issue: {
        id: string
        title: string
        identifier: string
      }
    }
  }
  errors?: Array<{
    message: string
    extensions?: {
      code: string
    }
  }>
}

interface LinearIssueUpdateResponse {
  data?: {
    issueUpdate: {
      success: boolean
      issue: {
        id: string
        title: string
        identifier: string
      }
    }
  }
  errors?: Array<{
    message: string
    extensions?: {
      code: string
    }
  }>
}

interface LinearTeam {
  id: string
  name: string
  key: string
}

interface LinearTeamsResponse {
  data?: {
    teams: {
      nodes: LinearTeam[]
    }
  }
  errors?: Array<{
    message: string
  }>
}

interface LinearViewer {
  id: string
  name: string
  email: string
}

interface LinearViewerResponse {
  data?: {
    viewer: LinearViewer
  }
  errors?: Array<{
    message: string
  }>
}

interface LinearLabel {
  id: string
  name: string
  color: string
}

interface LinearLabelsResponse {
  data?: {
    issueLabels: {
      nodes: LinearLabel[]
    }
  }
  errors?: Array<{
    message: string
  }>
}

interface LinearIssue {
  id: string
  identifier: string
  title: string
}

interface LinearIssueResponse {
  data?: {
    issue: LinearIssue
  }
  errors?: Array<{
    message: string
  }>
}

/**
 * Get Linear API key from environment variables
 */
function getLinearApiKey(): string {
  const apiKey = process.env.LINEAR_API_KEY
  if (!apiKey) {
    throw new Error("LINEAR_API_KEY is not set in environment variables")
  }
  return apiKey
}

/**
 * Make a GraphQL request to Linear API
 */
async function linearRequest<T>(query: string, variables?: Record<string, any>): Promise<T> {
  const apiKey = getLinearApiKey()

  const response = await fetch(LINEAR_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Linear API error response:", errorText)
    throw new Error(`Linear API request failed: ${response.status} ${response.statusText}\nResponse: ${errorText}`)
  }

  const data = await response.json()

  if (data.errors) {
    console.error("Linear API GraphQL errors:", JSON.stringify(data.errors, null, 2))
    throw new Error(`Linear API errors: ${JSON.stringify(data.errors)}`)
  }

  return data as T
}

/**
 * Get all teams in Linear workspace
 */
export async function getLinearTeams(): Promise<LinearTeamsResponse> {
  const query = `
    query {
      teams {
        nodes {
          id
          name
          key
        }
      }
    }
  `

  try {
    return await linearRequest<LinearTeamsResponse>(query)
  } catch (error) {
    console.error("Error fetching Linear teams:", error)
    throw error
  }
}

/**
 * Get current authenticated user (viewer) information
 */
export async function getLinearViewer(): Promise<LinearViewerResponse> {
  const query = `
    query {
      viewer {
        id
        name
        email
      }
    }
  `

  try {
    return await linearRequest<LinearViewerResponse>(query)
  } catch (error) {
    console.error("Error fetching Linear viewer:", error)
    throw error
  }
}

/**
 * Get all labels in Linear workspace
 */
export async function getLinearLabels(): Promise<LinearLabelsResponse> {
  const query = `
    query {
      issueLabels {
        nodes {
          id
          name
          color
        }
      }
    }
  `

  try {
    return await linearRequest<LinearLabelsResponse>(query)
  } catch (error) {
    console.error("Error fetching Linear labels:", error)
    throw error
  }
}

/**
 * Create a new issue in Linear
 * 
 * @param title - Issue title
 * @param description - Issue description (optional)
 * @param teamId - Team UUID (optional, will try to find CRO team if not provided)
 * @param assigneeId - User UUID to assign the issue to (optional)
 * @param labelNames - Array of label names to add to the issue (optional)
 * @returns Created issue information
 */
export async function createLinearIssue(
  title: string,
  description?: string,
  teamId?: string,
  assigneeId?: string,
  labelNames?: string[]
): Promise<LinearIssueCreateResponse> {
  // If teamId not provided, try to find CRO team
  let targetTeamId = teamId
  if (!targetTeamId) {
    const teamsResponse = await getLinearTeams()
    const croTeam = teamsResponse.data?.teams.nodes.find(
      (team) => team.key === "CRO" || team.name.toLowerCase().includes("cropdot")
    )
    if (!croTeam) {
      throw new Error("CRO team not found in Linear workspace")
    }
    targetTeamId = croTeam.id
  }

  // Convert label names to label IDs if provided
  let labelIds: string[] | undefined
  if (labelNames && labelNames.length > 0) {
    const labelsResponse = await getLinearLabels()
    const allLabels = labelsResponse.data?.issueLabels.nodes || []
    labelIds = labelNames
      .map(name => {
        const label = allLabels.find(l => l.name.toLowerCase() === name.toLowerCase())
        if (!label) {
          console.warn(`Label "${name}" not found in Linear workspace`)
        }
        return label?.id
      })
      .filter((id): id is string => id !== undefined)
  }

  const mutation = `
    mutation CreateIssue($title: String!, $description: String, $teamId: String!, $assigneeId: String, $labelIds: [String!]) {
      issueCreate(
        input: {
          title: $title
          description: $description
          teamId: $teamId
          assigneeId: $assigneeId
          labelIds: $labelIds
        }
      ) {
        success
        issue {
          id
          title
          identifier
        }
      }
    }
  `

  const variables: Record<string, any> = {
    title,
    teamId: targetTeamId,
  }

  if (description) {
    variables.description = description
  }

  if (assigneeId) {
    variables.assigneeId = assigneeId
  }

  if (labelIds && labelIds.length > 0) {
    variables.labelIds = labelIds
  }

  try {
    return await linearRequest<LinearIssueCreateResponse>(mutation, variables)
  } catch (error) {
    console.error("Error creating Linear issue:", error)
    throw error
  }
}

/**
 * Get issue by identifier (e.g., "CRO-14")
 */
async function getIssueByIdentifier(identifier: string): Promise<LinearIssue | null> {
  // Linear API supports querying by identifier directly
  const query = `
    query GetIssue($identifier: String!) {
      issue(id: $identifier) {
        id
        identifier
        title
      }
    }
  `

  try {
    const response = await linearRequest<LinearIssueResponse>(query, { identifier })
    return response.data?.issue || null
  } catch (error) {
    console.error(`Error fetching issue ${identifier}:`, error)
    return null
  }
}

/**
 * Update an existing issue in Linear
 * 
 * @param issueId - Issue UUID or identifier (e.g., "CRO-14")
 * @param updates - Object with fields to update
 * @param updates.title - New title (optional)
 * @param updates.description - New description (optional)
 * @param updates.assigneeId - New assignee UUID (optional)
 * @param updates.labelNames - Array of label names to add (optional, will convert to labelIds)
 * @returns Updated issue information
 */
export async function updateLinearIssue(
  issueId: string,
  updates: {
    title?: string
    description?: string
    assigneeId?: string
    labelNames?: string[]
  }
): Promise<LinearIssueUpdateResponse> {
  // If issueId looks like an identifier (e.g., "CRO-14"), find the UUID first
  let targetIssueId = issueId
  if (issueId.includes("-") && !issueId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    // Looks like an identifier, not a UUID
    const issue = await getIssueByIdentifier(issueId)
    if (!issue) {
      throw new Error(`Issue with identifier ${issueId} not found`)
    }
    targetIssueId = issue.id
  }
  
  // Convert label names to label IDs if provided
  let labelIds: string[] | undefined
  if (updates.labelNames && updates.labelNames.length > 0) {
    const labelsResponse = await getLinearLabels()
    const allLabels = labelsResponse.data?.issueLabels.nodes || []
    labelIds = updates.labelNames
      .map(name => {
        const label = allLabels.find(l => l.name.toLowerCase() === name.toLowerCase())
        if (!label) {
          console.warn(`Label "${name}" not found in Linear workspace`)
        }
        return label?.id
      })
      .filter((id): id is string => id !== undefined)
    
    if (labelIds.length === 0) {
      throw new Error(`None of the provided labels (${updates.labelNames.join(", ")}) were found in Linear workspace`)
    }
  }
  
  // Build input object with only provided fields
  const input: Record<string, any> = {}
  
  if (updates.title !== undefined) {
    input.title = updates.title
  }
  
  if (updates.description !== undefined) {
    input.description = updates.description
  }
  
  if (updates.assigneeId !== undefined) {
    input.assigneeId = updates.assigneeId
  }
  
  if (labelIds !== undefined && labelIds.length > 0) {
    input.labelIds = labelIds
  }

  // If no fields to update, return early
  if (Object.keys(input).length === 0) {
    throw new Error("No fields provided to update")
  }

  const mutation = `
    mutation UpdateIssue($id: String!, $input: IssueUpdateInput!) {
      issueUpdate(
        id: $id
        input: $input
      ) {
        success
        issue {
          id
          title
          identifier
        }
      }
    }
  `

  const variables: Record<string, any> = {
    id: targetIssueId,
    input,
  }

  try {
    return await linearRequest<LinearIssueUpdateResponse>(mutation, variables)
  } catch (error) {
    console.error("Error updating Linear issue:", error)
    throw error
  }
}

