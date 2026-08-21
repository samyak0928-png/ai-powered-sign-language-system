<div align="center">

# 🤟 AI-FSLS
### Turning Signs Into Words — And Words Into a Voice.
**AI-Powered Forward Directional Sign Language System**

<br>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Website-111827?style=for-the-badge)](https://ai-powered-sign-language-system.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/samyak0928-png/ai-powered-sign-language-system)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](#-license)

<br>

> **"What if saying 'I need help' didn't require the person standing in front of you to know sign language?"**

</div>

---

## 🌟 Multi-Page Experience Architecture

The AI-FSLS web application is structured across 7 focused, interconnected pages:

| Page | Path | Focus Area |
|---|---|---|
| **Home** | [`index.html`](index.html) | "Why does this exist?" (Human story, problem, solution, subsystem overview) |
| **Smart Glove** | [`glove.html`](glove.html) | "How does the system capture a sign?" (5-flex sensors, 6-DOF IMU, 50Hz telemetry) |
| **Sign Recognition** | [`recognition.html`](recognition.html) | "How does the system recognize a sign?" (14-sign dataset, AI pipeline, low-conf error handling) |
| **Communication** | [`communication.html`](communication.html) | "How does a sign become speech?" (Sentence builder, NLP grammar rules, Web Speech TTS) |
| **AI & Technology** | [`technology.html`](technology.html) | "What's happening technically?" (8-layer architecture, signal filtering, Camera vs Glove) |
| **Full Demo** | [`demo.html`](demo.html) | "Show me the entire system" (Live glove visualizer + single sign + sentence builder) |
| **Presentation** | [`presentation.html`](presentation.html) | "Can I present this to judges?" (6-slide pitch deck + 60s Judge Fast-Track mode) |

---

## 🚀 Quick Start (Local Server)

Run any local static web server to view the application:

```bash
# Using Python 3
python -m http.server 8080

# Or using Node http-server
npx http-server -p 8080
```

Open [http://localhost:8080/](http://localhost:8080/) in your browser.

---

## 🛡️ Prototype Truthfulness & Credibility

- **Status:** Technology Proof-of-Concept Prototype for Ideathon/Hackathon presentation.
- **Hardware Telemetry:** Simulated at 50Hz with realistic micro-noise and exponential interpolation.
- **Speech Engine:** Powered live by the browser's native Web Speech API (`SpeechSynthesis`).
- **Integrity Guarantee:** We clearly distinguish between simulated concepts and planned hardware/models.

---

## 📄 License

MIT License © 2026 AI-Powered Forward Directional Sign Language System (AI-FSLS).
