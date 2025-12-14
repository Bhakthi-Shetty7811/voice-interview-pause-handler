let noiseFloor = null;
let samples = [];

export function getVADState(dataArray) {
    let sumSquares = 0;
    for (let i = 0; i < dataArray.length; i++) {
        const val = dataArray[i] - 128;
        sumSquares += val * val;
    }
    const rms = Math.sqrt(sumSquares / dataArray.length);

    if (samples.length < 50) {
        samples.push(rms);
        noiseFloor = samples.reduce((a, b) => a + b, 0) / samples.length;
    }

    const energy = rms - (noiseFloor || 1);
    return Math.max(0, energy);
}

