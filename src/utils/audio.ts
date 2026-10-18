// Web Audio API Synthesizer for gentle, soothing sound effects & ambient rain soundscapes
// Works 100% offline with zero external audio assets

let audioCtx: AudioContext | null = null;
let rainNode: AudioBufferSourceNode | null = null;
let rainGainNode: GainNode | null = null;
let rainFilterNode: BiquadFilterNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Generate continuous gentle rain sound using brown/pink noise
export function setRainAudio(active: boolean, volume = 0.18) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (!active) {
      if (rainGainNode) {
        rainGainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1);
        setTimeout(() => {
          try {
            rainNode?.stop();
            rainNode?.disconnect();
            rainNode = null;
          } catch {
            // ignore
          }
        }, 1100);
      }
      return;
    }

    if (rainNode) {
      // Already running, just adjust gain
      rainGainNode?.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.5);
      return;
    }

    // Generate 5 seconds of soothing rain noise buffer and loop it
    const bufferSize = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise integration for soft water sound
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      // Subtle randomized droplet peaks
      if (Math.random() < 0.003) {
        data[i] += (Math.random() - 0.5) * 0.15;
      }
    }

    rainNode = ctx.createBufferSource();
    rainNode.buffer = buffer;
    rainNode.loop = true;

    // Filter to warm rain frequency
    rainFilterNode = ctx.createBiquadFilter();
    rainFilterNode.type = 'lowpass';
    rainFilterNode.frequency.setValueAtTime(950, ctx.currentTime);

    rainGainNode = ctx.createGain();
    rainGainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    rainGainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2);

    rainNode.connect(rainFilterNode);
    rainFilterNode.connect(rainGainNode);
    rainGainNode.connect(ctx.destination);

    rainNode.start();
  } catch (err) {
    console.warn('[Audio] Rain sound failed:', err);
  }
}

// Soft, distant cozy thunder rumble
export function playDistantThunder() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 3);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 4);
  } catch {
    // Ignore
  }
}

export const playSound = (
  type: 'pop' | 'chime' | 'soft-bell' | 'swoosh' | 'tink' | 'wheel-tick' | 'rain-drop',
  enabled: boolean = true
) => {
  if (!enabled) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'rain-drop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100 + Math.random() * 400, now);
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.08);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'wheel-tick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.03);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === 'tink') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'chime') {
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.08, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } else if (type === 'soft-bell') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
    } else if (type === 'swoosh') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch {
    // Ignore
  }
};
