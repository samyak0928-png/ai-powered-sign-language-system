/**
 * AI-Powered Forward Directional Sign Language System (AI-FSLS)
 * Presentation Mode Controller
 * 
 * Provides a streamlined, pitch-ready 6-slide deck with full keyboard navigation
 * (ArrowRight, ArrowLeft, Space, Escape) and on-screen controls.
 */

export class PresentationModeController {
  constructor() {
    this.isActive = false;
    this.currentSlideIndex = 0;
    this.totalSlides = 6;
    this.container = null;
    this.boundKeyHandler = this.handleKeyDown.bind(this);
  }

  init() {
    this.container = document.getElementById('presentation-modal');
    if (!this.container) return;

    const nextBtn = document.getElementById('pres-next-btn');
    const prevBtn = document.getElementById('pres-prev-btn');
    const exitBtn = document.getElementById('pres-exit-btn');
    const openPresBtn = document.getElementById('btn-presentation-mode');
    const openPresHeroBtn = document.getElementById('btn-hero-presentation');

    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    if (exitBtn) exitBtn.addEventListener('click', () => this.exit());
    if (openPresBtn) openPresBtn.addEventListener('click', () => this.enter());
    if (openPresHeroBtn) openPresHeroBtn.addEventListener('click', () => this.enter());

    // Connect indicator dots if present
    const dots = document.querySelectorAll('.pres-dot');
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => this.goToSlide(idx));
    });

    // If on presentation.html directly (where modal is open by default or standalone page)
    if (!this.container.classList.contains('hidden')) {
      this.isActive = true;
      window.addEventListener('keydown', this.boundKeyHandler);
      this.renderSlide();
    }
  }

  enter(initialSlide = 0) {
    this.isActive = true;
    this.currentSlideIndex = initialSlide;
    if (this.container) {
      this.container.classList.remove('hidden');
      this.container.setAttribute('aria-hidden', 'false');
      document.body.classList.add('presentation-active');
    }
    window.addEventListener('keydown', this.boundKeyHandler);
    this.renderSlide();
  }

  exit() {
    // If on presentation.html, exit can navigate to index.html or close fullscreen
    if (window.location.pathname.endsWith('presentation.html')) {
      window.location.href = 'index.html';
      return;
    }

    this.isActive = false;
    if (this.container) {
      this.container.classList.add('hidden');
      this.container.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('presentation-active');
    }
    window.removeEventListener('keydown', this.boundKeyHandler);
  }

  nextSlide() {
    if (this.currentSlideIndex < this.totalSlides - 1) {
      this.currentSlideIndex++;
      this.renderSlide();
    }
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.renderSlide();
    }
  }

  goToSlide(index) {
    if (index >= 0 && index < this.totalSlides) {
      this.currentSlideIndex = index;
      this.renderSlide();
    }
  }

  handleKeyDown(e) {
    if (!this.isActive) return;

    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      this.nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      this.prevSlide();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.exit();
    }
  }

  renderSlide() {
    const slides = document.querySelectorAll('.pres-slide');
    const dots = document.querySelectorAll('.pres-dot');
    const counter = document.getElementById('pres-slide-counter');
    const prevBtn = document.getElementById('pres-prev-btn');
    const nextBtn = document.getElementById('pres-next-btn');

    slides.forEach((slide, idx) => {
      if (idx === this.currentSlideIndex) {
        slide.classList.add('active');
        slide.removeAttribute('hidden');
      } else {
        slide.classList.remove('active');
        slide.setAttribute('hidden', 'true');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === this.currentSlideIndex) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
      }
    });

    if (counter) {
      counter.textContent = `${this.currentSlideIndex + 1} / ${this.totalSlides}`;
    }

    if (prevBtn) {
      prevBtn.disabled = this.currentSlideIndex === 0;
    }

    if (nextBtn) {
      nextBtn.textContent = this.currentSlideIndex === this.totalSlides - 1 ? 'Finish' : 'Next →';
    }
  }
}

export const presentationMode = new PresentationModeController();
