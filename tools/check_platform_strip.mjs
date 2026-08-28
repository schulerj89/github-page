import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(
  new URL("../platform-strip.js", import.meta.url),
  "utf8",
);
let clock = 0;
let nextId = 1;
const frames = new Map();
const timers = new Map();
const windowEvents = {};
const inputEvents = {};
const documentEvents = {};
const copies = [];
let onVisibility;
let onPreference;
let focused = false;
const group = {
  getBoundingClientRect: () => ({ width: 600 }),
  cloneNode() {
    return {
      attributes: {},
      setAttribute(name, value) {
        this.attributes[name] = value;
      },
      remove() {
        copies.splice(copies.indexOf(this), 1);
      },
    };
  },
};
const track = {
  querySelector: () => group,
  querySelectorAll: () => [...copies],
  append: (copy) => copies.push(copy),
};
const scroller = {
  clientWidth: 1024,
  scrollLeft: 0,
  querySelector: () => track,
  matches: () => focused,
  addEventListener(name, fn) {
    inputEvents[name] = fn;
  },
};
const doc = {
  hidden: false,
  addEventListener(name, fn) {
    documentEvents[name] = fn;
  },
};
const preference = {
  matches: false,
  addEventListener(_, fn) {
    onPreference = fn;
  },
};
const win = {
  IntersectionObserver: true,
  requestAnimationFrame(fn) {
    const id = nextId++;
    frames.set(id, fn);
    return id;
  },
  cancelAnimationFrame: (id) => frames.delete(id),
  setTimeout(fn, delay) {
    const id = nextId++;
    timers.set(id, { fn, at: clock + delay });
    return id;
  },
  clearTimeout: (id) => timers.delete(id),
  addEventListener(name, fn) {
    windowEvents[name] = fn;
  },
};
class Observer {
  constructor(fn) {
    onVisibility = fn;
  }
  observe() {}
}
const context = vm.createContext({
  window: win,
  document: doc,
  performance: { now: () => clock },
  IntersectionObserver: Observer,
});
vm.runInContext(source, context);
context.enhancePlatformStrip(scroller, preference);
function advance(ms) {
  clock += ms;
  for (const [id, timer] of [...timers])
    if (timer.at <= clock) {
      timers.delete(id);
      timer.fn();
    }
  const pending = [...frames];
  frames.clear();
  for (const [, fn] of pending) fn(clock);
}
function beginMoving() {
  advance(16);
  advance(16);
}

assert.equal(copies.length, 3, "Enough duplicates for a wide screen");
assert(
  copies.every((copy) => copy.attributes["aria-hidden"] === "true"),
  "Copies hidden from assistive technology",
);
assert.equal(frames.size, 0, "No animation before the strip enters view");
onVisibility([{ isIntersecting: true }]);
advance(16);
for (let i = 0; i < 60; i++) advance(1000 / 60);
assert(
  Math.abs(scroller.scrollLeft - 26) < 0.01,
  "Consistent 26px/second speed",
);
inputEvents.scroll();
assert.equal(timers.size, 0, "Automatic scroll events do not pause the loop");

inputEvents.wheel();
assert.equal(frames.size, 0, "Manual input immediately cancels the animation");
scroller.scrollLeft = 140;
advance(2000);
inputEvents.scroll(); // Touch/trackpad momentum extends the quiet period.
advance(2000);
assert.equal(scroller.scrollLeft, 140, "Manual momentum has priority");
advance(1600);
beginMoving();
assert(
  scroller.scrollLeft > 140,
  "Automatic motion resumes after input settles",
);

inputEvents.pointerdown();
const heldAt = scroller.scrollLeft;
advance(5000);
assert.equal(scroller.scrollLeft, heldAt, "Never move while a touch is held");
windowEvents.pointerup();
advance(3600);
beginMoving();
assert(scroller.scrollLeft > heldAt, "Resume after touch release");

inputEvents.pointerenter({ pointerType: "mouse" });
const hoveredAt = scroller.scrollLeft;
advance(5000);
assert.equal(scroller.scrollLeft, hoveredAt, "Hover pauses for reading");
inputEvents.pointerleave({ pointerType: "mouse" });
advance(3600);
beginMoving();
assert(scroller.scrollLeft > hoveredAt, "Resume after pointer leaves");

focused = true;
inputEvents.focusin();
const focusedAt = scroller.scrollLeft;
advance(5000);
assert.equal(
  scroller.scrollLeft,
  focusedAt,
  "Keyboard focus pauses automatic motion",
);
focused = false;
inputEvents.focusout();
advance(3600);
beginMoving();
assert(scroller.scrollLeft > focusedAt, "Resume after keyboard focus leaves");

inputEvents.wheel();
scroller.scrollLeft = 599.9;
advance(3600);
beginMoving();
assert(
  scroller.scrollLeft >= 0 && scroller.scrollLeft < 5,
  "Wrap seamlessly by one group width",
);
onVisibility([{ isIntersecting: false }]);
assert.equal(frames.size, 0, "Offscreen motion stops");
assert.equal(timers.size, 0, "Offscreen timers stop");
onVisibility([{ isIntersecting: true }]);
beginMoving();
doc.hidden = true;
documentEvents.visibilitychange();
assert.equal(frames.size, 0, "Hidden-tab motion stops");
doc.hidden = false;
documentEvents.visibilitychange();
beginMoving();
preference.matches = true;
onPreference();
const reducedAt = scroller.scrollLeft;
advance(5000);
assert.equal(
  scroller.scrollLeft,
  reducedAt,
  "Reduced motion disables automatic scrolling",
);
assert.equal(frames.size, 0);
preference.matches = false;
onPreference();
beginMoving();
assert(
  scroller.scrollLeft > reducedAt,
  "Runtime preference changes are supported",
);
const beforeResize = scroller.scrollLeft;
windowEvents.resize();
assert.equal(
  scroller.scrollLeft,
  beforeResize % 600,
  "Resize preserves the visible position",
);
assert.equal(
  copies.length,
  3,
  "Resize replaces copies instead of accumulating them",
);
console.log(
  "PASS: seamless loop, speed, manual takeover, momentum, delayed resume, hover/focus, visibility, reduced motion, and resize.",
);
