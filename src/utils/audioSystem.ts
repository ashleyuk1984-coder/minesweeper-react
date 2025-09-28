// Audio System for Minesweeper with Web Audio API
export class AudioSystem {
  private audioContext: AudioContext | null = null;
  private masterVolume = 0.3;
  private isMuted = false;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // Create audio context on first user interaction
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      await this.initialize();
    }
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Generic tone generator
  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 1) {
    return new Promise<void>((resolve) => {
      if (!this.audioContext || this.isMuted) {
        resolve();
        return;
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;
      
      const adjustedVolume = volume * this.masterVolume;
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(adjustedVolume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
      
      oscillator.onended = () => resolve();
    });
  }

  // Complex sound effects
  private createNoise(duration: number, volume = 1) {
    return new Promise<void>((resolve) => {
      if (!this.audioContext || this.isMuted) {
        resolve();
        return;
      }

      const bufferSize = this.audioContext.sampleRate * duration;
      const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      const adjustedVolume = volume * this.masterVolume;
      gainNode.gain.setValueAtTime(adjustedVolume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      
      whiteNoise.start(this.audioContext.currentTime);
      whiteNoise.stop(this.audioContext.currentTime + duration);
      
      whiteNoise.onended = () => resolve();
    });
  }

  // Sound Effects
  async playCellClick() {
    await this.ensureAudioContext();
    await this.createTone(800, 0.1, 'square', 0.1);
  }

  async playCellReveal() {
    await this.ensureAudioContext();
    await this.createTone(400, 0.15, 'sine', 0.15);
  }

  async playFlag() {
    await this.ensureAudioContext();
    // Two-tone flag sound
    await Promise.all([
      this.createTone(600, 0.1, 'square', 0.2),
      this.createTone(900, 0.15, 'sine', 0.15)
    ]);
  }

  async playQuestion() {
    await this.ensureAudioContext();
    // Rising tone for question mark
    if (!this.audioContext || this.isMuted) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(500, this.audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
    oscillator.type = 'triangle';
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15 * this.masterVolume, this.audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  async playExplosion() {
    await this.ensureAudioContext();
    // Complex explosion sound
    await Promise.all([
      this.createTone(100, 0.5, 'sawtooth', 0.4),
      this.createTone(150, 0.3, 'square', 0.3),
      this.createNoise(0.4, 0.2)
    ]);
  }

  async playVictory() {
    await this.ensureAudioContext();
    // Victory fanfare
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, C octave
    
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.createTone(notes[i], 0.4, 'square', 0.3);
      }, i * 150);
    }
  }

  async playChord() {
    await this.ensureAudioContext();
    // Satisfying chord sound
    await this.createTone(700, 0.2, 'triangle', 0.2);
  }

  async playMultiReveal(count: number) {
    await this.ensureAudioContext();
    // Cascading reveal sound based on number of cells
    const baseFreq = 300;
    const increment = Math.min(count * 20, 400);
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      setTimeout(() => {
        this.createTone(baseFreq + (i * increment / 10), 0.08, 'sine', 0.1);
      }, i * 30);
    }
  }

  // Background ambient sound for different themes
  async playAmbient(theme: string) {
    if (!this.isInitialized || this.isMuted) return;
    
    // Different ambient sounds for different themes
    switch (theme) {
      case 'neon':
        // Cyberpunk ambient
        this.createTone(220, 2, 'sawtooth', 0.05);
        break;
      case 'ocean':
        // Ocean waves simulation
        this.createNoise(3, 0.03);
        break;
      // Light and dark themes use no ambient by default
    }
  }

  // Volume and control methods
  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  getVolume(): number {
    return this.masterVolume;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  isMutedState(): boolean {
    return this.isMuted;
  }

  // Initialize audio on first user interaction (required by browsers)
  async initializeOnUserAction() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}

// Singleton instance
export const audioSystem = new AudioSystem();