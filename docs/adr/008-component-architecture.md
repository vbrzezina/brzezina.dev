# ADR-008: Component architecture — shared UI primitives vs section-local components

**Status:** revisit  
**Date:** 2026-08-18  
**Decider:** Václav Brzezina

---

## Context

The site has ~8 sections and a nav, each with styled components. The question is where to draw the line between "shared primitive" and "section-local styled component."

The current approach was established iteratively: started with each section self-contained, then refactored repeated patterns into `src/components/ui/` after duplication became apparent.

## Current decision

**Shared primitives in `src/components/ui/` for cross-section atoms. Section-specific layout and structural components stay local.**

### What lives in `src/components/ui/`

| Component | Used in | Purpose |
|-----------|---------|---------|
| `Button` | Hero, Contact, SiteNav | Polymorphic button (`solid` / `outline` variants, `asChild` for link rendering) |
| `Tag` | About | Skill/tech badge in mono font |

### What stays section-local

- Layout components (`HeroGrid`, `TwoColGrid`, `Timeline`, `CardGrid`) — too specific to extract
- Typography within a section (`Eyebrow`, `Heading`, `BodyText`) — use the same token references but section-specific sizing/spacing
- Form elements in Contact (`StyledInput`, `StyledTextarea`, `FieldGroup`) — used only once

### Shared layout primitives (`src/components/layout/`)

Separate from UI: `Container`, `Box`, `Spacer` — structural layout helpers used across all sections.

---

## Why `revisit`

The current split is pragmatic but not principled. Specific tensions:

1. **`SectionHeading` is effectively a shared primitive** — used in every section (`About`, `Experience`, `Services`, `Work`, `Contact`). It lives at `src/components/SectionHeading.tsx` but is structurally similar to a UI primitive.

2. **`Reveal` is a shared animation wrapper** — same situation; used everywhere, lives as a top-level component.

3. **Typography atoms are not extracted** — `Eyebrow`, section headings, body copy all use the same token + font pattern but are redefined per-section. A `Text` or `Heading` primitive with variant props would reduce duplication.

4. **The `Button` `as={Slot}` pattern is a type cast workaround** — `as={asChild ? (Slot as React.ElementType) : undefined}` is necessary because Emotion's `styled.button` does not natively understand the `asChild` prop. A cleaner implementation would use `React.forwardRef` and explicitly render either a `button` or a `Slot`, removing the cast.

5. **Form elements** — if a second form is ever added, `StyledInput`/`StyledTextarea` would need extraction.

---

## Options for future revision

### Option A — Extract a `Text` / `Heading` primitive
Create `src/components/ui/Text.tsx` with variants (`display`, `body`, `mono`, `label`) driven by the theme tokens. Sections import and use these instead of redefining `styled.h2` / `styled.p`. Reduces ~40 lines of per-section styled component boilerplate.

**Tradeoff:** More abstract; sections lose the ability to see their own typography in isolation. May be premature for a ~8-section single-page site.

### Option B — Formalise `SectionHeading` and `Reveal` as UI primitives
Move them into `src/components/ui/` where they belong conceptually. No API changes needed.

**Low risk, high clarity.** Likely to happen regardless.

### Option C — Rethink Button polymorphism
Replace `as={Slot as React.ElementType}` with an explicit render-path component:
```tsx
export function Button({ asChild, children, ...props }: ButtonProps) {
  if (asChild) {
    return <StyledButton as={Slot} {...props}>{children}</StyledButton>;
  }
  return <StyledButton {...props}>{children}</StyledButton>;
}
```
Removes the type cast and makes the rendering logic explicit.

---

## What prompted the `revisit` status

During implementation the user noted: *"I think we'll eventually still have to revisit the approach but for now"* — signalling the current structure is a workable starting point, not a final answer.

## Immediate action

No changes needed now. Revisit when a second instance of a pattern appears (the "rule of three"), when TypeScript casting in `Button` causes a real problem, or when the `Text`/`Heading` duplication across sections becomes editing friction.
