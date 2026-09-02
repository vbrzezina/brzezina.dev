# Case Study Decision Log

Running record of decisions, alternatives considered, and wrong turns for the brzezina.dev portfolio build. Used as source material for a future case study.

---

### 2026-08-17 — Project initiated

**Decision:** Build a completely new portfolio site from scratch.
**Alternatives considered:** None — no previous site existed.
**Why:** Needed a public online presence for contractor work and headhunter visibility. Senior full-stack TypeScript/React engineer with 9 years experience, no portfolio to show for it.

---

### 2026-08-17 — shadcn/ui evaluated and rejected

**Decision:** Do not use shadcn/ui.
**Alternatives considered:** shadcn/ui as the component foundation.
**Why:** Copy-paste pattern is not a real component library — no centralized updates, no design system abstraction, every component becomes a local maintenance liability. 20+ Tailwind classes per component make the codebase illegible. Not suitable for a project with a strong visual identity.
**Wrong turn / lesson:** Evaluated early as the "obvious" Next.js component choice. The constraint that revealed the problem: a bespoke terminal/CLI aesthetic requires named abstractions and a theme system, not inline utilities.

---

### 2026-08-17 — Tailwind CSS evaluated and rejected

**Decision:** Do not use Tailwind CSS.
**Alternatives considered:** Tailwind as the styling layer.
**Why:** Utility-class approach creates friction with a bespoke visual identity. The terminal/CLI aesthetic (oklch colour tokens, named spacing, JetBrains Mono eyebrow labels) needs precise named abstractions. Tailwind encourages "style at the call site" — the opposite of what a design system requires.
**Wrong turn / lesson:** Tailwind is excellent for many projects. It was wrong here because the design is opinionated and token-driven, not utility-driven.

---

### 2026-08-17/18 — CSS Modules evaluated and rejected

**Decision:** Do not use CSS Modules.
**Alternatives considered:** CSS Modules as the scoped styling solution (was the initial confirmed choice).
**Why:** Adequate for static styles but doesn't scale well with dynamic theming and prop-driven variant styling. Emotion/styled-components is a better fit: `$variant` props, conditional styles, and `styled(RadixPrimitive)` all work naturally in CSS-in-JS.
**Wrong turn / lesson:** Was initially listed as the confirmed stack. Reconsidered once the full component surface was understood and the need for dynamic variants became clear.

---

### 2026-08-18 — Visual prototype built in Lovable.dev (Vite/TanStack stack)

**Decision:** Use the Lovable.dev prototype at `https://github.com/vbrzezina/brzezina-blueprint` as a visual reference only — not as code to port.
**Alternatives considered:** Port the blueprint code directly; start from scratch with no visual reference.
**Why:** The blueprint uses Tailwind v4 + Radix shadcn — both rejected. Its value is purely visual: layout, spacing, component structure, colour palette, and typography rhythm. The code is AI-generated scaffolding and not production-quality.
**Wrong turn / lesson:** Briefly considered porting the blueprint code. The stack incompatibility (Vite/TanStack vs Next.js App Router) and the code quality of the AI-generated output ruled it out immediately.

---

### 2026-08-18 — Styling library decision: Radix Primitives + Emotion

**Decision:** `@radix-ui/react-*` Primitives + `@emotion/react` + `@emotion/styled`. No Radix Themes, no Chakra, no Mantine.
**Alternatives considered:**
- Radix Themes + Emotion: pre-styled catalogue + CSS var tokens, but ships an opinionated baseline (rounded corners, own color scale) that conflicts with this design. Would require constant overrides.
- Chakra UI v2: Emotion-based, global component overrides like MUI — but opinionated defaults and v2 is aging. v3 drops Emotion for Panda CSS entirely.
- Chakra UI v3: Panda CSS (zero-runtime, App Router friendly) but not Emotion-based and still fights the terminal aesthetic.
- Mantine: Emotion under the hood, MUI-like DX, but 7/10 a11y and unnecessary complexity for ~12 components.
**Why:** ~12 components needed, all heavily customized. Radix Primitives gives best-in-class a11y (9.5/10, WAI-ARIA compliant) with zero visual defaults. Emotion handles all styling via `styled(Primitive)` with CSS variables from `tokens.css`. `$`-prefixed props give type-safe variants. No baseline to fight.
**Reference:** `ui-library-decision-summary.md` for full option analysis.

---

### 2026-08-19 — Light mode broken: SSR `Global` styles win over client theme

**Decision:** Moved `body { background-color; color }` from Emotion's `<Global>` component into a `ThemeRoot` styled `div` wrapper inside `ThemeRegistry`.
**Alternatives considered:** CSS variables approach (define all tokens as CSS custom properties and swap them on `:root`); keeping `Global` but forcing re-insert.
**Why:** Emotion's `<Global>` injects element-selector rules (`body {}`) during SSR into a `<style data-emotion>` tag. When the user toggles the theme client-side, `Global` re-renders and tries to inject an updated `body {}` rule — but the SSR tag remains in the document and its specificity/order wins. Styled components with generated class names do NOT have this problem because React swaps `className` on re-render, pointing to fresh CSS rules. Moving background/color to a `ThemeRoot` styled wrapper exploits that class-swapping mechanism and makes the toggle work correctly.
**Wrong turn / lesson:** The symptom was subtle — the avatar circle correctly showed the light surface color (styled component class updated), but the page background stayed dark (body `Global` rule didn't). Evaluating `getComputedStyle(document.body).backgroundColor` via Playwright confirmed the body was still dark even after `isDark` toggled.

---

### 2026-08-19 — `$variant` prop leaking to DOM through Radix Slot

**Decision:** Added `shouldForwardProp: (prop) => !String(prop).startsWith('$')` to `StyledButton`.
**Alternatives considered:** Destructuring `$variant` out before the spread; wrapping Slot in a custom component that filters props.
**Why:** Emotion's default `styled.button` filters `$`-prefixed props when the render target is a string (`'button'`). But when `as={Slot}` is set (a React component, not a string), Emotion forwards all props — including `$variant` — to Slot. Radix Slot then merges them onto the child `<a>` element, producing an invalid HTML attribute and a React hydration mismatch error. `shouldForwardProp` applies regardless of what the `as` target is, fixing the leak at the source.

---
