'use strict';

let activeContext = null;

function stopMachineAudio() {
  if (activeContext && activeContext.state !== 'closed') {
    activeContext.close().catch(() => {});
  }
  activeContext = null;
}

async function playMachineSound(kind, muted) {
  if (muted || typeof window === 'undefined') return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  try {
    stopMachineAudio();
    const context = new AudioContext();
    activeContext = context;
    if (context.state === 'suspended') await context.resume();

    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);
    gain.connect(context.destination);

    const frequencies = { select: 620, obtain: 95, deliver: 180, reset: 420 };
    const oscillator = context.createOscillator();
    oscillator.type = kind === 'obtain' ? 'sawtooth' : 'square';
    oscillator.frequency.setValueAtTime(frequencies[kind] || 300, context.currentTime);
    if (kind === 'deliver') {
      oscillator.frequency.exponentialRampToValueAtTime(90, context.currentTime + 0.12);
    }
    oscillator.connect(gain);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
    oscillator.addEventListener('ended', stopMachineAudio, { once: true });
  } catch {
    stopMachineAudio();
  }
}

module.exports = { playMachineSound, stopMachineAudio };
