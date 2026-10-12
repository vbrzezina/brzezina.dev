# brzezina.dev — Redesign spec (October 2026)

**Status:** implemented on `claude/sweet-shannon-gxbtrh`
**Scope:** visual + interaction redesign of the single-page portfolio. Stack unchanged (Next.js App Router, Emotion `styled`, Radix Primitives, next-intl).
**Inputs:** the Lovable blueprint, the current Next.js build (screenshots in `.scratch/brzezina-dev-portfolio/screenshots/`), the original prototype brief, ADR-007, and Apple's interface design guidance (WWDC *Designing Fluid Interfaces*, *The Details of UI Typography*, *Principles of Great Design*) translated for the web.
**Figma:** partial token + component library in [brzezina.dev — Redesign](https://www.figma.com/design/zrxMjXf3ENaMKyTjFX4GLC). Full screens were not built — the Starter plan's 20 MCP calls/month ran out — so this document is the source of truth.

---

## 1. Diagnosis — what the current build gets wrong

| # | Problem | Where | Principle it breaks |
|---|---------|-------|---------------------|
| 1 | Hero stacks six text blocks (eyebrow, name, role, tagline, two paragraphs) at similar visual weight. Nothing leads. | Hero | Simplicity — hierarchy via order, spacing, contrast |
| 2 | Avatar is a floating monogram circle with no relationship to the copy. | Hero | Purpose — every element earns its place |
| 3 | First timeline entry renders without its company header (EPAM is missing). | Experience | Craft |
| 4 | About / Experience / Skills use invented placeholder content (fintech, open-source tools, "Data Pipeline Dashboard", "Banking Portal", LangChain…) that contradicts the real CV. | About, Experience | Responsibility — don't mislead a headhunter |
| 5 | Skills are ~35 boxed chips. Every tag has a border, so nothing reads as more important. | About | Simplicity, not minimalism |
| 6 | Work shows three "TBD" cards with a large dead zone — it reads as unfinished. | Work | Purpose; Feedback (status) |
| 7 | Body copy is 14–15px with ~1.7 leading and a single letter-spacing for every size. | Global | Craft — size-specific tracking & leading |
| 8 | Sections alternate background colours, so the page feels striped rather than continuous. | Global | Spatial consistency |
| 9 | Nav has a permanent hard border and the theme toggle uses text glyphs (☀/☾). Hamburger panel has no focus trap, no Escape, no motion. | Nav | Materials — scroll-edge effect; Familiarity |
| 10 | `Services` imports `darkTheme` statically → light mode is broken there. Theme state lives in React only → light/dark flashes on reload and is not persisted. | Services, ThemeRegistry | Craft; Agency |
| 11 | Contact form: no inline validation, no visible focus treatment beyond outline, full-width CTA disconnected from the form. | Contact | Feedback — validate inline, not on submit |

---

## 2. Direction

Keep the identity that ADR-007 established — **developer-dark, deep navy, one teal accent, Space Grotesk / DM Sans / JetBrains Mono, terminal details** — and raise the craft around it:

> **"Terminal, refined."** Confident editorial type on a calm canvas. The CLI motifs (`$` prompt, `>` arrows, `whoami`, mono counters) become *signature details*, not wallpaper. One accent, used for meaning: current state, primary action, the timeline.

The four Apple principles doing the most work here:

1. **Simplicity, not minimalism** — fewer competing blocks per screen, but *add* structure where it clarifies (e.g. a `whoami` card that turns a sentence into scannable facts).
2. **Craft** — a real type ramp with size-specific tracking and leading; layered surfaces; 44px targets; focus rings that are designed, not default.
3. **Materials & depth** — translucent nav that only shows its edge once content scrolls under it; raised surfaces for interactive panels; nothing else gets a fill.
4. **Feedback & motion** — respond on press, validate inline, show status ("Available for contract work"), animate only transform/opacity, honour reduced motion/transparency/contrast.

---

## 3. Foundations

### 3.1 Colour tokens

All colours are CSS custom properties in `src/styles/tokens.css`, switched by `html[data-theme]`. Emotion's theme object only references `var(--…)`, so a theme change never re-serialises styles (fixes the SSR `<Global>` bug logged on 2026-08-19 at the root).

| Token | Dark | Light | Use |
|-------|------|-------|-----|
| `--color-canvas` | `oklch(0.16 0.028 255)` | `oklch(0.978 0.006 106)` | Page background — one canvas, no striping |
| `--color-surface` | `oklch(0.205 0.03 255)` | `oklch(0.995 0.003 106)` | Cards, form panel |
| `--color-raised` | `oklch(0.245 0.03 255)` | `oklch(0.955 0.008 106)` | Hover/pressed fills, selected segment |
| `--color-material` | canvas / 72% | canvas / 78% | Translucent nav + sheet (with blur) |
| `--color-fg` | `oklch(0.965 0.006 250)` | `oklch(0.19 0.03 250)` | Primary text — 17.5:1 / 17.3:1 |
| `--color-fg-secondary` | `oklch(0.76 0.02 250)` | `oklch(0.42 0.02 250)` | Body copy — 9.1:1 / 7.9:1 |
| `--color-fg-tertiary` | `oklch(0.62 0.02 250)` | `oklch(0.52 0.02 250)` | Meta, stack lists — 5.3:1 / 5.2:1 |
| `--color-accent` | `oklch(0.82 0.15 190)` | `oklch(0.52 0.12 205)` | Primary action, active state — 11.9:1 / 4.7:1 |
| `--color-accent-hover` | `oklch(0.87 0.13 190)` | `oklch(0.46 0.12 205)` | Primary hover |
| `--color-on-accent` | `oklch(0.18 0.03 255)` | `oklch(0.99 0 0)` | Text on accent — 11.6:1 / 4.9:1 |
| `--color-accent-subtle` | accent / 12% | accent / 10% | Status pill, ghost hover, focus halo |
| `--color-border` | white / 10% | `oklch(0.88 0.01 250)` | Hairlines |
| `--color-border-strong` | white / 20% | `oklch(0.80 0.01 250)` | Inputs, secondary buttons |
| `--color-grid` | white / 5% | fg / 6% | Technical grid backdrop |
| `--color-success` | `oklch(0.80 0.15 150)` | `oklch(0.52 0.13 150)` | Availability dot, sent state |
| `--color-error` | `oklch(0.72 0.16 25)` | `oklch(0.52 0.18 25)` | Field errors |

All text pairs pass WCAG 2.1 AA (contrast ratios computed from the sRGB conversions; listed dark / light against canvas).

`prefers-contrast: more` → `--color-border` takes the `--color-border-strong` value and `--color-fg-tertiary` takes `--color-fg-secondary`.

### 3.2 Typography

Hierarchy is built from **size + weight + leading + tracking as a set**. Tracking tightens as size grows; body stays at 0; small text gets a hair of positive tracking.

| Style | Font / weight | Size (fluid) | Leading | Tracking | Used for |
|-------|---------------|--------------|---------|----------|----------|
| `displayXl` | Space Grotesk 700 | `clamp(3.25rem, 1.9rem + 5.6vw, 6rem)` | 0.95 | −0.035em | Hero name (h1) |
| `displayL` | Space Grotesk 700 | `clamp(2.25rem, 1.6rem + 2.6vw, 3.5rem)` | 1.05 | −0.03em | Section headings (h2) |
| `titleL` | Space Grotesk 500 | `clamp(1.375rem, 1.2rem + 0.6vw, 1.75rem)` | 1.2 | −0.015em | Hero tagline, company names, card titles |
| `titleM` | Space Grotesk 500 | 1.25rem | 1.3 | −0.01em | Project names, skill categories |
| `bodyL` | DM Sans 400 | `clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem)` | 1.6 | 0 | Leads, first bio paragraph |
| `bodyM` | DM Sans 400 | 1.0625rem (17px) | 1.65 | 0 | Body copy |
| `bodyS` | DM Sans 400 | 0.9375rem | 1.6 | 0.01em | Card and project descriptions |
| `label` | DM Sans 500 | 0.9375rem | 1.25 | 0.01em | Buttons, nav, form labels |
| `monoEyebrow` | JetBrains Mono 500 | 0.75rem | 1.33 | 0.16em, uppercase | Section counters, sidebar labels |
| `monoBody` | JetBrains Mono 400 | 0.875rem | 1.57 | 0 | Logo, `whoami` card |
| `monoS` | JetBrains Mono 400 | 0.8125rem | 1.54 | 0 | Stack lists, dates |

Implemented as Emotion `css` mixins in `src/styles/typography.ts`. Body text measure is capped at ~40rem. Everything is in `rem` so the layout scales with the user's text-size setting.

### 3.3 Space, radius, layout

- **Spacing scale:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 px (`theme.space`).
- **Section rhythm:** `padding-block: clamp(5rem, 3rem + 6vw, 8rem)`; sections are separated by space and the eyebrow alone — no rules between sections, no background changes. The only full-width rule is the footer's top edge.
- **Container:** 75rem max, gutter `clamp(1.25rem, 4vw, 2.5rem)`.
- **Grid:** 12 columns, 1.5rem gap desktop. Breakpoints: `sm 640`, `md 900` (nav collapses below this), `lg 1100`.
- **Radius:** `4px` for controls (buttons, inputs, pills, segments); `6px` for large surfaces (cards, panels, sheet). Corners stay sharp — the 2px step only makes larger surfaces read a little heavier.
- **Elevation:** no drop shadows on content. Depth comes from surface tiers and the nav material only.
- `scroll-margin-top: 5.5rem` on every section.

### 3.4 Motion

| Interaction | Spec | Reduced motion |
|-------------|------|----------------|
| Scroll reveal | opacity 0→1 + translateY(1rem→0), 700ms `cubic-bezier(0.22, 1, 0.36, 1)`, 70ms stagger, once | Opacity only, 200ms |
| Press feedback | `:active` → `scale(0.97)`, 100ms ease-out — feedback on pointer-down, not release | None |
| Hover | colour / background / border, 150ms ease | Same (non-vestibular) |
| Nav material | border + background fade in after 8px of scroll, 200ms | Same |
| Mobile sheet | enters **from the trigger edge** (top): translateY(−0.75rem)+opacity, 320ms; exits along the same path, 200ms; scrim fades | Opacity only |
| Theme switch | `background-color`/`color` cross-fade 300ms on the root — no abrupt brightness jump | Instant |
| Logo cursor | Static — no blink (an endless blink distracts in peripheral vision; WCAG 2.2.2 would require a pause control) | — |

Only `transform` and `opacity` are animated for movement. No looping animation anywhere. CSS transitions only — ADR-007 stands; nothing on the page is gesture-driven enough to need springs.

`prefers-reduced-transparency: reduce` → nav and sheet become solid `--color-canvas`, no blur.

---

## 4. Components

| Component | Spec |
|-----------|------|
| **Button** | Variants `primary` (accent fill), `secondary` (transparent, `border-strong`, hover → `raised`), `ghost` (no border, `fg-secondary`, hover → `accent-subtle`). Sizes `md` (48px, 4px radius) and `sm` (40px, 6px radius — nav CV, matching the icon button and locale switch). Optional leading/trailing icon. Focus: 2px accent outline, 2px offset. `asChild` for links. One primary button per view. |
| **SectionHeader** | `NN —— LABEL` eyebrow (number + rule in accent, label in `fg-secondary`) → h2 `displayL`. Optional lead directly below the heading (max 40rem). One left-aligned reading column at every width — eyebrow → heading → lead — so the eye never jumps across the page. |
| **StatusPill** | `accent-subtle` fill, success dot with soft glow, `monoS` label. Static — no pulse. |
| **StackList** | Mono, dot-separated (`TypeScript · React · NestJS`), wraps naturally, rendered as `<ul role="list">` with CSS separators — the explicit role keeps Safari/VoiceOver announcing it after the `list-style: none` reset (same on every styled list). Replaces boxed tags everywhere. |
| **Logo** | `$` accent + `brzezina.dev` + 0.5em static block cursor. |
| **LocaleSwitch** | Segmented control (`EN | CS`) — selected segment on `raised`. Real `<a>` links to the locale route with `aria-current`, `hreflang`. |
| **ThemeToggle** | 40px icon button, SVG sun/moon, label states the action ("Switch to light theme"). Persists to `localStorage`; inline head script applies the theme before first paint. |
| **Field** | Label above (never floating), 48px control on `canvas` with `border-strong`; focus → accent border + 3px `accent-subtle` halo; error → error border + message (`aria-invalid`, `aria-describedby`). Validated on blur, then live. |
| **IconButton** | 44px square on mobile (touch target), 40px from `md` up so every nav control shares one height; hairline border, `md` radius; hover → `raised`; press → `scale(0.94)` (off under reduced motion). Shared by the theme toggle and the menu open/close buttons. |
| **Icons** | Inline SVG, 20px, 1.75 stroke, `currentColor` (Lucide geometry): sun, moon, menu, close, arrow-right, arrow-up-right, download, github, check. |

---

## 5. Page, section by section

### Nav (sticky, 64px)
- **Left:** Logo.
- **Centre (≥900px):** About · Experience · Services · Work · Contact. Active section → `fg` + a 1px accent rule under the label, scaling in from the centre — the same mark as the eyebrow's rule (`aria-current`).
- **Right:** LocaleSwitch · ThemeToggle · `CV` secondary `sm` button with download icon.
- **Material:** transparent at the top of the page; after 8px of scroll it becomes `--color-material` + `backdrop-filter: blur(20px) saturate(180%)` with a hairline bottom edge. The edge exists only when content is actually under the bar.
- **< 900px:** Logo · ThemeToggle · 44px menu button. Menu = Radix Dialog sheet anchored to the top edge: large `titleL` links with mono counters (`01 About`), LocaleSwitch, CV + "Get in touch" buttons. Focus trap, Escape, scrim click. Dismissing returns focus to the trigger; choosing a section moves focus to that section instead.
- **Active section:** the section the reading line (35% down the viewport) passes through; none while on the hero; the last section at the very bottom of the page.
- Skip link ("Skip to content") as the first focusable element.

### 00 Hero
- Two columns from `lg` up (7/5), stacked on mobile (portrait first, compact).
- **Left:**
  1. StatusPill — "Available for contract work"
  2. h1 `displayXl` — **Václav Brzezina** (two lines on desktop)
  3. Role line, `monoS` accent — `Software Engineer`
  4. Tagline `titleL` fg — "9 years building JavaScript products across the full stack."
  5. One paragraph `bodyL` fg-secondary (the stack sentence + ownership sentence)
  6. CTAs: **See my work** (primary, →) · **Get in touch** (secondary)
- **Right:** circular portrait placeholder (accent ring, 1px gap) with a **`whoami` card** overlapping its lower-left edge. The card uses the nav material and blur. It turns the old "Currently Tech Lead…" sentence into scannable facts:
  ```
  ~ $ whoami
  role     Tech Lead · EPAM Systems
  client   Burberry — O2O clientelling
  stack    TypeScript · React · NestJS · AWS
  based    Czech Republic · CET
  speaks   EN · CS · SK
  ```
- **Backdrop:** the 72px technical grid, masked with a radial fade so it dissolves before the edges, plus one soft accent glow top-right (decorative, `aria-hidden`).
- **Proof strip** (bottom of hero, no rule): `WORKED ON PROJECTS FOR` eyebrow + `Burberry · Walmart · PSA · Veolia · Carvago · Logio` in `monoBody`. Worded as *projects for* because these were clients of EPAM, Starky's Club and Etnetera, not direct engagements — the big names stay, the claim stays accurate.

### 01 About — "Hands-on senior engineer"
- 5/7 split. Left: 4:5 portrait placeholder (surface, grid texture, `VB` monogram, `role="img"` with descriptive label). Right: first paragraph in `bodyL` fg (the lede), then two `bodyM` fg-secondary paragraphs, then a languages `<dl>`: **English** Fluent · **Czech** Native · **Slovak** Native.
- **Stack & tooling** (h3): a six-row table. Category in `titleM` on the left (3 cols), StackList on the right (9 cols), hairline between rows. Content from the brief: Frontend, Backend, Cloud, Databases, Practices, GenAI.

### 02 Experience — "Nine years, shipped"
- A vertical rail on the left with an accent dot per employer. The dot of the current role has a halo.
- **Company header:** name in `titleL`, title in `bodyM` fg-secondary; period in `monoS` accent, right-aligned on desktop and above the name on mobile.
- **Projects:** two-column grid from `lg` up (cuts the section height roughly in half). Cards in the same row share a height, with the stack line pinned to the bottom, so rows read as clean bands; across rows heights follow content (forcing one global height would pad short cards with empty space). Each project: `> Client` (`titleM`, accent `>`), role (`bodyS` fg), description (`bodyS` fg-secondary), StackList.
- Content is the real CV: EPAM (Burberry, Walmart), Starky's Club (Carvago/Omnitec DMS, 3G Project Guide Manager, Inventi/Summit Media — PSA), Etnetera (Logio, Veolia).

### 03 Services — "What I take on"
- 3 equal cards (`surface`, hairline, 6px radius): `01` counter, title `titleL`, description `bodyS`, hairline, `TYPICAL STACK` eyebrow + StackList. Hover → `border-strong`, card lifts 2px.
- **Engagement facts** row under the cards, three items with icons: *Freelance & contract* · *Remote-first, CET time zone* · *English & Czech*.

### 04 Work — "Selected work"
Replace the three TBD cards with **real, honest content**:
- **Featured card (8 cols):** brzezina.dev itself. The site is being built as the first case study (see `case-study-log.md`). Thumbnail: grid backdrop with a minimal browser-chrome mock showing the hero. Body: `IN PROGRESS` pill, title, one-line description, StackList (Next.js · TypeScript · Emotion · Radix · next-intl), "View source ↗" link to the public repo.
- **Open slot (4 cols):** dashed border — "Next case study. This slot is open — the next one could be your product." → ghost button "Start a project →" (#contact).
- The lead keeps the brief's line: "Projects coming soon — currently building this site."

### 05 Contact — "Available for freelance and contract engagements"
- Lead: "Tell me about the product, the stack and the timeline. I reply within 1–2 business days." (matches the brief; replaces "48 hours")
- **Form panel (8 cols, surface):** Name + Email side by side (stacked on mobile), Message (min 8 rows). Footer row: "All fields are required." on the left, **Send message** primary on the right. Inline validation. After submit the panel swaps to a success state with a check icon and the reply-time promise.
- **Aside (4 cols):** `<dl>` with mono labels — Response time · Based in · Elsewhere (GitHub) · Curriculum vitae (secondary button "Download PDF").

### Footer
- Logo + tagline · Sections column · Elsewhere column.
- Bottom bar: `© 2026 Václav Brzezina` · LocaleSwitch · "Back to top ↑".

---

## 6. Content & i18n

- All copy lives in `messages/en.json` and `messages/cs.json` (structure mirrored).
- Structured data lives in `src/data/` (`experience.ts`, `skills.ts`, `services.ts`, `work.ts`, `site.ts`) and holds **no translatable strings**: ids, periods, proper nouns (company / client / technology names), URLs. Roles and descriptions are looked up by id in the messages files.
- Removed: invented placeholder bio and projects. Everything shown now traces back to the brief or the CV.

## 7. Accessibility checklist (WCAG 2.1 AA)

- Contrast table in §3.1; every text pair ≥ 4.5:1.
- One `h1`; one `h2` per section; `h3` for companies, cards and subsections.
- Skip link; visible 2px accent focus ring on every interactive element; 44px minimum touch targets on mobile.
- Nav `aria-current`; locale links with `hreflang`; theme button announces its action.
- Mobile menu: Radix Dialog (focus trap, Escape, labelled, focus returns to the trigger).
- Form: real `<label>`s, `aria-invalid` + `aria-describedby` errors, `aria-live` status for sending/sent.
- `prefers-reduced-motion`, `prefers-reduced-transparency` and `prefers-contrast` all handled (§3.4, §3.1).
- Decorative backdrops and glows are `aria-hidden`; placeholders carry descriptive labels.

## 8. Out of scope / follow-ups

- **Contact submission backend** — the form POSTs JSON `{ name, email, message }` to `site.contactEndpoint` (`/api/contact`). The handler doesn't exist yet (tickets 08/10), so submissions currently show the error state — message kept, GitHub offered — never a fake success.
- **CV file** — every CV link points at `/cv.pdf` with `download`; the PDF still needs adding to `public/`.
- **Real photography** — both portrait slots are placeholders sized for real photos (1:1 hero, 4:5 about).
- **Figma parity** — finish the screens in the Figma file once MCP calls are available again (Pro plan or next month's quota).
