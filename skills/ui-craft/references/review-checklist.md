# Pre-Delivery Review Checklist

Extended 30-item checklist for UI implementation quality. Run through this before marking any UI task as complete.

## Typography (6 items)

### 1. Font Smoothing Applied
- **Check**: Root layout has `-webkit-font-smoothing: antialiased`
- **How**: Inspect `<html>` or `<body>` computed styles
- **Failing looks like**: Text appears heavy/blurry on macOS, especially at small sizes

### 2. Headings Use text-wrap: balance
- **Check**: All `<h1>`–`<h4>` elements have `text-wrap: balance`
- **How**: Resize viewport to trigger wrapping — headings should break evenly
- **Failing looks like**: One long line followed by a single orphan word

### 3. Body Text Uses text-wrap: pretty
- **Check**: Paragraphs and body text use `text-wrap: pretty`
- **How**: Check for orphaned words at the end of paragraphs
- **Failing looks like**: A single short word sitting alone on the last line

### 4. Dynamic Numbers Use tabular-nums
- **Check**: Counters, prices, timers, and data columns have `font-variant-numeric: tabular-nums`
- **How**: Watch numbers update — layout should not shift
- **Failing looks like**: Content jumps horizontally as digits change width

### 5. Line Length Controlled
- **Check**: Body text containers are capped at `max-width: 65ch`
- **How**: Measure character count on a full-width line
- **Failing looks like**: Text stretching edge-to-edge on wide monitors, hard to read

### 6. Type Scale Consistency
- **Check**: All text sizes come from the defined type scale (no arbitrary sizes)
- **How**: Inspect font sizes — they should match scale values (12/14/16/18/24/32/48)
- **Failing looks like**: Random sizes like 15px, 19px, 22px that aren't in the scale

## Color & Theme (5 items)

### 7. Semantic Color Tokens Only
- **Check**: No hardcoded hex/rgb values in component code
- **How**: Search for `#[0-9a-f]` or `rgb(` in component files
- **Failing looks like**: `background: #3b82f6` instead of `bg-primary` or `var(--primary)`

### 8. WCAG AA Contrast Met
- **Check**: Normal text ≥ 4.5:1, large text ≥ 3:1, UI components ≥ 3:1
- **How**: Run axe-core or Chrome DevTools contrast checker
- **Failing looks like**: Light gray text on white background, low-contrast placeholders

### 9. Dark Mode Contrast Verified
- **Check**: Contrast ratios pass in dark mode separately
- **How**: Toggle dark mode, re-run contrast checks
- **Failing looks like**: Passing in light mode but failing in dark (common with desaturated variants)

### 10. Color Not Sole Information Channel
- **Check**: Error, success, warning states use icon + text alongside color
- **How**: View the page in grayscale (browser DevTools → Rendering → Emulate vision deficiency)
- **Failing looks like**: Red border on error field with no icon or text explanation

### 11. Dark Mode Visual Review
- **Check**: All surfaces, borders, shadows, and text are legible in dark mode
- **How**: Toggle dark mode and visually scan every component
- **Failing looks like**: Invisible borders, washed-out shadows, or text-on-background collision

## Layout & Spatial (5 items)

### 12. Concentric Border Radius
- **Check**: Outer radius = inner radius + padding on all nested rounded elements
- **How**: Inspect nested cards, buttons-in-containers, input groups
- **Failing looks like**: Inner and outer corners don't follow the same curvature — looks "off"

| Before | After | Why |
|--------|-------|-----|
| Parent `rounded-lg` (12px), child `rounded-lg` (12px), padding 8px | Parent `rounded-xl` (16px), child `rounded-md` (8px), padding 8px | 8 + 8 = 16 — radii now concentric |

### 13. Spacing Follows Scale
- **Check**: All padding, margin, and gap values are multiples of 4px
- **How**: Inspect spacing values — no 5px, 7px, 13px, 19px etc.
- **Failing looks like**: Inconsistent spacing that makes the layout feel uneven

### 14. Hit Areas Meet Minimum
- **Check**: All interactive elements have at least 44×44px clickable area
- **How**: Use browser DevTools to measure element + padding dimensions
- **Failing looks like**: Tiny icon buttons, close buttons, or links that are hard to tap on mobile

### 15. Shadows Over Borders
- **Check**: Depth is created with layered box-shadows, not solid borders between sections
- **How**: Look for `border: 1px solid` between content sections
- **Failing looks like**: Hard dividing lines instead of natural depth transitions

### 16. Optical Alignment Verified
- **Check**: Icons in buttons, play triangles, and asymmetric elements are optically centered
- **How**: Squint at the element — does it look centered to the eye?
- **Failing looks like**: A play triangle that's geometrically centered but looks shifted left

## Motion & Interaction (7 items)

