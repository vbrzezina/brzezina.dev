# ADR-011: Linting, formatting, tests and CI

**Status:** accepted
**Date:** 2026-10-13
**Decider:** Václav Brzezina

---

## Context

The project had no linter, formatter, test runner or CI; `next lint` was unconfigured and the pre-commit hook was a placeholder. Several real defects (a form that dropped real messages, pages that silently rendered per request, an origin check that depended on the host) would have been caught by tests that did not exist. Code style had drifted file by file (semicolons in 32 files, none in 24).

## Decision

1. **ESLint 9 (flat config)** with `eslint-config-next` (core-web-vitals + TypeScript) plus extra `jsx-a11y` rules. `npm run lint` runs `eslint .`; `next lint` is deprecated.
2. **Prettier** — single quotes, semicolons, 120 columns (what the majority of files already used). Applied to staged files by **lint-staged** in the pre-commit hook, together with a project-wide `tsc --noEmit`. A one-off `npm run format` is deferred until open PRs are merged, to avoid conflicts.
3. **Vitest** for logic that has no UI: the contact route (origin, size, honeypot, validation, rate limit, provider failures, sender sanitising), the shared form rules, and EN/CS message parity (keys, placeholders, rich-text tags). The tests were mutation-checked: breaking the honeypot, the recipient, the origin check, or a Czech key makes them fail.
4. **Playwright + axe** against a **production build** for what only a browser can verify: both locales render without console errors, the form's error / success / failure states (including focus and live regions), the CV download, 404s, language redirect, and axe on every page in both themes at desktop and mobile widths.
5. **Typed translation keys** (`src/types/next-intl.d.ts`): `t()` is checked against `messages/en.json`, so a misspelled key is a compile error. Ids that become keys are typed in `src/data/*`; route `locale` params are narrowed with `resolveLocale()`.
6. **GitHub Actions** on every PR: type check, lint, unit tests, build, a check that `/[locale]` and `/[locale]/privacy` are still `●` (pre-rendered) in the build output, then the Playwright suite. Dependabot opens weekly, grouped npm updates (Next.js has needed critical patches here).
7. **Security headers** on every response (`nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY` with `frame-ancestors 'none'`, `Permissions-Policy`, `COOP`); `X-Powered-By` removed. A full CSP is deferred: the inline theme script and the consent-gated GTM bootstrap would need nonces, which makes every page dynamic.

## Consequences

- `npm audit` now reports dev-only advisories (via `eslint-config-next`'s globbing dependencies); nothing from them ships. Production advisories are unchanged (Next's pinned `postcss`).
- The browser tests need a Chromium (`npx playwright install chromium`, or `PLAYWRIGHT_CHROMIUM_PATH`).
- Optional translations (SAP's project description) need an explicit cast at the `t.has` call, since the type lists only keys that exist today.
