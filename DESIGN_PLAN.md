# Portfolio v3 — Old School. New Code.

## Direction

The requested direction is cool, dynamic, and game-led, with parallax. The visual language borrows from basketball broadcast graphics and hardware-era game screens: oversized condensed headings, warm orange, lime, charcoal, angled capture frames, and subtle court geometry. Game imagery is real, not generated artwork masquerading as gameplay.

Research references: [Lusion](https://lusion.co/) for layered, immersive presentation and [Locomotive Scroll](https://scroll.locomotive.ca/) for scroll-linked depth and in-view behavior. These are direction references, not copied layouts or dependencies. The earlier minimalist/editorial direction was rejected and is not the final design.

## Content priority

NBA Live 95 and NBA Live 97 lead. All-Star Challenge is complete within its documented single-player scope. Double Dribble and Tecmo retain visible source links. Upstream Laravel/PHP contributions remain a full section, followed by a concise biography.

## Motion and mobile

- Native scroll; no wheel/touch interception, scroll library, video, or WebGL. Hero effects request one frame per scroll/resize update.
- The console band loops at 26px/second using native scroll position and repeated label groups, not competing transforms. It only animates while visible, with hidden tabs and reduced-motion preferences stopping the loop.
- Manual touch/trackpad input pauses the loop until 3.5 seconds after movement settles. Mouse hover and keyboard focus also pause it. It retains its original uninterrupted-band appearance, without buttons, visible scrollbars, or a focus rectangle; keyboard focus uses a text underline instead.
- At 900px and below, projects and hero stack; parallax is reduced to 35% travel.
- Anchor links jump directly and predictably. Reduced motion disables automatic strip scrolling, parallax, reveals, and transitions, including preference changes while the page is open.
- No-JavaScript content stays visible. Galleries become plain image links. Links and primary controls have visible keyboard focus and at least 44px height.
- Screenshot dialog uses native focus containment, Escape dismissal, explicit close, backdrop dismissal, and focus restoration.
- Entire screenshot frames are preserved, with labels distinguishing native builds from original-game references.

## Verification

Check 320px and 390px phones, 768px tablet, and 1440px desktop; inspect headings, image loading, overflow, project links, gallery switching, dialog focus, completion details, and motion. The dependency-free `tools/check_site.mjs` checks source assets, anchors, metadata, contrast pairs, hero scheduling/clamping, mobile intensity, and reduced-motion fallbacks. `tools/check_platform_strip.mjs` verifies the automatic loop and manual interaction timing independently.

Keep desktop/mobile visual evidence in `artifacts/`. Confirm GitHub Pages after push. Do not present simulated viewport tests as physical-device testing or claim measured Core Web Vitals without a field measurement.
