# Josh Schuler Portfolio

Static GitHub Pages portfolio for Josh Schuler (`@schulerj89`).

## Live site

<https://schulerj89.github.io/github-page/>

## Portfolio focus

The portfolio foregrounds reverse engineering and source-level preservation while retaining the four-part engineering loop: **Frame → Build → Verify → Ship**.

- Editorial, evidence-led visual direction with real project captures.
- Sticky native-porting case study on desktop and normal document flow on mobile.
- Selected work across three native C ports plus Laravel and PHP open-source contributions.
- Native scrolling with restrained pointer depth, image parallax, active-section navigation, and scroll progress.
- Persisted dark/light themes with theme-specific accessible colors.
- Persisted Motion control plus `prefers-reduced-motion`, coarse-pointer, narrow-screen, offscreen, and hidden-tab fallbacks.
- Fully visible content and navigation when JavaScript is unavailable.
- Responsive layouts from 320px phones through wide desktop displays.
- Canonical, Open Graph, X card, JSON-LD, manifest, icon, sitemap, and robots metadata.

The implementation plan and design standards are documented in [`DESIGN_PLAN.md`](DESIGN_PLAN.md).

## Featured work

- [NBA All-Star Challenge Native Port](https://github.com/schulerj89/all-star-challenge-c-port) — Game Boy behavior reconstructed in native C.
- [Double Dribble Native Port](https://github.com/schulerj89/double-dribble-c-port) — NES behavior reconstructed in native C.
- [Tecmo Basketball Native Port](https://github.com/schulerj89/tecmo-basketball-port) — playable NES-to-native-C reconstruction.
- Selected [Laravel framework](https://github.com/laravel/framework/pull/53109), [Laravel documentation](https://github.com/laravel/docs/pull/8123), and [PHP documentation](https://github.com/php/doc-en/pull/3135) contributions.

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
