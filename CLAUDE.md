# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Pre-build. The stack and architecture are locked via a wayfinder planning effort — read the map before starting any implementation work:

- **Map**: `.scratch/brzezina-dev-portfolio/map.md`
- **Issue tracker**: `.scratch/brzezina-dev-portfolio/issues/` (local markdown — see `docs/agents/issue-tracker.md` for conventions)

## Confirmed stack

- **Framework**: Next.js (App Router, TypeScript), Vercel hosting, public GitHub repo
- **Styling**: `@radix-ui/react-*` Primitives + `@emotion/react` + `@emotion/styled` — no Radix Themes, no Chakra, no Mantine, no CSS Modules, no Tailwind, no shadcn, no MUI
  - Tokens stay in `tokens.css` as CSS custom properties; Emotion reads them via `var(--token-name)`
  - Wrap Radix Primitives with `styled(Primitive)` — no visual defaults to fight
  - Type-safe variants use `$`-prefixed props: `<Button $variant="solid" />`
- **Analytics**: Vercel Analytics + GA4 via GTM + Google Search Console
- **CMS**: None initially; Keystatic as the upgrade path when editing friction materialises
- **Accessibility**: WCAG 2.1 AA target

## Design system

Sourced from the Lovable.dev visual prototype at `https://github.com/vbrzezina/brzezina-blueprint`. The blueprint is the reference implementation (Vite/TanStack, different stack — use it for layout, tokens, and component structure only).

### Typography
- **Display / headings**: Space Grotesk — `letter-spacing: -0.02em`
- **Body**: DM Sans
- **Mono / eyebrow labels**: JetBrains Mono — uppercase, `letter-spacing: 0.18em`

### Colour tokens (oklch)
Dark mode is the primary experience. Light mode is available via toggle.

| Token | Dark | Light |
|-------|------|-------|
| `--background` | `oklch(0.16 0.028 255)` deep navy | `oklch(0.978 0.006 106)` warm white |
| `--surface` | `oklch(0.21 0.03 255)` | `oklch(0.955 0.008 106)` |
| `--foreground` | `oklch(0.965 0.006 250)` | `oklch(0.19 0.03 250)` |
| `--primary` (teal accent) | `oklch(0.82 0.15 190)` | `oklch(0.55 0.12 205)` |
| `--muted-foreground` | `oklch(0.73 0.02 250)` | `oklch(0.48 0.02 250)` |
| `--border` | `oklch(0.99 0 0 / 12%)` | `oklch(0.88 0.01 250)` |
| `--radius` | `0.25rem` (sharp corners) | same |

### Design language
- Developer-dark-first: dark is the primary and hero mode; light is secondary
- Teal/cyan accent (`--primary`) on deep navy — terminal/CLI aesthetic throughout
- Sharp corners (`border-radius: 0.25rem`) — no rounded pill softness
- Mono eyebrow labels: section counters and tags use JetBrains Mono in uppercase
- Faint technical grid backdrop on hero and card thumbnail backgrounds (CSS `background-image: repeating-linear-gradient`)
- Scroll-reveal: `opacity 0→1` + `translateY(1.25rem→0)`, 700ms `cubic-bezier(0.22, 1, 0.36, 1)`
- Smooth scroll with `scroll-margin-top: 5.5rem` for sticky nav clearance
- Flat cards: border-only, no shadow, background matches `--surface`

### Component patterns (from blueprint reference)

**Nav** — sticky, transparent-to-dark on scroll
- Logo: `$ brzezina.dev` — `$` in teal monospace, name in white monospace
- Links: DM Sans, no underline; active link gets underline
- Right cluster: `EN | CS` locale toggle · sun/moon theme toggle · `CV ↓` ghost outline button

**Section eyebrow** — consistent pattern across every section:
```
NN —— SECTION NAME
```
- `NN`: teal JetBrains Mono (00 hero, 01 about, 02 experience, 03 services, 04 work, 05 contact)
- `——`: short teal horizontal rule
- `SECTION NAME`: white JetBrains Mono uppercase
- Section heading: large Space Grotesk (heavy weight), full-width below eyebrow

