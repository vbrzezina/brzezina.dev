# MUI adoption depth

Type: grilling
Status: resolved

## Question

How deeply should MUI be adopted as the component library for brzezina.dev?

Options:
1. **Full MUI** — MUI components everywhere, custom theme, minimal bespoke Emotion CSS
2. **MUI as primitives** — use MUI for layout/spacing/typography baseline; write most UI in Emotion styled-components
3. **Emotion-only** — custom everything, no MUI components; only Emotion for styling

This decision depends on the design direction from "Design direction and visual identity" — a bold/expressive personal brand may require more bespoke components than full MUI allows cleanly.

Resolve: which approach best serves the chosen design direction, and what are the long-term maintenance tradeoffs?

## Answer

MUI is rejected. The design direction (ticket 04) requires a bespoke aesthetic incompatible with Material Design conventions. Any MUI adoption would require constant theme overrides, adding weight without benefit.

**Confirmed approach**: Radix UI (headless accessible primitives) + CSS custom properties (design tokens) + CSS Modules (component-scoped styles).

- Radix UI provides accessible behaviours (focus management, ARIA, keyboard nav) without visual opinion
- CSS custom properties carry all design tokens (colours, typography, radius, spacing)
- CSS Modules scope component styles without runtime overhead
- No Emotion, no Tailwind, no styled-components
