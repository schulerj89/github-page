# Portfolio Redesign Plan — The Build Loop

## Product goal

Present Josh Schuler as an engineering leader who can turn ambiguous problems into understandable, testable systems while staying close to product and implementation tradeoffs.

## Design direction

The portfolio uses an editorial systems language rather than a terminal-themed developer template: deep carbon and warm bone, a single signal-green accent, restrained technical annotations, large type, real project captures, and fewer boxed surfaces.

The page follows a four-part narrative:

1. **Frame** the ambiguous problem.
2. **Build** a legible system.
3. **Verify** the complete loop with evidence.
4. **Ship** something the team can own.

## Content architecture

- Positioning-led hero with immediate GitHub and work paths.
- Proof rail with concrete project scope.
- Sticky Campus Gridiron Dynasty case study with real product evidence.
- Selected builds spanning Three.js, native C, procedural systems, and open source.
- Working approach and responsible AI stance.
- Concise about and next-step sections with verified public links.

## Interaction standards

- Preserve native browser scrolling; never hijack the wheel or touch gesture.
- Use one coordinated animation frame for scroll progress and restrained parallax.
- Keep travel distances small and transform/opacity-only.
- Pause continuous motion offscreen or when the page is hidden.
- Provide an explicit persisted Motion control.
- Respect `prefers-reduced-motion` and remain fully usable without JavaScript.
- Disable parallax on small screens and coarse pointers.

## Mobile standards

- Art-directed single-column layouts below 900px, including landscape phones and small tablets.
- Minimum 44px interactive targets and safe-area-aware spacing.
- Normal document flow replaces sticky storytelling.
- Deliberate screenshot crops with fixed dimensions to prevent layout shift.
- Keyboard-safe menu with focus transfer, Escape close, and breakpoint reset.

## Quality targets

- WCAG AA contrast in dark and light themes.
- LCP at or below 2.5 seconds, INP at or below 200ms, and CLS below 0.1.
- No critical console errors, broken internal links, horizontal overflow, or hidden no-JavaScript content.
- Visual checks at 320, 390, 768, 1024, and 1440px plus reduced-motion and light-theme states.
- GitHub Pages production verification after the final push.
