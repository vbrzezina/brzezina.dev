# Design direction and visual identity

Type: grilling
Status: resolved

## Question

What is the visual identity and design direction for brzezina.dev?

The site must be **bold, expressive, and personal** — explicitly not a default MUI component aesthetic. Key decisions to resolve:

1. **Aesthetic direction**: developer-dark vs warm editorial vs strong grid/display type vs motion-forward (or combination)
2. **Dark/light mode**: commit to one mode, or offer a toggle? If one, which?
3. **Typography**: display font + body font — what personality should the type carry?
4. **Colour palette**: primary accent, background, surface colours
5. **Motion/animation approach**: Framer Motion, CSS transitions, or none?
6. **First impression**: what should a visitor feel in the first 3 seconds?

Invoke the frontend-design skill. Build a prototype of the hero section to make the direction concrete and react-able before committing to the full design system.

## Answer

Design direction confirmed via Lovable.dev visual prototype (reference: https://github.com/vbrzezina/brzezina-blueprint).

1. **Aesthetic**: Developer-dark-first. Deep navy (`oklch(0.16 0.028 255)`) background, teal/cyan accent (`oklch(0.82 0.15 190)`). Technical, code-adjacent. Sharp corners (0.25rem radius). Faint grid backdrop on hero areas.
2. **Dark/light mode**: Dark is primary. Light mode available via toggle. Dark is the canonical design surface.
3. **Typography**: Space Grotesk for display/headings (−0.02em tracking, bold weight), DM Sans for body, JetBrains Mono for eyebrow labels and code (uppercase, 0.18em tracking).
4. **Colour palette**: See design system tokens in CLAUDE.md. Teal primary accent, deep navy background, near-white foreground in dark mode.
5. **Motion**: CSS transitions only — no Framer Motion. Scroll-reveal via `opacity + translateY`, 700ms `cubic-bezier(0.22, 1, 0.36, 1)`. Respects `prefers-reduced-motion`.
6. **First impression**: A developer's portfolio — precise, confident, not corporate. The grid backdrop and mono eyebrow labels signal craft and attention to detail.
