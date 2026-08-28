# Josh Schuler — Old School. New Code.

Static, mobile-first portfolio: [schulerj89.github.io/github-page](https://schulerj89.github.io/github-page/).

## Featured work

1. [NBA Live 95](https://github.com/schulerj89/nba-live-95-c-port) — SNES to native C99; in development.
2. [NBA Live 97](https://github.com/schulerj89/nba-live-97-c-port) — PS1 frontend reconstruction in recovered C with a C++ host; no playable basketball yet.
3. [NBA All-Star Challenge](https://github.com/schulerj89/all-star-challenge-c-port) — completed single-player behavioral port; completion scope is disclosed on the page.
4. [Double Dribble](https://github.com/schulerj89/double-dribble-c-port) and [Tecmo Basketball](https://github.com/schulerj89/tecmo-basketball-port).
5. Four merged Laravel/PHP contributions, preserved in their own section.

## Design and interactions

Retro-sports typography, authentic game frames, dark/orange/lime colors, layered hero parallax, a scroll-linked console strip, and project reveals. Native browser scrolling is never intercepted. Mobile uses smaller motion distances. Reduced-motion preferences disable movement; content and source links work without JavaScript. Galleries progressively enhance into an accessible native dialog.

See [DESIGN_PLAN.md](DESIGN_PLAN.md) for rationale and [assets/SOURCES.md](assets/SOURCES.md) for image provenance. No ROMs or extracted game asset packs are hosted.

## Preview and verify

```powershell
python -m http.server 8765 --bind 127.0.0.1
node tools/check_site.mjs
node --check script.js
git diff --check
```

Open `http://127.0.0.1:8765/`. There is no build step or runtime dependency. Google Fonts have local system-font fallbacks. `tools/prepare_images.py` optionally reproduces the lossless WebP images from local sibling game-port checkouts using Pillow; it is not needed for deployment.

Current visual evidence lives in `artifacts/portfolio-*-v3.png`; the social image is `assets/portfolio-preview.png`. Older artifacts remain as historical records.

## Deploy

GitHub Pages publishes the repository root from `main`. Push to `main`, then verify the built-in Pages deployment and the live URL.
