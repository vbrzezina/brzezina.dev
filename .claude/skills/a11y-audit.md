---
name: a11y-audit
description: Run a WCAG 2.1 AA accessibility audit on a page or component. Combines automated axe-core checks with a structured manual review checklist covering keyboard navigation, screen reader compatibility, semantic HTML, colour contrast, and ARIA usage. Use after implementing any page or interactive component.
---

# Accessibility Audit Skill

Run this skill after implementing a page or component to catch WCAG 2.1 AA violations before they ship.

## Phase 1: Automated checks

### axe-core via Playwright (preferred)

```ts
// Add to existing Playwright test or run standalone
import AxeBuilder from '@axe-core/playwright';

const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
  .analyze();

// Report violations
results.violations.forEach(v => {
  console.log(`[${v.impact}] ${v.id}: ${v.description}`);
  v.nodes.forEach(n => console.log('  →', n.target));
});
```

Run against every page: `/en`, `/en/about`, `/en/services`, `/en/work`, `/en/contact`, plus Czech equivalents.

### axe-core via browser DevTools

Install axe DevTools browser extension for quick spot-checks during development. Catches ~30% of WCAG issues automatically.

### Colour contrast

Check all text/background pairs at https://webaim.org/resources/contrastchecker/

| Threshold | Applies to |
|-----------|-----------|
| 4.5:1 | Body text, labels, small UI text |
| 3:1 | Large text (18pt+), UI components, focus indicators |

## Phase 2: Keyboard navigation audit

Test without using a mouse — tab through the entire page:

- [ ] First focusable element is a "Skip to main content" link
- [ ] Tab order matches visual reading order
- [ ] All interactive elements (links, buttons, inputs) are reachable via Tab
- [ ] No keyboard traps — can always Tab out of any component
- [ ] Escape closes any modal, dropdown, or overlay
- [ ] Language switcher keyboard-accessible
- [ ] Contact form submittable via Enter/keyboard only
- [ ] Focus indicator is always visible (never `outline: none` without replacement)

## Phase 3: Semantic HTML review

- [ ] Single `<h1>` per page, correct heading hierarchy (no skips)
- [ ] `<nav>` elements have `aria-label` attributes to distinguish them
- [ ] Main content wrapped in `<main id="main-content">`
- [ ] `<footer>` and `<header>` present
- [ ] `<html lang="en">` / `<html lang="cs">` matches current locale
- [ ] All form `<input>` elements have associated `<label>` (not just placeholder)
- [ ] Required fields have `aria-required="true"`
- [ ] Error messages use `role="alert"` for SR announcement

## Phase 4: Screen reader spot-check (macOS VoiceOver)

1. Enable VoiceOver: Cmd+F5
2. Navigate by headings: VO+Cmd+H — confirm structure makes sense
3. Navigate by links: VO+Cmd+L — all links have descriptive text
4. Navigate by landmarks: VO+Cmd+W — header, nav, main, footer present
5. Tab to contact form — confirm field labels are announced
6. Submit with errors — confirm error messages are announced
7. Locate CV download link — purpose is clear without surrounding context

## Phase 5: ARIA usage review

- [ ] No redundant ARIA (e.g., `role="button"` on `<button>`)
- [ ] Decorative images have `alt=""` (not `alt="decorative"`)
- [ ] Informative images have meaningful `alt` text
- [ ] Icon-only buttons have `aria-label`
- [ ] Loading/status states use `aria-live` regions
- [ ] No `aria-hidden="true"` on focusable elements

## Reporting

For each violation found, record:

```
Page: /en/contact
WCAG criterion: 1.3.1 Info and Relationships (Level A)
Element: input#email
Issue: Input has no associated label
Fix: Add <label htmlFor="email"> or aria-label attribute
Impact: Critical — screen readers cannot identify field purpose
```

## Pass criteria

- Zero axe violations at `wcag2a` and `wcag2aa` tags
- Full keyboard navigation flow without traps or unreachable elements
- VoiceOver announces all page structure, form labels, and errors correctly
- All text contrast ratios meet thresholds above
