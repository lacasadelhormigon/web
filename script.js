/* ============================================================
   LA CASA DEL HORMIGÓN — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. NAVBAR — aparece al hacer scroll
     ============================================================ */
  const navbar = document.getElementById('navbar');
  const hero   = document.getElementById('hero');

  const navObserver = new IntersectionObserver(
    ([entry]) => {
      navbar.classList.toggle('visible', !entry.isIntersecting);
    },
    { threshold: 0.2 }
  );

  if (hero) navObserver.observe(hero);


  /* ============================================================
     2. CARRUSEL DE IMÁGENES POR PRODUCTO
     ============================================================ */
  document.querySelectorAll('.producto-imgs').forEach(container => {
    const track  = container.querySelector('.imgs-track');
    const images = track.querySelectorAll('img');
    const dotsEl = container.querySelector('.img-dots');
    const prevBtn = container.querySelector('.img-nav.prev');
    const nextBtn = container.querySelector('.img-nav.next');

    let current = 0;
    const total = images.length;

    // Ocultar controles si solo hay 1 imagen
    if (total <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
    }

    // Crear dots
    const dots = [];
    images.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.add('img-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
      dots.push(dot);
    });

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    // Touch / swipe
    let touchStartX = 0;
    container.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    container.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
    }, { passive: true });

    // Auto-play suave (pausa en hover)
    let autoplay;

    function startAuto() {
      autoplay = setInterval(() => goTo(current + 1), 3500);
    }

    function stopAuto() {
      clearInterval(autoplay);
    }

    if (total > 1) {
      startAuto();
      container.addEventListener('mouseenter', stopAuto);
      container.addEventListener('mouseleave', startAuto);
    }
  });


  /* ============================================================
     3. FILTROS DE CATÁLOGO
     ============================================================ */
  const filterBtns = document.querySelectorAll('.filtro-btn');
  const cards       = document.querySelectorAll('.producto-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Actualizar botón activo
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach((card, i) => {
        const match = filter === 'all' || card.dataset.category === filter;

        if (match) {
          card.classList.remove('hidden');
          // Stagger animation
          card.style.animationDelay = `${(i % 12) * 0.05}s`;
          card.style.animation = 'none';
          // Force reflow
          void card.offsetWidth;
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ============================================================
     4. SCROLL REVEAL para las cards
     ============================================================ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = `${i * 0.04}s`;
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  cards.forEach(card => revealObserver.observe(card));


  /* ============================================================
     5. SMOOTH SCROLL para links internos
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 70; // altura de navbar
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ============================================================
     6. CURSOR PERSONALIZADO (desktop)
     ============================================================ */
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 10px; height: 10px;
      background: #c9a84c;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%,-50%);
      transition: transform 0.1s ease, background 0.2s ease, width 0.2s ease, height 0.2s ease;
      mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    const ring = document.createElement('div');
    ring.id = 'cursor-ring';
    ring.style.cssText = `
      position: fixed;
      width: 32px; height: 32px;
      border: 1px solid rgba(201,168,76,0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%,-50%);
      transition: transform 0.18s ease, left 0.1s ease, top 0.1s ease;
    `;
    document.body.appendChild(ring);

    let mx = 0, my = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
      ring.style.left = mx + 'px';
      ring.style.top  = my + 'px';
    });

    // Agrandar al hacer hover en elementos interactivos
    document.querySelectorAll('a, button, .filtro-btn, .consultar-btn, .img-nav').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '14px';
        cursor.style.height = '14px';
        ring.style.width = '46px';
        ring.style.height = '46px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        ring.style.width = '32px';
        ring.style.height = '32px';
      });
    });
  }


  /* ============================================================
     7. PARALLAX sutil en el hero grid
     ============================================================ */
  const heroGrid = document.querySelector('.hero-grid');
  if (heroGrid) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroGrid.style.transform = `translateY(${scrollY * 0.25}px)`;
    }, { passive: true });
  }

});