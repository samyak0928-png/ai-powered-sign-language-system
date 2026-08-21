/**
 * AI-Powered Forward Directional Sign Language System (AI-FSLS)
 * UI Controller & Multi-Page Visualizer Bindings
 */

import { GESTURE_DATASET, SENTENCE_PRESETS } from './dataset.js';
import { gloveSim } from './glove-simulation.js';
import { speechEngine } from './speech-engine.js';
import { demoController } from './demo-controller.js';
import { sentenceBuilder } from './sentence-builder.js';

export class UIController {
  constructor() {
    this.activeTab = 'single'; // 'single' | 'sentence'
  }

  init() {
    this.bindNavigation();
    this.bindGloveTelemetry();
    this.bindDemoControls();
    this.bindSentenceBuilder();
    this.bindModals();
    this.bindArchitectureDiagram();
    this.bindSpeechWaveform();
    this.bindToast();

    // Start glove simulation if telemetry elements or SVG hand exist on page
    if (document.getElementById('svg-hand-container') || document.getElementById('gauge-bar-thumb')) {
      gloveSim.start();
    }
  }

  /* ================= NAVIGATION & ACTIVE PAGE HIGHLIGHT ================= */
  bindNavigation() {
    const navToggle = document.getElementById('mobile-nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    if (navToggle && mobileMenu) {
      navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
      });
    }

    // Set active link based on current pathname if not manually assigned
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const linkPath = href.split('#')[0].split('/').pop();
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
          link.classList.add('active');
        }
      }

      // Smooth scroll for hash links on the same page
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetEl = document.querySelector(href);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
              mobileMenu.classList.add('hidden');
              if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
            }
          }
        }
      });
    });

    // Hero buttons if present on page
    const heroDemoBtn = document.getElementById('hero-launch-demo-btn');
    if (heroDemoBtn) {
      heroDemoBtn.addEventListener('click', () => {
        const demoSec = document.getElementById('demo-section');
        if (demoSec) {
          demoSec.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = 'demo.html';
        }
      });
    }

    const heroWorksBtn = document.getElementById('hero-how-it-works-btn');
    if (heroWorksBtn) {
      heroWorksBtn.addEventListener('click', () => {
        const solSec = document.getElementById('solution-section');
        if (solSec) {
          solSec.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = 'technology.html';
        }
      });
    }
  }

  /* ================= GLOVE TELEMETRY VISUALIZATION ================= */
  bindGloveTelemetry() {
    const hasGloveElements = document.getElementById('svg-hand-container') || document.getElementById('gauge-bar-thumb');
    if (!hasGloveElements) return;

    // Subscribe to live simulated sensor engine
    gloveSim.subscribe((state) => {
      // Update 5 finger gauges in dashboard
      const fingers = ['thumb', 'index', 'middle', 'ring', 'little'];
      fingers.forEach(f => {
        const val = state.flex[f];
        const bar = document.getElementById(`gauge-bar-${f}`);
        const text = document.getElementById(`gauge-val-${f}`);
        if (bar) bar.style.width = `${val}%`;
        if (text) text.textContent = `${Math.round(val)}%`;

        // Update interactive SVG glove tracks if present
        const svgTrack = document.getElementById(`svg-flex-${f}`);
        if (svgTrack) {
          const hue = 190 + (val * 0.4);
          svgTrack.style.stroke = `hsl(${hue}, 90%, ${55 - val * 0.15}%)`;
          svgTrack.style.strokeWidth = `${3 + (val / 20)}px`;
        }
      });

      // Update IMU values
      const imuX = document.getElementById('imu-val-x');
      const imuY = document.getElementById('imu-val-y');
      const imuZ = document.getElementById('imu-val-z');
      const imuPitch = document.getElementById('imu-val-pitch');
      const imuRoll = document.getElementById('imu-val-roll');
      const imuYaw = document.getElementById('imu-val-yaw');
      const packetCountEl = document.getElementById('telemetry-packet-count');

      if (imuX) imuX.textContent = (state.imu.accelX >= 0 ? '+' : '') + state.imu.accelX.toFixed(2);
      if (imuY) imuY.textContent = (state.imu.accelY >= 0 ? '+' : '') + state.imu.accelY.toFixed(2);
      if (imuZ) imuZ.textContent = (state.imu.accelZ >= 0 ? '+' : '') + state.imu.accelZ.toFixed(2);
      if (imuPitch) imuPitch.textContent = state.imu.pitch.toFixed(1) + '°';
      if (imuRoll) imuRoll.textContent = state.imu.roll.toFixed(1) + '°';
      if (imuYaw) imuYaw.textContent = state.imu.yaw.toFixed(1) + '°';
      if (packetCountEl) packetCountEl.textContent = state.packetCount;

      // Update 3D orientation visual badge
      const hand3d = document.getElementById('svg-hand-container');
      if (hand3d) {
        hand3d.style.transform = `perspective(800px) rotateX(${state.imu.pitch * 0.3}deg) rotateY(${state.imu.roll * 0.4}deg)`;
      }
    });
  }

  /* ================= DEMO CONTROLS & PIPELINE ================= */
  bindDemoControls() {
    const chipsContainer = document.getElementById('gesture-chips-container');
    const gestureSelectDropdown = document.getElementById('demo-gesture-select');
    const startBtn = document.getElementById('btn-start-recognition');

    if (chipsContainer) {
      chipsContainer.innerHTML = '';
      GESTURE_DATASET.forEach(g => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'gesture-chip';
        chip.dataset.id = g.id;
        chip.innerHTML = `<span class="chip-cat">${g.category}</span><span class="chip-label">${g.label}</span>`;
        chip.addEventListener('click', () => {
          demoController.selectGestureById(g.id);
          this.highlightSelectedChip(g.id);
          if (gestureSelectDropdown) gestureSelectDropdown.value = g.id;
        });
        chipsContainer.appendChild(chip);
      });
      this.highlightSelectedChip('help');
    }

    if (gestureSelectDropdown) {
      gestureSelectDropdown.innerHTML = '';
      GESTURE_DATASET.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g.id;
        opt.textContent = `${g.label} (${g.category})`;
        gestureSelectDropdown.appendChild(opt);
      });

      gestureSelectDropdown.addEventListener('change', (e) => {
        demoController.selectGestureById(e.target.value);
        this.highlightSelectedChip(e.target.value);
      });
    }

    const resetBtn = document.getElementById('btn-reset-demo');
    const skipToggle = document.getElementById('toggle-skip-anim');
    const lowConfBtn = document.getElementById('btn-simulate-lowconf');
    const playSpeechBtn = document.getElementById('btn-play-speech');
    const copyTextBtn = document.getElementById('btn-copy-nlp-text');

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        demoController.startRecognition();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        demoController.resetDemo();
        this.highlightSelectedChip('help');
        if (gestureSelectDropdown) gestureSelectDropdown.value = 'help';
      });
    }

    if (skipToggle) {
      skipToggle.addEventListener('change', (e) => {
        demoController.setSkipAnimation(e.target.checked);
      });
    }

    if (lowConfBtn) {
      lowConfBtn.addEventListener('click', () => {
        demoController.selectGestureById('low_conf_test');
        this.clearActiveChips();
        demoController.startRecognition();
      });
    }

    if (playSpeechBtn) {
      playSpeechBtn.addEventListener('click', () => {
        demoController.playOutputSpeech();
      });
    }

    if (copyTextBtn) {
      copyTextBtn.addEventListener('click', () => {
        const text = document.getElementById('output-nlp-text')?.textContent;
        if (text && text !== '—') {
          navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied synthesized text to clipboard!');
          });
        }
      });
    }

    // Demo Mode Tabs (Single Gesture vs Multi-Sign Builder) if on unified demo
    const tabSingle = document.getElementById('tab-btn-single');
    const tabSentence = document.getElementById('tab-btn-sentence');
    const panelSingle = document.getElementById('demo-panel-single');
    const panelSentence = document.getElementById('demo-panel-sentence');

    if (tabSingle && tabSentence && panelSingle && panelSentence) {
      tabSingle.addEventListener('click', () => {
        this.activeTab = 'single';
        tabSingle.classList.add('active');
        tabSingle.setAttribute('aria-selected', 'true');
        tabSentence.classList.remove('active');
        tabSentence.setAttribute('aria-selected', 'false');
        panelSingle.classList.remove('hidden');
        panelSentence.classList.add('hidden');
      });

      tabSentence.addEventListener('click', () => {
        this.activeTab = 'sentence';
        tabSentence.classList.add('active');
        tabSentence.setAttribute('aria-selected', 'true');
        tabSingle.classList.remove('active');
        tabSingle.setAttribute('aria-selected', 'false');
        panelSentence.classList.remove('hidden');
        panelSingle.classList.add('hidden');
      });
    }

    // Demo Controller state subscription
    demoController.subscribe((state) => {
      const progressBar = document.getElementById('pipeline-progress-bar');
      const stepLabel = document.getElementById('pipeline-step-label');
      const stepDetail = document.getElementById('pipeline-step-detail');
      const recognizedSignEl = document.getElementById('output-recognized-sign');
      const nlpTextEl = document.getElementById('output-nlp-text');
      const confidenceBadge = document.getElementById('output-confidence-badge');
      const confidenceScoreEl = document.getElementById('output-confidence-score');
      const resultCard = document.getElementById('demo-result-card');
      const errorCard = document.getElementById('demo-lowconf-alert');

      if (progressBar) progressBar.style.width = `${state.progressPercent}%`;
      if (stepLabel) stepLabel.textContent = state.stepLabel;
      if (stepDetail) stepDetail.textContent = state.stepDetail;

      // Pipeline stage step nodes (1-4)
      for (let i = 1; i <= 4; i++) {
        const stepNode = document.getElementById(`pipe-step-${i}`);
        if (stepNode) {
          if (state.currentStep > i) {
            stepNode.className = 'pipe-step completed';
          } else if (state.currentStep === i) {
            stepNode.className = 'pipe-step active';
          } else {
            stepNode.className = 'pipe-step pending';
          }
        }
      }

      if (state.isComplete) {
        if (state.isErrorOrLowConf) {
          if (errorCard) errorCard.classList.remove('hidden');
          if (resultCard) resultCard.classList.add('border-amber');
          if (recognizedSignEl) recognizedSignEl.textContent = 'UNCERTAIN';
          if (nlpTextEl) nlpTextEl.textContent = 'Gesture uncertain — please repeat sign.';
          if (confidenceBadge) {
            confidenceBadge.className = 'badge badge-warning';
            confidenceBadge.textContent = 'Threshold Unmet (Simulated)';
          }
          if (confidenceScoreEl) confidenceScoreEl.textContent = '48%';
        } else {
          if (errorCard) errorCard.classList.add('hidden');
          if (resultCard) resultCard.classList.remove('border-amber');
          if (recognizedSignEl) recognizedSignEl.textContent = state.recognizedSign || '—';
          if (nlpTextEl) nlpTextEl.textContent = state.nlpSentence || '—';
          if (confidenceBadge) {
            confidenceBadge.className = 'badge badge-success';
            confidenceBadge.textContent = 'High Confidence (Simulated)';
          }
          if (confidenceScoreEl) confidenceScoreEl.textContent = `${state.confidenceScore}%`;
        }
      } else {
        if (errorCard) errorCard.classList.add('hidden');
        if (resultCard) resultCard.classList.remove('border-amber');
        if (recognizedSignEl) recognizedSignEl.textContent = state.recognizedSign || '—';
        if (nlpTextEl) nlpTextEl.textContent = state.nlpSentence || '—';
        if (confidenceBadge) {
          confidenceBadge.className = 'badge badge-neutral';
          confidenceBadge.textContent = 'Pending Input';
        }
        if (confidenceScoreEl) confidenceScoreEl.textContent = '—';
      }
    });
  }

  highlightSelectedChip(gestureId) {
    document.querySelectorAll('.gesture-chip').forEach(c => {
      if (c.dataset.id === gestureId) {
        c.classList.add('selected');
        c.setAttribute('aria-pressed', 'true');
      } else {
        c.classList.remove('selected');
        c.setAttribute('aria-pressed', 'false');
      }
    });
  }

  clearActiveChips() {
    document.querySelectorAll('.gesture-chip').forEach(c => {
      c.classList.remove('selected');
      c.setAttribute('aria-pressed', 'false');
    });
  }

  /* ================= MULTI-SIGN SENTENCE BUILDER ================= */
  bindSentenceBuilder() {
    const signsContainer = document.getElementById('sentence-signs-picker');
    const sequenceSlots = document.getElementById('sentence-sequence-slots');
    const presetsContainer = document.getElementById('sentence-presets-container');
    const clearBtn = document.getElementById('btn-clear-sentence');
    const playSentenceBtn = document.getElementById('btn-play-sentence-speech');
    const copySentenceBtn = document.getElementById('btn-copy-sentence-text');

    if (signsContainer) {
      signsContainer.innerHTML = '';
      GESTURE_DATASET.forEach(g => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sign-picker-btn';
        btn.innerHTML = `<span class="plus-icon">+</span> ${g.label}`;
        btn.addEventListener('click', () => {
          sentenceBuilder.addSign(g.label);
        });
        signsContainer.appendChild(btn);
      });
    }

    if (presetsContainer) {
      presetsContainer.innerHTML = '';
      SENTENCE_PRESETS.forEach((p, idx) => {
        const pBtn = document.createElement('button');
        pBtn.type = 'button';
        pBtn.className = 'preset-chip';
        pBtn.innerHTML = `<strong>${p.name}</strong> <span class="preset-sub">${p.signs.join(' → ')}</span>`;
        pBtn.addEventListener('click', () => {
          sentenceBuilder.loadPreset(idx);
        });
        presetsContainer.appendChild(pBtn);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        sentenceBuilder.clear();
      });
    }

    if (playSentenceBtn) {
      playSentenceBtn.addEventListener('click', () => {
        sentenceBuilder.playSpeech();
      });
    }

    if (copySentenceBtn) {
      copySentenceBtn.addEventListener('click', () => {
        const text = document.getElementById('sentence-synthesized-text')?.textContent;
        if (text && text.trim() !== '') {
          navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied synthesized sentence to clipboard!');
          });
        }
      });
    }

    sentenceBuilder.subscribe((state) => {
      const outputText = document.getElementById('sentence-synthesized-text');
      const sequenceEmptyNotice = document.getElementById('sentence-empty-notice');

      if (sequenceSlots) {
        sequenceSlots.innerHTML = '';
        if (state.sequence.length === 0) {
          if (sequenceEmptyNotice) sequenceEmptyNotice.classList.remove('hidden');
        } else {
          if (sequenceEmptyNotice) sequenceEmptyNotice.classList.add('hidden');
          state.sequence.forEach((sign, idx) => {
            const slot = document.createElement('div');
            slot.className = 'seq-token-badge';
            slot.innerHTML = `
              <span class="token-idx">${idx + 1}</span>
              <span class="token-name">${sign}</span>
              <button type="button" class="token-remove-btn" title="Remove ${sign}" aria-label="Remove sign ${sign}">×</button>
            `;
            slot.querySelector('.token-remove-btn').addEventListener('click', () => {
              sentenceBuilder.removeSign(idx);
            });
            sequenceSlots.appendChild(slot);
          });
        }
      }

      if (outputText) {
        outputText.textContent = state.synthesizedSentence || 'Select signs above to form a sentence.';
      }
    });
  }

  /* ================= SPEECH WAVEFORM CANVAS BINDING ================= */
  bindSpeechWaveform() {
    const singleCanvas = document.getElementById('speech-waveform-single');
    const sentenceCanvas = document.getElementById('speech-waveform-sentence');

    if (singleCanvas) {
      speechEngine.bindWaveformCanvas(singleCanvas);
    } else if (sentenceCanvas) {
      speechEngine.bindWaveformCanvas(sentenceCanvas);
    }

    speechEngine.subscribe((state) => {
      const liveIndicators = document.querySelectorAll('.speech-active-indicator');
      liveIndicators.forEach(el => {
        if (state.isSpeaking) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      });

      if (state.error) {
        this.showToast(`Speech Notice: ${state.error}`);
      }
    });
  }

  /* ================= ARCHITECTURE DIAGRAM INSPECTOR ================= */
  bindArchitectureDiagram() {
    const nodes = document.querySelectorAll('.arch-node');
    if (!nodes.length) return;

    const detailTitle = document.getElementById('arch-detail-title');
    const detailDesc = document.getElementById('arch-detail-desc');
    const detailBadge = document.getElementById('arch-detail-badge');

    const nodeInfo = {
      'node-user': {
        title: 'Layer 1: User Gesture (Sign Input)',
        badge: 'Physical Input',
        desc: 'The signer performs standard or calibrated sign language gestures. The forward directional system captures physical hand postures without requiring the signer to look at a screen or hold a phone.'
      },
      'node-glove': {
        title: 'Layer 2: Smart Glove Sensing (Wearable)',
        badge: 'Hardware Sensor Array',
        desc: 'Five embedded carbon-printed flex sensors measure individual finger flexion (0-100%), while a 6-DOF IMU tracks spatial 3D wrist acceleration, pitch, roll, and rotational velocity.'
      },
      'node-esp32': {
        title: 'Layer 3: Microcontroller & Signal Acquisition',
        badge: 'Edge Processing (ESP32)',
        desc: 'Onboard 32-bit MCU samples analog sensor voltages at 50Hz, performs hardware-level noise debouncing, and packages data into compact binary telemetry packets.'
      },
      'node-ble': {
        title: 'Layer 4: Bluetooth Low Energy (BLE)',
        badge: 'Wireless Protocol',
        desc: 'Streams low-latency telemetry packets to the companion smartphone or web host application over standard BLE GATT service profiles with minimal battery consumption.'
      },
      'node-preprocess': {
        title: 'Layer 5: Preprocessing & Baseline Normalization',
        badge: 'Signal Pipeline',
        desc: 'Applies digital Butterworth low-pass filtering, calibrates resting user hand dimensions, and normalizes resistance values against individualized calibration curves.'
      },
      'node-ml': {
        title: 'Layer 6: Machine Learning Gesture Classifier',
        badge: 'AI Recognition Engine',
        desc: 'Evaluates spatial-temporal feature vectors using trained classification models (e.g. Random Forest for static poses, LSTM / Temporal Convolutional Networks for dynamic signs).'
      },
      'node-nlp': {
        title: 'Layer 7: NLP Sentence Formation Layer',
        badge: 'Natural Language Processing',
        desc: 'Takes raw recognized sign glosses (e.g. [I], [WANT], [WATER]) and applies grammar transformation rules to produce fluent, natural spoken sentences ("I want water, please.").'
      },
      'node-output': {
        title: 'Layer 8: Text Display & Text-to-Speech (TTS)',
        badge: 'Audio/Visual Output',
        desc: 'Presents high-visibility legible text on the recipient screen and vocalizes the sentence through native speech synthesis engines for immediate acoustic comprehension.'
      }
    };

    nodes.forEach(node => {
      node.addEventListener('click', () => {
        nodes.forEach(n => n.classList.remove('selected'));
        node.classList.add('selected');
        const key = node.dataset.nodeKey;
        if (nodeInfo[key] && detailTitle && detailDesc && detailBadge) {
          detailTitle.textContent = nodeInfo[key].title;
          detailBadge.textContent = nodeInfo[key].badge;
          detailDesc.textContent = nodeInfo[key].desc;
        }
      });
    });
  }

  /* ================= MODALS & HONESTY DISCLOSURES ================= */
  bindModals() {
    const connectBtns = document.querySelectorAll('.btn-connect-hardware');
    const hwModal = document.getElementById('hardware-connect-modal');
    const hwModalClose = document.getElementById('hw-modal-close');
    const hwModalDismiss = document.getElementById('hw-modal-dismiss');

    connectBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (hwModal) {
          hwModal.classList.remove('hidden');
          hwModal.setAttribute('aria-hidden', 'false');
          document.body.classList.add('modal-open');
        }
      });
    });

    const closeHw = () => {
      if (hwModal) {
        hwModal.classList.add('hidden');
        hwModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
      }
    };

    if (hwModalClose) hwModalClose.addEventListener('click', closeHw);
    if (hwModalDismiss) hwModalDismiss.addEventListener('click', closeHw);
  }

  /* ================= TOAST NOTIFICATION SYSTEM ================= */
  bindToast() {
    this.toastEl = document.getElementById('app-toast');
    this.toastMessage = document.getElementById('toast-message');
    this.toastTimer = null;
  }

  showToast(message) {
    if (!this.toastEl || !this.toastMessage) return;
    if (this.toastTimer) clearTimeout(this.toastTimer);

    this.toastMessage.textContent = message;
    this.toastEl.classList.remove('hidden');
    this.toastEl.classList.add('show');

    this.toastTimer = setTimeout(() => {
      this.toastEl.classList.remove('show');
      setTimeout(() => this.toastEl.classList.add('hidden'), 300);
    }, 3000);
  }
}

export const uiController = new UIController();
