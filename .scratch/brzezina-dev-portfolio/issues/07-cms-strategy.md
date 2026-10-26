# CMS strategy

Type: grilling
Status: resolved
Blocked by: 02

## Question

Should brzezina.dev use a CMS, and if so which one?

Depends on research from "CMS options for a Next.js static export portfolio".

Context: portfolio section starts empty and grows over time; site is bilingual; Václav is the sole editor and a developer comfortable editing files directly.

Resolve:
1. Is any CMS overhead justified for a solo portfolio, or are hardcoded content files the right call?
2. If a CMS: which one best fits static export + solo-developer workflow?
3. Does the chosen CMS subsume or constrain the i18n translation file decision?

## Answer

**No CMS.** Resolved 2026-10-26 (the site had been running this way since launch). Copy lives in `messages/*.json`; structured data (experience, skills, services, work) lives as typed files in `src/data/` with no translatable strings.

1. CMS overhead is not justified for a solo, developer-edited portfolio.
2. If editing friction appears, Keystatic is the upgrade path (research ticket 02).
3. Not applicable: with no CMS, the i18n file decision (ticket 06) is unconstrained.

See `docs/adr/005-cms-strategy.md`.
