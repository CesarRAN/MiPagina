class ParallaxEngine {
  constructor() {
    this.elements = [];
    this.isMobile = window.innerWidth <= 768;
    this.rafId = null;
    this.init();
  }

  init() {
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const direction = el.dataset.parallaxDirection || 'vertical';
      this.elements.push({ el, speed, direction, rect: null });
    });

    if (!this.isMobile && this.elements.length > 0) {
      window.addEventListener('scroll', () => this.requestUpdate(), { passive: true });
      window.addEventListener('resize', () => this.handleResize(), { passive: true });
    }
  }

  requestUpdate() {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(() => {
      this.update();
      this.rafId = null;
    });
  }

  update() {
    const scrollY = window.pageYOffset;
    this.elements.forEach(item => {
      item.rect = item.el.getBoundingClientRect();
      const elementTop = item.rect.top + scrollY;
      const elementCenter = elementTop - (window.innerHeight / 2);
      const offset = (scrollY - elementCenter) * item.speed;

      if (item.direction === 'vertical') {
        item.el.style.transform = `translate3d(0, ${offset}px, 0)`;
      } else if (item.direction === 'horizontal') {
        item.el.style.transform = `translate3d(${offset}px, 0, 0)`;
      }
    });
  }

  handleResize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.elements.forEach(item => {
        item.el.style.transform = 'none';
      });
    }
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('scroll', this.requestUpdate);
    window.removeEventListener('resize', this.handleResize);
  }
}

class ParallaxBackground {
  constructor() {
    this.backgrounds = [];
    this.isMobile = window.innerWidth <= 768;
    this.init();
  }

  init() {
    document.querySelectorAll('.parallax-bg').forEach(bg => {
      const container = bg.parentElement;
      this.backgrounds.push({ bg, container });
    });

    if (!this.isMobile && this.backgrounds.length > 0) {
      window.addEventListener('scroll', () => this.update(), { passive: true });
    }
  }

  update() {
    const scrollY = window.pageYOffset;
    this.backgrounds.forEach(({ bg, container }) => {
      const rect = container.getBoundingClientRect();
      const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      if (isVisible) {
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const offset = (progress - 0.5) * 100;
        bg.style.transform = `translate3d(0, ${offset * 0.3}px, 0)`;
      }
    });
  }
}

class ScrollAnimations {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          const delay = entry.target.dataset.delay;
          if (delay) {
            entry.target.style.transitionDelay = `${delay}ms`;
          }

          if (entry.target.dataset.once !== 'false') {
            this.observer.unobserve(entry.target);
          }
        }
      });
    }, options);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      this.observer.observe(el);
    });
  }

  destroy() {
    if (this.observer) this.observer.disconnect();
  }
}

class CountUpAnimation {
  constructor() {
    this.elements = [];
    this.observer = null;
    this.init();
  }

  init() {
    this.elements = document.querySelectorAll('[data-count]');
    if (this.elements.length === 0) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCount(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.elements.forEach(el => this.observer.observe(el));
  }

  animateCount(el) {
    const target = parseInt(el.dataset.count);
    const duration = parseInt(el.dataset.duration) || 2000;
    const suffix = el.dataset.suffix || '';
    const start = 0;
    const startTime = performance.now();

    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.floor(start + (target - start) * easedProgress);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(animate);
  }

  destroy() {
    if (this.observer) this.observer.disconnect();
  }
}

class TiltEffect {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) return;
    this.init();
  }

  init() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => this.handleMove(e, card));
      card.addEventListener('mouseleave', () => this.handleLeave(card));
    });
  }

  handleMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  handleLeave(card) {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => {
      card.style.transition = '';
    }, 500);
  }
}

function initParallaxEffects() {
  const parallaxEngine = new ParallaxEngine();
  const parallaxBg = new ParallaxBackground();
  const scrollAnimations = new ScrollAnimations();
  const countUp = new CountUpAnimation();
  const tiltEffect = new TiltEffect();

  return { parallaxEngine, parallaxBg, scrollAnimations, countUp, tiltEffect };
}

document.addEventListener('DOMContentLoaded', () => {
  initParallaxEffects();
});