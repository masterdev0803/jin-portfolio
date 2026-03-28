/* ════════════════════════════════════════════════════════════════
   JIN STUDIO — Portfolio Script
   ════════════════════════════════════════════════════════════════ */

'use strict';

// ─── LOADER ──────────────────────────────────────────────────────
(function initLoader() {
  const loader   = document.getElementById('loader');
  const fill     = document.getElementById('loaderFill');
  let progress   = 0;

  const tick = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      setTimeout(() => {
        loader.classList.add('done');
        document.body.classList.remove('loading');
        startPageAnimations();
      }, 380);
    }
    fill.style.width = Math.min(progress, 100) + '%';
  }, 80);

  document.body.classList.add('loading');
})();

function startPageAnimations() {
  initHeroReveal();
  initParticles();
  initCycleText();
  initCounters();
  startRevealObserver();
  initSkillBars();
}

// ─── CUSTOM CURSOR ───────────────────────────────────────────────
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = -100, mouseY = -100;
let ringX  = -100, ringY  = -100;
let raf;

function animateCursor() {
  ringX += (mouseX - ringX) * 0.13;
  ringY += (mouseY - ringY) * 0.13;

  cursorDot.style.left  = mouseX + 'px';
  cursorDot.style.top   = mouseY + 'px';
  cursorRing.style.left = ringX  + 'px';
  cursorRing.style.top  = ringY  + 'px';

  raf = requestAnimationFrame(animateCursor);
}

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });

document.addEventListener('mousedown', () => {
  cursorDot.style.transform  = 'translate(-50%,-50%) scale(0.7)';
  cursorRing.style.transform = 'translate(-50%,-50%) scale(0.85)';
});
document.addEventListener('mouseup', () => {
  cursorDot.style.transform  = 'translate(-50%,-50%) scale(1)';
  cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
});

// Expand cursor on interactive elements
const interactiveSelectors = 'a, button, .filter-btn, .proj-link, .soc-link, .slider-btn, input, select, textarea, .service-card, .project-card, .stat-card, .pill, .slider-dot';

document.addEventListener('mouseover', (e) => {
  if (e.target.matches(interactiveSelectors) || e.target.closest(interactiveSelectors)) {
    cursorDot.classList.add('expanded');
    cursorRing.classList.add('expanded');
  }
});

document.addEventListener('mouseout', (e) => {
  if (e.target.matches(interactiveSelectors) || e.target.closest(interactiveSelectors)) {
    cursorDot.classList.remove('expanded');
    cursorRing.classList.remove('expanded');
  }
});

animateCursor();

// ─── SCROLL PROGRESS ─────────────────────────────────────────────
const scrollBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const pct = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
  scrollBar.style.width = pct + '%';
}, { passive: true });

// ─── NAVBAR ──────────────────────────────────────────────────────
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navToggle.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close mobile menu on resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    navToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ─── PARTICLE CANVAS ─────────────────────────────────────────────
function initParticles() {
  const canvas  = document.getElementById('particleCanvas');
  const ctx     = canvas.getContext('2d');
  let W, H, particles;
  let mx = -1000, my = -1000;

  function resize() {
    const hero = document.querySelector('.hero');
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
    if (!particles || particles.length === 0) buildParticles();
  }

  function buildParticles() {
    const count = Math.min(Math.floor((W * H) / 14000), 80);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .4,
      vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.8 + .6,
      opacity: Math.random() * .5 + .15,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      // Mouse repulsion
      const dx = p.x - mx;
      const dy = p.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100 * .8;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // Speed limit
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.5) { p.vx = (p.vx / speed) * 1.5; p.vy = (p.vy / speed) * 1.5; }

      p.x += p.vx;
      p.y += p.vy;

      // Damping
      p.vx *= 0.995;
      p.vy *= 0.995;

      // Wrap
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139,92,246,${p.opacity})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const ex = p.x - q.x, ey = p.y - q.y;
        const edist = Math.sqrt(ex * ex + ey * ey);
        if (edist < 130) {
          const alpha = (1 - edist / 130) * 0.12;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
          ctx.lineWidth = .8;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }

  const hero = document.querySelector('.hero');
  hero.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
  }, { passive: true });
  hero.addEventListener('mouseleave', () => { mx = -1000; my = -1000; });

  resize();
  draw();
  window.addEventListener('resize', resize, { passive: true });
}