### 17. Animation Frequency Appropriate
- **Check**: High-frequency actions (keyboard shortcuts, command palette) have NO animation
- **How**: Review the frequency table — occasional actions get standard animation, frequent actions get none
- **Failing looks like**: A command palette with a 300ms open animation that feels sluggish after the 50th use

### 18. No `transition: all`
- **Check**: Every transition specifies exact properties
- **How**: Search for `transition: all` or `transition-property: all`
- **Failing looks like**: Unintended properties animating (color, padding, border) causing jank

### 19. Custom Easing Curves Used
- **Check**: UI animations use custom bezier curves, not built-in `ease`, `ease-in`, `ease-out`
- **How**: Inspect transition/animation easing values
- **Failing looks like**: Animations feel generic and lack punch

### 20. Enter Animations Split and Staggered
- **Check**: Multi-element entrances use 30-80ms stagger between items
- **How**: Watch page load or section reveal — elements should cascade, not appear all at once
- **Failing looks like**: An entire section popping in as one block

### 21. Press Feedback on Buttons
- **Check**: All pressable elements have subtle `scale(0.96-0.97)` on `:active`
- **How**: Click and hold buttons — they should compress slightly
- **Failing looks like**: Clicking a button with zero visual feedback

### 22. prefers-reduced-motion Respected
- **Check**: Animations reduce/simplify when the user has reduced motion enabled
- **How**: Enable reduced motion in OS settings, reload, check all animations
- **Failing looks like**: Full animations playing for users who opted out

### 23. Hover States Gated
- **Check**: Hover animations are behind `@media (hover: hover) and (pointer: fine)`
- **How**: Test on touch device or emulate touch in DevTools
- **Failing looks like**: Hover states triggering on tap on mobile, causing sticky hover effects

## Accessibility (7 items)

### 24. Keyboard Navigation Complete
- **Check**: Every interactive element is reachable and operable with keyboard only
- **How**: Unplug mouse, Tab through entire page, operate every control
- **Failing looks like**: Unreachable buttons, inoperable dropdowns, trapped focus

### 25. Focus Rings Visible
- **Check**: Every focusable element has a visible focus indicator
- **How**: Tab through the page and verify each element shows focus
- **Failing looks like**: `outline: none` with no replacement, invisible focus state

### 26. Semantic HTML Used
- **Check**: `<button>` for actions, `<a>` for links, `<nav>` for navigation, proper heading hierarchy
- **How**: Inspect the DOM — look for `<div onclick>` or `<span>` where buttons should be
- **Failing looks like**: Divs with click handlers instead of buttons, missing landmarks

### 27. ARIA Labels on Icon Buttons
- **Check**: Every icon-only button has `aria-label` describing its action
- **How**: Inspect icon buttons in DevTools or run axe-core
- **Failing looks like**: Screen reader announcing "button" with no context

### 28. Form Errors Accessible
- **Check**: Error messages use `aria-live` or `role="alert"`, linked via `aria-describedby`
- **How**: Submit an invalid form, check screen reader announces errors
- **Failing looks like**: Visual error message that screen reader users never hear

### 29. Images Have Alt Text
- **Check**: Meaningful images have descriptive `alt`, decorative images have `alt=""`
- **How**: Search for `<img>` without `alt` attribute
- **Failing looks like**: Screen reader announcing file names or nothing for important images

### 30. Skip Link Present
- **Check**: First focusable element is "Skip to main content" link
- **How**: Tab once on page load — skip link should appear
- **Failing looks like**: Keyboard users forced to Tab through entire header/nav on every page

## Quick Pass/Fail Summary

Use this table to record results:

| # | Item | Pass | Notes |
|---|------|------|-------|
| 1 | Font smoothing | | |
| 2 | text-wrap: balance | | |
| 3 | text-wrap: pretty | | |
| 4 | tabular-nums | | |
| 5 | Line length | | |
| 6 | Type scale | | |
| 7 | Semantic tokens | | |
| 8 | WCAG contrast | | |
| 9 | Dark mode contrast | | |
| 10 | Color not sole channel | | |
| 11 | Dark mode visual | | |
| 12 | Concentric radius | | |
| 13 | Spacing scale | | |
| 14 | Hit areas | | |
| 15 | Shadows over borders | | |
| 16 | Optical alignment | | |
| 17 | Animation frequency | | |
| 18 | No transition: all | | |
| 19 | Custom easing | | |
| 20 | Staggered enter | | |
| 21 | Press feedback | | |
| 22 | Reduced motion | | |
| 23 | Hover gated | | |
| 24 | Keyboard nav | | |
| 25 | Focus rings | | |
| 26 | Semantic HTML | | |
| 27 | ARIA labels | | |
| 28 | Form errors | | |
| 29 | Alt text | | |
| 30 | Skip link | | |
