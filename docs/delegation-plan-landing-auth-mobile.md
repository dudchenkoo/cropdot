# Delegation Plan: Landing Page, Google OAuth, Freemium Model, and Mobile Responsiveness

## Overview
Implement four major features:
1. **Landing Page** - Marketing page with hero, features, pricing preview, and CTA
2. **Google OAuth Login** - Simple one-click Google authentication flow
3. **Freemium Model** - User accounts with coin system (1 free generation per user)
4. **Mobile Responsiveness** - Responsive design for all pages

---

## 1. Landing Page

### Current State
- Main page (`app/page.tsx`) directly shows `CarouselGenerator`
- No marketing/landing page exists
- Need to create a separate landing page and move generator to `/app/dashboard/page.tsx` or `/app/create/page.tsx`

### Implementation Tasks

#### 1.1 Create Landing Page Route
- **File**: `app/page.tsx` (replace current content)
- Create new landing page component with:
  - Hero section with headline, subheadline, and "Continue with Google" CTA button
  - Features section (3-4 key features with icons)
  - How it works section (3 steps)
  - Pricing preview section (link to full pricing page)
  - Footer with links (Templates, Pricing, Contact, Terms, Privacy)
- Use existing design system (Tailwind, existing colors, fonts)
- Match existing style (dark/light theme support)

#### 1.2 Move Generator to Dashboard
- **File**: `app/dashboard/page.tsx` (new file)
- Move `CarouselGenerator` component to dashboard route
- Add route protection (redirect to landing if not authenticated)
- Update navigation links throughout app

#### 1.3 Landing Page Components
- **File**: `components/landing-hero.tsx` (new)
  - Hero section with gradient text
  - "Continue with Google" button (will trigger OAuth)
  - Trust indicators (e.g., "Join X users creating high-performing content")
  
- **File**: `components/landing-features.tsx` (new)
  - Feature cards with icons
  - Features: AI-powered generation, Templates, Export options, LinkedIn-optimized
  
- **File**: `components/landing-how-it-works.tsx` (new)
  - 3-step process visualization
  - Steps: 1) Sign in with Google, 2) Create content, 3) Export and publish

#### 1.4 Update Navigation
- Update `Header` component to show different nav for authenticated vs unauthenticated users
- Add "Dashboard" link for authenticated users
- Keep existing links (Templates, Pricing, etc.)

---

## 2. Google OAuth Login

### Current State
- No authentication system exists
- User email stored in localStorage (`lib/avatar.ts`)
- Coins stored in localStorage (`lib/coins.ts`)
- Need to implement proper OAuth flow

### Implementation Tasks

#### 2.1 Install NextAuth.js
- **File**: `package.json`
- Add dependencies:
  ```json
  "next-auth": "^5.0.0-beta.25",
  "@auth/prisma-adapter": "^2.0.0" // Optional: if using database later
  ```
- Note: For MVP, can use JWT sessions without database

#### 2.2 Configure NextAuth
- **File**: `app/api/auth/[...nextauth]/route.ts` (new)
- Set up NextAuth with Google provider
- Configure callback URLs
- Set up JWT session strategy (no database needed for MVP)
- Store user info in session (email, name, image)

#### 2.3 Environment Variables
- **File**: `.env.local` (update)
- Add:
  ```
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=your-secret-key-here
  GOOGLE_CLIENT_ID=your-google-client-id
  GOOGLE_CLIENT_SECRET=your-google-client-secret
  ```

#### 2.4 Google OAuth Setup Instructions
- Create Google OAuth credentials at https://console.cloud.google.com/
- Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- For production: Add production callback URL

#### 2.5 Auth Provider Component
- **File**: `components/auth-provider.tsx` (new)
- Wrap app with NextAuth `SessionProvider`
- Update `app/layout.tsx` to include provider

#### 2.6 Login Button Component
- **File**: `components/google-login-button.tsx` (new)
- Create styled "Continue with Google" button
- Use `signIn("google")` from `next-auth/react`
- Show loading state during authentication
- Handle errors gracefully

#### 2.7 Update User Management
- **File**: `lib/avatar.ts`
- Update to use session data instead of localStorage
- Get user email from session: `session?.user?.email`
- Get user image from session: `session?.user?.image`