// ─── HERO TEXT CYCLE ─────────────────────────────────────────────
function initCycleText() {
  const el = document.getElementById('cycleText');
  if (!el) return;

  const words = ['Joyful', 'Powerful', 'Remarkable', 'Scalable', 'Beautiful', 'Extraordinary'];
  let index = 0;

  setInterval(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-20px)';
    el.style.transition = 'opacity .3s, transform .3s';

    setTimeout(() => {
      index = (index + 1) % words.length;
      el.textContent = words[index];
      el.style.transform = 'translateY(20px)';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    }, 320);
  }, 2800);
}

// ─── HERO REVEAL ─────────────────────────────────────────────────
function initHeroReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-right');
  elements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('revealed');
    }, 200 + i * 150);
  });
}

// ─── INTERSECTION OBSERVER (Scroll Reveals) ───────────────────────
function startRevealObserver() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  items.forEach(item => observer.observe(item));
}

// ─── COUNTER ANIMATION ────────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }

  requestAnimationFrame(step);
}

// ─── SKILL BARS ───────────────────────────────────────────────────
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const w   = bar.dataset.width;
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
}

// ─── PROJECT FILTER ───────────────────────────────────────────────
(function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          card.style.display = '';
          card.style.animation = 'fadeIn .4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

// ─── TESTIMONIALS SLIDER ─────────────────────────────────────────
(function initSlider() {
  const track    = document.getElementById('testimonialsTrack');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('sliderDots');
  if (!track) return;

  const slides = track.querySelectorAll('.testi-card');
  let current  = 0;
  let autoTimer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5500);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  resetAuto();
})();

// ─── CONTACT FORM ─────────────────────────────────────────────────
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--danger)';
        valid = false;
      }
      // Email format check
      if (field.type === 'email' && field.value.trim()) {
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        if (!emailOk) {
          field.style.borderColor = 'var(--danger)';
          valid = false;
        }
      }
    });

    if (!valid) return;

    // Simulate submission
    const btn  = form.querySelector('button[type="submit"]');
    const text = btn.querySelector('.btn-text');
    btn.disabled    = true;
    btn.style.opacity = '.7';
    text.textContent  = 'Sending…';

    setTimeout(() => {
      form.reset();
      btn.style.opacity  = '1';
      btn.disabled        = false;
      text.textContent    = 'Send Message';
      success.hidden      = false;

      setTimeout(() => { success.hidden = true; }, 6000);
    }, 1400);
  });

  // Live border reset on input
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => { field.style.borderColor = ''; });
  });
})();

// ─── TILT EFFECT on Project Cards ────────────────────────────────
(function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return; // skip touch devices

  const cards = document.querySelectorAll('.project-card, .service-card, .stat-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = e.clientX - cx;
      const dy     = e.clientY - cy;
      const maxRot = 6;
      const rx     = -(dy / (rect.height / 2)) * maxRot;
      const ry     =  (dx / (rect.width  / 2)) * maxRot;

      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ─── MAGNETIC BUTTONS ─────────────────────────────────────────────
(function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;

  const magBtns = document.querySelectorAll('.mag-btn');

  magBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * .22;
      const dy   = (e.clientY - cy) * .22;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

// ─── SMOOTH NAV LINKS ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── ACTIVE NAV LINK ON SCROLL ────────────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--text)';
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
})();

// ─── FLOATING CARD PARALLAX ───────────────────────────────────────
(function initParallax() {
  if (window.matchMedia('(hover: none)').matches) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const fc1 = document.querySelector('.fc-1');
  const fc2 = document.querySelector('.fc-2');
  const fc3 = document.querySelector('.fc-3');

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width  - .5) * 2;
    const yPct = ((e.clientY - rect.top)  / rect.height - .5) * 2;

    if (fc1) fc1.style.transform = `translateX(${xPct * -10}px) translateY(${yPct * -8}px)`;
    if (fc2) fc2.style.transform = `translateX(${xPct *  8}px) translateY(${yPct *  6}px)`;
    if (fc3) fc3.style.transform = `translateX(${xPct * -6}px) translateY(${yPct * 10}px)`;
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    if (fc1) fc1.style.transform = '';
    if (fc2) fc2.style.transform = '';
    if (fc3) fc3.style.transform = '';
  });
})();

// ─── MARQUEE PAUSE ON HOVER ───────────────────────────────────────
(function initMarqueePause() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  track.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
  track.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
})();

// ─── SERVICE CARD MOUSE GLOW ─────────────────────────────────────
(function initCardGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
      card.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(99,102,241,0.07), var(--bg-card) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();
