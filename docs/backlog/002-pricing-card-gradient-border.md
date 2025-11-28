# Issue #002: Gradient Animated Border on Pricing Cards

## Problem Description

The animated gradient border is not visible on the popular pricing card. The gradient should create a 2px animated border around the card, but it's not rendering or is hidden.

## Impact

- The popular pricing card doesn't have the intended visual distinction
- Missing the animated gradient border effect that should highlight the recommended plan
- Visual design inconsistency

## Attempted Fixes

### 1. Absolute Positioning with Negative Inset
- Tried using `absolute -inset-[2px]` with `-z-10` to position the gradient behind the card
- Issue: The gradient was positioned but not visible, likely covered by the card's background

### 2. Wrapper Div with Padding
- Implemented a wrapper div with `p-[2px]` and gradient background
- The card sits inside with `border-0` to allow gradient to show through
- Current implementation in `app/pricing/page.tsx`:
  ```tsx
  <div className="relative p-[2px] rounded-xl" style={{
    background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
    backgroundSize: "300% 100%",
    animation: "borderRun 3s linear infinite",
  }}>
    <Card className="relative h-full flex flex-col border-0 bg-card shadow-lg scale-105">
      {/* Card content */}
    </Card>
  </div>
  ```

### 3. Z-Index Adjustments
- Tried various z-index values to ensure proper layering
- Adjusted z-index of gradient wrapper and card

### 4. Border Removal
- Removed static border (`border-0`) from the popular card to allow gradient to show
- Changed from `border-2 border-primary/50` to `border-0`

## Current State

The implementation uses a wrapper div with `p-[2px]` padding and gradient background. The gradient should be visible as a 2px border around the card, but it may not be rendering correctly or may be hidden by the card's background.

## Files Involved

- `app/pricing/page.tsx` - Pricing page with popular card implementation (lines 144-219)
- `app/globals.css` - Contains `borderRun` animation definition (lines 148-155)

## Future Investigation

1. **Gradient Rendering Check**
   - Verify if the gradient is actually rendering in the browser DevTools
   - Check if the gradient element exists in the DOM
   - Inspect computed styles to see if gradient is applied

2. **Background Opacity/Visibility**
   - Check if the card's `bg-card` background is covering the gradient
   - Try making the card background semi-transparent
   - Test with `bg-transparent` or `bg-card/95` to see if gradient shows through

3. **Border Width Testing**
   - Try different padding values: `p-[1px]`, `p-[3px]`, `p-[4px]`
   - Test if thicker borders are more visible
   - Consider using `border` property instead of padding

4. **CSS Specificity Issues**
   - Check if other CSS rules are overriding the gradient
   - Verify that the gradient styles have proper specificity
   - Test with `!important` flags to see if it helps

5. **Animation Visibility**
   - Verify the `borderRun` animation is working
   - Check if the gradient is animating but not visible
   - Test with a static gradient first to isolate animation issues

6. **Alternative Approaches**
   - Use CSS `::before` or `::after` pseudo-elements for the border
   - Try using `box-shadow` with gradient instead of background
   - Consider using SVG for the animated border
   - Use a different technique like `mask-image` or `clip-path`

7. **Browser Compatibility**
   - Test in different browsers to see if it's browser-specific
   - Check if CSS gradient animations are supported
   - Verify `background-size` and animation compatibility

## Related Code

- Pricing card implementation: `app/pricing/page.tsx` (lines 144-219)
- Border animation: `app/globals.css` (lines 148-155)
- Similar working implementation: Template cards use similar gradient border technique successfully

## Notes

The template cards (`app/templates/page.tsx`) use a similar gradient border technique that works correctly. Compare the implementations to identify differences.

