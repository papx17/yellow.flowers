import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioCtx: AudioContext | null = null;
  private isPlaying = signal(false);
  private isMuted = signal(false);
  private loopTimer: any = null;

  readonly playing = this.isPlaying.asReadonly();
  readonly muted = this.isMuted.asReadonly();

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Toca una nota suave tipo caja de música / arpa
   */
  playNote(frequency: number, duration = 1.6, delay = 0, gainLevel = 0.08) {
    if (this.isMuted()) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const startTime = ctx.currentTime + delay;

    // Oscilador principal suave (sine)
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, startTime);

    // Armónico suave (triangle) para textura de campanilla/caja musical
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(frequency * 2, startTime);

    // Ganancia envolvente (Attack rápido, Decay dulce)
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(gainLevel, startTime + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    const gainNode2 = ctx.createGain();
    gainNode2.gain.setValueAtTime(0.0001, startTime);
    gainNode2.gain.linearRampToValueAtTime(gainLevel * 0.25, startTime + 0.03);
    gainNode2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.7);

    // Filtro pasa bajos suave
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);

    osc.connect(gainNode);
    gainNode.connect(filter);

    osc2.connect(gainNode2);
    gainNode2.connect(filter);

    filter.connect(ctx.destination);

    osc.start(startTime);
    osc2.start(startTime);
    osc.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  /**
   * Efecto brillante cuando florece o al tocar destellos
   */
  playSparkleChime() {
    if (this.isMuted()) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      this.playNote(freq, 1.2, idx * 0.08, 0.06);
    });
  }

  /**
   * Glissando celestial de arpa cuando la flor florece de par en par
   */
  playBloomSound() {
    if (this.isMuted()) return;
    const notes = [
      392.0,   // G4
      523.25,  // C5
      659.25,  // E5
      783.99,  // G5
      987.77,  // B5
      1046.5,  // C6
      1318.51, // E6
      1567.98, // G6
    ];
    notes.forEach((freq, idx) => {
      this.playNote(freq, 2.2, idx * 0.12, 0.07);
    });
  }

  /**
   * Inicia la melodía romántica acústica continua de fondo
   * Una progresión tierna y nostálgica (inspirada en melodías de primavera y flores amarillas)
   */
  startMelody() {
    if (this.isPlaying()) return;
    this.isPlaying.set(true);

    // Frecuencias para notas musicales (C4, D4, E4, F4, G4, A4, B4, C5, etc.)
    const notes = {
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
    };

    // Secuencia de arpegios suaves
    const phrase = [
      // Acorde C (Do Mayor)
      { note: notes.C4, delay: 0 },
      { note: notes.E4, delay: 0.35 },
      { note: notes.G4, delay: 0.7 },
      { note: notes.C5, delay: 1.05 },
      { note: notes.E5, delay: 1.4 },
      { note: notes.C5, delay: 1.75 },

      // Acorde G (Sol Mayor)
      { note: notes.G4, delay: 2.2 },
      { note: notes.B4, delay: 2.55 },
      { note: notes.D5, delay: 2.9 },
      { note: notes.G5, delay: 3.25 },
      { note: notes.D5, delay: 3.6 },
      { note: notes.B4, delay: 3.95 },

      // Acorde Am (La menor)
      { note: notes.A4, delay: 4.4 },
      { note: notes.C5, delay: 4.75 },
      { note: notes.E5, delay: 5.1 },
      { note: notes.A5, delay: 5.45 },
      { note: notes.E5, delay: 5.8 },
      { note: notes.C5, delay: 6.15 },

      // Acorde F (Fa Mayor)
      { note: notes.F4, delay: 6.6 },
      { note: notes.A4, delay: 6.95 },
      { note: notes.C5, delay: 7.3 },
      { note: notes.F5, delay: 7.65 },
      { note: notes.E5, delay: 8.0 },
      { note: notes.D5, delay: 8.35 },
    ];

    const phraseLength = 9.0; // Segundos por ciclo

    const playCycle = () => {
      if (!this.isPlaying()) return;
      phrase.forEach(item => {
        this.playNote(item.note, 2.0, item.delay, 0.05);
      });
      this.loopTimer = setTimeout(playCycle, phraseLength * 1000);
    };

    playCycle();
  }

  stopMelody() {
    this.isPlaying.set(false);
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
  }

  toggleSound() {
    const nextMuted = !this.isMuted();
    this.isMuted.set(nextMuted);
    if (!nextMuted && !this.isPlaying()) {
      this.startMelody();
    }
  }
}