**Hero**
- Two-column: text left (55%), avatar right (45%)
- Avatar: circular crop with teal ring border
- Role label: teal monospace below name
- Tagline: medium-weight DM Sans ~1.75rem
- CTAs: solid teal (primary `See my work`) + ghost outline white (secondary `Get in touch`)

**Experience timeline**
- Left: vertical teal line with teal bullet dots per company
- Company name + title left, date range in teal right-aligned
- Sub-items prefixed with `>` (teal terminal arrow) for project/client names
- Tech stack: `Tag · Tag · Tag` in JetBrains Mono, dot-separated

**Service / solution cards**
- 3-column grid, equal height
- Card: `--border` outline only, no background fill difference, `--radius` corners
- Top-left: teal mono number (`01`, `02`, `03`)
- Title: white semi-bold Space Grotesk
- Description: muted DM Sans body

**Work cards**
- 3-column grid with dashed border variant
- Thumbnail area: grid backdrop pattern fill
- Tech stack below title in mono dot-separated

**Contact section**
- Two-column: form left (2/3), info sidebar right (1/3)
- Sidebar uses mono uppercase labels (`RESPONSE TIME`, `CURRICULUM VITAE`)
- Form inputs: `--surface` background, `--border` outline, no label float
- Primary CTA: solid teal full-width button

**Buttons**
- Primary: `background: --primary`, `color: --primary-fg`, no border-radius beyond `--radius`
- Ghost/outline: `border: 1px solid --border` or `--primary`, transparent background
- No hover shadows — background lightens slightly (`--primary-hover`)

### Content and i18n
- All user-facing text lives in translation files (`messages/en.json`, `messages/cs.json`) — no `content.ts` or inline string literals in components
- i18n library: next-intl (pending ticket 10 resolution for route structure)
- Structured data (skill lists, experience entries, work projects) will be typed TypeScript files in `src/data/` but contain no translatable strings — labels and descriptions go in messages files

## Case study log

This project is being built for eventual use as a portfolio case study. Maintain a running decision record so the material is available when writing it up.

**Log file**: `.scratch/brzezina-dev-portfolio/case-study-log.md`

### What to log (agent instructions)

After any significant decision, wrong turn, or architectural choice — append an entry to the log file. Do not wait to be asked.

Each entry follows this format:

```markdown
### YYYY-MM-DD — <Short decision title>

**Decision:** What was chosen.
**Alternatives considered:** What else was on the table.
**Why:** The specific reason this option won (constraint, preference, technical fact).
**Wrong turn / lesson (optional):** If something was tried and abandoned, say what and why.
```

### What counts as loggable

- Any confirmed stack/tooling choice (library, framework, deployment approach)
- Any explicit rejection with a reason (e.g. Tailwind, shadcn, CSS Modules)
- Open decisions resolved — capture the moment of resolution with the reasoning
- Discoveries that changed direction mid-build
- Anything the user says was a "wrong turn"

### What not to log

- Routine implementation details (which file a component lives in, etc.)
- Decisions already fully captured in the issue tracker tickets

## Git workflow

Trunk-based development with conventional commits. **Never push or merge directly to `main`.**

### Branch naming
```
feat/<short-description>
fix/<short-description>
chore/<short-description>
docs/<short-description>
```

### Commit format (enforced by commitlint)
```
<type>(<optional-scope>): <short description>

Types: feat | fix | docs | style | refactor | perf | test | build | ci | chore | revert
```

### PR workflow
1. Create a branch from `main`
2. Commit with conventional commit messages
3. Push the branch and open a PR via `gh pr create`
4. Never run `git push origin main` — the Claude Code hook will block it

## Open decisions — do not treat research recommendations as approved

The following are **not yet decided** — work the relevant ticket before coding against them:

| Decision | Ticket | Notes |
|----------|--------|-------|
| `output: 'export'` vs Vercel-native SSG | `10` | Unresolved; affects i18n library and contact form |
| Contact form approach | depends on `10` | Resend via route handler (Vercel-native) vs external service (static export) |
| i18n library | `06` (blocked by `10`) | next-intl recommended by research; not HITL-approved; next-i18next still viable |
| CMS strategy | `07` | No-CMS recommended by research; not HITL-approved |
| Mailer selection | `08` | Resend recommended by research; not HITL-approved |
