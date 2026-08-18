/**
 * AI-Powered Forward Directional Sign Language System (AI-FSLS)
 * Premium Custom Cursor & Micro-Interactions
 * 
 * Deep-tech / AI product aesthetic:
 * - High precision center dot with instant tracking
 * - Smooth lerped outer ring with GPU acceleration
 * - Soft fading motion trail via lightweight canvas
 * - Subtle magnetic attraction for primary CTAs
 * - Click ripple & interactive states (Hover, Click, Text, Idle)
 * - Full accessibility (prefers-reduced-motion, pointer: fine only)
 */

export class CustomCursor {
  constructor() {
    this.isFinePointer = window.matchMedia('(pointer: fine)').matches;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // State coordinates
    this.mouse = { x: -100, y: -100 };
    this.ring = { x: -100, y: -100 };
    this.trailPoints = [];
    this.maxTrailPoints = 7;
    
    this.isHovering = false;
    this.isClicking = false;
    this.isTextMode = false;
    this.isIdle = false;
    this.activeMagneticEl = null;

    this.idleTimer = null;
    this.idleDelay = 3000; // 3 seconds before gentle fade out

    // Elements
    this.container = null;
    this.dot = null;
    this.ringEl = null;
    this.canvas = null;
    this.ctx = null;
    this.ripple = null;
    this.animFrameId = null;

    // Bindings
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onResize = this.onResize.bind(this);
    this.tick = this.tick.bind(this);
  }

  init() {
    if (!this.isFinePointer) return;

    this.createElements();
    this.bindEvents();
    this.onResize();

    // Start render loop
    this.animFrameId = requestAnimationFrame(this.tick);
  }

  createElements() {
    this.container = document.createElement('div');
    this.container.className = 'custom-cursor-container';
    this.container.setAttribute('aria-hidden', 'true');

    // Canvas for subtle motion trail
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'cursor-trail-canvas';
    this.ctx = this.canvas.getContext('2d', { alpha: true });

    // Outer Ring
    this.ringEl = document.createElement('div');
    this.ringEl.className = 'cursor-ring';

    // Center Dot
    this.dot = document.createElement('div');
    this.dot.className = 'cursor-dot';

    // Click Ripple
    this.ripple = document.createElement('div');
    this.ripple.className = 'cursor-ripple';

    this.container.appendChild(this.canvas);
    this.container.appendChild(this.ringEl);
    this.container.appendChild(this.dot);
    this.container.appendChild(this.ripple);
    document.body.appendChild(this.container);
  }

