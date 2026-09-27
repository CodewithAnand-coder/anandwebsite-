/* ═══════════════════════════════════════════
   PORTFOLIO — App Logic
   Single-page Smooth Scrolling • ScrollSpy • Scroll Reveals • Carousel • Interactions
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── DOM References ──
  const nav         = document.getElementById('mainNav');
  const navToggle   = document.getElementById('navToggle');
  const mobileMenu  = document.getElementById('mobileMenu');
  const navLinks    = document.querySelectorAll('.nav__link');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');
  const sections    = document.querySelectorAll('section[id], .page-section[id]');
  const footer      = document.getElementById('siteFooter');

  // ═══════════════════════════════════════════
  // 1. SMOOTH SCROLLING & NAVIGATION
  // ═══════════════════════════════════════════

  function scrollToSection(targetId) {
    const cleanId = targetId.replace('#', '');
    const targetElement = document.getElementById(cleanId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Update URL hash without jumping
      if (history.pushState) {
        history.pushState(null, '', '#' + cleanId);
      }
    }
  }

  // Handle all hash links smoothly
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        scrollToSection(href);
        closeMobileMenu();
      }
    });
  });

  // ═══════════════════════════════════════════
  // 2. SCROLLSPY (ACTIVE NAV HIGHLIGHTING)
  // ═══════════════════════════════════════════

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 180; // offset for navbar height
    let currentSectionId = 'home';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Check if scrolled near bottom of page
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 80) {
      currentSectionId = 'contact';
    }

    // Update desktop nav
    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === currentSectionId) {
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('nav__link--active');
      }
    });

    // Update mobile nav
    mobileLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === currentSectionId) {
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('nav__link--active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // Scrolled state for navbar backdrop
  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }, { passive: true });

  // ═══════════════════════════════════════════
  // 3. MOBILE MENU
  // ═══════════════════════════════════════════

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    navToggle.classList.add('nav__toggle--open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Stagger mobile link animations
    const links = mobileMenu.querySelectorAll('.nav__mobile-link');
    links.forEach((link, i) => {
      link.style.transitionDelay = (i * 50) + 'ms';
    });
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    if (navToggle) {
      navToggle.classList.remove('nav__toggle--open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';

    const links = mobileMenu.querySelectorAll('.nav__mobile-link');
    links.forEach(link => {
      link.style.transitionDelay = '0ms';
    });
  }

  // ═══════════════════════════════════════════
  // 4. SCROLL-TRIGGERED REVEALS
  // ═══════════════════════════════════════════

  function initScrollReveals() {
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

    if (!revealEls.length) return;

    // Check for reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      revealEls.forEach(el => el.classList.add('revealed'));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => {
      revealObserver.observe(el);
    });
  }

  // ═══════════════════════════════════════════
  // 5. INFINITE TECH CAROUSEL
  // ═══════════════════════════════════════════
  const techStack = [
    { name: 'Python',      cls: 'cb-python',  icon: 'Py' },
    { name: 'TensorFlow',  cls: 'cb-tf',      icon: 'TF' },
    { name: 'PyTorch',     cls: 'cb-pytorch', icon: 'PT' },
    { name: 'React',       cls: 'cb-react',   icon: 'Re' },
    { name: 'Node.js',     cls: 'cb-node',    icon: 'Nd' },
    { name: 'SQL',         cls: 'cb-sql',     icon: 'SQ' },
    { name: 'AWS',         cls: 'cb-aws',     icon: 'AW' },
    { name: 'Docker',      cls: 'cb-docker',  icon: 'Dk' },
    { name: 'JavaScript',  cls: 'cb-js',      icon: 'JS' },
    { name: 'TypeScript',  cls: 'cb-ts',      icon: 'TS' },
    { name: 'Git',         cls: 'cb-git',     icon: 'Gt' },
    { name: 'Pandas',      cls: 'cb-pandas',  icon: 'Pd' },
    { name: 'scikit-learn',cls: 'cb-sklearn', icon: 'SK' },
  ];

  const techStack2 = [
    { name: 'Flask',       cls: 'cb-flask',   icon: 'Fk' },
    { name: 'MongoDB',     cls: 'cb-mongo',   icon: 'Mg' },
    { name: 'Figma',       cls: 'cb-figma',   icon: 'Fi' },
    { name: 'Next.js',     cls: 'cb-nextjs',  icon: 'Nx' },
    { name: 'HTML5',       cls: 'cb-html',    icon: 'Ht' },
    { name: 'CSS3',        cls: 'cb-css',     icon: 'Cs' },
    { name: 'GCP',         cls: 'cb-gcp',     icon: 'GC' },
    { name: 'Keras',       cls: 'cb-keras',   icon: 'Kr' },
    { name: 'OpenCV',      cls: 'cb-opencv',  icon: 'CV' },
    { name: 'Spark',       cls: 'cb-spark',   icon: 'Sp' },
    { name: 'Linux',       cls: 'cb-linux',   icon: 'Lx' },
    { name: 'Tableau',     cls: 'cb-tableau', icon: 'Tb' },
    { name: 'Power BI',    cls: 'cb-power',   icon: 'PB' },
  ];

  let carouselInitialized = false;

  function createBadge(tech) {
    const badge = document.createElement('div');
    badge.className = 'carousel-badge ' + tech.cls;
    badge.innerHTML = `
      <div class="carousel-badge__icon">${tech.icon}</div>
      <span class="carousel-badge__name">${tech.name}</span>
    `;
    return badge;
  }

  function initCarousel() {
    if (carouselInitialized) return;

    const track1 = document.getElementById('carouselTrack');
    const track2 = document.getElementById('carouselTrack2');

    if (!track1 || !track2) return;

    const fragment1 = document.createDocumentFragment();
    const fragment2 = document.createDocumentFragment();

    // 3 copies for continuous loop
    for (let i = 0; i < 3; i++) {
      techStack.forEach(tech => fragment1.appendChild(createBadge(tech)));
      techStack2.forEach(tech => fragment2.appendChild(createBadge(tech)));
    }

    track1.appendChild(fragment1);
    track2.appendChild(fragment2);

    carouselInitialized = true;
  }

  // ═══════════════════════════════════════════
  // 6. WORKING CONTACT & EMAIL DISPATCH
  // ═══════════════════════════════════════════
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactFormStatus');
  const contactGmailBtn = document.getElementById('contactGmailBtn');

  function getFormData() {
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = (subjectInput && subjectInput.value.trim()) ? subjectInput.value.trim() : `Portfolio Inquiry from ${name || 'Visitor'}`;
    const message = messageInput ? messageInput.value.trim() : '';

    return { name, email, subject, message };
  }

  // Helper to open Gmail Web Composer
  function openGmailComposer(data) {
    const subject = data.subject || 'Portfolio Inquiry';
    const body = `Hi Anand,\n\n${data.message || ''}\n\n---\nBest regards,\n${data.name || 'Visitor'}\nEmail: ${data.email || ''}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=rnanand258@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  }

  // Helper to open default system mail app
  function openMailtoClient(data) {
    const subject = data.subject || 'Portfolio Inquiry';
    const body = `Hi Anand,\n\n${data.message || ''}\n\n---\nBest regards,\n${data.name || 'Visitor'}\nEmail: ${data.email || ''}`;
    const mailtoUrl = `mailto:rnanand258@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  }

  if (contactGmailBtn) {
    contactGmailBtn.addEventListener('click', function () {
      const data = getFormData();
      if (!data.name || !data.message) {
        showStatus('Tip: Enter your Name and Message to pre-fill your email to Anand.', 'success');
      }
      openGmailComposer(data);
      showStatus('✓ Opening Gmail composer to send directly to rnanand258@gmail.com...', 'success');
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = document.getElementById('contactSubmit');
      const originalHtml = submitBtn.innerHTML;
      const data = getFormData();

      if (!data.name || !data.email || !data.message) {
        showStatus('Please fill in your Name, Email, and Message.', 'error');
        return;
      }

      // Show loading spinner
      submitBtn.innerHTML = `
        <span style="display:inline-flex;align-items:center;gap:8px;">
          Sending Email...
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/></svg>
        </span>
      `;
      submitBtn.disabled = true;
      if (contactStatus) contactStatus.style.display = 'none';

      // If running on local file system (file://), open Gmail / mailto immediately to bypass browser CORS block
      if (window.location.protocol === 'file:') {
        setTimeout(() => {
          openGmailComposer(data);
          showStatus(`✓ Email draft created for <strong>rnanand258@gmail.com</strong>! Check your Gmail tab to hit Send.`, 'success');
          submitBtn.innerHTML = originalHtml;
          submitBtn.disabled = false;
        }, 500);
        return;
      }

      try {
        const response = await fetch("https://formsubmit.co/ajax/rnanand258@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            _subject: data.subject,
            message: data.message,
            _template: "table"
          })
        });

        const result = await response.json();

        if (response.ok || result.success === "true" || result.success === true) {
          showStatus(`✓ Thank you ${data.name}! Your message has been sent to rnanand258@gmail.com. Anand will get back to you shortly.`, 'success');
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        console.warn('Network sending fallback:', err);
        openGmailComposer(data);
        showStatus(`✓ Prepared email to <strong>rnanand258@gmail.com</strong>! Opening in Gmail...`, 'success');
      } finally {
        submitBtn.innerHTML = originalHtml;
        submitBtn.disabled = false;
      }
    });
  }

  function showStatus(messageHtml, type) {
    if (!contactStatus) return;
    contactStatus.className = 'contact__form-status ' + (type === 'success' ? 'contact__form-status--success' : 'contact__form-status--error');
    contactStatus.innerHTML = messageHtml;
    contactStatus.style.display = 'flex';
  }

  // ═══════════════════════════════════════════
  // 7. FOOTER YEAR
  // ═══════════════════════════════════════════
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ═══════════════════════════════════════════
  // 8. HERO MOUSE PARALLAX
  // ═══════════════════════════════════════════
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const orbs = heroSection.querySelectorAll('.hero__orb');

    heroSection.addEventListener('mousemove', function (e) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 15;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }

  // ═══════════════════════════════════════════
  // 9. KEYBOARD NAVIGATION
  // ═══════════════════════════════════════════
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
      if (navToggle) navToggle.focus();
    }
  });

  // ═══════════════════════════════════════════
  // 10. SMOOTH COUNTERS
  // ═══════════════════════════════════════════
  function animateCounters() {
    const stats = document.querySelectorAll('.stat__number');
    stats.forEach(stat => {
      const text = stat.textContent.trim();
      const match = text.match(/(\d+)/);
      if (!match) return;

      const target = parseInt(match[1]);
      const suffix = text.replace(match[1], '');
      let current = 0;
      const duration = 1500;
      const step = Math.max(1, target / (duration / 16));

      function update() {
        current += step;
        if (current >= target) {
          stat.textContent = target + suffix;
          return;
        }
        stat.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(update);
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            update();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(stat);
    });
  }

  // ═══════════════════════════════════════════
  // 11. CSS SPIN ANIMATION
  // ═══════════════════════════════════════════
  const spinStyle = document.createElement('style');
  spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(spinStyle);

  // ═══════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════
  function init() {
    initScrollReveals();
    initCarousel();
    animateCounters();
    updateActiveNavLink();

    // If starting with a hash in URL, scroll to it
    if (window.location.hash) {
      setTimeout(() => {
        scrollToSection(window.location.hash);
      }, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