#### 2.8 Protected Routes
- **File**: `middleware.ts` (new)
- Protect `/dashboard` and `/create` routes
- Redirect to landing page if not authenticated
- Allow public access to: `/`, `/pricing`, `/templates`, `/terms`, `/privacy`, `/contact`

#### 2.9 Logout Functionality
- **File**: `components/header.tsx`
- Update logout handler to use `signOut()` from `next-auth/react`
- Clear localStorage on logout (coins, saved carousels)
- Redirect to landing page

---

## 3. Freemium Model

### Current State
- Coins system exists in `lib/coins.ts` (localStorage-based)
- Default 10 coins for new users
- Need to integrate with authentication and enforce limits

### Implementation Tasks

#### 3.1 User Coin Initialization
- **File**: `lib/coins.ts`
- Update `getCoins()` to check if user is authenticated
- For new authenticated users: Give 1 coin (for 1 free generation)
- Store coins per user (use user ID from session)
- Migration: Keep localStorage for backward compatibility, migrate to user-based storage

#### 3.2 Coin Storage Strategy
- **Option A (MVP)**: Store in localStorage with user ID key
  - Key: `cropdot-coins-${userId}`
  - Simple, no backend needed
- **Option B (Future)**: Store in database (can be added later)

#### 3.3 Generation Cost Enforcement
- **File**: `components/carousel-form.tsx`
- Before generating, check if user has enough coins (1 coin per generation)
- If insufficient coins:
  - Show message: "You need 1 coin to generate. Get more coins on the Pricing page."
  - Disable "Generate with AI" button
  - Show link to pricing page
- After successful generation, deduct 1 coin
- Show toast notification: "Generation complete! 1 coin used. X coins remaining."

#### 3.4 Coin Display Updates
- **File**: `components/header.tsx`
- Show coins counter (already exists)
- Update to show 0 coins if user not authenticated
- Add tooltip: "You have X coins. Each generation costs 1 coin."

#### 3.5 Free Generation Flow
- New users get 1 coin on first login
- After using 1 coin, show upgrade prompt:
  - "You've used your free generation! Upgrade to create more content."
  - Link to pricing page
  - Show in dashboard when coins = 0

#### 3.6 Coin Purchase Integration
- **File**: `app/pricing/page.tsx`
- Update pricing page to show coin packages
- Add "Buy Coins" buttons (for now, can be placeholder or link to payment provider)
- After purchase, add coins to user's balance

#### 3.7 Dashboard Empty State
- **File**: `components/carousel-generator.tsx`
- When user has 0 coins and no carousels:
  - Show message: "You've used your free generation. Get more coins to create content."
  - Show "Buy Coins" CTA button
  - Link to pricing page

---

## 4. Mobile Responsiveness

### Current State
- App is desktop-focused
- Need responsive design for all pages
- Mobile breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

### Implementation Tasks

#### 4.1 Landing Page Mobile
- **File**: `app/page.tsx` and landing components
- Hero section:
  - Stack content vertically on mobile
  - Reduce font sizes for mobile
  - Full-width CTA button on mobile
- Features section:
  - Single column on mobile
  - 2 columns on tablet
  - 3-4 columns on desktop
- How it works:
  - Vertical stack on mobile
  - Horizontal on desktop

#### 4.2 Dashboard Mobile
- **File**: `app/dashboard/page.tsx` and `components/carousel-generator.tsx`
- Dashboard view:
  - Stack saved carousels in single column on mobile
  - Reduce card sizes on mobile
  - Make "New generation" button full-width on mobile
- Creation view:
  - Hide or collapse sidebar on mobile (use drawer/modal)
  - Stack preview and controls vertically on mobile
  - Make action buttons full-width on mobile
  - Reduce font sizes in text inputs

#### 4.3 Carousel Preview Mobile
- **File**: `components/carousel-preview.tsx`
- Single slide view:
  - Full-width slide on mobile
  - Smaller slide cards in navigation
  - Touch-friendly navigation buttons
- Grid view:
  - 1 column on mobile
  - 2 columns on tablet
  - 3+ columns on desktop

#### 4.4 Sidebar Mobile
- **File**: `components/carousel-generator.tsx`
- Convert sidebar to drawer/modal on mobile
- Add hamburger menu button
- Use Radix UI Dialog or Sheet component
- Slide in from right on mobile

#### 4.5 Action Panel Mobile
- **File**: `components/carousel-generator.tsx`
- Bottom action panel:
  - Full-width on mobile
  - Horizontal scroll for action buttons if needed
  - Stack buttons vertically if too many
  - Fixed to bottom with safe area padding