  bindEvents() {
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerdown', this.onPointerDown, { passive: true });
    window.addEventListener('pointerup', this.onPointerUp, { passive: true });
    document.addEventListener('mouseleave', this.onMouseLeave);
    document.addEventListener('mouseenter', this.onMouseEnter);
    window.addEventListener('resize', this.onResize, { passive: true });

    // Reduced motion listener
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
    });

    // Delegation for interactive element hovers & magnetic attraction
    document.addEventListener('mouseover', (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      const interactive = target.closest('button, a, select, input, [role="button"], .btn, .nav-link, .arch-node, .gesture-chip, .sign-picker-btn, .preset-chip, .feature-card, .hw-card, .pres-dot, .modal-close-btn');
      
      if (interactive) {
        this.setHover(true);
        this.setTextMode(false);

        // Check if magnetic candidate
        const magnetic = target.closest('.btn, .nav-link, .brand-logo, .gesture-chip, .sign-picker-btn, .preset-chip, .modal-close-btn');
        if (magnetic && !this.prefersReducedMotion) {
          this.activeMagneticEl = magnetic;
          magnetic.classList.add('magnetic-active');
        }
      } else {
        const textElement = target.closest('p, h1, h2, h3, h4, .nlp-sentence-display, .section-subtitle');
        if (textElement && !target.closest('button, a')) {
          this.setTextMode(true);
          this.setHover(false);
        } else {
          this.setTextMode(false);
          this.setHover(false);
        }
      }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      const magnetic = target.closest('.magnetic-active');
      if (magnetic) {
        magnetic.style.transform = '';
        if (this.activeMagneticEl === magnetic) {
          this.activeMagneticEl = null;
        }
      }
    }, { passive: true });
  }

  onResize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
  }

  onPointerMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;

    // Reset idle state
    if (this.isIdle) {
      this.isIdle = false;
      this.container?.classList.remove('cursor-idle');
    }

    this.resetIdleTimer();

    // Record trail point (capped)
    if (!this.prefersReducedMotion) {
      this.trailPoints.push({ x: this.mouse.x, y: this.mouse.y, alpha: 1.0 });
      if (this.trailPoints.length > this.maxTrailPoints) {
        this.trailPoints.shift();
      }
    }

    // Apply magnetic micro-pull if over magnetic target
    if (this.activeMagneticEl && !this.prefersReducedMotion) {
      const rect = this.activeMagneticEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = this.mouse.x - centerX;
      const dy = this.mouse.y - centerY;

      // Max displacement 6px
      const pullFactor = 0.14;
      const pullX = Math.max(-6, Math.min(6, dx * pullFactor));
      const pullY = Math.max(-6, Math.min(6, dy * pullFactor));

      this.activeMagneticEl.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
    }
  }

  onPointerDown(e) {
    this.isClicking = true;
    this.container?.classList.add('cursor-clicked');

    if (this.ripple) {
      this.ripple.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0) scale(0.6)`;
      this.ripple.classList.remove('ripple-active');
      // Trigger reflow to restart animation cleanly
      void this.ripple.offsetWidth;
      this.ripple.classList.add('ripple-active');
    }
  }

  onPointerUp() {
    this.isClicking = false;
    this.container?.classList.remove('cursor-clicked');
  }

  onMouseLeave() {
    this.isIdle = true;
    this.container?.classList.add('cursor-idle');
    if (this.activeMagneticEl) {
      this.activeMagneticEl.style.transform = '';
      this.activeMagneticEl = null;
    }
  }

  onMouseEnter() {
    this.isIdle = false;
    this.container?.classList.remove('cursor-idle');
  }

  resetIdleTimer() {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.isIdle = true;
      this.container?.classList.add('cursor-idle');
    }, this.idleDelay);
  }

  setHover(hover) {
    if (this.isHovering === hover) return;
    this.isHovering = hover;
    if (hover) {
      this.container?.classList.add('cursor-hover');
    } else {
      this.container?.classList.remove('cursor-hover');
    }
  }

  setTextMode(textMode) {
    if (this.isTextMode === textMode) return;
    this.isTextMode = textMode;
    if (textMode) {
      this.container?.classList.add('cursor-text');
    } else {
      this.container?.classList.remove('cursor-text');
    }
  }

  tick() {
    if (!this.isFinePointer) return;

    // Lerp outer ring
    const ease = this.prefersReducedMotion ? 1.0 : 0.22;
    this.ring.x += (this.mouse.x - this.ring.x) * ease;
    this.ring.y += (this.mouse.y - this.ring.y) * ease;

    // Apply GPU transform on dot and ring
    if (this.dot) {
      this.dot.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0) translate(-50%, -50%)`;
    }

    if (this.ringEl) {
      this.ringEl.style.transform = `translate3d(${this.ring.x}px, ${this.ring.y}px, 0) translate(-50%, -50%)`;
    }

    // Render soft subtle motion trail on canvas
    if (this.ctx && !this.prefersReducedMotion && this.canvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);

      if (this.trailPoints.length > 1) {
        for (let i = 0; i < this.trailPoints.length; i++) {
          const pt = this.trailPoints[i];
          const progress = i / this.trailPoints.length; // 0 (oldest) to 1 (newest)
          pt.alpha *= 0.88; // fade out

          const radius = 1.5 + progress * 1.5;
          const alpha = progress * 0.25 * pt.alpha;

          if (alpha > 0.01) {
            this.ctx.beginPath();
            this.ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
            this.ctx.fill();
          }
        }
      }
    }

    this.animFrameId = requestAnimationFrame(this.tick);
  }
}

export const customCursor = new CustomCursor();
