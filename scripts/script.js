document.addEventListener('DOMContentLoaded', () => {

  // Header-Referenz ganz oben – wird von Menu und Scroll-Handler gebraucht
  const header = document.querySelector('header');

  /* =====================================================
     Swiper – Produzenten Slider
     ===================================================== */
  const swiperEl = document.querySelector('.producer-swiper');
  const paginationEl = document.querySelector('.producer-pagination');

  if (swiperEl) {
    Object.assign(swiperEl, {
      centeredSlides: true,
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      keyboard: { enabled: true, onlyInViewport: true },
      slidesPerView: 1,
      spaceBetween: 32,
      speed: 800,
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 32 },
        1024: { slidesPerView: 3, spaceBetween: 32 },
      },
    });

    swiperEl.initialize();

    // Manuelle Pagination: je ein Dot pro Slide
    const slides = swiperEl.querySelectorAll('swiper-slide');
    const dots = [];

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'producer-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => {
        swiperEl.swiper.slideToLoop(i);
      });
      paginationEl.appendChild(dot);
      dots.push(dot);
    });

    // Aktiven Dot bei Slidewechsel aktualisieren
    swiperEl.addEventListener('swiperactiveindexchange', () => {
      const realIndex = swiperEl.swiper.realIndex;
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === realIndex);
      });
    });
  }

  /* =====================================================
     Mobile Menu Management
     ===================================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const headerList = document.querySelector('.header-list');

  if (menuToggle && headerList) {
    const closeMenu = () => {
      document.body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', () => {
      const isOpening = !document.body.classList.contains('menu-open');

      if (isOpening && header) {
        // Header sofort einblenden wenn Menü öffnet – ohne Transition-Flicker
        header.style.setProperty('transition', 'none');
        header.classList.remove('header-hidden');
        header.getBoundingClientRect(); // Reflow erzwingen
        header.style.removeProperty('transition');

        const rect = menuToggle.getBoundingClientRect();
        menuToggle.style.setProperty('--menu-toggle-top', `${rect.top}px`);
        menuToggle.style.setProperty('--menu-toggle-left', `${rect.left}px`);
      }

      const isOpen = document.body.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));

      if (!isOpen) {
        menuToggle.style.removeProperty('--menu-toggle-top');
        menuToggle.style.removeProperty('--menu-toggle-left');
      }
    });

    headerList.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });
  }

  /* =====================================================
     Accessibility: Section Navigation
     ===================================================== */
  document.querySelectorAll('section[id]').forEach(section => {
    section.setAttribute('tabindex', '-1');
  });

  // Anchor-Links: smooth scroll, dann focus+blur für saubere UX (kein Ring)
  document.querySelectorAll('.header-list a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        e.preventDefault();
        targetSection.scrollIntoView({ behavior: 'smooth' });
        targetSection.focus({ preventScroll: true });
        targetSection.blur();
      }
    });
  });

  /* =====================================================
     Header – Hide on scroll down, show on scroll up
     ===================================================== */
  let lastScrollY = window.scrollY;
  let isTicking = false;

  window.addEventListener('scroll', () => {
    if (!header || isTicking) return;

    isTicking = true;

    window.requestAnimationFrame(() => {
      // Menü offen → Header immer sichtbar
      if (document.body.classList.contains('menu-open')) {
        header.classList.remove('header-hidden');
        lastScrollY = window.scrollY;
        isTicking = false;
        return;
      }

      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY + 4;
      const isScrollingUp = currentScrollY < lastScrollY - 4;

      if (isScrollingDown && currentScrollY > 80) {
        header.classList.add('header-hidden');
      } else if (isScrollingUp || currentScrollY <= 80) {
        header.classList.remove('header-hidden');
      }

      lastScrollY = currentScrollY;
      isTicking = false;
    });
  }, { passive: true });

}); // End DOMContentLoaded