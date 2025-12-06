/**
 * Script to create a Linear task for pricing system and monetization
 * 
 * Usage: npm run create:pricing-system-task
 */

import { config } from "dotenv"
import { resolve } from "path"
import { createLinearIssue, getLinearTeams, getLinearViewer } from "../lib/linear"

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") })

const TASK_TITLE = "Implement Pricing System & Monetization (Subscription Plans + Coins)"

const TASK_DESCRIPTION = `## Overview
Implement a comprehensive subscription-based pricing system with monthly/annual billing, coin-based generation limits, and AI model tiering. The system should support Starter, Creator, and Pro plans with 99%+ margin.

## Business Model

### Subscription Model
- Monthly subscription with generation limits per month
- 1 generation = 1 complete carousel (Hook → Slides → CTA)
- Annual billing option with 30-35% savings

### Cost Structure
- **GPT-mini**: ~$0.002 per generation
- **Claude Haiku**: ~$0.003 per generation
- **Claude Sonnet**: ~$0.004 per generation
- Target margin: 99%+ for all plans

## Pricing Plans

### Starter Plan
- **Price**: $5-6 / month
- **Limit**: 5 carousels / month
- **AI Model**: GPT-mini or Claude Haiku
- **Purpose**: Testing, low entry point
- **Cost**: ~$0.02 → Margin ~99.6%
- **Coins**: 10 coins (5 carousels × 2 coins)

### Creator Plan (Most Popular)
- **Price**: $12-15 / month
- **Limit**: 15-20 carousels / month
- **AI Model**: Claude 3.5 Haiku
- **Purpose**: Main mass-market plan
- **Cost**: ~$0.05-0.06 → Margin ~99.5%
- **Coins**: 40 coins (20 carousels × 2 coins)
- **Badge**: "Most Popular"

### Pro Plan
- **Price**: $20-29 / month
- **Limit**: 40 carousels / month
- **AI Model**: Claude 3.5 Sonnet
- **Purpose**: Advanced creators, ghostwriters, agencies
- **Cost**: ~$0.16 → Margin ~99.3%
- **Coins**: 100 coins (40 carousels × 2.5 coins)

## Annual Billing

### Implementation
- Add Monthly ↔ Yearly toggle switch in pricing UI
- Annual plans offer 30-35% savings
- Display savings badges:
  - "Save 35% with annual billing"
  - "2 months free"
  - "Best value for creators"

### Example Annual Prices
- **Starter**: $5/mo → $42/year (save 30%)
- **Creator**: $12/mo → $96/year (save 33%)
- **Pro**: $25/mo → $228/year (save 24%)

### Benefits
- Increases conversion rate
- Reduces churn
- Higher LTV (Lifetime Value)

## Coins System

### Coin Allocation
Each plan receives coins equal to generation limit:
- **Starter**: 10 coins
- **Creator**: 40 coins
- **Pro**: 100 coins

### Coin Deduction
1 carousel generation = 2-5 coins depending on AI model:
- **GPT-mini**: 2 coins per generation
- **Claude Haiku**: 2 coins per generation
- **Claude Sonnet**: 2.5-3 coins per generation

### Coin Management
- Backend must check coin balance before generation
- Log all coin operations (deduction, addition, expiration)
- Display coin balance in UI
- Show coin usage per generation
- Handle coin expiration (monthly reset)

## Implementation Tasks

### 1. Database Schema (Supabase)

#### subscriptions table
\`\`\`sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('starter', 'creator', 'pro')),
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'annual')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'expired', 'past_due')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  coins_allocated INTEGER NOT NULL,
  coins_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

#### coin_transactions table
\`\`\`sql
CREATE TABLE coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- positive for addition, negative for deduction
  reason TEXT NOT NULL, -- 'generation', 'refund', 'bonus', 'reset'
  carousel_id UUID REFERENCES carousels(id) ON DELETE SET NULL,
  ai_model TEXT, -- 'gpt-mini', 'claude-haiku', 'claude-sonnet'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

### 2. Backend Implementation

#### 2.1 Subscription Management
- **File**: \`lib/subscriptions.ts\` (new)
- Functions:
  - \`createSubscription(userId, planType, billingPeriod)\`
  - \`getActiveSubscription(userId)\`
  - \`updateSubscriptionStatus(subscriptionId, status)\`
  - \`getSubscriptionCoins(userId)\`
  - \`resetMonthlyCoins(subscriptionId)\`

#### 2.2 Coin Management
- **File**: \`lib/coins.ts\` (update)
- Replace localStorage with Supabase
- Functions:
  - \`getCoins(userId)\` - Get current coin balance
  - \`deductCoins(userId, amount, reason, carouselId, aiModel)\`
  - \`addCoins(userId, amount, reason)\`
  - \`checkCoinBalance(userId, requiredAmount)\` - Before generation
  - \`getCoinTransactions(userId)\` - Transaction history

#### 2.3 Generation Limit Check
- **File**: \`app/api/generate/route.ts\` (update)
- Before generating:
  1. Check if user has active subscription
  2. Check coin balance
  3. Determine required coins based on AI model
  4. Deduct coins if sufficient
  5. Proceed with generation
  6. Log transaction
- Return error if insufficient coins/subscription

#### 2.4 AI Model Selection
- **File**: \`lib/ai-models.ts\` (new)
- Map subscription plan to AI model:
  - Starter → GPT-mini or Claude Haiku
  - Creator → Claude 3.5 Haiku
  - Pro → Claude 3.5 Sonnet
- Function: \`getAIModelForPlan(planType)\`

### 3. Frontend Implementation

#### 3.1 Pricing Page
- **File**: \`app/pricing/page.tsx\` (update)
- Features:
  - Display all 3 plans (Starter, Creator, Pro)
  - Monthly/Annual toggle switch
  - "Most Popular" badge on Creator plan
  - Savings badges for annual plans
  - Plan comparison table
  - Clear CTA buttons for each plan
  - Highlight differences:
    - Starter = "Basic AI"
    - Creator = "Smart AI"
    - Pro = "Premium AI"

#### 3.2 Subscription Selection UI
- Plan cards with:
  - Plan name and badge
  - Monthly/Annual price
  - Number of carousels per month
  - AI model used
  - Coin allocation
  - Features list
  - CTA button

#### 3.3 Coin Display
- **File**: \`components/header.tsx\` (update)
- Show:
  - Current coin balance
  - Plan type badge
  - Days until reset (if applicable)
- Link to pricing page when coins low

#### 3.4 Generation Flow
- **File**: \`components/carousel-form.tsx\` (update)
- Before generation:
  - Check coin balance
  - Show required coins
  - Disable button if insufficient
  - Show upgrade prompt if needed
- After generation:
  - Show coins deducted
  - Show remaining balance
  - Toast notification

### 4. Payment Integration

#### 4.1 Payment Provider
- Choose payment provider (Stripe recommended)
- Set up webhooks for subscription events
- Handle:
  - Subscription creation
  - Subscription renewal
  - Subscription cancellation
  - Payment failures

#### 4.2 Subscription Management
- **File**: \`app/api/subscriptions/route.ts\` (new)
- Endpoints:
  - POST /api/subscriptions/create - Create subscription
  - GET /api/subscriptions/current - Get current subscription
  - POST /api/subscriptions/cancel - Cancel subscription
  - POST /api/subscriptions/update - Update subscription

### 5. UI/UX Enhancements

#### 5.1 Pricing Page Design
- Modern, clean design
- Clear value proposition
- Social proof (if available)
- Feature comparison
- Mobile responsive

#### 5.2 Coin System UI
- Coin balance widget
- Coin usage indicator
- Transaction history (optional)
- Low balance warnings

#### 5.3 Upgrade Prompts
- Show upgrade prompt when:
  - Coins running low
  - User tries to generate without subscription
  - User exceeds plan limits

## Acceptance Criteria

### Subscription System
- [ ] All 3 plans (Starter, Creator, Pro) implemented
- [ ] Monthly and Annual billing options work
- [ ] Annual plans show correct savings (30-35%)
- [ ] Subscription status tracked in database
- [ ] Subscription renewal handled automatically
- [ ] Subscription cancellation works

### Coins System
- [ ] Coins allocated based on subscription plan
- [ ] Coins deducted correctly per generation
- [ ] Coin balance checked before generation
- [ ] Coin transactions logged
- [ ] Monthly coin reset works
- [ ] Coin balance displayed in UI

### AI Model Selection
- [ ] Starter plan uses GPT-mini or Claude Haiku
- [ ] Creator plan uses Claude 3.5 Haiku
- [ ] Pro plan uses Claude 3.5 Sonnet
- [ ] Model selection based on subscription

### Generation Limits
- [ ] Generation blocked if no active subscription
- [ ] Generation blocked if insufficient coins
- [ ] Clear error messages for limit violations
- [ ] Upgrade prompts shown when needed

### UI/UX
- [ ] Pricing page displays all plans correctly
- [ ] Monthly/Annual toggle works
- [ ] "Most Popular" badge on Creator plan
- [ ] Savings badges visible on annual plans
- [ ] Coin balance visible in header
- [ ] Generation form shows coin requirements
- [ ] Mobile responsive design

### Payment Integration
- [ ] Payment processing works (Stripe or alternative)
- [ ] Webhooks handle subscription events
- [ ] Subscription status updates correctly
- [ ] Payment failures handled gracefully

## Technical Specifications

### Coin Deduction Logic
\`\`\`typescript
const COIN_COSTS = {
  'gpt-mini': 2,
  'claude-haiku': 2,
  'claude-sonnet': 2.5
}

function deductCoinsForGeneration(userId, aiModel) {
  const requiredCoins = COIN_COSTS[aiModel]
  const currentBalance = getCoins(userId)
  
  if (currentBalance < requiredCoins) {
    throw new Error('Insufficient coins')
  }
  
  return deductCoins(userId, requiredCoins, 'generation', carouselId, aiModel)
}
\`\`\`

### Subscription Plan Configuration
\`\`\`typescript
const PLANS = {
  starter: {
    monthly: 5,
    annual: 42,
    limit: 5,
    coins: 10,
    aiModel: 'gpt-mini'
  },
  creator: {
    monthly: 12,
    annual: 96,
    limit: 20,
    coins: 40,
    aiModel: 'claude-haiku',
    popular: true
  },
  pro: {
    monthly: 25,
    annual: 228,
    limit: 40,
    coins: 100,
    aiModel: 'claude-sonnet'
  }
}
\`\`\`

## Files to Create/Modify

### New Files
1. \`lib/subscriptions.ts\` - Subscription management
2. \`lib/ai-models.ts\` - AI model selection logic
3. \`app/api/subscriptions/route.ts\` - Subscription API endpoints
4. \`app/api/subscriptions/webhook/route.ts\` - Payment webhooks
5. \`components/pricing-card.tsx\` - Reusable pricing card component
6. \`components/coin-balance.tsx\` - Coin balance display component

### Modified Files
1. \`lib/coins.ts\` - Migrate to Supabase, add subscription logic
2. \`app/pricing/page.tsx\` - Update with new plans and annual billing
3. \`components/header.tsx\` - Add coin balance display
4. \`components/carousel-form.tsx\` - Add coin check before generation
5. \`app/api/generate/route.ts\` - Add coin deduction and limit checks
6. \`lib/storage.ts\` - May need updates for subscription context

## Dependencies

- \`@supabase/supabase-js\` - Database operations
- \`stripe\` or payment provider SDK - Payment processing
- Existing packages should be sufficient for UI

## Testing Checklist

- [ ] Create subscription for each plan type
- [ ] Test monthly and annual billing
- [ ] Verify coin allocation on subscription creation
- [ ] Test coin deduction during generation
- [ ] Test generation blocking when coins insufficient
- [ ] Test monthly coin reset
- [ ] Verify AI model selection per plan
- [ ] Test subscription renewal
- [ ] Test subscription cancellation
- [ ] Test payment webhooks
- [ ] Verify margin calculations (99%+)
- [ ] Test on mobile devices

## Business Metrics

### Expected Distribution (100 paying users)
- Starter: 30 users (30%)
- Creator: 50 users (50%)
- Pro: 20 users (20%)

### Revenue Calculation
- Starter: 30 × $5 = $150/month
- Creator: 50 × $12 = $600/month
- Pro: 20 × $25 = $500/month
- **Total**: ~$1,250/month

### Cost Calculation
- Starter: 30 × 5 × $0.002 = $0.30/month
- Creator: 50 × 20 × $0.003 = $3.00/month
- Pro: 20 × 40 × $0.004 = $3.20/month
- **Total**: ~$6.50/month

### Margin
- Revenue: $1,250/month
- Cost: $6.50/month
- **Margin**: ~99.5%

## Notes

- Keep localStorage as fallback during migration
- Consider grace period for expired subscriptions
- Add analytics tracking for subscription events
- Document subscription management in \`docs/subscriptions.md\`
- Consider adding free trial period (optional)
- Plan for future features: team plans, custom limits, etc.
`

async function main() {
  try {
    console.log("🚀 Creating Linear task for pricing system and monetization...\n")

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
      ["backend", "frontend", "integrations", "monetization"] // Tags: backend, frontend, integrations, monetization
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

