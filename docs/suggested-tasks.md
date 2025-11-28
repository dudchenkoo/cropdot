# Suggested Tasks for Cropdot

Based on project analysis, here are recommended tasks organized by priority and category.

## High Priority

### 1. Implement Real AI Generation
**Current State:** API route uses mock data instead of real AI generation
**Location:** `app/api/generate/route.ts` (line 193-195)
**Impact:** Core functionality not working as intended
**Acceptance Criteria:**
- Replace `generateMockCarousel()` with real Anthropic API call
- Use `streamText` from `@ai-sdk/anthropic` (already imported)
- Handle streaming responses properly
- Maintain error handling and validation
- Ensure response matches expected `CarouselData` format
- Add rate limiting and error recovery
- Test with various topics and tones

### 2. Add Error Reporting to Linear
**Current State:** Errors are logged to console only
**Location:** `components/error-boundary.tsx`, `app/api/generate/route.ts`
**Impact:** Bugs go unnoticed, no tracking
**Acceptance Criteria:**
- Automatically create Linear issues when critical errors occur
- Include error message, stack trace, and user context
- Use existing `createLinearIssue` function
- Add error severity levels (critical, warning, info)
- Prevent duplicate issue creation for same error
- Add user-friendly error messages

### 3. Improve Export Quality and Options
**Current State:** Basic PDF/PNG export exists
**Location:** `lib/export.ts`
**Impact:** Limited export options may not meet user needs
**Acceptance Criteria:**
- Add export resolution options (1x, 2x, 3x for retina)
- Support multiple image formats (PNG, JPG, WebP)
- Add export progress indicator
- Optimize file sizes
- Add batch export with progress tracking
- Include metadata in exports (title, date, etc.)

## Medium Priority

### 4. Add Carousel Duplication Feature
**Current State:** Users can duplicate slides but not entire carousels
**Location:** `components/carousel-generator.tsx`
**Impact:** Users need to recreate similar carousels manually
**Acceptance Criteria:**
- Add "Duplicate carousel" button in dashboard
- Create copy with new ID and timestamp
- Allow renaming duplicated carousel
- Preserve all settings and content
- Update saved carousels list

### 5. Implement Carousel Sharing
**Current State:** No way to share carousels with others
**Impact:** Limited collaboration and feedback
**Acceptance Criteria:**
- Generate shareable links for carousels
- Add read-only preview mode for shared links
- Optional password protection
- Track view counts
- Add "Copy link" functionality

### 6. Add Undo/Redo History UI
**Current State:** Undo/redo exists but no visual indicator
**Location:** `components/carousel-generator.tsx` (history state exists)
**Impact:** Users don't know undo/redo is available
**Acceptance Criteria:**
- Show undo/redo buttons in UI
- Display history count (e.g., "3 actions available")
- Keyboard shortcuts (Cmd/Ctrl+Z, Cmd/Ctrl+Shift+Z)
- Visual feedback when undo/redo is performed
- Disable buttons when no history available

### 7. Add Image Upload for Backgrounds
**Current State:** Only URL input for background images
**Location:** `components/carousel-generator.tsx` (background settings)
**Impact:** Users must host images externally
**Acceptance Criteria:**
- Add file upload input for background images
- Support common formats (JPG, PNG, WebP)
- Image compression and optimization
- Preview uploaded image before applying
- Store images (localStorage or cloud storage)
- Add image cropping/resizing options

### 8. Improve Template System
**Current State:** Templates exist but limited customization
**Location:** `lib/templates.ts`
**Impact:** Limited template variety and customization
**Acceptance Criteria:**
- Add more template variations
- Allow users to save custom templates
- Add template categories (Business, Creative, Minimal, etc.)
- Template preview improvements
- Search/filter templates
- Template marketplace concept

## Low Priority / Nice to Have

### 9. Add Analytics Tracking
**Current State:** No analytics implemented
**Impact:** No insights into user behavior
**Acceptance Criteria:**
- Track carousel generation events
- Track export events
- Track template usage
- Track user journey (landing → generation → export)
- Privacy-compliant analytics (GDPR)
- Dashboard for viewing analytics

### 10. Add Keyboard Shortcuts Documentation
**Current State:** Some shortcuts exist but not documented
**Impact:** Users don't know about shortcuts
**Acceptance Criteria:**
- Create keyboard shortcuts modal/help
- Display shortcuts in UI (e.g., "?" key)
- Document all available shortcuts
- Add shortcut hints in tooltips
- Group shortcuts by category

