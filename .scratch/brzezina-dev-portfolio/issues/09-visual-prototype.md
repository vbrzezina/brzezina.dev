# Hero section visual prototype

Type: prototype
Status: resolved

## Question

Does the chosen design direction and component approach actually work when built?

Build a rough, concrete prototype of the homepage hero section using the decisions from:
- "Design direction and visual identity" — aesthetic, typography, palette, motion
- "MUI adoption depth" — component approach

The prototype should be react-able enough to confirm or redirect the direction before the full spec is written. Link the prototype artifact from this ticket as an asset.

## Answer

Prototype produced via Lovable.dev: https://github.com/vbrzezina/brzezina-blueprint

The blueprint is a Vite/TanStack Start app (different stack — not for direct reuse). Use it as the design reference for:
- Layout and section structure (hero, about, experience, services, work, contact)
- Design tokens (see `src/styles.css`)
- Component patterns (see `src/components/sections/`)
- Content structure (see `src/data/content.ts` — note: in the real portfolio, strings go in translation files, not content.ts)

Direction confirmed. Proceed to build phase.
