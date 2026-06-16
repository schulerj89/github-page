(function themeToggle() {
  const root = document.documentElement;
  const button = document.getElementById("themeToggle");
  const glyph = button?.querySelector(".theme-glyph");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    root.setAttribute("data-theme", savedTheme);
  }

  function syncButton() {
    const isLight = root.getAttribute("data-theme") === "light";
    if (glyph) glyph.textContent = isLight ? "10" : "01";
    if (button) button.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} theme`);
  }

  syncButton();

  button?.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    const nextTheme = isLight ? "dark" : "light";
    root.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    syncButton();
  });
})();

(function navigation() {
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("siteNav");
  const menuButton = document.getElementById("menuToggle");

  function syncHeader() {
    header?.setAttribute("data-elevated", String(window.scrollY > 14));
  }

  window.addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();

  menuButton?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("open") || false;
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav?.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement && nav.classList.contains("open")) {
      nav.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav?.classList.contains("open")) {
      nav.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.focus();
    }
  });
})();

(function year() {
  const yearElement = document.getElementById("year");
  if (yearElement) yearElement.textContent = String(new Date().getFullYear());
})();

(function revealOnScroll() {
  const elements = Array.from(document.querySelectorAll(".reveal"));
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  elements.forEach((element) => observer.observe(element));
})();

(function projectFilters() {
  const buttons = Array.from(document.querySelectorAll(".filter-button"));
  const cards = Array.from(document.querySelectorAll(".project-card"));
  const count = document.getElementById("projectCount");

  function applyFilter(filter) {
    let visible = 0;

    cards.forEach((card) => {
      const categories = String(card.getAttribute("data-category") || "").split(/\s+/);
      const shouldShow = filter === "all" || categories.includes(filter);
      card.hidden = !shouldShow;
      if (shouldShow) visible += 1;
    });

    buttons.forEach((button) => {
      const active = button.getAttribute("data-filter") === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (count) {
      count.textContent = `${visible} visible`;
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      applyFilter(button.getAttribute("data-filter") || "all");
    });
  });

  applyFilter("all");
})();

(function surfacePointer() {
  const surfaces = Array.from(document.querySelectorAll(".interactive-surface"));
  if (!window.matchMedia("(pointer: fine)").matches) return;

  surfaces.forEach((surface) => {
    surface.addEventListener("pointermove", (event) => {
      const rect = surface.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      surface.style.setProperty("--pointer-x", `${x.toFixed(2)}%`);
      surface.style.setProperty("--pointer-y", `${y.toFixed(2)}%`);
    });
  });
})();

(function signalCanvas() {
  const canvas = document.getElementById("signalCanvas");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: 0.68, y: 0.28 };
  let width = 0;
  let height = 0;
  let dpr = 1;
  let nodes = [];
  let frameId = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(72, Math.max(28, Math.round((width * height) / 18000)));
    nodes = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      size: index % 9 === 0 ? 2.6 : 1.6,
      phase: Math.random() * Math.PI * 2,
    }));

    drawFrame(0);
  }

  function drawGrid() {
    const spacing = width < 700 ? 56 : 74;
    context.strokeStyle = "rgba(87, 242, 135, 0.07)";
    context.lineWidth = 1;

    for (let x = 0; x <= width; x += spacing) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    for (let y = 0; y <= height; y += spacing) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
  }

  function drawPointerPulse(time) {
    const x = pointer.x * width;
    const y = pointer.y * height;
    const pulse = 38 + Math.sin(time / 420) * 8;
    const gradient = context.createRadialGradient(x, y, 0, x, y, 260);
    gradient.addColorStop(0, "rgba(49, 214, 255, 0.22)");
    gradient.addColorStop(0.35, "rgba(87, 242, 135, 0.11)");
    gradient.addColorStop(1, "rgba(87, 242, 135, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, 260, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "rgba(87, 242, 135, 0.35)";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(x, y, pulse, 0, Math.PI * 2);
    context.stroke();
  }

  function drawFrame(time) {
    context.clearRect(0, 0, width, height);
    drawGrid();
    drawPointerPulse(time);

    nodes.forEach((node) => {
      if (!reduceMotion) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;
      }

      const glow = 0.55 + Math.sin(time / 700 + node.phase) * 0.22;
      context.fillStyle = `rgba(87, 242, 135, ${glow})`;
      context.beginPath();
      context.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      context.fill();
    });

    for (let index = 0; index < nodes.length; index += 1) {
      for (let other = index + 1; other < nodes.length; other += 1) {
        const a = nodes[index];
        const b = nodes[other];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 138) {
          context.strokeStyle = `rgba(49, 214, 255, ${(1 - distance / 138) * 0.16})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }
    }

  }

  function animate(time) {
    drawFrame(time);
    if (!reduceMotion && !document.hidden) {
      frameId = requestAnimationFrame(animate);
    }
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener(
    "pointermove",
    (event) => {
      pointer.x = event.clientX / Math.max(1, width);
      pointer.y = event.clientY / Math.max(1, height);
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    if (reduceMotion) return;
    if (document.hidden) {
      cancelAnimationFrame(frameId);
    } else {
      frameId = requestAnimationFrame(animate);
    }
  });

  resize();

  if (!reduceMotion) {
    frameId = requestAnimationFrame(animate);
  }
})();
