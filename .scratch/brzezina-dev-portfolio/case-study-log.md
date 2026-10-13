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

### 2026-10-12 — Emotion glues a leading `:root` onto the component class

**Decision:** Theme-scoped selectors inside styled components start with `html[data-theme=…] &`, never `:root[data-theme=…] &`.
**Why:** Emotion's compiler (stylis) treats a nested selector that begins with `:` as a pseudo-class of the component itself, so `:root[data-theme='light'] & .icon-sun` compiled to `.css-x:root[data-theme="light"] .css-x .icon-sun` — which never matches. The theme toggle had been showing the sun icon in light mode since the first redesign commit; it surfaced only when a new dark-mode image filter visibly failed to apply.
**Wrong turn / lesson:** Axe and the interaction tests passed throughout — neither checks *which* icon is shown. Asserting computed styles of a visual state (here: `display` of each icon per theme) catches what accessibility and behaviour tests can't.

---

### 2026-10-13 — GA4 kept, behind opt-in consent; privacy policy; no Terms

**Decision:** GA4 via GTM stays, but GTM loads only after the visitor clicks Accept in a custom, non-modal banner (Consent Mode v2 defaults denied, then granted). Vercel Analytics (cookieless) runs for everyone. `NEXT_LOCALE` cookie disabled so the site sets zero cookies by default. Privacy policy page in EN/CS; no Terms of use. Details in ADR-009.
**Alternatives considered:** Dropping GA4 to avoid a banner entirely (recommended, owner preferred GA4); Consent Mode "advanced" with pre-consent pings; a third-party CMP.
**Why:** EU/Czech law requires opt-in for analytics cookies; loading nothing before consent is the simplest defensible pattern and keeps previews tracking-free (no ID → no banner). A custom banner keeps the design system intact and avoids another vendor script.
**Wrong turn / lesson:** The first audit with the banner showing flagged the skip link — rendering the banner first had demoted the skip link from first focusable element. Moved the skip link into the layout ahead of the banner. Also: an earlier "zero cookies" check came back clean only because the server wasn't running — re-verifying against a live server found `NEXT_LOCALE`.

---

### 2026-10-12 — Theme reset on locale switch: React owns `<html>`

**Decision:** Removed `data-theme` from the server-rendered `<html>`; dark is the CSS default on `:root`. The colour-scheme provider re-applies the stored theme in a layout effect on every mount.
**Why:** Switching locale is a client-side navigation that re-renders the root layout; React re-applied `data-theme="dark"` from props, overwriting the user's choice (still in `localStorage`, so a reload "fixed" it — which made it look random). Reproduced with Playwright before fixing.
**Alternatives considered:** A theme cookie read by the server layout — SSR-correct, but makes the route depend on `cookies()`, which conflicts with the still-open static-export option (ticket 10).

---

### 2026-10-13 — Business identification lives in Contact, not the footer

**Decision:** Email, phone and the sole-trader identification (name, IČO, registered address) sit in the Contact (05) aside; the privacy policy repeats them as the controller. The footer no longer carries an IČO line.
**Alternatives considered:** IČO line in the footer of every page (the first implementation); contact details in the header.
**Why:** Civil Code §435 requires the identification to be available on the website, not on every page. People looking for a phone number or invoicing details go to Contact, and a busy footer was already a complaint in earlier review rounds. The header stays navigation-only.
**Wrong turn / lesson:** The footer placement was copied from the common Czech e-shop pattern, where it exists for convenience rather than legal necessity.

### 2026-10-13 — CV download: home nav + Contact, not on content pages

**Decision:** The nav CV button only appears on the home page. Content pages (privacy now, blog later) drop it from the bar and the mobile sheet. The Contact aside keeps its CV button.
**Alternatives considered:** CV in the nav everywhere; CV in the nav only (removing it from Contact, which would also have shortened the too-tall aside).
**Why:** Content pages are for reading, and home is one click away. On home the sticky nav covers desktop, and the Contact aside is where hiring intent peaks. It is also the only CV link mobile visitors see without opening the menu. The aside's height problem was solved with spacing instead: its top padding matches the panel's, and its rhythm is tightened so both columns start and end together.

### 2026-10-13 — One nav for every page (reversing "CV only on home")

**Decision:** Content pages use the same nav as home: section links (pointing back into home), the CV button and "Get in touch". Only the header surface differs. No section is highlighted on a content page.
**Alternatives considered:** Hiding the CV on content pages (shipped briefly); also dropping "Get in touch"; reducing the content-page menu to a single "Home" link.
**Why:** A blog post is often the first page a visitor sees, arriving from search or a shared link. For them the header is the way into the portfolio, and a recruiter reading a post is exactly who wants the CV. A different menu per page type means learning two navigations. A "Home"-only menu turns every section into two clicks, and it fits poorly with a Blog link that will need its own place in the nav.
**Wrong turn / lesson:** "Content pages are a reading context, so strip the actions" sounded tidy but optimised for the privacy page, the least-visited page on the site. Also: scrolling to the bottom of the privacy page highlighted "Contact". The active-section hook's "at the bottom, the last section wins" rule didn't check that the section existed on the page. It now ignores ids that aren't rendered.

