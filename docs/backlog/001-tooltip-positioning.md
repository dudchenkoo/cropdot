# Issue #001: Tooltip Positioning

## Problem Description

Tooltips are appearing in the top-left corner of the viewport instead of positioning themselves near their trigger elements. This affects all tooltips throughout the application, making them unusable.

## Impact

- Poor user experience - tooltips don't provide helpful context
- Accessibility issues - users can't see tooltip information
- Affects all icon buttons that have tooltips

## Attempted Fixes

### 1. TooltipContent Props
- Added `side="top"` and `align="center"` as default props to `TooltipContent` in `components/ui/tooltip.tsx`
- Added `avoidCollisions={true}` to help with positioning

### 2. Portal Container
- Set `container={typeof document !== "undefined" ? document.body : undefined}` to `TooltipPrimitive.Portal` to ensure tooltips are rendered in the correct container

### 3. CSS Overrides in `app/globals.css`
- Added `[data-radix-tooltip-content] { position: fixed !important; }` to force fixed positioning
- Added transition property exclusions to prevent transform interference:
  ```css
  [data-radix-tooltip-content], [data-radix-tooltip-content] * {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, filter, backdrop-filter !important;
    transition-duration: 150ms !important;
  }
  ```
- Added transform overrides:
  ```css
  [data-radix-tooltip-content] {
    transform: none !important;
    will-change: auto !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
  }
  ```

### 4. Portal Positioning
- Added `[data-radix-portal] { position: static !important; transform: none !important; }` to prevent portal interference

## Current State

The issue persists despite all attempted fixes. Tooltips still appear in the top-left corner.

## Files Involved

- `components/ui/tooltip.tsx` - Tooltip component implementation
- `app/globals.css` - CSS overrides for tooltip positioning
- `components/carousel-preview.tsx` - Uses tooltips for action buttons
- `components/carousel-generator.tsx` - Uses tooltips for various controls

## Future Investigation

1. **Parent Elements with CSS Transforms**
   - Check if any parent elements have `transform` properties that create new positioning contexts
   - Inspect the DOM hierarchy of tooltip triggers
   - Look for elements with `transform: translate()`, `scale()`, `rotate()`, etc.

2. **Radix UI Version Compatibility**
   - Review Radix UI documentation for known positioning issues
   - Check if there's a version mismatch or incompatibility
   - Consider updating or downgrading `@radix-ui/react-tooltip`

3. **Z-Index Stacking Contexts**
   - Investigate if z-index stacking contexts are interfering
   - Check for elements with `isolation: isolate` or `will-change: transform`
   - Review the z-index hierarchy

4. **Browser-Specific Issues**
   - Test in different browsers to see if issue is browser-specific
   - Check browser console for any errors or warnings
   - Test with browser extensions disabled

5. **Alternative Approaches**
   - Consider using a different tooltip library
   - Try implementing custom tooltip positioning logic
   - Use CSS-only tooltips as a fallback

## Related Code

- Tooltip component: `components/ui/tooltip.tsx`
- Global CSS overrides: `app/globals.css` (lines 129-144, 269-274)
- TooltipProvider usage: `components/carousel-preview.tsx`, `components/carousel-generator.tsx`

