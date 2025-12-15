import { initMic } from './audio/mic.js';
import { getVADState } from './audio/vad.js';
import { updatePause } from './conversation/pauseLogic.js';
import { updateStateMachine, getCurrentState } from './conversation/stateMachine.js';
import { updateDebugPanel } from './ui/debugPanel.js';
let turnCount = 0;
let currentUtterance = "";

const questions = [
  "Tell me about a challenging project you worked on.",
  "What was your role in that project?",
  "What did you learn from this experience?"
];

let audioContext, analyser, dataArray;
let silenceStart = null;

const startBtn = document.getElementById('startBtn');
const transcriptEl = document.getElementById('transcript');

startBtn.onclick = async () => {
    const micData = await initMic();
    audioContext = micData.audioContext;
    await audioContext.resume();

    analyser = micData.analyser;
    dataArray = micData.dataArray;
    processAudio();
};

function processAudio() {
    requestAnimationFrame(processAudio);

    analyser.getByteTimeDomainData(dataArray);
    const energy = getVADState(dataArray);
    const currentState = getCurrentState();

    const pauseResult = updatePause(energy, currentState);

    if (energy > 5 && currentState === "USER_SPEAKING") {
        currentUtterance += "word ";
        transcriptEl.textContent = `Candidate: ${currentUtterance}`;
    }

    updateStateMachine(pauseResult);
    updateDebugPanel({
        ...pauseResult,
        state: getCurrentState()
    });

    if (pauseResult.interrupt) {
        transcriptEl.textContent += "\n[End of candidate response]\n";

        currentUtterance = "";
        turnCount++;

        const question = questions[turnCount % questions.length];
        transcriptEl.textContent += `\nAI (${turnCount}): ${question}\n`;
    }

}
