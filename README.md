# Josh Schuler Portfolio

Static GitHub Pages portfolio for Josh Schuler (`@schulerj89`).

## Live site

<https://schulerj89.github.io/github-page/>

## The Build Loop redesign

The portfolio is designed around a four-part engineering loop: **Frame → Build → Verify → Ship**.

- Editorial, evidence-led visual direction with real project captures.
- Sticky Campus Gridiron Dynasty case study on desktop and normal document flow on mobile.
- Selected work across Three.js games, a native C port, procedural systems, and Laravel open source.
- Native scrolling with restrained pointer depth, image parallax, active-section navigation, and scroll progress.
- Persisted dark/light themes with theme-specific accessible colors.
- Persisted Motion control plus `prefers-reduced-motion`, coarse-pointer, narrow-screen, offscreen, and hidden-tab fallbacks.
- Fully visible content and navigation when JavaScript is unavailable.
- Responsive layouts from 320px phones through wide desktop displays.
- Canonical, Open Graph, X card, JSON-LD, manifest, icon, sitemap, and robots metadata.

The implementation plan and design standards are documented in [`DESIGN_PLAN.md`](DESIGN_PLAN.md).

## Featured work

- [Campus Gridiron Dynasty](https://schulerj89.github.io/campus-gridiron-dynasty/) — 20-year fictional college-football simulation.
- [Shadow Circuit](https://schulerj89.github.io/sneak-game/) — 12-level Three.js stealth game.
- [Tecmo Basketball Native Port](https://github.com/schulerj89/tecmo-basketball-port) — clean-room native C port workspace.
- [Orbit Janitor](https://schulerj89.github.io/orbit-janitor/) — procedural Three.js arcade game.
- Selected [Laravel framework](https://github.com/laravel/framework/pull/43639) and [documentation](https://github.com/laravel/docs/pull/8123) contributions.

## Local preview

```powershell
python -m http.server 8080
```

Then open `http://127.0.0.1:8080/`.

## Verification artifacts

- `artifacts/portfolio-desktop-v2.png`
- `artifacts/portfolio-mobile-v2.png`
- `artifacts/portfolio-mobile-light-v2.png`
- `artifacts/portfolio-case-study-detail-v2.png`
- `artifacts/portfolio-campus-polish-v2.0.1.png`
- `artifacts/portfolio-tecmo-polish-v2.0.1.png`
- `artifacts/portfolio-approach-polish-v2.0.1.png`
- `artifacts/portfolio-mobile-polish-v2.0.1.png`
- `artifacts/portfolio-approach-mobile-polish-v2.0.1.png`
- `assets/portfolio-og.png`

## Deploy

GitHub Pages publishes the repository root from `main`. A push to `main` triggers the built-in Pages deployment.
