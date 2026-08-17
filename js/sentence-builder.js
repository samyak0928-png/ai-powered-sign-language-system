/**
 * AI-Powered Forward Directional Sign Language System (AI-FSLS)
 * Multi-Sign Sentence Builder & Simulated NLP Synthesis Engine
 * 
 * Allows assembling sequences of recognized signs and demonstrating how
 * an NLP layer synthesizes grammatically fluent sentences with Text-to-Speech.
 */

import { GESTURE_DATASET, SENTENCE_PRESETS } from './dataset.js';
import { speechEngine } from './speech-engine.js';

export class SentenceBuilder {
  constructor() {
    this.sequence = ['I', 'WANT', 'WATER']; // Default starter sequence
    this.synthesizedSentence = 'I want water, please.';
    this.subscribers = new Set();
    this.isSynthesizing = false;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    this.notify();
    return () => this.subscribers.delete(callback);
  }

  notify() {
    for (const cb of this.subscribers) {
      cb({
        sequence: [...this.sequence],
        synthesizedSentence: this.synthesizedSentence,
        isSynthesizing: this.isSynthesizing,
        isEmpty: this.sequence.length === 0,
        presets: SENTENCE_PRESETS
      });
    }
  }

  addSign(signLabel) {
    if (this.sequence.length >= 6) return; // Cap length for clarity
    this.sequence.push(signLabel.toUpperCase());
    this.synthesize();
  }

  removeSign(index) {
    if (index >= 0 && index < this.sequence.length) {
      this.sequence.splice(index, 1);
      this.synthesize();
    }
  }

  clear() {
    this.sequence = [];
    this.synthesizedSentence = '';
    this.notify();
  }

  loadPreset(presetIndex) {
    const preset = SENTENCE_PRESETS[presetIndex];
    if (preset) {
      this.sequence = [...preset.signs];
      this.synthesizedSentence = preset.synthesizedSentence;
      this.notify();
    }
  }

  /**
   * Simulated NLP Synthesis logic:
   * Maps raw sign gloss sequences into natural spoken sentences.
   */
  synthesize() {
    if (this.sequence.length === 0) {
      this.synthesizedSentence = '';
      this.notify();
      return;
    }

    this.isSynthesizing = true;
    this.notify();

    // Check if matches known combinations
    const seqStr = this.sequence.join(' ');

    const knownMap = {
      'I WANT WATER': 'I want water, please.',
      'I NEED HELP': 'I need help, please assist me.',
      'I NEED DOCTOR': 'I need a doctor immediately.',
      'PLEASE HELP I': 'Please help me, I need assistance.',
      'PLEASE HELP': 'Please help me.',
      'THANK YOU YOU HELP': 'Thank you for your help.',
      'THANK YOU HELP': 'Thank you for your help.',
      'THANK YOU YOU': 'Thank you very much.',
      'STOP PLEASE HELP': 'Please stop, I need help.',
      'HELLO DOCTOR': 'Hello doctor, thank you for seeing me.',
      'HELLO YOU': 'Hello there, nice to meet you.',
      'YES I NEED': 'Yes, I definitely need that.',
      'NO I WANT': 'No, that is not what I want.'
    };

    let result = '';

    if (knownMap[seqStr]) {
      result = knownMap[seqStr];
    } else {
      // General heuristic formatting
      const words = this.sequence.map(w => w.toLowerCase());
      if (words.length === 1) {
        result = `${words[0].charAt(0).toUpperCase() + words[0].slice(1)}.`;
      } else {
        result = words.join(' ');
        result = result.charAt(0).toUpperCase() + result.slice(1) + '.';
      }
    }

    setTimeout(() => {
      this.synthesizedSentence = result;
      this.isSynthesizing = false;
      this.notify();
    }, 200);
  }

  playSpeech() {
    if (this.synthesizedSentence && this.synthesizedSentence.trim() !== '') {
      speechEngine.speak(this.synthesizedSentence);
    }
  }
}

export const sentenceBuilder = new SentenceBuilder();
