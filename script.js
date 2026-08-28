"use strict";

// The content and source links work without JavaScript. Only the galleries
// and enlarged screenshot view are progressively enhanced.
document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const controls = gallery.querySelector(".gallery-controls");
  if (!controls) return;
  controls.hidden = false;
  const image = gallery.querySelector("img");
  const link = gallery.querySelector("[data-enlarge]");
  const caption = gallery.querySelector("[data-image-caption]");
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-src]");
    if (!button) return;
    controls.querySelectorAll("button").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    image.src = button.dataset.src;
    image.alt = button.dataset.alt;
    link.href = button.dataset.src;
    link.dataset.caption = button.dataset.alt + " — " + button.dataset.caption;
    link.setAttribute("aria-label", "Enlarge " + button.dataset.alt);
    caption.textContent = button.dataset.caption;
  });
});

const dialog = document.getElementById("image-dialog");
const dialogImage = document.getElementById("dialog-image");
const dialogCaption = document.getElementById("dialog-caption");
let opener = null;

if (dialog && typeof dialog.showModal === "function") {
  document.querySelectorAll("[data-enlarge]").forEach((link) => {
    link.addEventListener("click", (event) => {
      // Preserve browser-native open-in-new-tab behavior.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      opener = link;
      dialogImage.src = link.href;
      dialogImage.alt = link.querySelector("img").alt;
      dialogCaption.textContent = link.dataset.caption;
      dialog.showModal();
    });
  });
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    opener?.focus();
  });
}

document.getElementById("year").textContent = String(new Date().getFullYear());

// Native scrolling stays in charge. Render at most once per scroll frame,
// with smaller travel on phones and no perpetual animation loop.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const narrowViewport = window.matchMedia("(max-width: 900px)");
const hero = document.querySelector(".hero");
const layers = [...document.querySelectorAll("[data-parallax]")];
const progress = document.querySelector(".scroll-progress");
let framePending = false;
let heroVisible = true;

// Keep the platform strip independent of page parallax so touch, trackpad,
// keyboard, and button scrolling never fight an automatic transform.
const platformScroller = document.querySelector(".era-scroll");
if (platformScroller) {
  const arrows = [...document.querySelectorAll("[data-era-direction]")];
  const updateArrows = () => {
    const end = platformScroller.scrollWidth - platformScroller.clientWidth;
    arrows.forEach((arrow) => {
      arrow.hidden = end <= 1;
      arrow.disabled =
        Number(arrow.dataset.eraDirection) < 0
          ? platformScroller.scrollLeft <= 1
          : platformScroller.scrollLeft >= end - 1;
    });
  };
  arrows.forEach((arrow) => {
    arrow.hidden = false;
    arrow.addEventListener("click", () => {
      platformScroller.scrollBy({
        left:
          Number(arrow.dataset.eraDirection) *
          platformScroller.clientWidth *
          0.75,
        behavior: "instant",
      });
      updateArrows();
    });
  });
  platformScroller.addEventListener("scroll", updateArrows, { passive: true });
  platformScroller.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const steps = {
      ArrowLeft: -80,
      ArrowRight: 80,
      Home: -platformScroller.scrollWidth,
      End: platformScroller.scrollWidth,
    };
    if (!(event.key in steps)) return;
    event.preventDefault();
    platformScroller.scrollBy({ left: steps[event.key], behavior: "instant" });
    updateArrows();
  });
  window.addEventListener("resize", updateArrows, { passive: true });
  document.fonts?.ready.then(updateArrows);
  updateArrows();
}

function renderScroll() {
  framePending = false;
  const y = window.scrollY;
  const range = document.documentElement.scrollHeight - window.innerHeight;
  if (progress)
    progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, y / range)) : 0})`;
  if (reducedMotion.matches || document.hidden) return;
  const intensity = narrowViewport.matches ? 0.35 : 1;
  if (heroVisible) {
    layers.forEach((layer) => {
      const offset = Math.max(
        -90,
        Math.min(90, y * Number(layer.dataset.parallax) * intensity),
      );
      layer.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
    });
  }
}

function scheduleScroll() {
  if (!framePending) {
    framePending = true;
    window.requestAnimationFrame(renderScroll);
  }
}

if ("IntersectionObserver" in window) {
  const activityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
      });
      scheduleScroll();
    },
    { rootMargin: "100px" },
  );
  if (hero) activityObserver.observe(hero);

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -24px 0px" },
  );
  document.querySelectorAll("[data-reveal]").forEach((element) => {
    if (
      !reducedMotion.matches &&
      element.getBoundingClientRect().top >= window.innerHeight
    ) {
      element.classList.add("reveal-ready");
      revealObserver.observe(element);
    }
  });
}

reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) {
    layers.forEach((layer) => layer.style.removeProperty("--parallax-y"));
    document
      .querySelectorAll(".reveal-ready")
      .forEach((element) => element.classList.add("is-visible"));
  }
  scheduleScroll();
});
window.addEventListener("scroll", scheduleScroll, { passive: true });
window.addEventListener("resize", scheduleScroll, { passive: true });
window.addEventListener("load", scheduleScroll, { once: true });
document.addEventListener("visibilitychange", scheduleScroll);
document.fonts?.ready.then(scheduleScroll);
scheduleScroll();
