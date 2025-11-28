/**
 * Linear API helper functions
 * 
 * Documentation: https://developers.linear.app/docs/graphql/working-with-the-graphql-api
 */

interface LinearIssueCreateInput {
  title: string
  description?: string
  teamId: string
}

interface LinearIssue {
  id: string
  title: string
  identifier: string
}

interface LinearIssueCreateResponse {
  data?: {
    issueCreate: {
      success: boolean
      issue: LinearIssue | null
    }
  }
  errors?: Array<{
    message: string
    extensions?: {
      code?: string
    }
  }>
}

/**
 * Creates an issue in Linear using the GraphQL API
 * 
 * @param title - The title of the issue
 * @param description - Optional description of the issue
 * @param teamId - The ID of the team in Linear
 * @returns Promise with the created issue data or error
 * 
 * @example
 * ```ts
 * const result = await createLinearIssue(
 *   "Fix bug in carousel generator",
 *   "The carousel preview is not showing correctly on mobile devices",
 *   "team-id-from-linear"
 * )
 * ```
 */
export async function createLinearIssue(
  title: string,
  description: string | undefined,
  teamId: string
): Promise<LinearIssueCreateResponse> {
  const query = `
    mutation IssueCreate($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue {
          id
          title
          identifier
        }
      }
    }
  `

  const apiKey = process.env.LINEAR_API_KEY

  if (!apiKey) {
    throw new Error("LINEAR_API_KEY environment variable is not set")
  }

  const response = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({
      query,
      variables: {
        input: {
          title,
          description,
          teamId,
        },
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Linear API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

