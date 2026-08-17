# CMS options for a Next.js static export portfolio

Type: research
Status: resolved

## Question

What are the viable CMS options for a solo developer's Next.js static export portfolio, from no-CMS to lightweight file-based to full headless? Evaluate:

1. **No CMS** — hardcoded TypeScript/JSON content files committed to git
2. **Decap CMS** (formerly Netlify CMS) — file-based, git-backed, browser UI
3. **Keystatic** — file-based, local and cloud modes, TypeScript-first
4. **Tina CMS** — git-backed, visual editing, open source
5. **Sanity** — hosted headless CMS, free tier

For each: Does it work with `output: 'export'`? What is the editing experience for a solo developer? Cost? Complexity overhead?

Additional context: portfolio section starts empty and grows over time; site is bilingual (EN/CS) — does the CMS choice affect how translations are managed?

## Answer

### The core constraint: `output: 'export'` kills runtime API routes

Next.js static export produces a fully static HTML/CSS/JS bundle with no Node.js server. This means **no API routes**, **no server-side rendering**, and **no dynamic route handlers**. Any CMS that requires a running backend or API routes at request time is either incompatible or needs a workaround (e.g., a separate Vercel function deployment alongside the static export, which adds complexity and partly defeats the purpose).

---

### 1. No CMS — hardcoded TypeScript/JSON files in git

**Static export compatibility:** Full — no runtime dependency at all.

**Editing experience:** Edit files in your IDE, commit, push, Vercel rebuilds. For a solo developer this is the lowest-friction workflow; no UI to maintain or authenticate with.

**Content structure:** TypeScript files provide full type safety. A `content/projects/` directory with typed objects is trivially queryable at build time and checked by the compiler. The i18n story is explicit: maintain parallel `en.ts` / `cs.ts` objects or a single object with `{ en: string; cs: string }` per field. No magic, no abstraction.

**Cost:** Free.

**Complexity overhead:** Zero extra dependencies. The "overhead" is manual — there is no admin UI, so you edit raw files. For a solo developer who lives in VS Code this is a feature, not a bug.

**i18n impact:** None imposed; you design the structure yourself, which is a strength for a bespoke bilingual setup.

**Verdict:** Best choice for the current state of this site. Portfolio section starts empty; there is nothing to "manage" yet. Add a CMS when the editing friction genuinely hurts.

---

### 2. Decap CMS (formerly Netlify CMS)

**Static export compatibility:** Technically compatible — Decap CMS is a pure client-side Single Page Application (SPA) deployed as a static HTML page alongside your site (typically at `/admin/`). It communicates directly with GitHub's API from the browser using OAuth. No server-side API routes required.

**Editing experience:** Browser-based WYSIWYG/form UI over your git-tracked markdown/YAML/JSON files. Works from any browser; no local setup needed. The UI is functional but noticeably dated (project rebranded from Netlify CMS in 2023, development pace is slow). It requires setting up a GitHub OAuth app and either Netlify's identity service or a third-party auth proxy (e.g., `netlify-cms-github-oauth-provider` on a small Node service, or Cloudflare Workers) for non-Netlify hosting — that is a real setup cost on Vercel.

**GitHub OAuth on Vercel:** The OAuth callback must hit a server endpoint. Without Netlify Identity you need to self-host a tiny auth proxy or use a community service. This is documented and solvable but adds friction.

**Cost:** Free and open source. Auth proxy may be free (Cloudflare Workers free tier) or trivially cheap.

**Complexity overhead:** Moderate. OAuth app registration, auth proxy setup, and config file maintenance (`config.yml`). The admin page itself is just a static HTML file you drop in `public/admin/`.

**i18n impact:** Decap CMS has a beta i18n feature (`i18n` in `config.yml`, `structure: multiple_files` or `single_file` mode). It surfaces language switchers in the editor. Works, but is not its strongest feature and requires schema duplication.

**Verdict:** Viable but carries setup overhead that is disproportionate for a solo dev on Vercel. Better suited to teams or Netlify-hosted sites. Skip unless you have a specific reason to want a browser editing UI.

---

### 3. Keystatic

**Static export compatibility:** Partial and constrained.

The Keystatic admin UI (`/keystatic`) requires:
- An API route at `app/api/keystatic/[...params]/route.ts`
- The admin page exported with `export const dynamic = 'force-dynamic'`

Both are incompatible with `output: 'export'`. The admin UI **cannot be included in a statically exported Next.js site**.

**Workaround:** Use the `@keystatic/core/reader` Reader API at build time to read markdown/YAML/JSON files from disk — that works perfectly in a static build. The constraint is that you must edit content files locally in your editor or run Keystatic in a **separate non-exported Next.js project/branch** (or a separate `dev` mode run), then commit the files. Keystatic's `storage: { kind: 'github' }` mode requires the API route to be live, which means you'd need to deploy the admin-enabled build separately (e.g., a Vercel preview/branch deployment that is not the static export).

**Keystatic Cloud:** `storage: { kind: 'cloud' }` delegates auth to Keystatic Cloud (free for open-source/solo use as of 2025). This still requires the API route to be reachable — so the same constraint applies.

**Editing experience (when it works):** Excellent. TypeScript-first schema definition, co-located content files, first-class Markdown + YAML/JSON, tight VS Code integration, and a polished browser UI. Maintained by Thinkmill, actively developed in 2025.

**Cost:** Free for the package. Keystatic Cloud has a free tier for solo/open-source projects.

**Complexity overhead:** Low-to-medium if you're OK with the admin running on a separate dev server (`next dev`). High if you want the admin accessible from Vercel while the public site is a static export — requires two deployments or a hybrid setup.

