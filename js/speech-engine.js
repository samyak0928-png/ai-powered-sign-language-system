/**
 * AI-Powered Forward Directional Sign Language System (AI-FSLS)
 * Text-to-Speech Engine & Audio Waveform Visualizer
 * 
 * Uses Web Speech API (SpeechSynthesis) when supported with graceful fallbacks
 * and synchronized audio waveform rendering.
 */

export class SpeechEngine {
  constructor() {
    this.isSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.voices = [];
    this.selectedVoice = null;
    this.subscribers = new Set();
    this.waveformCanvas = null;
    this.waveformCtx = null;
    this.waveformAnimId = null;
    this.wavePhase = 0;

    if (this.isSupported) {
      this.initVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    try {
      this.voices = window.speechSynthesis.getVoices();
      // Select an English natural/clean sounding voice
      this.selectedVoice = this.voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('David'))) 
                        || this.voices.find(v => v.lang.startsWith('en')) 
                        || this.voices[0] 
                        || null;
    } catch (e) {
      console.warn('Voice initialization issue:', e);
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    callback({ isSpeaking: this.isSpeaking, isSupported: this.isSupported });
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(detail = {}) {
    for (const cb of this.subscribers) {
      cb({
        isSpeaking: this.isSpeaking,
        isSupported: this.isSupported,
        ...detail
      });
    }
  }

  /**
   * Speak a synthesized sentence
   * @param {string} text - Sentence text to vocalize
   * @returns {Promise<boolean>} Resolves when speech completes or rejects on failure
   */
  speak(text) {
    if (!text || text.trim() === '') {
      return Promise.reject(new Error('Empty text provided for speech synthesis.'));
    }

    if (!this.isSupported) {
      this.notifySubscribers({ error: 'Text-to-speech is unavailable in this browser.' });
      return Promise.resolve(false);
    }

    // Cancel any previous speech in flight
    this.stop();

    return new Promise((resolve) => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95; // Clear, deliberate cadence for accessibility
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        if (this.selectedVoice) {
          utterance.voice = this.selectedVoice;
        }

        utterance.onstart = () => {
          this.isSpeaking = true;
          this.currentUtterance = utterance;
          this.startWaveformAnimation();
          this.notifySubscribers({ text, status: 'speaking' });
        };

        utterance.onend = () => {
          this.isSpeaking = false;
          this.currentUtterance = null;
          this.stopWaveformAnimation();
          this.notifySubscribers({ text, status: 'idle' });
          resolve(true);
        };

        utterance.onerror = (e) => {
          console.warn('Speech synthesis event notice:', e);
          this.isSpeaking = false;
          this.currentUtterance = null;
          this.stopWaveformAnimation();
          this.notifySubscribers({ text, status: 'idle', error: e.error });
          resolve(false);
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis execution error:', err);
        this.isSpeaking = false;
        this.stopWaveformAnimation();
        this.notifySubscribers({ text, status: 'idle', error: err.message });
        resolve(false);
      }
    });
  }

  stop() {
    if (this.isSupported) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.stopWaveformAnimation();
    this.notifySubscribers({ status: 'idle' });
  }

  /**
   * Bind canvas element for rendering the animated audio waveform
   * @param {HTMLCanvasElement} canvas 
   */
  bindWaveformCanvas(canvas) {
    this.waveformCanvas = canvas;
    if (canvas) {
      this.waveformCtx = canvas.getContext('2d');
      this.drawIdleWaveform();
    }
  }

  startWaveformAnimation() {
    if (!this.waveformCanvas || !this.waveformCtx) return;
    if (this.waveformAnimId) cancelAnimationFrame(this.waveformAnimId);

    const render = () => {
      if (!this.isSpeaking) {
        this.drawIdleWaveform();
        return;
      }

      this.wavePhase += 0.12;
      const ctx = this.waveformCtx;
      const w = this.waveformCanvas.width;
      const h = this.waveformCanvas.height;

      ctx.clearRect(0, 0, w, h);

      // Draw dynamic multi-layered waveform
      const barCount = 32;
      const barWidth = Math.max(2, (w / barCount) - 3);
      const centerY = h / 2;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 3) + 4;
        const normalizedX = i / barCount;
        
        // Multi-frequency wave formula
        const amplitude = Math.sin(this.wavePhase + normalizedX * Math.PI * 3) 
                        * Math.cos(this.wavePhase * 0.7 + normalizedX * Math.PI)
                        * 0.7 + 0.3;
        
        const barHeight = Math.max(4, Math.abs(amplitude) * (h * 0.75));
        const y = centerY - barHeight / 2;

        // Gradient styling
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#06B6D4'); // Electric cyan
        grad.addColorStop(0.5, '#3B82F6'); // Cobalt blue
        grad.addColorStop(1, '#60A5FA');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, 2) : ctx.fillRect(x, y, barWidth, barHeight);
        ctx.fill();
      }

      this.waveformAnimId = requestAnimationFrame(render);
    };

    render();
  }

  stopWaveformAnimation() {
    if (this.waveformAnimId) {
      cancelAnimationFrame(this.waveformAnimId);
      this.waveformAnimId = null;
    }
    this.drawIdleWaveform();
  }

  drawIdleWaveform() {
    if (!this.waveformCanvas || !this.waveformCtx) return;
    const ctx = this.waveformCtx;
    const w = this.waveformCanvas.width;
    const h = this.waveformCanvas.height;

    ctx.clearRect(0, 0, w, h);
    const barCount = 32;
    const barWidth = Math.max(2, (w / barCount) - 3);
    const centerY = h / 2;

    ctx.fillStyle = 'rgba(148, 163, 184, 0.25)'; // Muted slate

    for (let i = 0; i < barCount; i++) {
      const x = i * (barWidth + 3) + 4;
      const barHeight = 4;
      const y = centerY - barHeight / 2;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, 2) : ctx.fillRect(x, y, barWidth, barHeight);
      ctx.fill();
    }
  }
}

export const speechEngine = new SpeechEngine();
