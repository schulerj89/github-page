// Dependency-free checks; browser interaction/visual QA is complementary.
import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const root = fileURLToPath(new URL("../", import.meta.url));
const html = readFileSync(path.join(root, "index.html"), "utf8");
const normalizedHtml = html.replace(/\s+/g, " ");
const css = readFileSync(path.join(root, "styles.css"), "utf8");
const script = readFileSync(path.join(root, "script.js"), "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
assert.equal(new Set(ids).size, ids.length, "Duplicate IDs");
const files = new Set();
for (const [, raw] of html.matchAll(/(?:href|src|data-src)="([^"]+)"/g)) {
  if (raw.startsWith("#"))
    assert(ids.includes(raw.slice(1)), `Missing anchor ${raw}`);
  else if (!/^(https?:|mailto:)/.test(raw)) files.add(raw.split("?")[0]);
}
for (const file of files)
  assert(existsSync(path.join(root, file)), `Missing asset ${file}`);
for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
  assert(/\balt="/.test(tag), `Missing image alt: ${tag}`);
  if (!tag.includes('id="dialog-image"')) {
    assert(
      /\bwidth="\d+"/.test(tag) && /\bheight="\d+"/.test(tag),
      "Missing image dimensions",
    );
  }
}
for (const [, json] of html.matchAll(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
))
  JSON.parse(json);
