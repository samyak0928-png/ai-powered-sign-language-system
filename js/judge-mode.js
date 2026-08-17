/**
 * AI-Powered Forward Directional Sign Language System (AI-FSLS)
 * Judge Mode Controller
 * 
 * Provides an accelerated, high-density assessment view for Ideathon & Hackathon judges
 * to evaluate problem statement, architecture, prototype honesty, and interactive demo in under 60 seconds.
 */

import { demoController } from './demo-controller.js';
import { sentenceBuilder } from './sentence-builder.js';

export class JudgeModeController {
  constructor() {
    this.isActive = false;
    this.modal = null;
  }

  init() {
    this.modal = document.getElementById('judge-modal');
    const openBtn = document.getElementById('btn-judge-mode');
    const closeBtn = document.getElementById('judge-modal-close');
    const dismissBtn = document.getElementById('judge-dismiss-btn');

    if (openBtn) openBtn.addEventListener('click', () => this.open());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (dismissBtn) dismissBtn.addEventListener('click', () => this.close());

    // Setup 1-click evaluation shortcuts
    const triggerEmergency = document.getElementById('judge-trigger-emergency');
    const triggerWater = document.getElementById('judge-trigger-water');
    const triggerLowConf = document.getElementById('judge-trigger-lowconf');
    const triggerDemoScroll = document.getElementById('judge-trigger-livedemo');

    if (triggerEmergency) {
      triggerEmergency.addEventListener('click', () => {
        this.close();
        document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
        demoController.selectGestureById('help');
        setTimeout(() => demoController.startRecognition(), 400);
      });
    }

    if (triggerWater) {
      triggerWater.addEventListener('click', () => {
        this.close();
        document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
        demoController.selectGestureById('water');
        setTimeout(() => demoController.startRecognition(), 400);
      });
    }

    if (triggerLowConf) {
      triggerLowConf.addEventListener('click', () => {
        this.close();
        document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
        demoController.selectGestureById('low_conf_test');
        setTimeout(() => demoController.startRecognition(), 400);
      });
    }

    if (triggerDemoScroll) {
      triggerDemoScroll.addEventListener('click', () => {
        this.close();
        document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  open() {
    this.isActive = true;
    if (this.modal) {
      this.modal.classList.remove('hidden');
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    }
  }

  close() {
    this.isActive = false;
    if (this.modal) {
      this.modal.classList.add('hidden');
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }
  }
}

export const judgeMode = new JudgeModeController();
