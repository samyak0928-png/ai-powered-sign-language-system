/**
 * AI-Powered Forward Directional Sign Language System (AI-FSLS)
 * Interactive AI Recognition Controller
 * 
 * Manages the multi-stage recognition pipeline, timing sequence,
 * confidence evaluation, sentence formation, and simulated AI inference states.
 */

import { GESTURE_DATASET, LOW_CONFIDENCE_DEMO } from './dataset.js';
import { gloveSim } from './glove-simulation.js';
import { speechEngine } from './speech-engine.js';

export class DemoController {
  constructor() {
    this.selectedGesture = GESTURE_DATASET.find(g => g.id === 'help') || GESTURE_DATASET[0];
    this.isLowConfidenceMode = false;
    this.isSkipAnimation = false;
    this.currentStep = 0; // 0: Idle, 1: Sensor Stream, 2: Preprocess, 3: Feature Extraction, 4: ML Inference, 5: Complete
    this.isProcessing = false;
    this.activeTimeouts = [];
    this.subscribers = new Set();

    this.state = {
      selectedGesture: this.selectedGesture,
      isLowConfidenceMode: false,
      isSkipAnimation: false,
      currentStep: 0,
      stepLabel: 'Ready for Gesture Input',
      stepDetail: 'Select a gesture to initiate the simulated recognition pipeline.',
      progressPercent: 0,
      recognizedSign: null,
      nlpSentence: null,
      confidenceText: null,
      confidenceScore: 0,
      isComplete: false,
      isErrorOrLowConf: false,
      statusMessage: 'Ready'
    };
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    callback(this.state);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    for (const cb of this.subscribers) {
      cb(this.state);
    }
  }

  setSkipAnimation(skip) {
    this.isSkipAnimation = Boolean(skip);
    this.state.isSkipAnimation = this.isSkipAnimation;
    this.notify();
  }

  selectGestureById(gestureId) {
    if (this.isProcessing) this.cancelActiveSequence();

    if (gestureId === 'low_conf_test') {
      this.isLowConfidenceMode = true;
      this.selectedGesture = null;
      gloveSim.setNoisyMode(true);
      this.state.isLowConfidenceMode = true;
      this.state.selectedGesture = { label: 'Ambiguous Motion Pattern' };
    } else {
      this.isLowConfidenceMode = false;
      this.selectedGesture = GESTURE_DATASET.find(g => g.id === gestureId) || GESTURE_DATASET[0];
      gloveSim.setTargetGesture(this.selectedGesture);
      this.state.isLowConfidenceMode = false;
      this.state.selectedGesture = this.selectedGesture;
    }

    // Reset previous outputs on selection change
    this.state.currentStep = 0;
    this.state.stepLabel = `Gesture Selected: ${this.isLowConfidenceMode ? 'Ambiguous' : this.selectedGesture.label}`;
    this.state.stepDetail = 'Click "Start Recognition" to run the simulated AI pipeline.';
    this.state.progressPercent = 0;
    this.state.recognizedSign = null;
    this.state.nlpSentence = null;
    this.state.confidenceText = null;
    this.state.confidenceScore = 0;
    this.state.isComplete = false;
    this.state.isErrorOrLowConf = false;

    this.notify();
  }

  startRecognition() {
    if (this.isProcessing) return;
    this.cancelActiveSequence();

    this.isProcessing = true;
    const isFast = this.isSkipAnimation;

    if (isFast) {
      this.executeInstantRecognition();
      return;
    }

    // 5-Stage Sequence
    const stages = [
      {
        step: 1,
        duration: 700,
        label: 'Receiving Sensor Data...',
        detail: 'Acquiring 50Hz flex resistance & 6-DOF IMU streams from glove.',
        progress: 25
      },
      {
        step: 2,
        duration: 700,
        label: 'Preprocessing & Filtering...',
        detail: 'Applying low-pass filtering and baseline user calibration offsets.',
        progress: 50
      },
      {
        step: 3,
        duration: 700,
        label: 'Extracting Spatial Features...',
        detail: 'Computing joint angular velocities, finger curl ratios, and gyro trajectories.',
        progress: 75
      },
      {
        step: 4,
        duration: 700,
        label: 'Running Gesture Classifier...',
        detail: 'Evaluating spatial-temporal features against trained sign models.',
        progress: 90
      }
    ];

    let cumulativeTime = 0;

    stages.forEach((stage, index) => {
      const timeoutId = setTimeout(() => {
        this.state.currentStep = stage.step;
        this.state.stepLabel = stage.label;
        this.state.stepDetail = stage.detail;
        this.state.progressPercent = stage.progress;
        this.notify();
      }, cumulativeTime);

      this.activeTimeouts.push(timeoutId);
      cumulativeTime += stage.duration;
    });

    // Final Recognition Step
    const finalTimeoutId = setTimeout(() => {
      this.finalizeRecognition();
    }, cumulativeTime);

    this.activeTimeouts.push(finalTimeoutId);
  }

  executeInstantRecognition() {
    this.finalizeRecognition();
  }

  finalizeRecognition() {
    this.isProcessing = false;
    this.state.currentStep = 5;
    this.state.progressPercent = 100;
    this.state.isComplete = true;

    if (this.isLowConfidenceMode) {
      this.state.isErrorOrLowConf = true;
      this.state.stepLabel = 'Gesture Uncertain (Low Confidence)';
      this.state.stepDetail = 'AI confidence (48% simulated) falls below safe speech threshold (80%). Safe fallback triggered.';
      this.state.recognizedSign = 'UNCERTAIN';
      this.state.nlpSentence = 'Gesture uncertain — please repeat the sign.';
      this.state.confidenceText = 'Low Confidence (Simulated Demo State)';
      this.state.confidenceScore = 48;
    } else {
      const g = this.selectedGesture;
      this.state.isErrorOrLowConf = false;
      this.state.stepLabel = `Recognized: ${g.recognizedSign}`;
      this.state.stepDetail = `Successfully identified sign pattern with ${g.confidenceScore}% simulated confidence.`;
      this.state.recognizedSign = g.recognizedSign;
      this.state.nlpSentence = g.nlpSentence;
      this.state.confidenceText = `${g.confidenceTier} (${g.confidenceScore}% simulated)`;
      this.state.confidenceScore = g.confidenceScore;
    }

    this.notify();
  }

  playOutputSpeech() {
    if (this.state.nlpSentence) {
      speechEngine.speak(this.state.nlpSentence);
    }
  }

  resetDemo() {
    this.cancelActiveSequence();
    speechEngine.stop();
    gloveSim.resetToNeutral();

    this.selectedGesture = GESTURE_DATASET.find(g => g.id === 'help') || GESTURE_DATASET[0];
    this.isLowConfidenceMode = false;
    this.isProcessing = false;

    this.state = {
      selectedGesture: this.selectedGesture,
      isLowConfidenceMode: false,
      isSkipAnimation: this.isSkipAnimation,
      currentStep: 0,
      stepLabel: 'Ready for Gesture Input',
      stepDetail: 'Select a gesture to initiate the simulated recognition pipeline.',
      progressPercent: 0,
      recognizedSign: null,
      nlpSentence: null,
      confidenceText: null,
      confidenceScore: 0,
      isComplete: false,
      isErrorOrLowConf: false,
      statusMessage: 'Reset to neutral'
    };

    this.notify();
  }

  cancelActiveSequence() {
    for (const t of this.activeTimeouts) {
      clearTimeout(t);
    }
    this.activeTimeouts = [];
    this.isProcessing = false;
  }
}

export const demoController = new DemoController();
