import {
  ENERGY_THRESHOLD,
  BASE_PAUSE_MS,
  MAX_EXTRA_PAUSE_MS
} from '../config/constants.js';

let lastSpeechTime = Date.now();
let adaptiveThreshold = BASE_PAUSE_MS;
let hasInterrupted = false;

export function updatePause(energy) {
    const now = Date.now();
    let interrupt = false;

    // If user is speaking, reset timers
    if (energy > ENERGY_THRESHOLD) {
        lastSpeechTime = now;
        hasInterrupted = false;
    }

    const silenceDuration = now - lastSpeechTime;

    // Adaptive threshold: recent speech → allow longer pause
    const energyFactor = Math.min(1, energy / ENERGY_THRESHOLD);
    adaptiveThreshold =
        BASE_PAUSE_MS + (1 - energyFactor) * MAX_EXTRA_PAUSE_MS;

    // Trigger interrupt only once per silence segment
    if (silenceDuration > adaptiveThreshold && !hasInterrupted) {
        interrupt = true;
        hasInterrupted = true;
    }

    return {
        energy,
        silenceDuration,
        threshold: adaptiveThreshold,
        interrupt
    };
}
