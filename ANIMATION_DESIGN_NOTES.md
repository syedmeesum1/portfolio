# Animation Upgrade Notes (Mesum Portfolio)

## Goals
- Add more polished motion: entrance/stagger, hover micro-interactions, subtle background movement.
- Keep performance good: avoid heavy continuous JS; use CSS animations where possible.
- Respect accessibility: `prefers-reduced-motion`.

## Planned additions
1. Background shimmer / gradient drift via CSS keyframes.
2. Section entrance animations (GSAP) for headings/cards and skills tiles.
3. Projects cards: hover “shine” pseudo-element + slight parallax tilt (optional JS).
4. Cursor: switch to `gsap.quickTo` + reduce calls; disable on reduced-motion.
5. Add reduced-motion logic to avoid continuous effects.

