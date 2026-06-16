---
name: interactive-dev-site-expert
description: Build polished, real interactive developer portfolio and project sites with responsive layouts, mobile ergonomics, tasteful motion, accessible controls, screenshot verification, and release notes. Use when Codex is asked to revamp a personal developer site, GitHub Pages portfolio, project showcase, or static HTML/CSS/JS site.
---

# Interactive Dev Site Expert

Use this skill to turn a developer portfolio into a usable product surface, not a static flyer. Favor fast static pages, clear project evidence, responsive interaction, and visual QA.

## Workflow

1. Inspect the existing stack, live/deploy target, current content, and git state before editing.
2. Preserve truthful personal/project details and improve presentation around them.
3. Design the first viewport around the developer's name, role, project signal, and primary links.
4. Add interaction only when it improves exploration: filters, keyboard-friendly controls, hover detail, mobile-safe navigation, canvas effects, or stateful theme toggles.
5. Build mobile first, then widen layouts with stable grids and predictable card sizes.
6. Keep assets, screenshots, and release notes versioned in the repo.
7. Run local verification and capture desktop and mobile screenshots before finishing.

## Design Standards

- Make the actual portfolio useful immediately: projects, live links, GitHub links, skills, and contact paths must be visible without hunting.
- Avoid generic hero filler. Use concrete builder language, measurable project facts, and visible calls to action.
- Use restrained color contrast, crisp typography, 8px card radii unless the existing system requires otherwise, and clear focus states.
- Use animation sparingly and respect `prefers-reduced-motion`.
- Keep mobile nav reachable, buttons at least 44px tall, and text readable without horizontal scrolling.
- Make project cards action-oriented: short problem statement, stack tags, and explicit "Repo" or "Live" links.

## Verification

- Serve static sites locally instead of relying on file URLs when screenshots or browser automation are needed.
- Check at least one desktop viewport and one mobile viewport.
- Store screenshots under `artifacts/` with descriptive names.
- Add or update `CHANGELOG.md` with date, version, and concise bullets covering design, content, verification, and screenshots.

## Delivery

Report changed files, verification commands, screenshot paths, and any remaining deploy/push steps. Do not claim live deployment unless it was actually pushed and confirmed.
