import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowerComponent } from './components/flower/flower.component';
import { ParticlesComponent } from './components/particles/particles.component';
import { LetterModalComponent } from './components/letter-modal/letter-modal.component';
import { AudioService } from './services/audio.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FlowerComponent,
    ParticlesComponent,
    LetterModalComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private audioService = inject(AudioService);

  @ViewChild(ParticlesComponent) particlesComponent?: ParticlesComponent;

  // Estados: 'intro' | 'blooming' | 'revealed'
  appState = signal<'intro' | 'blooming' | 'revealed'>('intro');
  isFlowerBloomed = signal(false);
  isSecretMode = signal(false);
  phraseIndex = signal(0);

  readonly isAudioMuted = this.audioService.muted;

  startExperience() {
    this.audioService.startMelody();
    this.audioService.playSparkleChime();
    this.appState.set('blooming');

    // Iniciar crecimiento y apertura de flor
    setTimeout(() => {
      this.isFlowerBloomed.set(true);
      this.particlesComponent?.burstPetals(35);
    }, 100);

    // Momento culminante de florecimiento
    setTimeout(() => {
      this.audioService.playBloomSound();
      this.particlesComponent?.burstPetals(25);
    }, 1800);

    // Mostrar carta con mensaje emotivo una vez florecido
    setTimeout(() => {
      this.appState.set('revealed');
    }, 3200);
  }

  onFlowerClicked() {
    if (this.isSecretMode()) {
      this.audioService.playSecretChime();
      this.particlesComponent?.burstWhiteSparks(25);
    } else {
      this.audioService.playSparkleChime();
      this.particlesComponent?.burstPetals(18);
    }
  }

  burstMorePetals() {
    if (this.isSecretMode()) {
      this.audioService.playSecretChime();
      this.particlesComponent?.burstWhiteSparks(35);
    } else {
      this.audioService.playSparkleChime();
      this.particlesComponent?.burstPetals(25);
    }
  }

  toggleAudio() {
    this.audioService.toggleSound();
  }

  /**
   * Cambia a la siguiente frase emotiva y re-florece
   */
  replayBloom() {
    this.isFlowerBloomed.set(false);
    this.appState.set('blooming');
    this.phraseIndex.update(idx => idx + 1);

    if (this.isSecretMode()) {
      this.audioService.playSecretChime();
    } else {
      this.audioService.playSparkleChime();
    }

    setTimeout(() => {
      this.isFlowerBloomed.set(true);
      if (this.isSecretMode()) {
        this.particlesComponent?.burstWhiteSparks(30);
      } else {
        this.particlesComponent?.burstPetals(30);
      }
    }, 300);

    setTimeout(() => {
      if (this.isSecretMode()) {
        this.audioService.playSecretChime();
      } else {
        this.audioService.playBloomSound();
      }
    }, 2000);

    setTimeout(() => {
      this.appState.set('revealed');
    }, 3200);
  }

  changePhrase() {
    this.phraseIndex.update(idx => idx + 1);
    this.audioService.playSparkleChime();
    this.particlesComponent?.burstPetals(15);
  }

  /**
   * Activa el modo secreto: La flor más hermosa del mundo para Katze
   */
  activateSecretMode() {
    this.isSecretMode.set(true);
    this.audioService.startMelody();
    this.audioService.playSecretChime();
    this.particlesComponent?.burstWhiteSparks(50);

    if (this.appState() === 'intro') {
      this.appState.set('blooming');
      setTimeout(() => {
        this.isFlowerBloomed.set(true);
      }, 200);
      setTimeout(() => {
        this.appState.set('revealed');
      }, 2500);
    } else {
      // Si ya estaba en la pradera, revivir florecimiento celestial
      this.isFlowerBloomed.set(false);
      setTimeout(() => {
        this.isFlowerBloomed.set(true);
        this.appState.set('revealed');
      }, 250);
    }
  }

  exitSecretMode() {
    this.isSecretMode.set(false);
    this.audioService.playSparkleChime();
    this.particlesComponent?.burstPetals(35);
  }
}
