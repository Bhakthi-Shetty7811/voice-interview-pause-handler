import { ENERGY_THRESHOLD } from '../config/constants.js';

let state = 'IDLE';

export function getCurrentState() {
    return state;
}

export function updateStateMachine({ energy, interrupt }) {
    switch(state) {
        case 'IDLE':
            state = 'AI_ASKING';
            break;

        case 'AI_ASKING':
            if (energy > ENERGY_THRESHOLD) {
                state = 'USER_SPEAKING';
            }
            break;

        case 'USER_SPEAKING':
            if (energy <= ENERGY_THRESHOLD) {
                state = 'USER_PAUSING';
            }
            break;

        case 'USER_PAUSING':
            if (interrupt) {
                state = 'AI_THINKING';
            } else if (energy > ENERGY_THRESHOLD) {
                state = 'USER_SPEAKING';
            }
            break;

        case 'AI_THINKING':
            state = 'AI_ASKING';
            break;
    }
}
