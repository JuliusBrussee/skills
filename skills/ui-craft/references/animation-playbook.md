# Animation Playbook

Deep-dive reference for animation patterns. The main SKILL.md references these techniques
but does not include the full detail needed for implementation.

---

## 1. Easing Curve Library

The built-in CSS keywords (`ease`, `ease-in`, `ease-out`, `ease-in-out`) produce weak,
generic motion. Define custom curves as CSS custom properties so every animation in the
project shares the same vocabulary.

```css
:root {
  /* Strong ease-out — the default for UI interactions (enter, appear, respond) */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  /* Strong ease-in-out — on-screen movement and morphing transitions */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);

  /* iOS-like drawer curve — slide-up sheets, bottom drawers */
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);

  /* Snappy — fast micro-interactions, toggles, checkboxes */
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);

  /* Emphasized deceleration — large surface transitions, page-level changes */
  --ease-decel: cubic-bezier(0, 0, 0.2, 1);
}
```

### When to use which

| Curve            | Use case                                       |
| ---------------- | ---------------------------------------------- |
| `--ease-out`     | Elements entering the viewport, appearing       |
| `--ease-in-out`  | Elements morphing shape, moving across screen   |
| `--ease-drawer`  | Sheets, drawers, panels sliding into view       |
| `--ease-snappy`  | Micro-interactions: toggles, checks, switches   |
| `--ease-decel`   | Large page transitions, route changes           |
| `linear`         | Constant-rate motion only: progress bars, spin  |

Never use `ease-in` alone for UI elements — it makes things feel sluggish at the start.
Reserve `linear` for continuous motion (loading spinners, progress indicators) where
deceleration would look wrong.

