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
   * Melodía mágica y celestial especial cuando se activa la flor secreta de Katze
   */
  playSecretChime() {
    if (this.isMuted()) return;
    // Acorde místico de campanas de cristal (F#madd9 / E / Dmaj7 estelar)
    const secretNotes = [
      440.0,   // A4
      554.37,  // C#5
      659.25,  // E5
      739.99,  // F#5
      880.0,   // A5
      1108.73, // C#6
      1318.51, // E6
      1661.22, // G#6
      1760.0,  // A6
    ];
    secretNotes.forEach((freq, idx) => {
      this.playNote(freq, 3.0, idx * 0.14, 0.09);
    });
  }

  /**
   * Inicia la melodía oficial del coro de "Flores Amarillas" (Floricienta)
   * "Ella sabía que él sabía, que algún día pasaría, que vendría a buscarla con sus flores amarillas..."
   */
  startMelody() {
    if (this.isPlaying()) return;
    this.isPlaying.set(true);

    const D4 = 293.66;
    const E4 = 329.63;
    const Fs4 = 369.99;
    const G4 = 392.00;
    const A4 = 440.00;
    const B4 = 493.88;
    const C5 = 523.25;
    const D5 = 587.33;
    const E5 = 659.25;

    // Bajo de acompañamiento (octava 3)
    const G3 = 196.00;
    const D3 = 146.83;
    const E3 = 164.81;
    const C3 = 130.81;

    // Melodía completa del coro icónico de Flores Amarillas con bajos armónicos
    const song: { note: number; duration: number; delay: number; bass?: number; gain?: number }[] = [
      // Acorde G: "Ella sabía..."
      { note: G4, duration: 0.35, delay: 0.0, bass: G3, gain: 0.09 },
      { note: G4, duration: 0.35, delay: 0.35 },
      { note: A4, duration: 0.35, delay: 0.7 },
      { note: B4, duration: 0.6, delay: 1.05 },

      // Acorde D: "...que él sabía..."
      { note: B4, duration: 0.35, delay: 1.7, bass: D3, gain: 0.09 },
      { note: C5, duration: 0.35, delay: 2.05 },
      { note: B4, duration: 0.35, delay: 2.4 },
      { note: A4, duration: 0.6, delay: 2.75 },

      // Acorde Em: "...que algún día pasaría..."
      { note: A4, duration: 0.32, delay: 3.4, bass: E3, gain: 0.09 },
      { note: G4, duration: 0.32, delay: 3.72 },
      { note: A4, duration: 0.32, delay: 4.04 },
      { note: B4, duration: 0.38, delay: 4.36 },
      { note: G4, duration: 0.38, delay: 4.74 },
      { note: E4, duration: 0.6, delay: 5.12 },

      // Acorde C: "...que vendría a buscarla..."
      { note: D4, duration: 0.32, delay: 5.75, bass: C3, gain: 0.09 },
      { note: E4, duration: 0.32, delay: 6.07 },
      { note: G4, duration: 0.32, delay: 6.39 },
      { note: A4, duration: 0.35, delay: 6.71 },
      { note: B4, duration: 0.4, delay: 7.06 },
      { note: D5, duration: 0.55, delay: 7.46 },

      // Acorde G: "...con sus flores amarillas."
      { note: B4, duration: 0.35, delay: 8.1, bass: G3, gain: 0.09 },
      { note: A4, duration: 0.35, delay: 8.45 },
      { note: G4, duration: 0.35, delay: 8.8 },
      { note: A4, duration: 0.35, delay: 9.15 },
      { note: G4, duration: 1.2, delay: 9.5 },

      // Segunda parte del coro
      // Acorde G: "No te apures..."
      { note: G4, duration: 0.35, delay: 11.0, bass: G3, gain: 0.09 },
      { note: G4, duration: 0.35, delay: 11.35 },
      { note: A4, duration: 0.35, delay: 11.7 },
      { note: B4, duration: 0.55, delay: 12.05 },

      // Acorde D: "...no detengas..."
      { note: B4, duration: 0.35, delay: 12.65, bass: D3, gain: 0.09 },
      { note: C5, duration: 0.35, delay: 13.0 },
      { note: B4, duration: 0.35, delay: 13.35 },
      { note: A4, duration: 0.55, delay: 13.7 },

      // Acorde Em: "...el instante del encuentro..."
      { note: A4, duration: 0.32, delay: 14.3, bass: E3, gain: 0.09 },
      { note: G4, duration: 0.32, delay: 14.62 },
      { note: A4, duration: 0.32, delay: 14.94 },
      { note: B4, duration: 0.35, delay: 15.26 },
      { note: C5, duration: 0.35, delay: 15.61 },
      { note: D5, duration: 0.45, delay: 15.96 },
      { note: B4, duration: 0.55, delay: 16.41 },

      // Acorde C: "...no te olvides que la vida..."
      { note: G4, duration: 0.32, delay: 17.1, bass: C3, gain: 0.09 },
      { note: A4, duration: 0.32, delay: 17.42 },
      { note: B4, duration: 0.35, delay: 17.74 },
      { note: D5, duration: 0.4, delay: 18.09 },
      { note: C5, duration: 0.35, delay: 18.49 },
      { note: B4, duration: 0.35, delay: 18.84 },
      { note: A4, duration: 0.55, delay: 19.19 },

      // Acorde G: "...casi nunca está dormida."
      { note: A4, duration: 0.35, delay: 19.8, bass: G3, gain: 0.09 },
      { note: B4, duration: 0.35, delay: 20.15 },
      { note: A4, duration: 0.4, delay: 20.5 },
      { note: G4, duration: 1.8, delay: 20.9 },
    ];

    const phraseLength = 23.5; // Segundos por ciclo completo del coro

    const playCycle = () => {
      if (!this.isPlaying()) return;
      song.forEach(item => {
        this.playNote(item.note, item.duration + 0.5, item.delay, item.gain || 0.075);
        if (item.bass) {
          this.playNote(item.bass, 2.5, item.delay, 0.04);
        }
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
