"use strict";

// Animate the native scroll position, not a transform, so visitors can take
// control with normal touch/trackpad gestures at any time.
function enhancePlatformStrip(scroller, reducedMotion) {
  const track = scroller.querySelector(".era-track");
  const group = track?.querySelector(".era-group");
  if (!group) return;
  const speed = 26; // Pixels per second, independent of refresh rate.
  const resumeDelay = 3500;
  let cycle = 0;
  let frame = null;
  let timer = null;
  let lastTime = null;
  let position = 0;
  let visible = !("IntersectionObserver" in window);
  let hovered = false;
  let held = false;
  let keyboardFocused = false;
  let manualUntil = 0;

  function stop() {
    if (frame !== null) window.cancelAnimationFrame(frame);
    if (timer !== null) window.clearTimeout(timer);
    frame = timer = null;
    lastTime = null;
  }

  function tick(now) {
    frame = null;
    if (!visible || document.hidden || reducedMotion.matches) return;
    if (lastTime !== null) {
      // Keep fractional movement and cap long-frame travel to avoid jumps.
      position =
        (position + (Math.min(now - lastTime, 64) * speed) / 1000) % cycle;
      scroller.scrollLeft = position;
    }
    lastTime = now;
    frame = window.requestAnimationFrame(tick);
  }

  function reconcile() {
    stop();
    if (
      !cycle ||
      !visible ||
      document.hidden ||
      reducedMotion.matches ||
      hovered ||
      held ||
      keyboardFocused
    )
      return;
    const remaining = manualUntil - performance.now();
    if (remaining > 0) {
      timer = window.setTimeout(reconcile, remaining);
      return;
    }
    manualUntil = 0;
    position = Math.max(0, scroller.scrollLeft) % cycle;
    frame = window.requestAnimationFrame(tick);
  }

  function pauseForInput() {
    manualUntil = performance.now() + resumeDelay;
    reconcile();
  }

  function measure() {
    const previousPosition = scroller.scrollLeft;
    cycle = group.getBoundingClientRect().width;
    if (!cycle) {
      stop();
      return;
    }
    track.querySelectorAll("[data-era-copy]").forEach((copy) => copy.remove());
    // Enough repeated content for a seamless wrap even on wide desktops.
    const copies = Math.ceil(scroller.clientWidth / cycle) + 1;
    for (let i = 0; i < copies; i++) {
      const copy = group.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      copy.setAttribute("data-era-copy", "");
      track.append(copy);
    }
    scroller.scrollLeft = Math.max(0, previousPosition) % cycle;
    reconcile();
  }

  scroller.addEventListener("wheel", pauseForInput, { passive: true });
  scroller.addEventListener("keydown", pauseForInput);
  scroller.addEventListener(
    "pointerdown",
    () => {
      held = true;
      pauseForInput();
    },
    { passive: true },
  );
  const release = () => {
    if (held) {
      held = false;
      pauseForInput();
    }
  };
  window.addEventListener("pointerup", release, { passive: true });
  window.addEventListener("pointercancel", release, { passive: true });
  scroller.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") {
      hovered = true;
      reconcile();
    }
  });
  scroller.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") {
      hovered = false;
      pauseForInput();
    }
  });
  scroller.addEventListener("focusin", () => {
    keyboardFocused = scroller.matches(":focus-visible");
    pauseForInput();
  });
  scroller.addEventListener("focusout", () => {
    keyboardFocused = false;
    pauseForInput();
  });
  scroller.addEventListener(
    "scroll",
    () => {
      // Extend the pause during touch/trackpad inertia. Automatic scroll events
      // don't enter this branch, so they cannot accidentally pause themselves.
      if (manualUntil > performance.now()) pauseForInput();
    },
    { passive: true },
  );
  document.addEventListener("visibilitychange", () => {
    held = false;
    reconcile();
  });
  reducedMotion.addEventListener("change", reconcile);
  window.addEventListener("resize", measure, { passive: true });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      reconcile();
    }).observe(scroller);
  }
  document.fonts?.ready.then(measure);
  measure();
}
