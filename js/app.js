/**
 * AI-Powered Forward Directional Sign Language System (AI-FSLS)
 * Main Application Bootstrap
 */

import { uiController } from './ui.js';
import { presentationMode } from './presentation-mode.js';
import { judgeMode } from './judge-mode.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize UI and interactions
    uiController.init();
    presentationMode.init();
    judgeMode.init();

    console.log('AI-FSLS Prototype initialized successfully in Simulation Mode.');
  } catch (error) {
    console.error('Initialization error in AI-FSLS application:', error);
  }
});
