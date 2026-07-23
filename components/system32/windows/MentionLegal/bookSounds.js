let context;

function getContext() {
  if (typeof window === 'undefined') return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!context) context = new AudioContext();
  if (context.state === 'suspended') context.resume();
  return context;
}

function noiseBuffer(audioContext, duration) {
  const length = Math.ceil(audioContext.sampleRate * duration);
  const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let index = 0; index < length; index += 1) channel[index] = Math.random() * 2 - 1;
  return buffer;
}

function burst(audioContext, start, duration, gainAmount, frequency) {
  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();
  source.buffer = noiseBuffer(audioContext, duration);
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(frequency, start);
  filter.Q.value = .7;
  gain.gain.setValueAtTime(gainAmount, start);
  gain.gain.exponentialRampToValueAtTime(.001, start + duration);
  source.connect(filter).connect(gain).connect(audioContext.destination);
  source.start(start);
  source.stop(start + duration);
}

function tone(audioContext, start, duration, frequency, gainAmount) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, frequency * .62), start + duration);
  gain.gain.setValueAtTime(gainAmount, start);
  gain.gain.exponentialRampToValueAtTime(.001, start + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start + duration);
}

export function playBookSettle() {
  const audioContext = getContext();
  if (!audioContext) return;
  const start = audioContext.currentTime;
  burst(audioContext, start, .16, .085, 230);
  tone(audioContext, start, .12, 110, .065);
  tone(audioContext, start + .035, .1, 74, .045);
}

export function playPageTurn() {
  const audioContext = getContext();
  if (!audioContext) return;
  const variants = [
    { duration: .11, gain: .052, frequency: 1050 },
    { duration: .14, gain: .046, frequency: 820 },
    { duration: .17, gain: .041, frequency: 1280 },
  ];
  const variant = variants[Math.floor(Math.random() * variants.length)];
  const start = audioContext.currentTime;
  burst(audioContext, start, variant.duration, variant.gain, variant.frequency);
  burst(audioContext, start + .035, variant.duration * .65, variant.gain * .5, variant.frequency * .58);
}

export function playBookPoof() {
  const audioContext = getContext();
  if (!audioContext) return;
  const start = audioContext.currentTime;
  burst(audioContext, start, .12, .075, 470);
  tone(audioContext, start, .09, 185, .05);
}
