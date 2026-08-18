/**
 * AI-Powered Forward Directional Sign Language System (AI-FSLS)
 * Main Application Bootstrap
 */

import { uiController } from './ui.js';
import { presentationMode } from './presentation-mode.js';
import { judgeMode } from './judge-mode.js';
import { customCursor } from './custom-cursor.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize UI and interactions
    uiController.init();
    presentationMode.init();
    judgeMode.init();
    customCursor.init();

    console.log('AI-FSLS Prototype initialized successfully with Deep-Tech Custom Cursor.');
  } catch (error) {
    console.error('Initialization error in AI-FSLS application:', error);
  }
});
