// Web Audio API Synthesizer for lightweight and retro-sleek game sounds
let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Resume if suspended (browser security autoplays)
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playCorrectSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Dual-tone chime (G5 to C6)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "triangle";
    osc2.type = "sine";

    // Play G5 (783.99 Hz)
    osc1.frequency.setValueAtTime(783.99, now);
    // Play C6 (1046.50 Hz) slightly staggered
    osc2.frequency.setValueAtTime(1046.50, now + 0.08);

    // Fade out gain envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.45);

    osc2.start(now + 0.08);
    osc2.stop(now + 0.45);
  } catch (error) {
    console.warn("Failed to play correct sound:", error);
  }
}

export function playIncorrectSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Low dull buzzer/slide down sound
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sawtooth";
    // Frequency slide down from 180Hz to 90Hz
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.3);

    // Fade out gain envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    // Simple lowpass filter to make the sawtooth warm/dull instead of harsh
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(350, now);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch (error) {
    console.warn("Failed to play incorrect sound:", error);
  }
}

export function playTimeoutSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // A warning tick/tock sound
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(120, now);

    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.linearRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (error) {
    console.warn("Failed to play timeout sound:", error);
  }
}
