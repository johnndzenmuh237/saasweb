/* ============================================
   FLOWDESK — MAIN.JS
   ============================================ */

(function () {
  'use strict';

  /* ---- Scroll Progress Bar ---- */
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ---- Sticky Nav ---- */
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile Nav ---- */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-mobile-toggle');
    if (!toggle) return;

    // Create mobile nav element
    const nav = document.querySelector('.nav-inner');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';

    if (navLinks) {
      const links = navLinks.querySelectorAll('a');
      links.forEach(link => {
        const clone = link.cloneNode(true);
        mobileNav.appendChild(clone);
      });
    }

    if (navActions) {
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'mobile-nav-actions';
      const buttons = navActions.querySelectorAll('.btn');
      buttons.forEach(btn => {
        const clone = btn.cloneNode(true);
        clone.style.textAlign = 'center';
        actionsDiv.appendChild(clone);
      });
      mobileNav.appendChild(actionsDiv);
    }

    document.body.appendChild(mobileNav);

    let isOpen = false;
    toggle.addEventListener('click', () => {
      isOpen = !isOpen;
      mobileNav.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      // Animate hamburger to X
      const spans = toggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (isOpen && !toggle.contains(e.target) && !mobileNav.contains(e.target)) {
        isOpen = false;
        mobileNav.classList.remove('open');
        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  }

  /* ---- FAQ Accordion ---- */
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(fi => fi.classList.remove('open'));
        // Toggle clicked
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ---- Scroll Reveal ---- */
  function initScrollReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      const delay = el.dataset.delay;
      if (delay) el.style.transitionDelay = delay + 'ms';
      observer.observe(el);
    });
  }

  /* ---- Pricing Toggle ---- */
  function initPricingToggle() {
    const toggle = document.querySelector('#billing-toggle');
    if (!toggle) return;

    const pricesMonthly = document.querySelectorAll('[data-price-monthly]');
    const pricesAnnual = document.querySelectorAll('[data-price-annual]');

    toggle.addEventListener('change', () => {
      const isAnnual = toggle.checked;
      pricesMonthly.forEach(el => {
        el.textContent = isAnnual ? el.dataset.priceAnnual : el.dataset.priceMonthly;
      });
      document.querySelectorAll('.price-period').forEach(el => {
        el.textContent = isAnnual ? '/mo billed annually' : '/month';
      });
    });
  }

  /* ---- Contact Form ---- */
  function initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'var(--color-success)';
        showToast('✅', 'Message sent! We\'ll be in touch soon.');
        form.reset();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      }, 1500);
    });
  }

  /* ---- Auth Forms ---- */
  function initAuthForms() {
    const loginForm = document.querySelector('#login-form');
    const signupForm = document.querySelector('#signup-form');

    const handleSubmit = (form, action) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = action === 'login' ? 'Signing in…' : 'Creating account…';
        btn.disabled = true;

        setTimeout(() => {
          if (action === 'signup') {
            showToast('🎉', 'Account created! Check your email.');
          } else {
            showToast('👋', 'Welcome back! Redirecting…');
          }
          setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
          }, 2000);
        }, 1500);
      });
    };

    if (loginForm) handleSubmit(loginForm, 'login');
    if (signupForm) handleSubmit(signupForm, 'signup');

    // Password visibility toggle
    document.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        if (!input) return;
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        btn.textContent = isHidden ? '🙈' : '👁';
      });
    });
  }

  /* ---- Toast Notification ---- */
  function showToast(icon, message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  /* ---- Active Nav Link ---- */
  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ---- Smooth Scroll for Anchor Links ---- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ---- Counter Animation ---- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1500;
        const start = performance.now();

        const tick = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = eased * target;
          el.textContent = prefix + (Number.isInteger(target) ? Math.floor(value) : value.toFixed(1)) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  /* ---- Steps interactive ---- */
  function initSteps() {
    const steps = document.querySelectorAll('.step-item');
    if (!steps.length) return;

    steps.forEach((step, i) => {
      step.addEventListener('click', () => {
        steps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');
      });
    });

    // Auto-cycle
    let current = 0;
    setInterval(() => {
      steps.forEach(s => s.classList.remove('active'));
      current = (current + 1) % steps.length;
      steps[current].classList.add('active');
    }, 3000);
  }

  /* ---- Init All ---- */
  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initNav();
    initMobileNav();
    initFAQ();
    initScrollReveal();
    initPricingToggle();
    initContactForm();
    initAuthForms();
    initActiveNav();
    initSmoothScroll();
    initCounters();
    initSteps();
  });

  // Expose showToast globally
  window.showToast = showToast;

})();