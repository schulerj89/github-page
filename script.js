(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");
  const state = {
    motionEnabled: true,
    pointerFine: window.matchMedia("(pointer: fine)").matches,
    scrollFrame: 0,
    pointerFrame: 0,
  };

  function safeFeature(name, initialize) {
    try {
      initialize();
    } catch (error) {
      console.warn(`[portfolio] ${name} enhancement unavailable`, error);
    }
  }

  function readPreference(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (_error) {
      return null;
    }
  }

  function writePreference(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_error) {
      // The interface remains usable when storage is restricted.
    }
  }

  function clamp(min, max, value) {
    return Math.min(max, Math.max(min, value));
  }

  safeFeature("year", () => {
    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  });

  safeFeature("theme", () => {
    const button = document.getElementById("themeToggle");
    const label = button?.querySelector(".theme-label");
    const themeColor = document.getElementById("themeColor");
    const systemTheme = window.matchMedia("(prefers-color-scheme: light)");
    let savedTheme = readPreference("portfolio-theme");

    function applyTheme(theme, persist = false) {
      const nextTheme = theme === "light" ? "light" : "dark";
      root.setAttribute("data-theme", nextTheme);
      if (themeColor) themeColor.setAttribute("content", nextTheme === "light" ? "#f1efe7" : "#0b0d0c");
      if (label) label.textContent = nextTheme === "light" ? "Dark" : "Light";
      if (button) button.setAttribute("aria-label", `Switch to ${nextTheme === "light" ? "dark" : "light"} theme`);
      if (persist) {
        savedTheme = nextTheme;
        writePreference("portfolio-theme", nextTheme);
      }
    }

    const initialTheme = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    applyTheme(initialTheme);

    button?.addEventListener("click", () => {
      const nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(nextTheme, true);
    });

    systemTheme.addEventListener?.("change", (event) => {
      if (savedTheme !== "light" && savedTheme !== "dark") {
        applyTheme(event.matches ? "light" : "dark");
      }
    });
  });

  safeFeature("motion preference", () => {
    const button = document.getElementById("motionToggle");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let savedMotion = readPreference("portfolio-motion");

    function applyMotion(enabled, persist = false) {
      state.motionEnabled = reducedMotion.matches ? false : Boolean(enabled);
      root.classList.toggle("motion-off", !state.motionEnabled);
      if (button) {
        button.setAttribute("aria-pressed", String(state.motionEnabled));
        button.disabled = reducedMotion.matches;
        button.setAttribute(
          "aria-label",
          reducedMotion.matches
            ? "Motion reduced by system setting"
            : `Turn motion ${state.motionEnabled ? "off" : "on"}`
        );
      }
      if (persist && !reducedMotion.matches) {
        savedMotion = state.motionEnabled ? "on" : "off";
        writePreference("portfolio-motion", savedMotion);
      }
      window.dispatchEvent(new CustomEvent("portfolio:motionchange", { detail: state.motionEnabled }));
    }

    const initialMotion = reducedMotion.matches ? false : savedMotion === "on" ? true : savedMotion === "off" ? false : true;
    applyMotion(initialMotion);

    button?.addEventListener("click", () => applyMotion(!state.motionEnabled, true));
    reducedMotion.addEventListener?.("change", (event) => {
      if (event.matches) applyMotion(false);
      else applyMotion(savedMotion === "on" ? true : savedMotion === "off" ? false : true);
    });
  });

  safeFeature("navigation", () => {
    const header = document.getElementById("siteHeader");
    const nav = document.getElementById("siteNav");
    const menuButton = document.getElementById("menuToggle");
    const navLinks = Array.from(nav?.querySelectorAll("a") || []);

    if (!header || !nav || !menuButton) return;

    function closeMenu({ restoreFocus = false } = {}) {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
      if (restoreFocus) menuButton.focus();
    }

    function openMenu() {
      nav.classList.add("open");
      menuButton.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
      window.requestAnimationFrame(() => navLinks[0]?.focus());
    }

    menuButton.addEventListener("click", () => {
      if (nav.classList.contains("open")) closeMenu();
      else openMenu();
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        closeMenu({ restoreFocus: window.innerWidth <= 900 });
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        closeMenu({ restoreFocus: true });
      }
    });

    document.addEventListener("pointerdown", (event) => {
      if (nav.classList.contains("open") && event.target instanceof Node && !header.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("focusin", (event) => {
      if (nav.classList.contains("open") && event.target instanceof Node && !header.contains(event.target)) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900 && nav.classList.contains("open")) closeMenu();
    }, { passive: true });
  });

  safeFeature("reveal", () => {
    const elements = Array.from(document.querySelectorAll(".reveal"));
    if (!elements.length || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96) element.classList.add("is-visible");
      else observer.observe(element);
    });

    if (state.motionEnabled) root.classList.add("motion-ok");
    window.addEventListener("portfolio:motionchange", (event) => {
      root.classList.toggle("motion-ok", Boolean(event.detail));
    });
  });

  safeFeature("scroll motion", () => {
    const header = document.getElementById("siteHeader");
    const hero = document.querySelector(".hero");
    const heroLines = Array.from(document.querySelectorAll(".hero-line[data-depth]"));
    const media = Array.from(document.querySelectorAll(".parallax-media"));
    let elevated = false;

    function resetTransforms() {
      heroLines.forEach((line) => { line.style.transform = ""; });
      media.forEach((image) => image.style.setProperty("--parallax-y", "0px"));
    }

    function updateScrollEffects() {
      state.scrollFrame = 0;
      const scrollY = window.scrollY || 0;
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty("--scroll-progress", String(clamp(0, 1, scrollY / scrollable)));

      const nextElevated = scrollY > 18;
      if (header && nextElevated !== elevated) {
        elevated = nextElevated;
        header.setAttribute("data-elevated", String(elevated));
      }

      if (!state.motionEnabled || !state.pointerFine || window.innerWidth < 900) {
        resetTransforms();
        return;
      }

      if (hero) {
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        if (scrollY < heroBottom) {
          heroLines.forEach((line) => {
            const depth = Number(line.getAttribute("data-depth")) || 0;
            const offset = -clamp(0, 66, scrollY * depth * 0.52);
            line.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
          });
        }
      }

      media.forEach((image) => {
        const frame = image.parentElement;
        if (!frame) return;
        const rect = frame.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const imageCenter = rect.top + rect.height / 2;
        const offset = clamp(-24, 24, (window.innerHeight / 2 - imageCenter) * 0.035);
        image.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
      });
    }

    function requestScrollUpdate() {
      if (!state.scrollFrame) state.scrollFrame = window.requestAnimationFrame(updateScrollEffects);
    }

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate, { passive: true });
    window.addEventListener("portfolio:motionchange", requestScrollUpdate);
    updateScrollEffects();
  });

  safeFeature("pointer depth", () => {
    if (!state.pointerFine) return;
    const loop = document.getElementById("loopVisual");
    let pointerX = window.innerWidth * 0.68;
    let pointerY = window.innerHeight * 0.18;

    function updatePointer() {
      state.pointerFrame = 0;
      if (!state.motionEnabled) return;
      root.style.setProperty("--pointer-x", `${((pointerX / window.innerWidth) * 100).toFixed(2)}%`);
      root.style.setProperty("--pointer-y", `${((pointerY / window.innerHeight) * 100).toFixed(2)}%`);
    }

    window.addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!state.pointerFrame) state.pointerFrame = window.requestAnimationFrame(updatePointer);
    }, { passive: true });

    loop?.addEventListener("pointermove", (event) => {
      if (!state.motionEnabled) return;
      const rect = loop.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      loop.style.setProperty("--loop-rotate-x", `${(-y * 6).toFixed(2)}deg`);
      loop.style.setProperty("--loop-rotate-y", `${(x * 6).toFixed(2)}deg`);
    }, { passive: true });

    loop?.addEventListener("pointerleave", () => {
      loop.style.setProperty("--loop-rotate-x", "0deg");
      loop.style.setProperty("--loop-rotate-y", "0deg");
    });

    window.addEventListener("portfolio:motionchange", (event) => {
      if (!event.detail) {
        loop?.style.setProperty("--loop-rotate-x", "0deg");
        loop?.style.setProperty("--loop-rotate-y", "0deg");
      }
    });
  });

  safeFeature("active navigation", () => {
    if (!("IntersectionObserver" in window)) return;
    const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
    const sections = Array.from(document.querySelectorAll("[data-section]"));

    function setActive(id) {
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]?.target.id) setActive(visible[0].target.id);
    }, { rootMargin: "-28% 0px -58%", threshold: [0, 0.1, 0.3] });

    sections.forEach((section) => observer.observe(section));
  });

  safeFeature("case study", () => {
    const caseStudy = document.querySelector(".case-study");
    const steps = Array.from(document.querySelectorAll(".story-step"));
    const captionIndex = caseStudy?.querySelector(".caption-index");
    const captionCopy = caseStudy?.querySelector(".caption-copy");
    if (!caseStudy || !steps.length || !("IntersectionObserver" in window)) return;

    function activate(step) {
      const stepNumber = step.getAttribute("data-step") || "1";
      caseStudy.setAttribute("data-step", stepNumber);
      steps.forEach((item) => item.classList.toggle("is-active", item === step));
      if (captionIndex) captionIndex.textContent = stepNumber.padStart(2, "0");
      if (captionCopy) captionCopy.textContent = step.getAttribute("data-caption") || "";
    }

    const observer = new IntersectionObserver((entries) => {
      const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (active) activate(active.target);
    }, { rootMargin: "-24% 0px -38%", threshold: [0.1, 0.3, 0.55] });

    steps.forEach((step) => observer.observe(step));
  });

  safeFeature("visible project motion", () => {
    if (!("IntersectionObserver" in window)) return;
    const cards = Array.from(document.querySelectorAll(".project-card"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("is-onscreen", entry.isIntersecting && state.motionEnabled));
    }, { rootMargin: "12% 0px", threshold: 0.01 });

    cards.forEach((card) => observer.observe(card));
    window.addEventListener("portfolio:motionchange", (event) => {
      cards.forEach((card) => {
        if (!event.detail) {
          card.classList.remove("is-onscreen");
          return;
        }
        const rect = card.getBoundingClientRect();
        card.classList.toggle("is-onscreen", rect.bottom > 0 && rect.top < window.innerHeight);
      });
    });
  });

  safeFeature("approach focus", () => {
    if (!("IntersectionObserver" in window)) return;
    const items = Array.from(document.querySelectorAll(".approach-item"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("is-current", entry.isIntersecting));
    }, { rootMargin: "-35% 0px -45%", threshold: 0.1 });
    items.forEach((item) => observer.observe(item));
  });

  safeFeature("page visibility", () => {
    function syncVisibility() {
      document.body.classList.toggle("page-hidden", document.hidden);
    }
    document.addEventListener("visibilitychange", syncVisibility);
    syncVisibility();
  });
})();