### 2026-10-13 — About graphic: an architecture diagram instead of a second photo

**Decision:** The About photo is replaced by an inline-SVG system diagram, with four layers (client → API → serverless → data). The request path is drawn in the accent colour, and a single pulse travels from the browser to the database.
**Alternatives considered:**
- A different candid photo (none of the available shots worked).
- A generic workplace stock photo.
- A code or terminal card (repeats the hero's whoami card).
- A git-graph of career milestones (repeats the Experience timeline).
**Why:** The diagram draws exactly what the bio's lede says. It belongs to the site's blueprint grid language, works in both themes from tokens alone and costs no image bytes. A stock photo would read as filler on a portfolio whose point is authenticity.
**Wrong turn / lesson:** Three rounds of photo-picking for this slot. The slot never needed a photo, it needed something that explained the work.

### 2026-10-13 — Security upgrade: Next.js 15.5.27, next-intl v4; postcss advisory accepted

**Decision:** Patch Next.js to 15.5.27, which fixes two critical RCE advisories, one of them in the Image Optimization API that `next/image` uses. Move next-intl from 3.26.5 to 4.14.9: the middleware open-redirect fix only exists in v4. Leave the postcss advisory open; Next 15 pins postcss to exactly 8.4.31, and the only fix on offer is Next 16.
**Alternatives considered:** `npm audit fix --force` (jumps to Next 16, a major upgrade with its own migration); an `overrides` entry forcing postcss ≥ 8.5.23 under Next.
**Why:** The postcss advisories all need attacker-controlled CSS. Here postcss only compiles the repo's own stylesheets at build time, so overriding a framework's exact pin would add risk without removing any. The v4 migration was nearly drop-in because the code already used next-intl's newer APIs (`createNavigation`, `defineRouting`, `requestLocale`).
**Wrong turn / lesson:** Probing the open redirect turned up an older bug. The middleware matcher skips dotted paths, and the `[locale]` layout never validated the locale, so `/foo.bar` rendered the home page with a 200 and `lang="foo.bar"`. Fixed with v4's `hasLocale` + `notFound()`.

### 2026-10-13 — Contact form: Resend via a route handler; Vercel-native confirmed

**Decision:** The contact form posts to `src/app/api/contact/route.ts`, which sends through the official Resend SDK. This also closes the static-export question (ticket 10) in favour of Vercel-native deployment.
**Alternatives considered:** a plain `fetch` to Resend's REST API; Formspree and other hosted form backends (which static export would have required); Nodemailer + SMTP; AWS SES.
**Why:**
- The owner had a Resend account ready, and research ticket 03 had already ranked it first.
- The site had quietly stopped being static-exportable once next-intl's middleware arrived, so ticket 10 was already decided by the code.
- Abuse controls are sized to the actual risk. The recipient is fixed server-side and the visitor's address only goes into Reply-To, so the worst case is spam in the owner's own inbox: a honeypot, an Origin check and a per-instance rate limit cover it without adding a KV store.
**Wrong turn / lesson:** The first version called Resend's REST API with a plain `fetch` to keep the SDK's inbound and webhook dependencies out of a public repo. The owner preferred the official SDK: typed payloads, `{ data, error }` results and API changes absorbed upstream are worth two small transitive packages on a site they maintain alone. The switch changed nothing observable, and the same tests passed byte for byte.

### 2026-10-13 — Review findings → static rendering, localized metadata, visible hero

**Decision:** Pre-render both locales (`generateStaticParams` + `setRequestLocale`), generate all page metadata from one helper with canonical + hreflang + Open Graph, add the missing SEO files (robots, sitemap, icons, OG image, JSON-LD), and make the hero visible without waiting for JavaScript. See ADR-010.
**Alternatives considered:** keep next-intl's middleware `Link` header for hreflang (rejected: its host comes from the request, so it disagrees with the canonical origin on previews and www); drop the Reveal animation on the hero entirely (rejected: a CSS-only version keeps the polish at no JavaScript cost); skip `latin-ext` to save ~49 KB of preloads (rejected: Czech letters would render in a fallback font).
**Why:** A four-way review (design, code, accessibility, SEO) agreed on the same root cause: the site looked right in a browser but was built for a visitor with JavaScript and an English locale. Pages were rendered per request, `/cs` carried English metadata, and the hero's largest paint waited for hydration.
**Wrong turn / lesson:** The 404 template first imported a styled `Container` into a server component, and the prerender of an unrelated page failed with `createContext is not a function`. Emotion-styled modules must only be imported from client components.
**Measured:** LCP 1136 ms → 316 ms (desktop) and 3472 ms → 1248 ms (mobile, throttled).