JSON.parse(readFileSync(path.join(root, "site.webmanifest"), "utf8"));
const preview = path.join(root, "assets/portfolio-preview.png");
assert(existsSync(preview), "Missing sharing image");
const png = readFileSync(preview);
assert.equal(png.readUInt32BE(16), 1200, "Sharing image width");
assert.equal(png.readUInt32BE(20), 630, "Sharing image height");
assert(
  normalizedHtml.includes("Playable basketball is not yet implemented."),
  "NBA97 scope missing",
);
assert(
  normalizedHtml.includes("Completed single-player behavioral port"),
  "All-Star scope missing",
);
assert.equal(
  (html.match(/github.com\/(?:laravel|php)\//g) || []).length,
  4,
  "Upstream contributions lost",
);
assert(
  css.includes("prefers-reduced-motion"),
  "Missing reduced-motion fallback",
);
assert(
  !/\.reveal-ready[^}]*display:\s*none/.test(css),
  "Reveal must preserve layout",
);
const imageBytes = [...files]
  .filter((f) => /\.(webp|png)$/.test(f))
  .reduce((sum, f) => sum + statSync(path.join(root, f)).size, 0);
assert(imageBytes < 700_000, `Page imagery too heavy: ${imageBytes}`);
assert(
  /class="era-scroll"[^>]*tabindex="0"/.test(normalizedHtml),
  "Platform strip must be keyboard focusable",
);
assert(
  /\.era-scroll\s*\{[^}]*overflow-x:\s*auto/.test(css),
  "Platform strip must allow native horizontal scrolling",
);
assert(
  !html.includes("data-drift") && !script.includes("--drift-x"),
  "Automatic drift must not fight manual scrolling",
);

function motionHarness({ narrow = false, reduced = false } = {}) {
  const queue = [];
  const mediaListeners = {};
  const events = {};
  const style = () => ({
    values: {},
    setProperty(k, v) {
      this.values[k] = v;
    },
    removeProperty(k) {
      delete this.values[k];
    },
  });
  const layers = [0.1, -0.18].map((speed) => ({
    dataset: { parallax: String(speed) },
    style: style(),
  }));
  const hero = {};
  const platformHandlers = {};
  const platformScroller = {
    scrollWidth: 1000,
    clientWidth: 300,
    scrollLeft: 0,
    scrollBy({ left }) {
      this.scrollLeft = Math.min(700, Math.max(0, this.scrollLeft + left));
    },
    addEventListener(name, fn) {
      platformHandlers[name] = fn;
    },
  };
  const arrows = [-1, 1].map((direction) => ({
    dataset: { eraDirection: String(direction) },
    hidden: true,
    disabled: false,
    addEventListener(name, fn) {
      this[name] = fn;
    },
  }));
  const strip = { getBoundingClientRect: () => ({ top: 100 }) };
  const drift = { style: style() };
  const progress = { style: {} };
  const reveal = {
    classes: new Set(),
    getBoundingClientRect: () => ({ top: 1200 }),
  };
  reveal.classList = { add: (value) => reveal.classes.add(value) };
  const observers = [];
  const reducedQuery = {
    matches: reduced,
    addEventListener: (_, fn) => {
      mediaListeners.reduced = fn;
    },
  };
  const doc = {
    hidden: false,
    documentElement: { scrollHeight: 3000 },
    querySelectorAll: (selector) =>
      selector === "[data-era-direction]"
        ? arrows
        : selector === "[data-parallax]"
          ? layers
          : selector === "[data-reveal]" || selector === ".reveal-ready"
            ? [reveal]
            : [],
    querySelector: (selector) =>
      ({
        ".hero": hero,
        ".era-scroll": platformScroller,
        ".era-strip": strip,
        "[data-drift]": drift,
        ".scroll-progress": progress,
      })[selector],
    getElementById: (id) => (id === "year" ? {} : null),
    addEventListener: (name, fn) => {
      events[name] = fn;
    },
  };
  const win = {
    scrollY: 200,
    innerHeight: 800,
    matchMedia: (q) =>
      q.includes("reduced-motion") ? reducedQuery : { matches: narrow },
    requestAnimationFrame: (fn) => queue.push(fn),
    addEventListener: (name, fn) => {
      events[name] = fn;
    },
    IntersectionObserver: true,
  };
  class Observer {
    constructor(callback) {
      this.callback = callback;
      observers.push(this);
    }
    observe() {}
    unobserve() {}
  }
  vm.runInNewContext(script, {
    window: win,
    document: doc,
    IntersectionObserver: Observer,
  });
  const flush = () => {
    const work = queue.splice(0);
    work.forEach((fn) => fn());
  };
  return {
    queue,
    platformScroller,
    platformHandlers,
    arrows,
    events,
    layers,
    hero,
    strip,
    drift,
    progress,
    doc,
    win,
    reveal,
    observers,
    reducedQuery,
    mediaListeners,
    flush,
  };
}
const normal = motionHarness();
assert(
  !html.includes("era-arrow") && !script.includes("data-era-direction"),
  "No strip buttons",
);
assert(
  /\.era-scroll\s*\{[^}]*scrollbar-width:\s*none/.test(css),
  "Keep the strip visually unboxed",
);
normal.platformHandlers.keydown({ key: "ArrowRight", preventDefault() {} });
assert.equal(normal.platformScroller.scrollLeft, 80, "Keyboard scrolls right");
normal.platformHandlers.keydown({ key: "Home", preventDefault() {} });
assert.equal(
  normal.platformScroller.scrollLeft,
  0,
  "Home returns to the start",
);
normal.platformHandlers.keydown({ key: "End", preventDefault() {} });
assert.equal(
  normal.platformScroller.scrollLeft,
  700,
  "Last label remains reachable",
);
normal.events.scroll();
normal.events.scroll();
assert.equal(normal.queue.length, 1, "Only one frame should be scheduled");
normal.flush();
assert.equal(normal.layers[0].style.values["--parallax-y"], "20.0px");
assert.equal(normal.queue.length, 0, "No perpetual animation loop");
assert(normal.reveal.classes.has("reveal-ready"));
normal.observers[1].callback([{ target: normal.reveal, isIntersecting: true }]);
assert(
  normal.reveal.classes.has("is-visible"),
  "Reveal should show entering content",
);
normal.win.scrollY = 4000;
normal.events.scroll();
normal.flush();
assert.equal(
  normal.layers[0].style.values["--parallax-y"],
  "90.0px",
  "Clamp parallax",
);
assert.equal(normal.layers[1].style.values["--parallax-y"], "-90.0px");
assert.equal(
  normal.progress.style.transform,
  "scaleX(1)",
  "Clamp page progress",
);
normal.doc.hidden = true;
normal.win.scrollY = 100;
normal.events.scroll();
normal.flush();
assert.equal(
  normal.layers[0].style.values["--parallax-y"],
  "90.0px",
  "Hidden page should skip motion",
);
normal.doc.hidden = false;
normal.observers[0].callback([
  { target: normal.hero, isIntersecting: false },
  { target: normal.strip, isIntersecting: false },
]);
normal.flush();
assert.equal(
  normal.layers[0].style.values["--parallax-y"],
  "90.0px",
  "Offscreen hero should skip motion",
);
normal.reducedQuery.matches = true;
normal.mediaListeners.reduced();
normal.flush();
assert.equal(
  normal.layers[0].style.values["--parallax-y"],
  undefined,
  "Runtime motion preference reset",
);
const mobile = motionHarness({ narrow: true });
mobile.flush();
assert.equal(
  mobile.layers[0].style.values["--parallax-y"],
  "7.0px",
  "Mobile travel is 35%",
);
const reduced = motionHarness({ reduced: true });
reduced.flush();
assert.equal(reduced.layers[0].style.values["--parallax-y"], undefined);
assert(
  !reduced.reveal.classes.has("reveal-ready"),
  "Reduced-motion content stays visible",
);

function luminance(hex) {
  const rgb = hex
    .match(/\w\w/g)
    .map((c) => parseInt(c, 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
for (const [fg, bg] of [
  ["f0eee8", "0b0d10"],
  ["a2a7ad", "14171b"],
  ["ff7546", "14171b"],
  ["0b0d10", "ff7546"],
  ["39462b", "d1ef94"],
]) {
  const values = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  assert(
    (values[0] + 0.05) / (values[1] + 0.05) >= 4.5,
    `Text contrast ${fg}/${bg}`,
  );
}
console.log(
  `PASS: anchors, ${files.size} local files, image metadata, scope, contributions, contrast, and motion safeguards. Page imagery: ${(imageBytes / 1024).toFixed(1)} KiB.`,
);
