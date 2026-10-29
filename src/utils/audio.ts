// Ambient relaxing sounds generator using Web Audio API

class SoundManager {
  private ctx: AudioContext | null = null;
  private currentSource: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private activeSound: string | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playRain() {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    // Pink / Brown noise for gentle warm rain
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Lowpass filter for cozy softness
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 850;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    whiteNoise.start();
    this.currentSource = whiteNoise;
    this.isPlaying = true;
    this.activeSound = 'rain';
  }

  playWaves() {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    // Soft ocean waves modulated with an LFO
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;

    const modGain = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.12; // slow breathing waves
    lfo.connect(filter.frequency);

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.07, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    noise.start();
    lfo.start();
    this.currentSource = noise;
    this.isPlaying = true;
    this.activeSound = 'waves';
  }

  playHeartbeat() {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    // Gentle protective heartbeat loop
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, this.ctx.currentTime);

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    for (let t = 0; t < 60; t += 1.1) {
      // Lub-Dub
      this.gainNode.gain.setValueAtTime(0, now + t);
      this.gainNode.gain.linearRampToValueAtTime(0.2, now + t + 0.05);
      this.gainNode.gain.linearRampToValueAtTime(0, now + t + 0.2);

      this.gainNode.gain.setValueAtTime(0, now + t + 0.28);
      this.gainNode.gain.linearRampToValueAtTime(0.14, now + t + 0.33);
      this.gainNode.gain.linearRampToValueAtTime(0, now + t + 0.45);
    }

    osc.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
    osc.start();
    this.currentSource = osc;
    this.isPlaying = true;
    this.activeSound = 'heartbeat';
  }

  stop() {
    if (this.currentSource) {
      try {
        (this.currentSource as AudioScheduledSourceNode).stop();
      } catch {
        // ignore already stopped
      }
      this.currentSource.disconnect();
      this.currentSource = null;
    }
    this.isPlaying = false;
    this.activeSound = null;
  }

  getStatus() {
    return { isPlaying: this.isPlaying, activeSound: this.activeSound };
  }
}

export const soundManager = new SoundManager();

// Speech synthesis for tender voice reading
export function speakTenderArabic(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  // Strip emojis for smoother reading
  const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.92; // gentle, unhurried pace
  utterance.pitch = 1.05; // warm, friendly tone

  const voices = window.speechSynthesis.getVoices();
  const arVoice = voices.find(v => v.lang.startsWith('ar') && (v.name.includes('Female') || v.name.includes('Laila') || v.name.includes('Salma') || v.name.includes('Hoda') || v.name.includes('Zeina') || v.name.includes('Arabic')));
  if (arVoice) {
    utterance.voice = arVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
