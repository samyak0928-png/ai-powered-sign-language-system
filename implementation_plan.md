# Implementation Plan: AI-FSLS Multi-Page Migration

## 1. Current Architecture & Existing Functionality

The current **AI-Powered Forward Directional Sign Language System (AI-FSLS)** is a single-page static web application (`index.html`) using Vanilla ES6 JavaScript modules and custom CSS.

### Current Features & Components:
1. **Interactive SVG Smart Glove Visualizer**:
   - 5 animated flex sensor tracks (Thumb, Index, Middle, Ring, Little) with real-time bend levels.
   - 6-DOF IMU sensor chip (MPU-6050 simulation) tracking acceleration (X, Y, Z) and gyro (Pitch, Roll, Yaw).
   - ESP32 microcontroller representation and pulsing BLE radio waves.
2. **Continuous Sensor Telemetry Engine (`glove-simulation.js`)**:
   - 50Hz procedural simulation with smooth exponential interpolation (lerp) and natural micro-noise.
3. **AI Recognition Controller (`demo-controller.js` & `dataset.js`)**:
   - 14-sign dataset (*Hello, Yes, No, Help, Water, Food, Thank You, Please, I, You, Need, Want, Doctor, Stop*).
   - 5-stage simulated pipeline: Telemetry Stream → Filtering → Feature Extraction → Classifier Inference → Output.
   - Low-confidence safety fallback testbed (*"Ambiguous Gesture"*).
   - Fast evaluation toggle (*"Skip Animation"*).
4. **Multi-Sign Sentence Builder & NLP Synthesizer (`sentence-builder.js`)**:
   - Interactive sign sequence assembler (e.g., `[I] + [WANT] + [WATER]`).
   - NLP grammar transformation (`"I want water, please."`).
   - Pre-configured emergency and daily communication scenarios.
5. **Speech Engine (`speech-engine.js`)**:
   - Native Web Speech API (`window.speechSynthesis`) integration with voice selection.
   - Synchronized dynamic Canvas audio waveform visualizer.
6. **Presentation & Judge Modes (`presentation-mode.js` & `judge-mode.js`)**:
   - 6-slide full-screen pitch deck with keyboard controls (`←`, `→`, `Space`, `Esc`).
   - 60-second fast-track Judge evaluation panel with 1-click test triggers.
7. **Deep-Tech Custom Cursor (`custom-cursor.js` & `custom-cursor.css`)**:
   - Dual-layer dot + lerped glow ring with GPU transforms, motion trail canvas, magnetic attraction on CTAs, click ripple, text mode, idle auto-fade, and accessibility safeguards.
8. **Deep-Tech Storytelling & Documentation**:
   - 7 problem domain cards, 8-layer interactive architecture inspector, hardware breakdown, static vs. dynamic ML analysis, 3-step personalization (`CALIBRATE` → `NORMALIZE` → `PERSONALIZE`), Camera vs. Glove comparison matrix, and 8-phase future roadmap.

---

## 2. Multi-Page Architecture & Page Breakdown

We will migrate the single-page application into 7 dedicated, focused HTML pages:

| Page | File | Primary Purpose | Key Content & Interactive Modules |
|---|---|---|---|
| **1. Home** | `index.html` | "Why does this project exist?" (Human Story) | Hero with value proposition, human communication barrier, interactive forward-directional solution overview, key feature cards, prototype status statement, CTA to full demo. |
| **2. Smart Glove** | `glove.html` | "How does the system capture a sign?" (Hardware & Sensing) | Full-size interactive SVG Smart Glove visualizer, 5-finger flex gauges, 6-DOF IMU accelerometer & gyro telemetry, sensor fusion explanation, hardware anatomy cards, Web Bluetooth modal. |
| **3. Sign Recognition** | `recognition.html` | "How does the system recognize a sign?" (AI & Intelligence) | Gesture selector (14 signs), 5-stage animated inference pipeline, recognized sign output, simulated confidence rating, ambiguous low-confidence testbed, computational logic, static vs dynamic models. |
| **4. Communication** | `communication.html` | "How does a recognized sign become communication?" (Output & Voice) | Interactive Multi-Sign Sentence Builder, sign palette chips, active sequence tokens, NLP grammatical synthesis, Web Speech API playback with live audio waveform canvas, quick scenario presets. |
| **5. AI & Technology** | `technology.html` | "What's happening technically behind the interface?" (Deep-Tech Architecture) | 8-layer interactive architecture inspector, signal processing & Butterworth filtering, dataset collection strategy, 3-step personalization flow, Camera vs Glove comparison matrix, future sensor fusion. |
| **6. Full Demo** | `demo.html` | "Show me the entire system" (End-to-End Experience) | Complete unified workflow: Live SVG glove + Telemetry dashboard + Single sign recognition + Multi-sign sentence builder + Speech output + Direct links to deep-dive pages. |
| **7. Presentation** | `presentation.html` | "Can I present this to judges?" (Pitch & Evaluation) | Embedded pitch-ready 6-slide presentation deck with keyboard controls (`←`/`→`/`Esc`), slide counter, navigation dots, and dedicated Judge Fast-Track panel with 1-click test triggers. |

