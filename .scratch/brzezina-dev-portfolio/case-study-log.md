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

### 2026-10-12 — Redesign attempted in Figma via MCP, abandoned for a written spec

**Decision:** Write the redesign as a spec (`docs/design/redesign-2026-10.md`) and implement it directly in the Next.js app, instead of producing full Figma screens first.
**Alternatives considered:** Full Figma screens via the Figma MCP server; an HTML mockup importable into Figma later.
**Why:** The Figma Starter plan caps the MCP server at 20 tool calls per month, files at 3 pages, and variable collections at 1 mode (so Dark/Light needed two parallel collections). The budget ran out after tokens + part of the component library were built.
**Wrong turn / lesson:** For a solo project on the Starter plan, Figma-via-agent is a poor primary design surface — the code is the cheaper, faster prototype. The partial Figma file (tokens, buttons, fields, icons) still exists for reference.

---

### 2026-10-12 — MUI re-confirmed as rejected

**Decision:** Keep Emotion `styled` + Radix Primitives; do not adopt MUI.
**Alternatives considered:** Switching to MUI during the redesign.
**Why:** On review, the remembered "switch to MUI" was the move *away from Tailwind*; ticket 05 had already rejected MUI and the codebase has never used it. Emotion-styled components would map onto MUI's `styled()` if that ever changes.

---

### 2026-10-12 — Colour tokens moved to CSS custom properties with `html[data-theme]`

**Decision:** All colours live in `src/styles/tokens.css`; the Emotion theme references `var(--color-*)`. The toggle flips `data-theme`, persists to `localStorage`, and an inline `<head>` script applies the stored theme before first paint.
**Alternatives considered:** Keep two Emotion theme objects swapped through `ThemeProvider` (previous approach).
**Why:** Swapping theme objects re-serialised every style, required the `ThemeRoot` workaround for SSR `<Global>` rules (2026-08-19 entry), broke wherever a component imported `darkTheme` statically (Services), and could not persist the choice without a dark flash on reload. CSS variables remove the whole class of problems.

---

### 2026-10-12 — `asChild` never worked: custom `shouldForwardProp` swallowed Emotion's `as`

**Decision:** `shouldForwardProp: (prop) => prop !== 'as' && !prop.startsWith('$')`.
**Why:** Emotion only treats `as` as "change the rendered element" when `shouldForwardProp('as')` is false. The 2026-08-19 fix returned true for `as`, so every `<Button asChild><a/></Button>` rendered `<button as="…"><a>…</a></button>` — nested interactive content, invalid HTML. Found because button icons wrapped onto a second line in screenshots.
**Wrong turn / lesson:** The earlier fix solved the visible symptom (`$variant` leaking) and silently created a worse one. Check the rendered DOM, not just the absence of console errors.

---

### 2026-10-12 — Placeholder content replaced with the real CV

**Decision:** All experience, skills and bio copy now come from the original brief; data in `src/data/`, strings in `messages/*.json`.
**Why:** The previous build shipped invented projects ("Data Pipeline Dashboard", "Banking Portal"), skills (LangChain, tRPC, Terraform) and claims (open-source maintainer, fintech). For a site aimed at headhunters, believable-but-false content is worse than an empty section.

---

### 2026-10-12 — Code review on the redesign PR: no fake success, CV regression caught

**Decision:** The contact form now POSTs to `/api/contact` and shows an honest error (message kept, GitHub offered) when that fails, which it does until the route handler exists. The `setTimeout` "Message sent" stub is gone.
**Alternatives considered:** Keep the stub until tickets 08/10 resolve; hide the form entirely.
**Why:** A fake success silently throws away a recruiter's message while telling them it arrived — the worst possible outcome for a portfolio. Failing visibly costs nothing and the code path is already the real one.
**Wrong turn / lesson:** The redesign also regressed the CV links from `/cv.pdf` (with `download`) to `#` because the spec was written from the nav button, the one place that was already `#`. Review the diff against the base branch, not against your memory of it. Other review fixes: mobile-menu focus now lands on the chosen section, explicit `role="list"` on styled lists (Safari/VoiceOver), active-section detection rewritten to use geometry instead of intersection ratios.

