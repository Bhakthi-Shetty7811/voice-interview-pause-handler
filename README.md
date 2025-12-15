# Improving Pause Detection in Voice AI Interviews

This project is a small browser-based prototype that shows how pause detection in voice interviews can be improved.

In many voice AI interviews, the system interrupts users too early because it treats short silences as the end of an answer. This prototype tries to fix that by understanding *how humans actually pause while thinking*.

---

### What problem does it solve?

* Prevents AI from cutting off candidates mid-answer
* Distinguishes thinking pauses from completed answers
* Makes voice interviews feel more natural and less stressful

---

### How does it work (simple explanation)?

1. The browser microphone captures audio
2. Audio energy is calculated in real time
3. Initial silence is used to estimate background noise
4. If the user was recently speaking, the system allows a longer pause
5. A state machine decides when it is safe for the AI to respond
6. A debug panel shows what the system is thinking

No speech-to-text is used — responses are simulated to keep the focus on pause handling.

---

### Folder Structure

```
voice-interview-pause-handler/
├── audio/          # microphone + VAD logic
├── conversation/   # pause handling & state machine
├── ui/             # debug visualization
├── config/         # thresholds and constants
├── demo/           # before/after samples
├── index.html
├── app.js
└── docs/summary.pdf
```

---

### How to run the project

1. Open the project in a local server (VS Code Live Server or similar)
2. Open `index.html` in the browser
3. Click **Start Interview**
4. Allow microphone access
5. Speak naturally and observe the debug panel

---

### Demo scenarios to try

* Pause for 1–2 seconds while thinking mid-answer
* Speak continuously for a long answer
* Stop speaking completely and wait

You will notice fewer interruptions compared to a fixed silence timeout.

---

### Why this approach?

This prototype focuses on **impact and clarity** rather than heavy AI models. It shows how small, well-thought-out changes in pause handling can significantly improve user experience in voice-based interviews.