**Resources**: [easing.dev](https://easing.dev), [easings.co](https://easings.co)
for visual curve comparison and copying.

---

## 2. Spring Animations

Springs are physics-based. They do not have a fixed duration — they simulate mass,
stiffness, and damping. This makes them ideal for anything interactive.

### When to use springs instead of easing curves

- Drag interactions (the element should follow the finger naturally)
- Elements that feel "alive" (cards, floating actions, avatars)
- Gestures that can be interrupted mid-animation
- Mouse-tracking interactions (cursor followers, magnetic buttons)

### Apple-style spring (duration + bounce)

```js
// Framer Motion / Motion One
animate(element, { x: 100 }, {
  type: "spring",
  duration: 0.5,
  bounce: 0.2
})
```

This is the simpler API. `duration` controls overall timing, `bounce` controls overshoot.

### Traditional physics spring (mass + stiffness + damping)

```js
animate(element, { x: 100 }, {
  type: "spring",
  mass: 1,
  stiffness: 100,
  damping: 10
})
```

More control, but harder to tune. Start with mass=1 and adjust stiffness/damping.

### Guidelines

- Keep bounce subtle: **0.1 to 0.3** for most UI. Higher values feel toy-like.
- Avoid bounce entirely for actions that need to feel decisive (confirms, deletes).
- Springs **maintain velocity when interrupted** — if you change the target mid-animation,
  the element smoothly redirects. Keyframe animations restart from scratch.
- Use `useSpring` (or equivalent) for mouse-tracking: it makes cursor followers feel
  natural instead of artificial. The lag is intentional and pleasant.
- For lists, spring each item separately so they can settle independently.

---

## 3. clip-path Animation Patterns

`clip-path` is one of the most underused animation tools. It lets you reveal, hide,
and transition content without layout shifts.

### Inset shape basics

```css
/* Full visibility */
clip-path: inset(0 0 0 0);

/* Clipped from bottom — only top portion visible */
clip-path: inset(0 0 50% 0);

/* Fully hidden — clipped from all sides */
clip-path: inset(50% 50% 50% 50%);

/* With border-radius */
clip-path: inset(10px round 8px);
```

The values are `inset(top right bottom left)` — how far each edge clips inward.

### Pattern: Tabs with perfect color transitions

Duplicate the entire tab list. Place one copy on top of the other. The bottom copy has
inactive styles; the top copy has active styles. Animate `clip-path: inset(...)` on the
top copy to reveal only the active tab region. The color transition is instantaneous and
pixel-perfect — no fade needed.

```css
.tabs-active-overlay {
  clip-path: inset(0 calc(100% - var(--tab-right)) 0 var(--tab-left));
  transition: clip-path 300ms var(--ease-out);
}
```

### Pattern: Hold-to-delete

Overlay a colored fill on the button. On `:active`, animate `clip-path` from
`inset(0 100% 0 0)` to `inset(0 0 0 0)` over 2 seconds with `linear` timing (the user
needs to see constant progress). On release, snap back with `200ms ease-out`.

```css
.delete-btn::after {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 200ms var(--ease-out);
}
.delete-btn:active::after {
  clip-path: inset(0 0 0 0);
  transition: clip-path 2s linear;
}
```

### Pattern: Image reveals on scroll

Start with `clip-path: inset(0 0 100% 0)` (image hidden, clipped from bottom).
Use IntersectionObserver to detect viewport entry, then animate to `inset(0 0 0 0)`.

```js
observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.clipPath = 'inset(0 0 0 0)';
    }
  });
}, { threshold: 0.1 });
```

### Pattern: Comparison sliders

Overlay two images. Clip the top image by the drag position:
`clip-path: inset(0 calc(100% - var(--pos)) 0 0)`. Update `--pos` on pointer move.

---

## 4. Gesture Design

Gestures are the hardest animation category because they involve real-time user input
and require physics-aware feedback.

### Momentum-based dismissal

Calculate velocity during drag:

```js
const velocity = distance / elapsed; // px per ms
if (velocity > 0.11) {
  dismiss(); // Fast enough — dismiss regardless of distance
} else if (Math.abs(offset) > threshold) {
  dismiss(); // Far enough — dismiss regardless of speed
} else {
  snapBack(); // Neither fast nor far — return to origin
}
```

The velocity threshold (0.11 px/ms) matters more than distance. A quick flick should
dismiss even from a small offset.

### Damping at boundaries

When the user drags past a natural boundary (e.g., top of a scroll view), apply
increasing resistance:

```js
function dampedOffset(raw, boundary) {
  const overflow = raw - boundary;
  // Logarithmic damping — diminishing returns
  return boundary + Math.log(1 + Math.abs(overflow)) * 30 * Math.sign(overflow);
}
```

This produces the rubber-band effect. The element still moves, but progressively less.

### Pointer capture

Once a drag begins, call `element.setPointerCapture(event.pointerId)`. This ensures
all subsequent pointer events route to this element even if the pointer leaves its
bounds. Release on `pointerup`.

### Multi-touch protection

Track only the first pointer. If a second finger touches during a drag, ignore it:

```js
let activePointerId = null;
element.addEventListener('pointerdown', (e) => {
  if (activePointerId !== null) return; // Already tracking
  activePointerId = e.pointerId;
  element.setPointerCapture(e.pointerId);
});
```

### Friction instead of hard stops

Never hard-clamp position. Always allow movement with increasing resistance. Hard stops
feel broken. Friction feels physical.

---

## 5. Stagger Patterns

Staggering creates a sense of flow by delaying each item slightly.

### CSS implementation

```css
.stagger-item {
  opacity: 0;
  transform: translateY(8px);
  animation: stagger-in 400ms var(--ease-out) forwards;
}

@keyframes stagger-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stagger-item:nth-child(1) { animation-delay: 0ms; }
.stagger-item:nth-child(2) { animation-delay: 40ms; }
.stagger-item:nth-child(3) { animation-delay: 80ms; }
.stagger-item:nth-child(4) { animation-delay: 120ms; }
.stagger-item:nth-child(5) { animation-delay: 160ms; }
```

Or with a custom property:

```css
.stagger-item {
  animation-delay: calc(var(--index) * 40ms);
}
```

Set `--index` via `style` attribute in markup or JS.

### Guidelines

- **30-80ms** per step is the sweet spot. Under 30ms looks simultaneous. Over 80ms
  feels sluggish.
- Break content into **semantic chunks** — stagger cards, not individual lines of text.
- **Never block interaction** during stagger animations. All items should be clickable
  immediately, even if not yet visible.
- Cap the total stagger time. For a list of 20 items, stagger the first 5-6 and let the
  rest appear together.
- Stagger on initial load only. Re-renders should not re-stagger.

---

## 6. Exit Animation Patterns

Exits are often neglected. They deserve as much care as entries.

### Principles

- **Exits should be faster than enters.** If enter is 400ms, exit should be 200-250ms.
- **Use small fixed translateY** (8-12px) instead of full-height slides. Large movements
  during exit draw too much attention away from what remains.
- **Opacity + scale combination** works better than opacity alone for removal. A slight
  `scale(0.96)` during fade-out makes it feel more physical.
- **Asymmetric timing is intentional.** A hold-to-delete might take 2 seconds (deliberate),
  but the actual removal should be 200ms (snappy). The weight is in the decision, not
  the consequence.

### Exit with height collapse

When removing an item from a list, animate both the content (opacity + translate) and
the container height. The content fades first, then the gap closes:

```css
.item-exiting {
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 150ms var(--ease-out),
              transform 150ms var(--ease-out);
}
.item-exiting-collapse {
  height: 0;
  margin: 0;
  padding: 0;
  transition: height 200ms var(--ease-out) 100ms, /* delayed start */
              margin 200ms var(--ease-out) 100ms,
              padding 200ms var(--ease-out) 100ms;
}
```

### Tuning

There is no formula for the right opacity/height/transform combination. Adjust until it
feels right. Test by performing the action 10 times quickly — if anything feels off on
repetition, it needs work.

---

## 7. Performance Rules

Animation jank is unacceptable. These rules keep animations at 60fps.

### The compositing-only rule

Only animate properties that skip layout and paint:
- `transform` (translate, scale, rotate)
- `opacity`
- `filter` (with caveats — see below)

Everything else triggers layout recalculation (width, height, margin, padding, top, left)
or paint (background-color, box-shadow, border). Both are expensive.

### CSS vs JavaScript animations

- **CSS animations and transitions** run off the main thread on the compositor. Use them
  for predetermined animations (hover effects, enter/exit, state changes).
- **Framer Motion `x`/`y` props are NOT hardware-accelerated.** They animate inline
  styles, which run on the main thread. Use the full transform string or CSS-based
  approaches for performance-critical animations.
- **CSS variables on parent elements** cause expensive style recalculation when updated.
  If animating a CSS variable, update the `transform` property directly instead.

### Web Animations API (WAAPI)

For programmatic animations that need CSS-level performance:

```js
element.animate(
  [
    { transform: 'translateY(20px)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 }
  ],
  { duration: 400, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards' }
);
```

WAAPI runs on the compositor like CSS animations but is controlled from JavaScript.

### Blur and filter performance

- Keep `blur()` under **20px**, especially on Safari where large blurs are expensive.
- `backdrop-filter: blur()` is even more expensive — use sparingly.
- Prefer pre-blurred images over real-time blur when possible.

### will-change

- Only use `will-change` for `transform`, `opacity`, or `filter`.
- **Never** use `will-change: all` — it promotes every property and wastes GPU memory.
- Add `will-change` only when you observe first-frame stutter on an animation. It is a
  last resort, not a default.
- Remove `will-change` after the animation completes if the element is long-lived.

### transition: all is banned

```css
/* Bad — animates every property change, including ones you did not intend */
transition: all 200ms ease;

/* Good — explicit about what animates */
transition: transform 200ms var(--ease-out), opacity 200ms var(--ease-out);
```

`transition: all` causes unexpected animations when other properties change and makes
debugging difficult.

---

## 8. The Sonner Principles

Sonner (the toast library) demonstrates principles that apply broadly to dynamic UI
components.

### Good defaults matter more than options

If you need 12 configuration props to make a component feel right, the defaults are
wrong. The component should feel right out of the box.

### Use transitions, not keyframes, for dynamic UI

Toasts are added rapidly and unpredictably. Keyframe animations have fixed timelines
that cannot adapt to rapid state changes. CSS transitions respond to the current state
and interpolate naturally.

### Handle edge cases invisibly

- Pause toast timers when the browser tab is hidden (the user should not miss toasts).
- When a toast is dismissed from the middle of a stack, the remaining toasts should
  fill the gap smoothly.
- When multiple toasts arrive simultaneously, batch the visual update.

### Match motion personality to component personality

A success toast can be slightly bouncy. An error toast should be direct and firm.
A loading toast should feel steady and patient. The animation communicates as much as
the content.

---

## 9. @starting-style for Modern CSS Enter Animations

`@starting-style` defines the initial style of an element when it first renders.
Combined with transitions, it creates enter animations in pure CSS — no JavaScript
`useEffect` + `mounted` state needed.

```css
.toast {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 400ms ease, transform 400ms ease;

  @starting-style {
    opacity: 0;
    transform: translateY(100%);
  }
}
```

When the `.toast` element is inserted into the DOM, the browser starts from the
`@starting-style` values and transitions to the normal values.

### Works with display: none toggling

```css
.dialog {
  display: block;
  opacity: 1;
  transition: opacity 300ms var(--ease-out), display 300ms allow-discrete;

  @starting-style {
    opacity: 0;
  }
}
.dialog[hidden] {
  display: none;
  opacity: 0;
}
```

The `allow-discrete` keyword lets `display` participate in the transition timeline.

### Fallback for older browsers

When `@starting-style` is not supported, fall back to a `data-mounted` attribute pattern:

```css
.toast {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 400ms ease, transform 400ms ease;
}
.toast:not([data-mounted]) {
  opacity: 0;
  transform: translateY(100%);
}
```

Add `data-mounted` via JavaScript after a single `requestAnimationFrame`.

---

## 10. Debug Techniques

### Slow motion testing

Increase animation duration by 2-5x during development. At normal speed, problems are
invisible. At 5x, you see every hitch, wrong easing, and misaligned property.

```css
:root {
  --debug-speed: 1; /* Change to 5 for slow-mo */
}
.animated {
  transition-duration: calc(200ms * var(--debug-speed));
}
```

### Chrome DevTools Animations panel

Open DevTools > More Tools > Animations. This panel shows:
- A timeline of all running animations
- Frame-by-frame scrubbing
- Easing curve visualization
- Duration and delay for each animation

Use the playback speed controls (25%, 10%) for detailed inspection.

### Real device testing

Touch interactions feel completely different on a real phone versus a trackpad simulator.
Always test gestures, drag interactions, and spring animations on physical devices.

### Fresh eyes check

Review animations with fresh eyes the next day. What felt right at 11pm during
development often feels too fast, too slow, or too dramatic the next morning.

### The checklist

Before shipping any animation, verify:
- Smooth color transitions (no banding or flashing)?
- Correct easing curve for the interaction type?
- Right `transform-origin` (elements scaling/rotating from the expected point)?
- All animated properties in sync (opacity and transform finishing together)?
- No layout shift during the animation?
- Works with `prefers-reduced-motion: reduce`?
- Performs at 60fps on a mid-range device?
