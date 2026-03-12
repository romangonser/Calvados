// Swiper v12 Web Components – Konfiguration via JS
const swiperEl = document.querySelector('.producer-swiper');
const paginationEl = document.querySelector('.producer-pagination');

if (swiperEl) {
    // Swiper konfigurieren (ohne built-in pagination)
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
