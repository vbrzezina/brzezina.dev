# ADR-002: Styling layer — Emotion + Radix Primitives

**Status:** accepted  
**Date:** 2026-08-17/18  
**Decider:** Václav Brzezina

---

## Context

The site has a bespoke visual identity: terminal/CLI aesthetic, oklch colour tokens, named spacing scale, JetBrains Mono eyebrow labels, sharp corners, dark-first. About 12–15 components needed. Accessibility target is WCAG 2.1 AA.

The design is opinionated and token-driven — "style at the call site" (utility classes) and pre-styled component libraries both create friction against the design language.

## Decision

**`@radix-ui/react-*` Primitives + `@emotion/react` + `@emotion/styled`. Tokens as CSS custom properties in `tokens.css`, read by Emotion via `var(--token-name)` through a typed `AppTheme` object.**

## Alternatives considered

### Tailwind CSS
**Rejected.** Utility-class approach requires inline style decisions — the opposite of a token-driven design system. 20+ classes per element create illegible JSX. Enforcing a named design language (e.g., "this heading always uses `--font-display`") is possible but requires discipline that a styled-component abstraction gives for free.

### shadcn/ui
**Rejected.** Copy-paste pattern: every component becomes a local maintenance liability. No centralised updates, no design system abstraction. Competes with Tailwind for the same rejection reasons. Cannot enforce the terminal aesthetic without fighting every default.

### CSS Modules
**Rejected (was initially confirmed).** Adequate for static styles; generates scoped class names. However: no ergonomic `$variant` prop pattern, no `styled(RadixPrimitive)` syntax, theme context requires a separate CSS variable strategy anyway. Reconsidered once the full component surface and variant requirements became clear.

### Radix Themes + Emotion
**Rejected.** Radix Themes ships an opinionated baseline: rounded corners, its own color scale (`--accent-1` through `--accent-12`). The terminal aesthetic requires sharp corners and a custom oklch palette. Using Radix Themes would mean constant baseline overrides — trading one set of defaults for another.

### Chakra UI v2
**Rejected.** Emotion-based, global `theme.components.Button` override system is ergonomic. But: v2 is aging, v3 drops Emotion for Panda CSS entirely, and the 100+ component surface is unnecessary for 12–15 components. The MUI-like DX is valuable in team settings; overkill solo.

### Chakra UI v3
**Rejected.** Drops Emotion for Panda CSS (zero-runtime, App Router-friendly). Not Emotion-based — would require evaluating a second styling system. Still has opinionated defaults.

### Mantine
**Rejected.** Emotion under the hood, closest to MUI DX, global component overrides. But: ~7/10 accessibility (has gaps), unnecessary complexity for the component count, opinionated defaults to fight.

### MUI
**Rejected early.** The default MUI aesthetic is a well-known visual fingerprint. A portfolio built on MUI signals "default enterprise components" — directly at odds with the "bold, expressive, personal" positioning goal.

## Why Radix Primitives + Emotion

- ~12–15 bespoke components: Radix Primitives provides best-in-class accessibility (WAI-ARIA compliant, keyboard nav, screen reader tested) with zero visual defaults
- `styled(NavigationMenu.Root)` syntax wraps any Radix Primitive — no adapter pattern needed
- `$`-prefixed transient props (`$variant="outline"`) give type-safe variants without DOM attribute pollution
- CSS custom properties in `tokens.css` serve as the single source of truth; Emotion reads them via `var(--token)` and TypeScript types them via `AppTheme`
- No baseline to override — the design renders exactly as specified

## Consequences

- Every styled component requires explicit styling from scratch — no "good enough defaults"
- SSR requires `useServerInsertedHTML` via `EmotionRegistry` to inject styles before paint (Next.js App Router constraint)
- The `as={Slot}` pattern for polymorphic components (Button rendering as `<a>`) requires `@radix-ui/react-slot` and a runtime cast — see ADR-008
- All visual logic (variants, states) lives in the styled component definition, not at the call site — favourable for consistency, requires discipline
