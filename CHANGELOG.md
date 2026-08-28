# Changelog

## 2026-08-27 - v3.0.3

- Added a seamless, gentle automatic console-strip loop while preserving native manual scrolling and the clean button-free appearance.
- Touch, trackpad, and keyboard input take priority; automatic scrolling resumes after 3.5 seconds of inactivity. Mouse hover and keyboard focus pause it for reading.
- Suspended the loop offscreen, in hidden tabs, and for reduced-motion preferences. Duplicate labels are hidden from assistive technology.
- Added focused tests for timing, input takeover, momentum, resuming, wrapping, visibility, reduced motion, and resize.
- Verified desktop/mobile appearance and browser-observed auto movement plus keyboard takeover; screenshots saved as `artifacts/platform-strip-auto-*-v3.0.3.jpg`.

## 2026-08-27 - v3.0.2

- Restored the original clean console band: removed arrow buttons, the surrounding focus box, and visible scrollbar; restored the original vertical spacing.
- Kept native horizontal touch/trackpad scrolling and keyboard navigation, with an underline-only keyboard focus cue.
- Added regression checks for the button-free appearance and continued keyboard scrolling.
- Verified clean layouts at 390px and 1024px; screenshots saved under `artifacts/platform-strip-clean-*-v3.0.2.jpg`.

## 2026-08-27 - v3.0.1

- Made the console strip manually scrollable with native touch/trackpad scrolling, keyboard focus, a visible scrollbar, and 44px previous/next buttons.
- Removed the strip's automatic drift and duplicate labels so all console names remain reachable. Hero parallax is unchanged.
- Added regression checks for scrolling bounds, keyboard accessibility, and the absence of competing automatic transforms.
- Checked 390px mobile and 1024px desktop layouts, arrow-button limits, and keyboard scrolling; screenshots are saved as `artifacts/platform-scroll-*-v3.0.1.jpg`.

## 2026-08-27 - v3.0.0

- Rebuilt the site with a retro-sports visual direction: oversized condensed type, dark courtside colors, floating game screens, layered parallax, a scroll-linked console strip, and project reveals.
- Prioritized NBA Live 95 (SNES C99) and NBA Live 97 (PlayStation recovered C/C++); marked All-Star Challenge complete with its single-player scope disclosed.
- Retained Double Dribble, Tecmo Basketball, and four merged Laravel/PHP contributions.
- Added five optimized, authentic game captures, interactive galleries, and a keyboard-accessible screenshot dialog. Native-build captures and original-game references are labeled separately.
- Kept native touch scrolling, smaller mobile parallax, reduced-motion support, visible no-JavaScript content, and 44px primary controls.
- Updated sharing metadata, screenshot provenance, verification tools, and desktop/mobile artifacts.

## 2026-07-10 - v2.0.1

- Replaced the Tecmo Basketball Native Port preview with the supplied Tecmo Presents artwork.
- Removed the Campus Gridiron screenshot focus boxes while retaining the scroll-driven crop and caption changes.
- Made the Frame, Build, Verify, and Ship labels fully visible and increased their contrast across desktop and mobile.

## 2026-07-10 - v2.0.0

- Rebuilt the portfolio around the editorial “Build Loop” direction: Frame, Build, Verify, Ship.
- Replaced the generic terminal/canvas presentation with restrained native-scroll motion, a sticky case study, active navigation, scroll progress, and real project evidence.
- Added Campus Gridiron Dynasty and the Tecmo Basketball Native Port while retaining Shadow Circuit, Orbit Janitor, selected experiments, and Laravel contributions.
- Added a persisted Motion control, runtime reduced-motion handling, mobile-safe parallax fallbacks, hidden-tab animation pausing, guarded storage, and a usable no-JavaScript presentation.
- Reworked mobile layouts down to 320px with keyboard-safe navigation, focus transfer, Escape handling, 44px targets, and deliberate project-card crops.
- Added accessible light-theme tokens, a clear theme control, forced-colors support, canonical and social metadata, JSON-LD, manifest icons, robots, sitemap, and a 1200×630 Open Graph image.
- Added the implementation plan in `DESIGN_PLAN.md` and refreshed `README.md` for the new portfolio.
- Added verification artifacts:
  - `artifacts/portfolio-desktop-v2.png`
  - `artifacts/portfolio-mobile-v2.png`
  - `artifacts/portfolio-mobile-light-v2.png`
  - `artifacts/portfolio-case-study-detail-v2.png`
  - `assets/portfolio-og.png`

## 2026-06-29 - v1.2.0

- Added Orbit Janitor to the project board as a game project.
- Added Orbit Janitor links:
  - GitHub: `https://github.com/schulerj89/orbit-janitor`
  - Live: `https://schulerj89.github.io/orbit-janitor/`

## 2026-06-16 - v1.1.0

- Revamped the GitHub Pages portfolio into a responsive interactive developer site.
- Added Shadow Circuit / sneak-game as the featured project with GitHub and live links.
- Added project filtering, a stronger hero, mobile navigation, theme persistence, and a full-screen signal canvas.
- Added a project-local Codex skill at `.codex/skills/interactive-dev-site-expert`.
- Added screenshot artifact targets for desktop and mobile verification:
  - `artifacts/portfolio-desktop.png`
  - `artifacts/portfolio-mobile.png`
