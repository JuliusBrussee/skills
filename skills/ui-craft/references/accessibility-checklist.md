# WCAG 2.1 AA Accessibility Audit Guide

Comprehensive checklist for building accessible web interfaces. Every requirement maps to WCAG 2.1 Level AA success criteria.

---

## 1. Semantic HTML Priority

ALWAYS use semantic HTML before reaching for ARIA. Native elements carry built-in keyboard behavior, focus management, and screen reader announcements that ARIA can only approximate.

### Element Selection Rules

| Instead of | Use |
|---|---|
| `<div role="button">` | `<button>` |
| `<div role="navigation">` | `<nav>` |
| `<div class="header">` | `<header>` |
| `<div class="footer">` | `<footer>` |
| `<span onClick>` | `<a href>` or `<button>` |
| `<div role="list">` | `<ul>` / `<ol>` |
| `<div class="table">` | `<table>` with `<thead>`, `<tbody>`, `<th>` |

### Landmark Elements

- `<main>` — one per page, wraps primary content
- `<nav>` — navigation sections (label with `aria-label` when multiple exist)
- `<header>` — introductory content or navigation aids
- `<footer>` — footer content, copyright, related links
- `<aside>` — tangentially related content (sidebars, callouts)
- `<article>` — self-contained composition (blog post, comment, widget)
- `<section>` — thematic grouping of content (always pair with a heading)

### Form Associations

- `<label>` with `for` attribute connected to the input's `id`
- Group related inputs with `<fieldset>` and `<legend>`
- Use `<optgroup>` for grouped select options

### Heading Hierarchy

- Sequential order: h1 -> h2 -> h3 -> h4 -> h5 -> h6
- NEVER skip levels (e.g., h1 directly to h3)
- One `<h1>` per page (the page title)
- Headings must describe the content that follows

---

## 2. Keyboard Navigation Patterns

Every interactive element must be operable with a keyboard alone. No mouse-only interactions.

### Global Key Bindings

| Key | Action |
|---|---|
| `Tab` | Move focus to next focusable element |
| `Shift + Tab` | Move focus to previous focusable element |
| `Enter` | Activate links, buttons, submit forms |
| `Space` | Activate buttons, toggle checkboxes |
| `Escape` | Close modals, dropdowns, popovers, tooltips |
| `Arrow keys` | Navigate within composite widgets |
| `Home` | Jump to first item in a list or range |
| `End` | Jump to last item in a list or range |

### Composite Widget Navigation (Arrow Keys)

- **Tabs**: Left/Right arrows move between tabs
- **Menus**: Up/Down arrows move between menu items
- **Radio groups**: Arrow keys cycle through options, selecting as they go
- **Listboxes**: Up/Down arrows move highlight, Space selects
- **Tree views**: Up/Down navigate siblings, Right expands, Left collapses

### tabindex Rules

- `tabindex="0"` — places element in natural tab order (use for custom interactive elements)
- `tabindex="-1"` — removes from tab order but allows programmatic focus via `element.focus()` (use for modal containers, skip-link targets, dynamically focused content)
- **NEVER** use `tabindex > 0` — it overrides natural DOM order and creates an unpredictable, unmaintainable focus sequence

### Focus Order Principle

Focus order must match the visual reading order (left-to-right, top-to-bottom for LTR languages). If the DOM order does not match the visual layout, fix the DOM order rather than using positive tabindex values.

---

## 3. ARIA Attributes Reference

The first rule of ARIA: do not use ARIA if a native HTML element provides the behavior. When you must use ARIA, apply it correctly.

### Naming and Describing

| Attribute | Purpose | Example |
|---|---|---|
| `aria-label` | Names an element without visible text | Icon button: `<button aria-label="Close">X</button>` |
| `aria-labelledby` | Points to another element as the label | Modal: `aria-labelledby="dialog-title"` |
| `aria-describedby` | Provides additional description | Form hint: `aria-describedby="password-hint"` |

### Live Regions

| Attribute | Behavior |
|---|---|
| `aria-live="polite"` | Waits for current speech to finish before announcing (toasts, status updates) |
| `aria-live="assertive"` | Interrupts current speech immediately (critical errors, urgent alerts) |
| `aria-atomic="true"` | Re-reads entire region content on change, not just the delta |
| `role="alert"` | Shorthand for `aria-live="assertive"` + `aria-atomic="true"` |
| `role="status"` | Shorthand for `aria-live="polite"` + `aria-atomic="true"` |

### State and Properties