---

### 2026-10-12 — Owner design review: fewer rules, one reading column, honest client wording

**Decision:** Removed hairlines between sections (spacing + eyebrow do the job); section leads moved under the heading instead of a right-hand column; nav active state became a 1px accent rule (matching the eyebrow rule) instead of a dot; logo cursor made static; nav controls unified at 40px; experience cards equal height per row; "Shipped for" → "Worked on projects for".
**Why:** The rules doubled up in the hero and read as clutter. The split header made the eye jump across the page. The dot was a borrowed idiom; the line is this design's own vocabulary. An endless blink distracts (and WCAG 2.2.2 would need a pause control). Burberry, Walmart, PSA etc. were clients of EPAM / Starky's Club / Etnetera — "shipped for" overstated a direct relationship.
**Wrong turn / lesson:** The owner's review caught things the automated review and axe didn't: rhythm, consistency of marks, and the accuracy of a three-word label.

---

### 2026-10-12 — Sections divided by tonal bands

**Decision:** Every even section sits on a new `--color-band` (About, Services, Contact); hard edges, no rules. Depth ladder canvas < band < surface < raised; light accent darkened 0.52 → 0.50 and dark tertiary text lightened 0.62 → 0.64 so all text stays AA on the band.
**Alternatives considered:** Hairlines (tried; doubled up in the hero and read as clutter); no division (tried; the page became one undifferentiated scroll); section title bars / giant numerals / gradient fades (more elements to solve a rhythm problem).
**Why:** Tone divides without drawing anything, so nothing can double up — it's how apple.com bands its pages. The blueprint's alternation failed only because its band colour equalled its card colour; a dedicated band token between canvas and surface fixes that. A first pass at dark band L 0.185 measured just ~5 RGB steps off canvas — invisible on average panels — so it went to 0.20.
**Wrong turn / lesson:** "No lines" over-corrected "weird lines". The owner was right that sections need a boundary; the fix was a different *kind* of boundary, not none.

---

### 2026-10-12 — One place per link; About keeps a (second) photo

**Decision:** GitHub appears only in the footer, the CV only in the nav and Contact, the theme toggle only in the header. About keeps a 4:5 photo slot for a candid at-work shot, different from the hero headshot.
**Alternatives considered:** Keeping GitHub + CV in both the Contact sidebar and the footer; replacing the About photo with an "At a glance" figures panel (years / companies / client projects computed from the CV data); a text-led About with no visual.
**Why:** The link duplication was visible on one screen (Contact sidebar directly above the footer) — the original brief already assigned GitHub to the footer and the CV to Contact, so it was resolved by following the brief. For About, two *different* photos (headshot vs. at work) carry the human voice the brief asked for.
**Wrong turn / lesson:** The figures panel was built and shipped, then reverted — a tall bordered box of giant numbers read as a dashboard widget, a different visual language from the rest of the page, sitting exactly where the eye expects a face. "Add information instead of repeating a face" was right in principle but wrong in form; asking with previews before the second attempt got to the answer in one step.

---

### 2026-10-12 — Theme reset on locale switch: React owns `<html>`

**Decision:** Removed `data-theme` from the server-rendered `<html>`; dark is the CSS default on `:root`. The colour-scheme provider re-applies the stored theme in a layout effect on every mount.
**Why:** Switching locale is a client-side navigation that re-renders the root layout; React re-applied `data-theme="dark"` from props, overwriting the user's choice (still in `localStorage`, so a reload "fixed" it — which made it look random). Reproduced with Playwright before fixing.
**Alternatives considered:** A theme cookie read by the server layout — SSR-correct, but makes the route depend on `cookies()`, which conflicts with the still-open static-export option (ticket 10).

---