---

## 3. Shared Components & Design System

1. **Global Sticky Header**:
   - Logo: `AI-FSLS` linking to `index.html`.
   - Links: `Home`, `Smart Glove`, `Recognition`, `Communication`, `AI & Technology`, `Full Demo`, `Presentation`.
   - Visual active state highlighting the current page.
   - Quick CTAs: `⚖️ Judge Mode`, `📽️ Pitch Slides`, `Launch Demo →`.
   - Accessible mobile hamburger drawer with active state.
2. **Global Footer**:
   - Brand mark & tagline (*"Different language. Same message."*).
   - Navigation links to all 7 pages.
   - Links to GitHub repository & Live Demo.
   - Transparent prototype truthfulness disclaimer.
3. **Deep-Tech Custom Cursor**:
   - Loaded and active on all 7 pages.
   - Disabled on touch/mobile devices via `@media (pointer: fine)`.
   - Respects `prefers-reduced-motion`.
4. **CSS Architecture**:
   - `css/main.css`: Core design tokens, typography, navbar, footer, buttons, utilities.
   - `css/components.css`: Cards, feature grids, roadmap, comparison matrix, modals.
   - `css/glove-visualizer.css`: SVG glove styling, sensor heatmaps, 3D gyro tilt.
   - `css/demo.css`: Telemetry gauges, pipeline stage tracker, sentence builder, waveform canvas.
   - `css/presentation.css`: Presentation slide deck, judge modal layout.
   - `css/custom-cursor.css`: Custom cursor styles, states, and ripple animations.

---

## 4. JavaScript Architecture & State Management

### Modular Separation:
- **`js/dataset.js`**: Core 14-sign vocabulary, sensor patterns, sentence presets, low-conf demo data.
- **`js/glove-simulation.js`**: 50Hz telemetry simulation engine with realistic noise & interpolation.
- **`js/speech-engine.js`**: Web Speech API wrapper, audio waveform visualizer.
- **`js/demo-controller.js`**: Single sign recognition pipeline sequencer.
- **`js/sentence-builder.js`**: Multi-sign sequential assembler & NLP simulator.
- **`js/presentation-mode.js`**: Slide deck controller with keyboard navigation.
- **`js/judge-mode.js`**: Fast-track judge modal & test triggers.
- **`js/custom-cursor.js`**: Custom cursor engine.
- **`js/ui.js` & `js/app.js`**: Page-aware bootstrap.

### Safe DOM Element Handling:
We will ensure `ui.js` and all controllers check for the presence of DOM elements (`if (!el) return;`) so that initializing on any page will execute smoothly without throwing null reference exceptions.

### Lightweight Shared State (`localStorage`):
When a user selects a sign or builds a sentence in one page (e.g. `recognition.html` or `communication.html`), we will optionally sync the active state to `localStorage` (`aifsls_active_gesture`, `aifsls_active_sequence`) so navigating across pages preserves context smoothly while remaining a 100% static frontend application.

---

## 5. Migration & Execution Steps

1. **Step 1**: Update `ui.js` to be fully element-safe across multi-page environments.
2. **Step 2**: Create `glove.html` (Smart Glove dedicated page).
3. **Step 3**: Create `recognition.html` (Sign Recognition dedicated page).
4. **Step 4**: Create `communication.html` (Communication & Speech dedicated page).
5. **Step 5**: Create `technology.html` (AI & Technology dedicated page).
6. **Step 6**: Create `demo.html` (Full unified End-to-End Demo page).
7. **Step 7**: Create `presentation.html` (Presentation & Judge Mode page).
8. **Step 8**: Streamline `index.html` into a focused, human-centered Home page with links to all sub-pages.
9. **Step 9**: Update `README.md` to reflect the multi-page structure.
10. **Step 10**: Verify every route, button, simulation, speech playback, custom cursor, and keyboard shortcut locally on `http://localhost:8080/`.