| Attribute | Purpose |
|---|---|
| `aria-expanded` | Indicates whether a collapsible section is open (`true`) or closed (`false`) |
| `aria-haspopup` | Indicates the trigger opens a popup (`menu`, `listbox`, `dialog`, `grid`, `tree`) |
| `aria-modal="true"` | Marks a dialog as modal (assistive tech should ignore content outside) |
| `aria-hidden="true"` | Hides element from assistive technology (decorative images, duplicate content) |
| `aria-invalid` | Marks a form field as having an error (`true`, `grammar`, `spelling`) |
| `aria-required` | Indicates the field is required before form submission |
| `aria-sort` | Indicates sort direction on table column headers (`ascending`, `descending`, `none`) |
| `aria-selected` | Indicates selected state in single/multi-select widgets |
| `aria-controls` | Identifies the element(s) controlled by this element |
| `aria-current` | Indicates the current item in a set (`page`, `step`, `location`, `date`, `true`) |
| `aria-disabled` | Marks element as disabled but still perceivable (unlike `disabled` attribute which removes from tab order) |

---

## 4. Focus Management

### Visible Focus Indicators

- **NEVER** use `outline: none` or `outline: 0` without providing a custom alternative
- Recommended default: `outline: 3px solid currentColor; outline-offset: 2px;`
- Use `:focus-visible` for keyboard-only focus styling (hides ring on mouse click):

```css
:focus-visible {
  outline: 3px solid var(--focus-color, #2563eb);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}
```

- Focus indicators must meet 3:1 contrast ratio against adjacent colors (WCAG 2.4.11)
- Minimum focus indicator area: at least 2px perimeter around the component

### Modal Focus Trapping

When a modal opens:
1. Move focus to the first focusable element inside the modal (or the modal container with `tabindex="-1"`)
2. Trap Tab/Shift+Tab to cycle only through focusable elements within the modal
3. Pressing Escape closes the modal
4. On close, return focus to the element that triggered the modal

### Focus Restoration

- When a dropdown/popover/modal closes, return focus to its trigger element
- When an item is deleted from a list, move focus to the nearest remaining item
- When a dialog confirms an action, focus the result or next logical element

### SPA Route Changes

- On navigation, move focus to the main content heading or a skip-link target
- Announce the new page title to screen readers using an `aria-live` region or document.title update
- Use `<title>` updates: "Page Name | Site Name"

### Skip Links

- First focusable element on the page should be "Skip to main content"
- Link target: `<main id="main-content" tabindex="-1">`
- Visually hidden until focused:

```css
.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
}

.skip-link:focus {
  position: static;
  left: auto;
}
```

---

## 5. Color Contrast Requirements

### WCAG AA Minimum Ratios

| Element | Minimum Contrast Ratio |
|---|---|
| Normal text (< 24px, or < 18.66px if bold) | 4.5:1 |
| Large text (>= 24px, or >= 18.66px if bold) | 3:1 |
| UI components (borders, icons, form controls) | 3:1 |
| Graphical objects (charts, infographics) | 3:1 |
| Disabled elements | No requirement (but keep readable) |
| Placeholder text | 4.5:1 (it is regular text) |

### Testing Tools

- Chrome DevTools: Elements panel -> Styles -> color swatch -> contrast ratio
- axe-core browser extension
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Stark (Figma/Sketch plugin)

### Color Independence Rules

- **NEVER** convey information by color alone
- Error states: red color + error icon + descriptive text message
- Required fields: asterisk + "required" label text (not just red border)
- Status indicators: color + icon + text label (e.g., green checkmark + "Complete")
- Links in body text: color + underline (or other non-color differentiator)
- Charts/graphs: use patterns, labels, or shapes in addition to color

### Dark Mode Considerations

- Test contrast ratios separately in dark mode
- Use desaturated color variants, not simple CSS `invert()`
- Background and foreground pairs must both be intentionally chosen
- Semi-transparent overlays can reduce effective contrast -- verify computed values

---

## 6. Accessible Component Patterns

### Dropdown / Select

```
trigger: aria-haspopup="listbox", aria-expanded="false|true"
container: role="listbox"
options: role="option", aria-selected="true|false"
```

- Arrow keys navigate options
- Typeahead: typing characters jumps to matching option
- Enter/Space selects highlighted option
- Escape closes without selecting
- Selected option text updates trigger label

### Modal / Dialog

```
container: role="dialog", aria-modal="true", aria-labelledby="title-id"
title: id="title-id"
close button: aria-label="Close dialog"
```

- Focus moves into modal on open
- Tab cycles within modal (focus trap)
- Escape closes modal
- Click on backdrop closes modal
- Focus returns to trigger on close
- Background content gets `aria-hidden="true"` or `inert`

### Tabs

```
container: role="tablist"
tab: role="tab", aria-selected="true|false", aria-controls="panel-id", tabindex="0|-1"
panel: role="tabpanel", aria-labelledby="tab-id", tabindex="0"
```

- Only the active tab has `tabindex="0"`; inactive tabs have `tabindex="-1"`
- Left/Right arrows move between tabs (wrapping optional)
- Home/End jump to first/last tab
- Tab key moves focus from the active tab into the panel content

### Forms

- Every `<input>`, `<select>`, `<textarea>` has a visible `<label>`
- Required fields: `aria-required="true"` + visual asterisk indicator
- Error fields: `aria-invalid="true"` + `aria-describedby` pointing to error message element
- Error messages: use `role="alert"` or `aria-live="assertive"` region
- On failed submission: focus the first invalid field
- Helper text: linked via `aria-describedby` to the associated input
- Password fields: toggle visibility button with `aria-label` describing current state
- Groups of related controls: `<fieldset>` + `<legend>`

