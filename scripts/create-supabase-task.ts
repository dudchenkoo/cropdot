/**
 * Script to create a Linear task for Supabase and Google Console setup
 * 
 * Usage: npm run create:supabase-task
 */

import { config } from "dotenv"
import { resolve } from "path"
import { createLinearIssue, getLinearTeams, getLinearViewer } from "../lib/linear"

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") })

const TASK_TITLE = "Setup Supabase and Google Console Integration"

const TASK_DESCRIPTION = `## Overview
Set up Supabase database backend and configure Google OAuth for authentication. This will replace localStorage-based storage with a proper database solution and enable secure authentication.

## Supabase Setup

### 1. Create Supabase Project
- Go to https://supabase.com and create a new project
- Choose a project name and database password
- Note the project URL and API keys

### 2. Environment Variables
Add to \`.env.local\`:
\`\`\`
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

### 3. Database Schema
Create the following tables in Supabase SQL Editor:

#### users table
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

#### carousels table
\`\`\`sql
CREATE TABLE carousels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

#### coins table
\`\`\`sql
CREATE TABLE coins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  balance INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

#### invoices table
\`\`\`sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  credits INTEGER NOT NULL,
  plan TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

### 4. Row Level Security (RLS)
Enable RLS and create policies:

\`\`\`sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousels ENABLE ROW LEVEL SECURITY;
ALTER TABLE coins ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Users can only see/update their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Carousels policies
CREATE POLICY "Users can view own carousels" ON carousels
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own carousels" ON carousels
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own carousels" ON carousels
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own carousels" ON carousels
  FOR DELETE USING (auth.uid() = user_id);

-- Coins policies
CREATE POLICY "Users can view own coins" ON coins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own coins" ON coins
  FOR UPDATE USING (auth.uid() = user_id);

-- Invoices policies
CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own invoices" ON invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);
\`\`\`

### 5. Install Dependencies
\`\`\`bash
npm install @supabase/supabase-js
\`\`\`

## Google Console Setup

### 1. Create Google Cloud Project
- Go to https://console.cloud.google.com
- Create a new project or select existing one
- Enable Google+ API (if needed)

### 2. Create OAuth 2.0 Credentials
- Navigate to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "OAuth client ID"
- Choose "Web application"
- Configure:
  - Name: "Cropdot OAuth Client"
  - Authorized redirect URIs:
    - \`http://localhost:3000/api/auth/callback/google\` (development)
    - \`https://yourdomain.com/api/auth/callback/google\` (production)

### 3. Environment Variables
Add to \`.env.local\`:
\`\`\`
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
\`\`\`

## Integration Tasks

### 1. Replace NextAuth with Supabase Auth
- Install \`@supabase/auth-helpers-nextjs\` or use Supabase Auth directly
- Update \`app/api/auth/[...nextauth]/route.ts\` to use Supabase Auth
- Or keep NextAuth and integrate with Supabase for data storage

### 2. Create Migration Script
- Create \`scripts/migrate-to-supabase.ts\`
- Migrate carousels from localStorage to Supabase
- Migrate coins from localStorage to Supabase
- Migrate invoices from localStorage to Supabase
- Verify no data loss

### 3. Update Storage Functions
- **File**: \`lib/storage.ts\`
  - Replace localStorage with Supabase client
  - Update \`saveCarousel()\`, \`loadCarousel()\`, \`deleteCarousel()\`
  - Add error handling for network failures

- **File**: \`lib/coins.ts\`
  - Replace localStorage with Supabase client
  - Update \`getCoins()\`, \`setCoins()\`, \`addCoins()\`, \`subtractCoins()\`
  - Ensure atomic operations for coin transactions

- **File**: \`lib/billing.ts\`
  - Replace localStorage with Supabase client
  - Update \`getInvoices()\`, \`addInvoice()\`, \`createInvoiceFromPurchase()\`
  - Add proper invoice number generation

### 4. Update Authentication Flow
- Update \`components/landing-hero.tsx\` to use Supabase Auth
- Update \`components/google-login-button.tsx\` if exists
- Update \`middleware.ts\` to check Supabase session
- Update \`components/header.tsx\` to use Supabase user data

### 5. Testing
- Test user registration/login flow
- Test data migration (localStorage → Supabase)
- Test CRUD operations for carousels
- Test coin balance updates
- Test invoice creation
- Verify RLS policies work correctly
- Test on multiple devices/browsers

## Acceptance Criteria

- [ ] Supabase project created and configured
- [ ] Database schema created with all required tables (users, carousels, coins, invoices)
- [ ] RLS policies configured and tested
- [ ] Google OAuth credentials created and configured
- [ ] Environment variables added to \`.env.local\`
- [ ] \`@supabase/supabase-js\` package installed
- [ ] Migration script created and tested
- [ ] Data successfully migrated from localStorage to Supabase
- [ ] All storage functions updated to use Supabase
- [ ] Authentication works with Google OAuth
- [ ] All existing features work with Supabase backend
- [ ] No data loss during migration
- [ ] RLS policies prevent unauthorized access
- [ ] Error handling implemented for network failures

## Notes

- Keep localStorage as fallback during migration period
- Consider adding migration status indicator in UI
- Document Supabase setup in \`docs/supabase-setup.md\`
- Test thoroughly before removing localStorage code
`

