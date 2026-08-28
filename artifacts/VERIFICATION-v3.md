# Portfolio v3 verification — 2026-08-27

- Browser viewport checks: 320×740, 390×844, 768×1024, 1440×900; no horizontal page overflow. These are simulated viewports, not physical-device tests.
- Inspected desktop/mobile heroes, project cards and galleries, and the mobile upstream-contributions section. Capture files may be scaled by the browser screenshot service; filenames describe the tested viewport, not bitmap width.
- Verified direct section navigation and back-to-top navigation.
- NBA Live 95 Court/Team Select and NBA Live 97 Rosters/Player/Title gallery states update image, caption, accessible name, and selected button. Original reference vs native-build labels remain distinct.
- Screenshot dialog opens, close button dismisses, Escape dismisses through keyboard input, and focus returns to the originating image link.
- All-Star completion details expand; NBA97 explicitly discloses that basketball gameplay is not implemented.
- Observed scroll-linked hero transforms on mobile; unit tests check 35% mobile intensity, ±90px bounds, offscreen/hidden-document skipping, one-frame scheduling, and both initial/runtime reduced-motion preferences.
- Source checks cover local assets, anchors, structured metadata, image dimensions/alt attributes, primary text contrast pairs, required scope notes, and four upstream contribution links. Referenced game imagery and icons total about 262 KiB, excluding fonts and social preview.
- No-JavaScript fallback verified by source structure: content isn't hidden by default, project/source links are native anchors, and gallery controls alone are initially hidden.
- Social preview is a normalized 1200×630 PNG captured from the site, not generated game imagery.

Commands: `node tools/check_site.mjs`, `node --check script.js`, `git diff --check`.

No physical-device, screen-reader, field Core Web Vitals, or exhaustive accessibility certification is claimed.
