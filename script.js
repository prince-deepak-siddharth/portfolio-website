/* ═══════════════════════════════════════════════════════════
   PREMIUM PORTFOLIO — INTERACTIVITY
   Scroll reveals, nav highlighting, cursor glow, counters
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── CURSOR GLOW ───
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // ─── HERO REVEAL ON LOAD ───
  const heroReveals = document.querySelectorAll('.hero-section .reveal-text');
  heroReveals.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('revealed');
    }, 300 + i * 120);
  });

  // ─── SCROLL REVEAL (Intersection Observer) ───
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — keep for re-entry if wanted
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll(
    '.section-header, .section-subtitle, .about-content, .about-stats, ' +
    '.tech-group, .project-card, .blog-row, .contact-text, .contact-methods, ' +
    '.exp-card, .ach-card'
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── ACTIVE NAV LINK ON SCROLL ───
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = '';
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
    const docH = document.documentElement.scrollHeight;

    // If near the bottom of page (within 200px), force-activate the last section (contact)
    if (scrollY + windowH >= docH - 200) {
      current = sections[sections.length - 1].getAttribute('id');
    } else {
      // Check each section; use a proportion-based approach
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // Section is active when its top enters the upper 40% of the viewport
        if (rect.top <= windowH * 0.4) {
          current = section.getAttribute('id');
        }
      });
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ─── SMOOTH SCROLL FOR NAV LINKS ───
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Close mobile menu if open
      closeMobileMenu();
    });
  });

  // ─── MOBILE MENU ───
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const floatingNav = document.getElementById('floatingNav');
  const navOverlay = document.getElementById('mobileNavOverlay');

  function closeMobileMenu() {
    mobileToggle.classList.remove('active');
    floatingNav.classList.remove('mobile-open');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileToggle.classList.toggle('active');
    floatingNav.classList.toggle('mobile-open');
    if (navOverlay) navOverlay.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on overlay click
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close on clicking outside
  document.addEventListener('click', (e) => {
    if (!floatingNav.contains(e.target) && !mobileToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // ─── ANIMATED COUNTERS ───
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.5 });

  const statsContainer = document.querySelector('.about-stats');
  if (statsContainer) {
    counterObserver.observe(statsContainer);
  }

  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      const duration = 1500;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        stat.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ─── PARALLAX SUBTLE EFFECT ON HERO ───
  const heroVisual = document.querySelector('.hero-visual');

  if (heroVisual) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrolled * 0.15}px)`;
      }
    }, { passive: true });
  }

  // ─── NAV HIDE/SHOW ON SCROLL (Desktop) ───
  let lastScroll = 0;
  const nav = document.getElementById('floatingNav');

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (window.innerWidth > 768) {
      if (currentScroll > lastScroll && currentScroll > 400) {
        nav.style.opacity = '0.3';
      } else {
        nav.style.opacity = '1';
      }
    }
    lastScroll = currentScroll;
  }, { passive: true });

  nav.addEventListener('mouseenter', () => {
    nav.style.opacity = '1';
  });

  // ─── PROJECT CARD TILT EFFECT ───
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -2;
      const rotateY = ((x - centerX) / centerX) * 2;

      card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
    });
  });

  // ─── TECH CARD HOVER SOUND-LIKE FEEDBACK ───
  const techCards = document.querySelectorAll('.tech-card');

  techCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });

  // ─── SCROLL PROGRESS INDICATOR (Accent line on nav brand) ───
  const navBrand = document.querySelector('.nav-brand');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    navBrand.style.background = `linear-gradient(to top, var(--gold) ${scrollPercent}%, var(--charcoal) ${scrollPercent}%)`;
  }, { passive: true });

  // ─── PRELOAD COMPLETE — REMOVE LOADING STATE ───
  document.body.classList.add('loaded');

  // ─── ORBITING TECH ICONS ───
  const orbitIcons = document.querySelectorAll('.orbit-icon[data-orbit]');
  const wrapper = document.querySelector('.hero-photo-wrapper');

  if (wrapper && orbitIcons.length) {
    const centerX = wrapper.offsetWidth / 2;
    const centerY = wrapper.offsetHeight / 2;
    const iconSize = 40;

    // Each icon gets its own orbit config
    const orbits = Array.from(orbitIcons).map((icon, i) => {
      const count = orbitIcons.length;
      const startAngle = (i / count) * Math.PI * 2; // evenly spaced start
      // Alternate between two orbit radii for depth
      const radius = (i % 2 === 0) ? 190 : 170;
      // Varied speeds — some faster, some slower, some reversed
      const speeds = [0.0006, -0.0005, 0.0007, -0.0004, 0.0008, -0.0006, 0.0005, -0.0007, 0.0004];
      const speed = speeds[i % speeds.length];
      // Slight wobble for organic feel
      const wobbleAmp = 6 + Math.random() * 8;
      const wobbleFreq = 0.001 + Math.random() * 0.001;

      return { el: icon, angle: startAngle, radius, speed, wobbleAmp, wobbleFreq, phase: Math.random() * Math.PI * 2 };
    });

    let startTime = null;

    function animateOrbits(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      orbits.forEach(o => {
        o.angle += o.speed * 16; // per-frame increment (~16ms)
        const wobble = Math.sin(elapsed * o.wobbleFreq + o.phase) * o.wobbleAmp;
        const r = o.radius + wobble;
        const x = centerX + Math.cos(o.angle) * r - iconSize / 2;
        const y = centerY + Math.sin(o.angle) * r - iconSize / 2;
        o.el.style.left = x + 'px';
        o.el.style.top = y + 'px';
      });

      requestAnimationFrame(animateOrbits);
    }

    requestAnimationFrame(animateOrbits);
  }

});
