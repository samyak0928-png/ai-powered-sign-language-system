/**
 * AI-Powered Forward Directional Sign Language System (AI-FSLS)
 * Glove Telemetry Simulation Engine
 * 
 * Provides smooth interpolation, realistic micro-noise, 5-finger flex modeling,
 * and 6-DOF IMU dynamics (Accelerometer & Gyroscope).
 * 
 * IMPORTANT: All telemetry is strictly simulated for prototype demonstration.
 */

export class GloveSimulationEngine {
  constructor() {
    // Current live sensor state
    this.state = {
      flex: {
        thumb: 20,
        index: 15,
        middle: 15,
        ring: 18,
        little: 20
      },
      imu: {
        accelX: 0.05,
        accelY: 0.12,
        accelZ: 9.81,
        pitch: 0.0,
        roll: 0.0,
        yaw: 0.0
      },
      batteryPercent: 88,
      samplingRateHz: 50,
      connectionStatus: 'SIMULATION ACTIVE',
      packetCount: 0
    };

    // Target values for smooth interpolation
    this.target = {
      flex: { ...this.state.flex },
      imu: { ...this.state.imu }
    };

    this.isNoisyMode = false;
    this.isRunning = false;
    this.subscribers = new Set();
    this.animationFrameId = null;
    this.lastTimestamp = performance.now();
    this.noisePhase = 0;

    // Handle tab visibility to save CPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.start();
      }
    });
  }

  /**
   * Subscribe to telemetry updates
   * @param {Function} callback - Called every animation tick with current state
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    // Initial emit
    callback(this.state);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Set target gesture signature for smooth interpolation
   * @param {Object} gesture - Gesture object from dataset
   */
  setTargetGesture(gesture) {
    this.isNoisyMode = false;
    if (gesture && gesture.simulatedFlex && gesture.simulatedImu) {
      this.target.flex = { ...gesture.simulatedFlex };
      this.target.imu = { ...gesture.simulatedImu };
    }
  }

  /**
   * Trigger ambiguous/noisy state for low-confidence demo
   */
  setNoisyMode(enable = true) {
    this.isNoisyMode = enable;
    if (enable) {
      this.target.flex = { thumb: 45, index: 52, middle: 40, ring: 48, little: 42 };
      this.target.imu = { accelX: 2.2, accelY: -3.1, accelZ: 7.8, pitch: 20, roll: 40, yaw: 65 };
    }
  }

  /**
   * Return to relaxed neutral hand state
   */
  resetToNeutral() {
    this.isNoisyMode = false;
    this.target.flex = { thumb: 18, index: 14, middle: 14, ring: 16, little: 18 };
    this.target.imu = { accelX: 0.02, accelY: 0.05, accelZ: 9.81, pitch: 0.0, roll: 0.0, yaw: 0.0 };
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.tick();
  }

  pause() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  tick() {
    if (!this.isRunning) return;

    const now = performance.now();
    const dt = Math.min((now - this.lastTimestamp) / 1000, 0.1); // Cap delta time
    this.lastTimestamp = now;

    this.noisePhase += dt * (this.isNoisyMode ? 12 : 2.5);
    const noiseFactor = this.isNoisyMode ? 3.5 : 0.8;

    // Linear interpolation rate
    const lerpRate = this.isNoisyMode ? 4.0 : 6.5;
    const alpha = Math.min(1, dt * lerpRate);

    // Interpolate flex values with subtle procedural sine noise
    for (const finger of ['thumb', 'index', 'middle', 'ring', 'little']) {
      const targetVal = this.target.flex[finger];
      const fingerOffset = finger === 'thumb' ? 0 : finger === 'index' ? 1.2 : finger === 'middle' ? 2.4 : finger === 'ring' ? 3.6 : 4.8;
      const noise = Math.sin(this.noisePhase + fingerOffset) * noiseFactor + (Math.sin(this.noisePhase * 2.3 + fingerOffset) * 0.4 * noiseFactor);
      
      this.state.flex[finger] += (targetVal - this.state.flex[finger]) * alpha;
      // Clamping between 0 and 100%
      const liveWithNoise = Math.max(0, Math.min(100, this.state.flex[finger] + noise));
      this.state.flex[finger] = Math.round(liveWithNoise * 10) / 10;
    }

    // Interpolate IMU values
    for (const key of ['accelX', 'accelY', 'accelZ', 'pitch', 'roll', 'yaw']) {
      const targetVal = this.target.imu[key];
      const noise = (Math.sin(this.noisePhase * 1.5 + (key.length * 0.7)) * 0.08 * noiseFactor);
      this.state.imu[key] += (targetVal - this.state.imu[key]) * alpha;
      this.state.imu[key] = Math.round((this.state.imu[key] + (key.startsWith('accel') ? noise * 0.5 : noise * 4.0)) * 100) / 100;
    }

    this.state.packetCount = (this.state.packetCount + 1) % 999999;

    // Broadcast to UI subscribers
    for (const callback of this.subscribers) {
      callback(this.state);
    }

    this.animationFrameId = requestAnimationFrame(() => this.tick());
  }
}

// Singleton simulation instance
export const gloveSim = new GloveSimulationEngine();