### Accordion

```
trigger: <button aria-expanded="true|false" aria-controls="panel-id">
panel: id="panel-id", role="region", aria-labelledby="trigger-id"
```

- Enter/Space toggles section
- Only one section open at a time (optional, depends on design)
- Panel content hidden with `hidden` attribute or `display: none` (not just visually)

### Toast / Notification

- Container: `role="status"` or `aria-live="polite"` (non-critical)
- Critical notifications: `role="alert"` (assertive)
- Must be dismissible (close button or auto-dismiss with sufficient time)
- Auto-dismiss: minimum 5 seconds visible, pauses on hover/focus

---

## 7. prefers-reduced-motion

### Global Reset

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Nuanced Approach

Reduced motion means fewer/gentler animations, not zero motion:
- **Keep**: opacity fades, color transitions that aid comprehension
- **Remove**: parallax scrolling, zoom/scale transforms, slide/translate animations, auto-playing carousels
- **Simplify**: complex multi-step animations to simple fades

### Framework Integration

React (framer-motion):
```jsx
import { useReducedMotion } from 'framer-motion';

function Component() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      animate={{ x: shouldReduceMotion ? 0 : 100 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    />
  );
}
```

CSS custom property approach:
```css
:root {
  --transition-speed: 0.3s;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-speed: 0.01ms;
  }
}
```

---

## 8. Testing Approach

### Automated Testing

| Tool | Usage |
|---|---|
| axe-core | `npm install jest-axe` for unit tests; `expect(container).toHaveNoViolations()` |
| Lighthouse | Accessibility score target: 90+ |
| eslint-plugin-jsx-a11y | Static analysis for JSX accessibility issues |
| pa11y | CLI/CI integration for automated page-level audits |
| Playwright/axe | `@axe-core/playwright` for integration test accessibility checks |

### Manual Testing Checklist

1. **Keyboard-only navigation**: unplug mouse, navigate entire page with Tab, Enter, Arrows, Escape
2. **Screen reader**: VoiceOver (macOS: Cmd+F5), NVDA (Windows, free), JAWS (Windows)
3. **Zoom 200%**: content should reflow without horizontal scrolling or content clipping
4. **Zoom 400%**: text should remain readable (WCAG 1.4.10 Reflow)
5. **Focus indicators**: every interactive element shows a visible focus ring when focused via keyboard
6. **Forced colors mode**: test in Windows High Contrast Mode (use `forced-colors` media query)
7. **Text spacing**: override letter-spacing (0.12em), word-spacing (0.16em), line-height (1.5), paragraph-spacing (2em) -- content must remain readable

### CI Integration

```bash
# Example: axe-core with Playwright in CI
npx playwright test --project=accessibility
```

---

## 9. Common Mistakes

| Mistake | Fix |
|---|---|
| `outline: none` on focus | Use `:focus-visible` with a custom focus ring |
| Placeholder as only label | Always use `<label>` element |
| Icon button without label | Add `aria-label="Action description"` |
| Color-only error indication | Add icon + descriptive text alongside color |
| Missing alt text on images | Descriptive `alt` text, or `alt=""` for decorative images |
| Heading level skip (h1 to h3) | Sequential hierarchy: h1 -> h2 -> h3 |
| `tabindex > 0` | Use natural DOM order; only use `0` or `-1` |
| Emoji used as functional icons | Use SVG icons with `aria-label` |
| Auto-playing animation | Respect `prefers-reduced-motion` media query |
| Non-dismissible modal | Always support Escape key to close |
| `aria-hidden="true"` on focusable elements | Remove from tab order or remove `aria-hidden` |
| Missing `lang` attribute on `<html>` | Set `<html lang="en">` (or appropriate language code) |
| Autoplaying video/audio with sound | Require user interaction to start, or mute by default with controls |
| Tiny tap targets on mobile | Minimum 44x44 CSS pixels for touch targets |
| Using `title` attribute as primary label | `title` is unreliable; use `aria-label` or visible `<label>` |
| Links that say "click here" or "read more" | Descriptive link text: "Read the accessibility guide" |
| Missing form error summary | On submit failure, show summary of all errors at top of form |

---

## Quick Reference: Testing a New Component

Before marking any component as complete, verify:

1. Can you reach and operate it using only a keyboard?
2. Does it have a visible focus indicator?
3. Does it announce correctly in a screen reader?
4. Does it meet color contrast ratios?
5. Does it work at 200% zoom?
6. Does it respect `prefers-reduced-motion`?
7. Does it pass `jest-axe` / axe-core automated checks?
8. Does it have appropriate semantic HTML or ARIA roles?
9. Are all images, icons, and media labeled?
10. Can it be operated with one hand on mobile (44x44px touch targets)?
