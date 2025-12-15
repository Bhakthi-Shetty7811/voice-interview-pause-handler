import { initMic } from './audio/mic.js';
import { getVADState } from './audio/vad.js';
import { updatePause } from './conversation/pauseLogic.js';
import { updateStateMachine, getCurrentState } from './conversation/stateMachine.js';
import { updateDebugPanel } from './ui/debugPanel.js';

let turnCount = 0;
let currentUtterance = "";
let interviewEnded = false;
let hasSpokenInTurn = false;

const questions = [
  "Can you briefly explain what problem this prototype is solving?",
  "Why do pauses cause issues in browser-based voice interviews?",
  "What improvement does your approach introduce?"
];

const MAX_QUESTIONS = questions.length;

let audioContext, analyser, dataArray;

const startBtn = document.getElementById('startBtn');
const transcriptEl = document.getElementById('transcript');

startBtn.disabled = false;
startBtn.textContent = "Start Interview";
transcriptEl.textContent = "Waiting for interview to start...";

startBtn.onclick = async () => {
    if (interviewEnded) return;

    const micData = await initMic();
    audioContext = micData.audioContext;
    await audioContext.resume();

    analyser = micData.analyser;
    dataArray = micData.dataArray;

    transcriptEl.textContent = `AI (1): ${questions[0]}\n`;
    processAudio();
};

function processAudio() {
    if (interviewEnded) return;

    requestAnimationFrame(processAudio);

    analyser.getByteTimeDomainData(dataArray);
    const energy = getVADState(dataArray);

    const pauseResult = updatePause(energy, getCurrentState());

    updateStateMachine(pauseResult);
    const currentState = getCurrentState();

    if (energy > 5 && currentState === "USER_SPEAKING") {
        hasSpokenInTurn = true;
        currentUtterance += "word ";
        transcriptEl.textContent = `Candidate: ${currentUtterance}`;
    }

    updateDebugPanel({
        ...pauseResult,
        state: currentState
    });

    if (pauseResult.interrupt && hasSpokenInTurn && !interviewEnded) {
        transcriptEl.textContent += "\n[End of candidate response]\n";

        currentUtterance = "";
        hasSpokenInTurn = false;
        turnCount++;

        if (turnCount < MAX_QUESTIONS) {
            transcriptEl.textContent += `\nAI (${turnCount + 1}): ${questions[turnCount]}\n`;
        } else {
            transcriptEl.textContent += "\n🎉 Interview Completed. Thank you for your responses.\n";
            interviewEnded = true;

            startBtn.disabled = true;
            startBtn.textContent = "Interview Completed";
        }
    }
}