async function main() {
  try {
    console.log("🚀 Creating Linear task for Supabase and Google Console setup...\n")

    // Check for API key
    if (!process.env.LINEAR_API_KEY) {
      throw new Error("LINEAR_API_KEY is not set in .env.local")
    }

    // Find CRO team
    console.log("📋 Fetching teams to find CRO team...")
    const teamsResponse = await getLinearTeams()
    
    if (!teamsResponse.data?.teams.nodes) {
      throw new Error("Failed to fetch teams from Linear")
    }

    const croTeam = teamsResponse.data.teams.nodes.find(
      (team) => team.key === "CRO" || team.name.toLowerCase().includes("cropdot")
    )

    if (!croTeam) {
      throw new Error("CRO team not found in Linear workspace")
    }

    console.log(`✅ Found CRO team: ${croTeam.name} (Key: ${croTeam.key}, UUID: ${croTeam.id})\n`)

    // Get current user for assignment
    console.log("👤 Fetching current user for auto-assignment...")
    const viewerResponse = await getLinearViewer()
    
    if (!viewerResponse.data?.viewer) {
      throw new Error("Failed to fetch current user from Linear")
    }

    const userId = viewerResponse.data.viewer.id
    console.log(`✅ Current user: ${viewerResponse.data.viewer.name} (${viewerResponse.data.viewer.email})\n`)

    // Create the issue
    console.log("📝 Creating Linear issue...")
    const result = await createLinearIssue(
      TASK_TITLE,
      TASK_DESCRIPTION,
      croTeam.id,
      userId,
      ["backend", "integrations", "database"] // Tags: backend, integrations, database
    )

    if (result.errors) {
      throw new Error(`Linear API errors: ${JSON.stringify(result.errors)}`)
    }

    if (!result.data?.issueCreate.success) {
      throw new Error("Failed to create issue in Linear")
    }

    const issue = result.data.issueCreate.issue
    console.log(`\n🎉 Task created successfully!`)
    console.log(`   Issue: ${issue.identifier}`)
    console.log(`   Title: ${issue.title}`)
    console.log(`   URL: https://linear.app/cropdot/issue/${issue.identifier}`)
    console.log(`   Assigned to: ${viewerResponse.data.viewer.name}\n`)
  } catch (error) {
    console.error("\n❌ Error creating Linear task:", error)
    if (error instanceof Error) {
      console.error(`   ${error.message}`)
    }
    process.exit(1)
  }
}

main()

