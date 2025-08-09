// Theme toggle persistence
(function themeToggle(){
  const root = document.documentElement;
  const prev = localStorage.getItem('theme');
  if (prev) root.setAttribute('data-theme', prev);
  const btn = document.getElementById('themeToggle');
  btn?.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

// Mobile menu toggle
(function mobileMenu(){
  const btn = document.getElementById('menuToggle');
  const nav = document.querySelector('.site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => {
    const t = e.target;
    if (t instanceof HTMLElement && t.tagName === 'A' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

// Current year
(function year(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear().toString();
})();

// IntersectionObserver reveal on scroll
(function reveal(){
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('visible')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
})();

// Subtle tilt effect for cards (disabled on touch/non-fine pointers)
(function tilt(){
  if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;
  const cards = document.querySelectorAll('.tilt');
  cards.forEach(card => {
    let raf = 0;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height; // 0..1
      const rotX = (py - .5) * -8; // max tilt
      const rotY = (px - .5) * 8;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
    });
  });
})();

// Lightweight particle background on canvas
(function particles(){
  const canvas = document.getElementById('bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, particles = [], last = 0;

  function resize(){
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * DPR; canvas.height = h * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    makeParticles();
  }

  function makeParticles(){
    const base = (w * h) / 26000;
    const density = window.innerWidth <= 480 ? base * 0.6 : base;
    const count = Math.round(density);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  function step(ts){
    const dt = Math.min(32, ts - last); last = ts;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(14,165,233,0.8)';
    ctx.strokeStyle = 'rgba(34,211,238,0.25)';

    // move and draw
    for (let i=0;i<particles.length;i++){
      const p = particles[i];
      p.x += p.vx * dt * 0.06; p.y += p.vy * dt * 0.06;
      if (p.x < -5) p.x = w+5; if (p.x > w+5) p.x = -5;
      if (p.y < -5) p.y = h+5; if (p.y > h+5) p.y = -5;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
    }

    // connect near
    for (let i=0;i<particles.length;i++){
      for (let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y; const d2 = dx*dx + dy*dy;
        if (d2 < 90*90) { // within 90px
          ctx.globalAlpha = Math.max(0, 1 - Math.sqrt(d2)/90) * 0.5;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.globalAlpha = 1;
        }
      }
    }

    requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  requestAnimationFrame(step);
})();

// Wave effect: split hero name into characters with staggered delay
(function waveTitle(){
  const h1 = document.querySelector('h1.wave');
  if (!h1) return;
  const text = h1.textContent || '';
  const frag = document.createDocumentFragment();
  let i = 0;
  for (const ch of text) {
    const span = document.createElement('span');
    span.textContent = ch;
    span.className = 'char';
    span.style.setProperty('--i', String(i));
    frag.appendChild(span);
    i++;
  }
  h1.textContent = '';
  h1.appendChild(frag);
})();
