const stateEl = document.getElementById('state');
const silenceEl = document.getElementById('silence');
const thresholdEl = document.getElementById('threshold');
const canvas = document.getElementById('energyCanvas');
const ctx = canvas.getContext('2d');

export function updateDebugPanel({
    energy,
    silenceDuration,
    threshold,
    state
}) {
    stateEl.textContent = state;
    silenceEl.textContent = Math.round(silenceDuration);
    thresholdEl.textContent = Math.round(threshold);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    ctx.fillRect(
        0,
        canvas.height - energy * 5,
        canvas.width,
        energy * 5
    );
}

