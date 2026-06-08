/* ============================================================
   ADEL AUDITOR — Portfolio Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. THEME TOGGLE ─────────────────────────────────────────────────────

  const html = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');

  const applyTheme = (theme) => {
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
  };

  const savedTheme = localStorage.getItem('aa-theme') || 'dark';
  applyTheme(savedTheme);

  themeBtn?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('aa-theme', next);
  });


  // ─── 2. MOBILE MENU ──────────────────────────────────────────────────────

  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const closeMenu = () => {
    hamburger?.classList.remove('active');
    mobileMenu?.classList.remove('active');
    if (mobileMenu) mobileMenu.setAttribute('aria-hidden', 'true');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = hamburger.classList.toggle('active');
    mobileMenu?.classList.toggle('active', isOpen);
    if (mobileMenu) mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (e) => {
    if (
      mobileMenu?.classList.contains('active') &&
      !mobileMenu.contains(e.target) &&
      !hamburger?.contains(e.target)
    ) {
      closeMenu();
    }
  });


  // ─── 3. STICKY NAVBAR ────────────────────────────────────────────────────

  const navbar = document.querySelector('.navbar');

  const onScroll = () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 48);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  // ─── 4. TYPING EFFECT ────────────────────────────────────────────────────

  const typedEl = document.getElementById('typed-text');

  if (typedEl) {
    const phrases = [
      'AI Automation Specialist',
      'n8n Expert',
      'Zapier Pro',
      'AI Agent Builder',
      'Workflow Architect',
    ];
    let phraseIdx = 0;
    let charIdx   = 0;
    let deleting  = false;

    const tick = () => {
      const phrase = phrases[phraseIdx];

      if (!deleting) {
        typedEl.textContent = phrase.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === phrase.length) {
          deleting = true;
          setTimeout(tick, 2100);
        } else {
          setTimeout(tick, 82);
        }
      } else {
        typedEl.textContent = phrase.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting  = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(tick, 320);
        } else {
          setTimeout(tick, 48);
        }
      }
    };

    tick();
  }


  // ─── 5. ANIMATED COUNTERS ────────────────────────────────────────────────

  const counterEls = document.querySelectorAll('[data-target]');

  if (counterEls.length) {
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    const runCounter = (el) => {
      const target   = parseInt(el.getAttribute('data-target'), 10);
      const duration = 2000;
      const start    = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(easeOut(progress) * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      };

      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => counterObserver.observe(el));
  }


  // ─── 6. SKILLS PROGRESS BARS ─────────────────────────────────────────────

  const skillFills  = document.querySelectorAll('.skill-fill[data-width]');
  const skillPcts   = document.querySelectorAll('.skill-percent[data-percent]');

  if (skillFills.length) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const pct = bar.getAttribute('data-width') + '%';
          bar.style.width = pct;

          // Also animate the percentage label
          const item   = bar.closest('.skill-item');
          const label  = item?.querySelector('.skill-percent');
          if (label) {
            const target   = parseInt(label.getAttribute('data-percent'), 10);
            const duration = 1400;
            const start    = performance.now();
            const easeOut  = t => 1 - Math.pow(1 - t, 3);
            const step = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              label.textContent = Math.floor(easeOut(progress) * target) + '%';
              if (progress < 1) requestAnimationFrame(step);
              else label.textContent = target + '%';
            };
            requestAnimationFrame(step);
          }

          skillObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    skillFills.forEach(bar => skillObserver.observe(bar));
  }


  // ─── 7. SCROLL REVEAL ────────────────────────────────────────────────────

  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
      // stagger siblings
      const siblings = el.parentElement
        ? [...el.parentElement.querySelectorAll('.reveal')]
        : [];
      const idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = `${idx * 85}ms`;
      revealObserver.observe(el);
    });
  }


  // ─── 8. SMOOTH SCROLL ────────────────────────────────────────────────────

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      closeMenu();

      const offset = navbar ? navbar.getBoundingClientRect().height : 0;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  // ─── 9. ACTIVE NAV LINK ON SCROLL ────────────────────────────────────────

  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link[href^="#"]');

  const highlightNav = () => {
    if (!sections.length || !navAnchors.length) return;

    const navH      = navbar ? navbar.getBoundingClientRect().height : 0;
    const scrollMid = window.scrollY + navH + window.innerHeight * 0.3;
    let active      = null;

    sections.forEach(sec => {
      if (scrollMid >= sec.offsetTop && scrollMid < sec.offsetTop + sec.offsetHeight) {
        active = sec.id;
      }
    });

    if (!active && window.scrollY < 100 && sections.length) {
      active = sections[0].id;
    }

    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${active}`);
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();


  // ─── 10. CONTACT FORM ────────────────────────────────────────────────────

  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const successEl = document.getElementById('form-success');
    const submitBtn = contactForm.querySelector('[type="submit"]');

    const showError = (inputId, msg) => {
      const input = document.getElementById(inputId);
      const err   = document.getElementById(inputId.replace('contact-', '') + '-error');
      if (input) input.classList.add('invalid');
      if (err)   err.textContent = msg;
    };

    const clearErrors = () => {
      contactForm.querySelectorAll('.form-input').forEach(f => f.classList.remove('invalid'));
      contactForm.querySelectorAll('.form-error').forEach(e => e.textContent = '');
    };

    const validateEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      const name    = document.getElementById('contact-name');
      const email   = document.getElementById('contact-email');
      const subject = document.getElementById('contact-subject');
      const message = document.getElementById('contact-message');
      let valid = true;

      if (!name?.value.trim()) { showError('contact-name', 'Please enter your name.'); valid = false; }
      if (!email?.value.trim() || !validateEmail(email.value)) { showError('contact-email', 'Please enter a valid email.'); valid = false; }
      if (!subject?.value.trim()) { showError('contact-subject', 'Please enter a subject.'); valid = false; }
      if (!message?.value.trim()) { showError('contact-message', 'Please enter your message.'); valid = false; }

      if (!valid) return;

      // Loading state
      submitBtn?.classList.add('loading');
      if (submitBtn) submitBtn.disabled = true;

      // Simulate send (replace with real fetch to a form handler / Netlify Forms)
      setTimeout(() => {
        submitBtn?.classList.remove('loading');
        if (submitBtn) submitBtn.disabled = false;
        contactForm.reset();
        if (successEl) {
          successEl.setAttribute('aria-hidden', 'false');
          successEl.style.display = 'flex';
          setTimeout(() => {
            successEl.setAttribute('aria-hidden', 'true');
            successEl.style.display = 'none';
          }, 5000);
        }
      }, 1200);
    });
  }


  // ─── 11. FOOTER YEAR ─────────────────────────────────────────────────────

  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // ─── 12. WORKFLOW STEP REVEAL ────────────────────────────────────────────

  const flowNodes = document.querySelectorAll('.flow-node');
  if (flowNodes.length) {
    const flowObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const idx = [...flowNodes].indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 120}ms`;
          entry.target.classList.add('visible');
          flowObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    flowNodes.forEach(node => {
      node.classList.add('reveal');
      flowObserver.observe(node);
    });
  }

});