#### 4.6 Form Mobile
- **File**: `components/carousel-form.tsx`
- Full-width inputs on mobile
- Stack form fields vertically
- Larger touch targets (min 44x44px)
- Tone selector: horizontal scroll on mobile

#### 4.7 Header Mobile
- **File**: `components/header.tsx`
- Hide some nav links on mobile (show in hamburger menu)
- Keep logo, coins, and avatar visible
- Add mobile menu drawer

#### 4.8 Templates Page Mobile
- **File**: `app/templates/page.tsx`
- Template grid:
  - 1 column on mobile
  - 2 columns on tablet
  - 3-4 columns on desktop
- Template cards: full-width on mobile

#### 4.9 Pricing Page Mobile
- **File**: `app/pricing/page.tsx`
- Pricing cards:
  - Single column on mobile
  - 2 columns on tablet
  - 3 columns on desktop
- Reduce padding and font sizes on mobile

#### 4.10 Other Pages Mobile
- **Files**: `app/billing/page.tsx`, `app/contact/page.tsx`, `app/terms/page.tsx`, `app/privacy/page.tsx`
- Ensure all pages are responsive
- Use consistent mobile breakpoints
- Test on common mobile screen sizes (375px, 414px, 768px)

#### 4.11 Mobile-Specific Utilities
- **File**: `hooks/use-mobile.ts` (already exists, verify it works)
- Use for conditional rendering based on screen size
- Example: Show different UI on mobile vs desktop

---

## Dependencies to Add

```json
{
  "dependencies": {
    "next-auth": "^5.0.0-beta.25"
  }
}
```

## Environment Variables

Add to `.env.local`:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## File Structure Changes

```
app/
  page.tsx                    # Landing page (NEW)
  dashboard/
    page.tsx                  # Dashboard with CarouselGenerator (NEW)
  api/
    auth/
      [...nextauth]/
        route.ts              # NextAuth API route (NEW)
  ...existing pages...

components/
  landing-hero.tsx            # Landing page hero (NEW)
  landing-features.tsx        # Features section (NEW)
  landing-how-it-works.tsx   # How it works section (NEW)
  google-login-button.tsx     # Google OAuth button (NEW)
  auth-provider.tsx           # NextAuth provider wrapper (NEW)
  ...existing components...

middleware.ts                 # Route protection (NEW)
```

## Testing Checklist

### Landing Page
- [ ] Hero section displays correctly
- [ ] "Continue with Google" button works
- [ ] Features section is responsive
- [ ] All links work correctly
- [ ] Dark/light theme works

### Authentication
- [ ] Google OAuth flow works
- [ ] User session persists after page reload
- [ ] Logout clears session
- [ ] Protected routes redirect to landing
- [ ] Public routes accessible without auth

### Freemium Model
- [ ] New users get 1 coin on first login
- [ ] Generation deducts 1 coin
- [ ] Cannot generate with 0 coins
- [ ] Upgrade prompts show when coins = 0
- [ ] Coin counter updates correctly

### Mobile Responsiveness
- [ ] Landing page works on mobile (375px, 414px)
- [ ] Dashboard works on mobile
- [ ] Carousel editor works on mobile
- [ ] Sidebar converts to drawer on mobile
- [ ] All forms are mobile-friendly
- [ ] Navigation works on mobile
- [ ] Test on iOS Safari and Chrome mobile

## Estimated Scope

- **Landing Page**: ~8-10 hours
- **Google OAuth**: ~6-8 hours
- **Freemium Model**: ~4-6 hours
- **Mobile Responsiveness**: ~12-15 hours

**Total**: ~30-39 hours of work

## Priority Order

1. **Google OAuth** (foundation for everything else)
2. **Landing Page** (user entry point)
3. **Freemium Model** (business logic)
4. **Mobile Responsiveness** (UX improvement)

## Notes

- Start with OAuth to establish user sessions
- Landing page should be beautiful and conversion-focused
- Freemium model is simple: 1 coin = 1 generation
- Mobile responsiveness is critical for user adoption
- All features should work together seamlessly
- Test thoroughly on real mobile devices
- Consider using NextAuth v5 (beta) for latest features
- For MVP, localStorage-based coin storage is acceptable (can migrate to database later)

