/* ============================================================
   ADEL AUDITOR — Portfolio Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 0. DYNAMIC CONTENT (skills + projects loaded from data.json) ────────
  //
  // To add / edit / remove a skill or project, you only need to edit
  // data.json — this section reads it and builds the markup automatically.

  const escapeHTML = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));

  const renderSkillItem = (skill) => `
    <div class="skill-item" aria-label="${escapeHTML(skill.name)} skill: ${skill.percent} percent">
      <div class="skill-header">
        <span class="skill-name">
          <i class="${escapeHTML(skill.icon)}" aria-hidden="true"></i>
          ${escapeHTML(skill.name)}
        </span>
        <span class="skill-percent" data-percent="${skill.percent}">0%</span>
      </div>
      <div class="skill-bar" role="progressbar" aria-valuenow="${skill.percent}" aria-valuemin="0" aria-valuemax="100" aria-label="${escapeHTML(skill.name)} proficiency ${skill.percent} percent">
        <div class="skill-fill" data-width="${skill.percent}"></div>
      </div>
    </div>`;

  const renderProjectCard = (project) => {
    const featuredClass = project.featured ? ' project-card--featured' : '';
    const statusLabel = project.status
      ? project.status.charAt(0).toUpperCase() + project.status.slice(1)
      : 'Live';
    const tags = (project.tags || [])
      .map((tag) => `<span class="project-tag">${escapeHTML(tag)}</span>`)
      .join('');

    return `
      <article class="project-card glass-card${featuredClass}" aria-label="Project: ${escapeHTML(project.title)}">
        <div class="project-card-header">
          <div class="project-icon" aria-hidden="true">
            <i class="${escapeHTML(project.icon)}"></i>
          </div>
          <div class="project-status project-status--${escapeHTML(project.status || 'live')}">
            <span class="status-dot" aria-hidden="true"></span>
            ${escapeHTML(statusLabel)}
          </div>
        </div>
        <div class="project-card-body">
          <h3 class="project-title">${escapeHTML(project.title)}</h3>
          <p class="project-description">${escapeHTML(project.description)}</p>
          <div class="project-tags" aria-label="Technologies used">
            ${tags}
          </div>
        </div>
        <div class="project-card-footer">
          <a href="${escapeHTML(project.link)}" class="project-link" target="_blank" rel="noopener noreferrer" aria-label="View ${escapeHTML(project.title)} on GitHub">
            <i class="fa-brands fa-github" aria-hidden="true"></i>
            View Project
          </a>
        </div>
      </article>`;
  };

  // Sets up the IntersectionObserver-driven fill/count-up animation on
  // .skill-fill elements. Extracted into a function so it can run again
  // after skills are injected dynamically (see loadPortfolioData below).
  const initSkillBars = () => {
    const skillFills = document.querySelectorAll('.skill-fill[data-width]:not([data-observed])');

    if (!skillFills.length) return;

    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const pct = bar.getAttribute('data-width') + '%';
          bar.style.width = pct;

          const item  = bar.closest('.skill-item');
          const label = item?.querySelector('.skill-percent');
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

    skillFills.forEach(bar => {
      bar.setAttribute('data-observed', 'true');
      skillObserver.observe(bar);
    });
  };

  const loadPortfolioData = async () => {
    const skillsGrid   = document.getElementById('skills-grid');
    const projectsGrid = document.getElementById('projects-grid');

    try {
      const res = await fetch('data.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to load data.json (${res.status})`);
      const data = await res.json();

      // Skills
      if (skillsGrid && Array.isArray(data.skills)) {
        skillsGrid.innerHTML = data.skills.map(renderSkillItem).join('');
        skillsGrid.removeAttribute('data-loading');

        // Sync the decorative radar chart labels with the first 6 skills
        data.skills.slice(0, 6).forEach((skill, i) => {
          const label = document.querySelector(`[data-radar-label="${i + 1}"]`);
          if (label) label.textContent = skill.name;
        });

        initSkillBars();
      }

      // Projects
      if (projectsGrid && Array.isArray(data.projects)) {
        projectsGrid.innerHTML = data.projects.map(renderProjectCard).join('');
        projectsGrid.removeAttribute('data-loading');
      }
    } catch (err) {
      console.error('Portfolio data failed to load:', err);
      if (skillsGrid) {
        skillsGrid.innerHTML = '<p class="data-load-error">Skills failed to load. Please refresh.</p>';
      }
      if (projectsGrid) {
        projectsGrid.innerHTML = '<p class="data-load-error">Projects failed to load. Please refresh.</p>';
      }
    }
  };

  loadPortfolioData();


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
  //
  // Sends real emails via Web3Forms (https://web3forms.com) — a free,
  // backend-free form relay. Get your access key at web3forms.com and paste
  // it into the hidden "access_key" input in index.html.

  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const successEl = document.getElementById('form-success');
    const errorEl   = document.getElementById('form-submit-error');
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

    const showBanner = (el, hideAfterMs = 5000) => {
      if (!el) return;
      el.setAttribute('aria-hidden', 'false');
      el.style.display = 'flex';
      setTimeout(() => {
        el.setAttribute('aria-hidden', 'true');
        el.style.display = 'none';
      }, hideAfterMs);
    };

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();
      if (errorEl) { errorEl.setAttribute('aria-hidden', 'true'); errorEl.style.display = 'none'; }

      // Honeypot: if this hidden field got filled, silently drop (bot).
      const honeypot = contactForm.querySelector('[name="botcheck"]');
      if (honeypot?.checked) return;

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

      const accessKey = contactForm.querySelector('[name="access_key"]')?.value;
      if (!accessKey || accessKey === 'YOUR-WEB3FORMS-ACCESS-KEY-HERE') {
        console.error('Web3Forms access_key is not set — see index.html contact form.');
        showBanner(errorEl);
        return;
      }

      // Loading state
      submitBtn?.classList.add('loading');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const payload = Object.fromEntries(new FormData(contactForm).entries());

        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await res.json();

        if (result.success) {
          contactForm.reset();
          showBanner(successEl);
        } else {
          console.error('Web3Forms error:', result.message);
          showBanner(errorEl);
        }
      } catch (err) {
        console.error('Contact form send failed:', err);
        showBanner(errorEl);
      } finally {
        submitBtn?.classList.remove('loading');
        if (submitBtn) submitBtn.disabled = false;
      }
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


  // ─── 13. FAQ CHAT WIDGET (client-side, no backend, no API cost) ──────────
  //
  // Loads Q&A pairs from faq.json and matches user input by keyword overlap.
  // To edit what the bot says, just edit faq.json — no code changes needed.

  const faqWidget   = document.getElementById('faq-widget');
  const faqToggle   = document.getElementById('faq-toggle');
  const faqPanel    = document.getElementById('faq-panel');
  const faqClose    = document.getElementById('faq-close');
  const faqMessages = document.getElementById('faq-messages');
  const faqChips    = document.getElementById('faq-quick-questions');
  const faqForm     = document.getElementById('faq-input-form');
  const faqInput    = document.getElementById('faq-input');

  if (faqWidget && faqToggle && faqPanel) {
    let faqData = null;
    let hasGreeted = false;

    const scrollMessagesToBottom = () => {
      faqMessages.scrollTop = faqMessages.scrollHeight;
    };

    const appendMessage = (text, sender) => {
      const bubble = document.createElement('div');
      bubble.className = `faq-message faq-message--${sender}`;
      bubble.textContent = text;
      faqMessages.appendChild(bubble);
      scrollMessagesToBottom();
    };

    const showTypingIndicator = () => {
      const typing = document.createElement('div');
      typing.className = 'faq-message faq-message--bot faq-message--typing';
      typing.id = 'faq-typing-indicator';
      typing.innerHTML = '<span class="faq-typing-dot"></span><span class="faq-typing-dot"></span><span class="faq-typing-dot"></span>';
      faqMessages.appendChild(typing);
      scrollMessagesToBottom();
    };

    const removeTypingIndicator = () => {
      document.getElementById('faq-typing-indicator')?.remove();
    };

    const respondTo = (userText) => {
      if (!faqData) return;
      showTypingIndicator();

      // Simulated "thinking" delay makes the scripted bot feel less abrupt.
      setTimeout(() => {
        removeTypingIndicator();

        const normalized = userText.toLowerCase();
        let bestMatch = null;
        let bestScore = 0;

        faqData.faqs.forEach((faq) => {
          const score = faq.keywords.reduce(
            (acc, kw) => acc + (normalized.includes(kw.toLowerCase()) ? 1 : 0),
            0
          );
          if (score > bestScore) {
            bestScore = score;
            bestMatch = faq;
          }
        });

        appendMessage(bestMatch ? bestMatch.answer : faqData.fallback, 'bot');
      }, 500 + Math.random() * 400);
    };

    const renderQuickQuestions = () => {
      faqChips.innerHTML = '';
      faqData.quickQuestions.forEach((question) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'faq-chip';
        chip.textContent = question;
        chip.addEventListener('click', () => {
          appendMessage(question, 'user');
          respondTo(question);
        });
        faqChips.appendChild(chip);
      });
    };

    const loadFaqData = async () => {
      try {
        const res = await fetch('faq.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to load faq.json (${res.status})`);
        faqData = await res.json();

        const nameEl = document.getElementById('faq-bot-name');
        const subEl  = document.getElementById('faq-bot-subtitle');
        if (nameEl) nameEl.textContent = faqData.botName;
        if (subEl)  subEl.textContent  = faqData.botSubtitle;

        renderQuickQuestions();
      } catch (err) {
        console.error('FAQ bot failed to load:', err);
        faqData = {
          botName: 'Assistant',
          botSubtitle: 'Unavailable',
          greeting: '',
          fallback: "Sorry, I'm having trouble loading right now. Please use the contact form below.",
          quickQuestions: [],
          faqs: [],
        };
      }
    };

    const openPanel = () => {
      faqPanel.setAttribute('data-open', 'true');
      faqPanel.setAttribute('aria-hidden', 'false');
      faqToggle.setAttribute('aria-expanded', 'true');
      faqToggle.setAttribute('aria-label', 'Close chat assistant');

      if (!hasGreeted && faqData?.greeting) {
        hasGreeted = true;
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          appendMessage(faqData.greeting, 'bot');
        }, 450);
      }

      setTimeout(() => faqInput?.focus(), 250);
    };

    const closePanel = () => {
      faqPanel.setAttribute('data-open', 'false');
      faqPanel.setAttribute('aria-hidden', 'true');
      faqToggle.setAttribute('aria-expanded', 'false');
      faqToggle.setAttribute('aria-label', 'Open chat assistant');
    };

    faqToggle.addEventListener('click', () => {
      const isOpen = faqPanel.getAttribute('data-open') === 'true';
      isOpen ? closePanel() : openPanel();
    });

    faqClose?.addEventListener('click', closePanel);

    document.addEventListener('click', (e) => {
      if (
        faqPanel.getAttribute('data-open') === 'true' &&
        !faqPanel.contains(e.target) &&
        !faqToggle.contains(e.target)
      ) {
        closePanel();
      }
    });

    faqForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = faqInput.value.trim();
      if (!text) return;
      appendMessage(text, 'user');
      faqInput.value = '';
      respondTo(text);
    });

    loadFaqData();
  }

});
