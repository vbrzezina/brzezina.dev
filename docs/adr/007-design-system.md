# ADR-007: Design language and visual identity

**Status:** accepted  
**Date:** 2026-08-17/18  
**Decider:** Václav Brzezina

---

## Context

The portfolio needs a strong visual identity that communicates technical depth and seniority. The reference implementation is the Lovable.dev prototype at `https://github.com/vbrzezina/brzezina-blueprint` (Vite/TanStack/Tailwind — used for visual reference only, not ported).

## Decision

**Developer-dark-first; terminal/CLI aesthetic; teal accent on deep navy; Space Grotesk + DM Sans + JetBrains Mono typography system.**

---

## Design principles

### Dark mode is primary
The dark theme is the hero experience — it communicates the terminal/developer aesthetic most strongly. Light mode is available via toggle but is secondary. Colour tokens are defined for both; the dark values are designed first.

### Colour palette (oklch)

oklch was chosen over hex/hsl because:
- Perceptually uniform: equal lightness steps look equal — important for a teal accent that must read well against deep navy
- Better wide-gamut support on P3 displays (Macs, modern phones)
- More predictable when generating accessible foreground/background pairs

| Token | Dark | Light |
|-------|------|-------|
| `--background` | `oklch(0.16 0.028 255)` deep navy | `oklch(0.978 0.006 106)` warm white |
| `--surface` | `oklch(0.21 0.03 255)` | `oklch(0.955 0.008 106)` |
| `--foreground` | `oklch(0.965 0.006 250)` | `oklch(0.19 0.03 250)` |
| `--primary` | `oklch(0.82 0.15 190)` teal | `oklch(0.55 0.12 205)` |
| `--muted-foreground` | `oklch(0.73 0.02 250)` | `oklch(0.48 0.02 250)` |
| `--border` | `oklch(0.99 0 0 / 12%)` | `oklch(0.88 0.01 250)` |

### Typography system

Three fonts, each with a strict role:

| Font | Role | Key styling |
|------|------|-------------|
| Space Grotesk | Display / headings | `letter-spacing: -0.02em`, heavy weight (800) |
| DM Sans | Body copy | Neutral, readable, no letter-spacing |
| JetBrains Mono | Eyebrows, labels, tags, code | Uppercase, `letter-spacing: 0.18em` |

The mono font is used for all "meta" text: section counters, skill tags, form labels, the logo. This creates a consistent CLI-adjacent visual layer.

### Sharp corners
`border-radius: 0.25rem` site-wide. No rounded pills, no card softness. Sharp corners reinforce the technical aesthetic.

### No shadows
Cards use border-only treatment (`1px solid var(--border)`). No box-shadow. Flat, structured.

### Section eyebrow pattern
Every section opens with:
```
NN —— SECTION NAME
```
`NN` is a teal mono counter (00–05). The dash and section name are also teal mono uppercase. Below this: the full section heading in Space Grotesk.

### Scroll-reveal animation
`opacity: 0 → 1` + `translateY(1.25rem → 0)`, `700ms cubic-bezier(0.22, 1, 0.36, 1)`. Applied via the `Reveal` component using `IntersectionObserver`. CSS transitions only — no JavaScript animation libraries.

### Faint grid backdrop
Hero and card thumbnails use a CSS `background-image: repeating-linear-gradient` grid pattern at ~30% opacity. Reinforces the technical/terminal aesthetic without being distracting.

## Reference

Visual reference: `https://github.com/vbrzezina/brzezina-blueprint`. Code is AI-generated and not ported; used for layout rhythm, spacing, component structure, and colour palette validation only.

## Consequences

- Every component must be designed explicitly — no library defaults provide starting points
- The light theme must be validated for contrast on all colour pairings (WCAG 2.1 AA requires 4.5:1 for normal text)
- JetBrains Mono is a variable font — ensure it is loaded correctly for the weight ranges used
- The grid backdrop must use `aria-hidden` to avoid screen reader noise