**i18n impact:** Keystatic has no native i18n/locale fields. You model translations as separate collections or as structured fields (`{ en: fields.text(), cs: fields.text() }`). The TypeScript schema makes this explicit and safe.

**Verdict:** Strong option if the portfolio grows significantly and you want a polished editing UI. The practical workflow: run `next dev` locally, edit at `localhost:3000/keystatic`, commit, push. The static export then reads the committed files at build time. This is entirely workable for a solo developer who doesn't need browser-based remote editing.

---

### 4. Tina CMS

**Static export compatibility:** Yes — Tina supports `output: 'export'` explicitly (documented for Cloudflare Pages deployment). At build time, Tina's CLI generates content from the git-tracked files and the static export uses that output.

**Architecture:** Tina has two backends:
- **TinaCloud** — hosted service with an editorial workflow, branch management, and a live preview editing experience (visual, inline editing). Requires the Tina backend to be reachable via the Tina GraphQL API.
- **Self-hosted** — run your own backend with a custom database and auth. Removes the TinaCloud dependency but adds infrastructure.

**The static export caveat:** The live/visual editing experience (Tina's headline feature) requires the Tina backend running at request time. For a pure static export you lose visual inline editing and are left with the git-backed content files that Tina manages — functionally similar to Keystatic's setup but with more moving parts.

**Editing experience:** Tina's USP is inline visual editing ("edit directly on the page"). This works with ISR or SSR Next.js. With static export you'd use the Tina admin UI (a separate panel), which is polished but the visual-in-page experience is degraded.

**Cost:** TinaCloud free tier covers 2 users and limited editorial workflow seats as of 2025. Self-hosted is free but requires a database (e.g., MongoDB Atlas free tier) and auth setup.

**Complexity overhead:** High for what this project needs. TinaCloud adds a third-party service dependency. Self-hosting adds a database and auth layer. The GraphQL schema generation (`tina/config.ts`) is another file to maintain.

**i18n impact:** No native i18n support. The Tina docs note you can use Next.js's built-in i18n routing alongside Tina, but since built-in Next.js i18n is broken on static export (noted in the map notes), you'd need a custom approach regardless. Tina adds no value here and doesn't simplify the problem.

**Verdict:** Overkill for a solo portfolio. The visual editing selling point is diminished on static export. Only worth it if editorial workflow (drafts, review, multi-branch) becomes a requirement.

---

### 5. Sanity

**Static export compatibility:** Yes. Sanity is a hosted headless CMS; your Next.js app fetches content from Sanity's CDN (`cdn.sanity.io`) at **build time** using GROQ queries. The static export has zero runtime dependency on Sanity — it's just a data source for `generateStaticParams` / `getStaticProps`. The Sanity Studio can be embedded in Next.js but requires `force-static` on the studio route and is typically deployed separately or accessed at `sanity.io/manage`.

**Editing experience:** Sanity Studio is the best-in-class editing UI among these options — real-time collaborative, highly customizable, schema-defined in TypeScript (`defineType`, `defineField`). Changes in Studio trigger a Vercel webhook redeployment. The disconnect between editing and seeing the live static site is the same as all the other options.

**Cost:** Free tier (as of 2025) includes 3 users, 2 datasets, 500k API CDN requests/month, and 20GB bandwidth. A personal portfolio is orders of magnitude below these limits. Paid plans start at $15/month.

**Complexity overhead:** The highest of all options here. You maintain a Sanity project (separate from your repo or in a `/studio` subdirectory), define schemas in Sanity's schema language (parallel to any TypeScript types in your Next.js app), manage API tokens in Vercel env vars, and set up a redeployment webhook. Content lives outside your git repo, which means content is not version-controlled alongside code by default (Sanity has content history but not git).

**i18n impact:** Sanity has a first-class `document-internationalization` plugin (formerly `sanity-plugin-intl-input`). It supports "weak" references across translated documents and surfaces language switchers in the Studio. This is the most mature i18n story among all the CMS options evaluated. However, given the simple bilingual (EN/CS) structure of this site, this sophistication is not needed.

**Verdict:** Best-in-class editing and i18n support, but the complexity-to-value ratio is poor for a single-developer portfolio. The overhead of maintaining a separate content platform, schema definitions outside the codebase, and API credentials is not justified when content volume is low and you're the only editor.

---

### Comparison summary

| Option | Static export | Editing UI | Cost | Complexity | i18n |
|---|---|---|---|---|---|
| No CMS | Full | IDE only | Free | Zero | DIY, fully controlled |
| Decap CMS | Full | Browser SPA | Free | Medium (OAuth proxy on Vercel) | Beta feature, workable |
| Keystatic | Build time only (admin broken on static) | Local dev server or browser via GitHub mode | Free | Low-medium | DIY structured fields |
| Tina CMS | Full | Admin panel (visual editing degraded) | Free tier / self-host | High | DIY + Next.js i18n |
| Sanity | Full | Sanity Studio (best-in-class) | Free tier | Highest | First-class plugin |

---

### Recommendation

**Start with no CMS.** The portfolio section is empty; there is nothing to manage. TypeScript/JSON content files in git are zero-overhead, fully type-safe, and trivially readable at build time. Translations are handled as parallel locale objects in the same files. When the Work section grows to 10+ projects and editing raw files becomes tedious, **migrate to Keystatic** (run locally, edit in dev, commit, push) — the Reader API is a drop-in build-time data source and migrating content from raw TS/JSON objects to Keystatic YAML/markdown is mechanical.

**Avoid Decap CMS** on Vercel — the OAuth proxy requirement is genuine friction without upside for a solo developer.

**Avoid Tina and Sanity** for this project's current scale — both impose ongoing operational complexity (external services, API tokens, webhooks, schema maintenance) disproportionate to a static portfolio with one author.
