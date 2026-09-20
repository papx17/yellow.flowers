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

  readonly isAudioMuted = this.audioService.muted;

  startExperience() {
    this.audioService.startMelody();
    this.audioService.playSparkleChime();
    this.appState.set('blooming');

    // Iniciar crecimiento y apertura de flor
    setTimeout(() => {
      this.isFlowerBloomed.set(true);
      this.particlesComponent?.burstPetals(30);
    }, 100);

    // Mostrar carta con mensaje emotivo una vez florecido
    setTimeout(() => {
      this.appState.set('revealed');
      this.audioService.playSparkleChime();
    }, 2800);
  }

  onFlowerClicked() {
    this.audioService.playSparkleChime();
    this.particlesComponent?.burstPetals(15);
  }

  burstMorePetals() {
    this.audioService.playSparkleChime();
    this.particlesComponent?.burstPetals(25);
  }

  toggleAudio() {
    this.audioService.toggleSound();
  }

  replayBloom() {
    this.isFlowerBloomed.set(false);
    this.appState.set('blooming');
    this.audioService.playSparkleChime();

    setTimeout(() => {
      this.isFlowerBloomed.set(true);
      this.particlesComponent?.burstPetals(25);
    }, 300);

    setTimeout(() => {
      this.appState.set('revealed');
    }, 2800);
  }
}