### 11. Add Carousel Versioning
**Current State:** No version history for carousels
**Impact:** Can't revert to previous versions
**Acceptance Criteria:**
- Save version history for each carousel
- Show version timeline
- Allow reverting to previous versions
- Compare versions side-by-side
- Auto-save versions periodically

### 12. Improve Mobile Experience
**Current State:** Mobile responsiveness added but can be improved
**Location:** Mobile components exist
**Impact:** Mobile users may have suboptimal experience
**Acceptance Criteria:**
- Optimize touch interactions
- Improve mobile preview
- Better mobile navigation
- Touch-friendly controls
- Mobile-specific UI adjustments

### 13. Add Collaboration Features
**Current State:** Single-user experience
**Impact:** No team collaboration
**Acceptance Criteria:**
- Share carousels with team members
- Add comments on slides
- Real-time collaboration (optional)
- Permission levels (view, edit, admin)
- Activity feed

### 14. Add AI Content Improvement
**Current State:** AI generates initial content only
**Impact:** Limited AI assistance
**Acceptance Criteria:**
- "Improve this slide" AI button
- "Make it shorter/longer" options
- Tone adjustment for existing content
- Grammar and style checking
- Content suggestions

### 15. Add Export Templates
**Current State:** Standard export formats
**Impact:** Limited export customization
**Acceptance Criteria:**
- Custom export templates
- Brand colors and fonts in exports
- Watermark options
- Custom dimensions
- Export presets (LinkedIn, Instagram, etc.)

## Technical Debt

### 16. Split Large Components
**Current State:** `CarouselGenerator` is 2582 lines
**Location:** `components/carousel-generator.tsx`
**Impact:** Hard to maintain and test
**Acceptance Criteria:**
- Extract dashboard view to separate component
- Extract creation view to separate component
- Extract action panels to separate components
- Improve code organization
- Reduce component complexity

### 17. Add Comprehensive Tests
**Current State:** Basic tests exist
**Location:** `lib/__tests__/`, `components/__tests__/`
**Impact:** Risk of regressions
**Acceptance Criteria:**
- Increase test coverage to 80%+
- Add integration tests
- Add E2E tests for critical flows
- Test error scenarios
- Test edge cases

### 18. Improve Type Safety
**Current State:** Some `any` types and loose typing
**Impact:** Potential runtime errors
**Acceptance Criteria:**
- Remove all `any` types
- Add strict TypeScript checks
- Improve type definitions
- Add runtime type validation
- Better error messages for type mismatches

### 19. Optimize Bundle Size
**Current State:** Large bundle size
**Impact:** Slow loading times
**Acceptance Criteria:**
- Analyze bundle with `@next/bundle-analyzer`
- Remove unused dependencies
- Code splitting improvements
- Lazy load heavy components
- Optimize images and assets

### 20. Add Performance Monitoring
**Current State:** No performance tracking
**Impact:** Don't know about performance issues
**Acceptance Criteria:**
- Add performance markers
- Track component render times
- Monitor API response times
- Track user interaction delays
- Set up performance alerts

## Documentation

### 21. API Documentation
**Current State:** Basic JSDoc comments
**Impact:** Hard for new developers to understand
**Acceptance Criteria:**
- Complete API documentation
- OpenAPI/Swagger spec
- Example requests/responses
- Error code documentation
- Rate limiting documentation

### 22. Developer Guide
**Current State:** Basic README
**Impact:** Onboarding is difficult
**Acceptance Criteria:**
- Architecture overview
- Development setup guide
- Contribution guidelines
- Code style guide
- Deployment guide

## Security

### 23. Add Input Sanitization
**Current State:** Basic validation exists
**Impact:** Potential XSS vulnerabilities
**Acceptance Criteria:**
- Sanitize all user inputs
- Validate file uploads
- Prevent code injection
- Add CSP headers
- Security audit

### 24. Add Rate Limiting
**Current State:** No rate limiting on API
**Impact:** Vulnerable to abuse
**Acceptance Criteria:**
- Rate limit API endpoints
- Per-user rate limits
- Per-IP rate limits
- Graceful rate limit handling
- Rate limit headers in responses

