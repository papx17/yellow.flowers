import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface PetalConfig {
  angle: number;
  delay: number;
  scale: number;
  length: number;
  width: number;
}

interface SpiralSeed {
  x: number;
  y: number;
  size: number;
  color: string;
  glow: boolean;
}

@Component({
  selector: 'app-flower',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flower.component.html',
  styleUrl: './flower.component.css',
})
export class FlowerComponent {
  @Input() isBloomed = false;
  @Output() flowerClicked = new EventEmitter<void>();

  // Inclinación orgánica interactiva que sigue el cursor (heliotropismo)
  tiltX = signal(0);
  tiltY = signal(0);

  // Capa 1: Pétalos Exteriores Mayores (18 pétalos amplios con caída suave)
  readonly layer1Petals: PetalConfig[] = Array.from({ length: 18 }, (_, i) => ({
    angle: i * 20,
    delay: 1.2 + (i % 6) * 0.1,
    scale: 1.0,
    length: 125,
    width: 28,
  }));

  // Capa 2: Pétalos Medios Dorados (18 pétalos intercalados, tono amarillo sol)
  readonly layer2Petals: PetalConfig[] = Array.from({ length: 18 }, (_, i) => ({
    angle: i * 20 + 10,
    delay: 1.5 + (i % 5) * 0.11,
    scale: 0.94,
    length: 116,
    width: 26,
  }));

  // Capa 3: Pétalos Interiores Brillantes (16 pétalos azafrán con reflejo)
  readonly layer3Petals: PetalConfig[] = Array.from({ length: 16 }, (_, i) => ({
    angle: i * 22.5 + 5,
    delay: 1.8 + (i % 4) * 0.12,
    scale: 0.86,
    length: 102,
    width: 24,
  }));

  // Capa 4: Pétalos Florales del Corazón (14 pétalos envolventes cálidos)
  readonly layer4Petals: PetalConfig[] = Array.from({ length: 14 }, (_, i) => ({
    angle: i * (360 / 14) + 12,
    delay: 2.1 + (i % 3) * 0.13,
    scale: 0.76,
    length: 88,
    width: 22,
  }));

  // Espiral de Fibonacci para el centro del girasol (Filotaxis real de 64 floretes)
  readonly spiralSeeds: SpiralSeed[] = (() => {
    const seeds: SpiralSeed[] = [];
    const phi = 137.507764 * (Math.PI / 180); // Ángulo de oro
    const c = 4.4; // Factor de espaciamiento

    for (let i = 1; i <= 68; i++) {
      const r = c * Math.sqrt(i);
      const theta = i * phi;
      const x = 250 + r * Math.cos(theta);
      const y = 170 + r * Math.sin(theta);

      // Variación cromática: del centro oscuro al exterior dorado
      let color = '#451a03'; // chocolate
      if (i > 15 && i <= 35) color = '#78350f'; // ámbar oscuro
      if (i > 35 && i <= 52) color = '#b45309'; // miel
      if (i > 52) color = '#f59e0b'; // oro cálido

      seeds.push({
        x,
        y,
        size: 1.4 + (i / 68) * 1.5,
        color,
        glow: i % 7 === 0,
      });
    }
    return seeds;
  })();

  // Rayos solares divinos (God Rays)
  readonly sunRays = Array.from({ length: 12 }, (_, i) => ({
    angle: i * 30,
  }));

  // Partículas mágicas que orbitan la flor
  readonly auraSparks = Array.from({ length: 8 }, (_, i) => ({
    delay: i * 0.7,
    duration: 4 + (i % 3),
    radius: 70 + (i % 4) * 18,
  }));

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.isBloomed) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const normX = (e.clientX - w / 2) / (w / 2);
    const normY = (e.clientY - h / 2) / (h / 2);

    // Suave inclinación heliotrópica
    this.tiltX.set(Math.max(-8, Math.min(8, normX * 8)));
    this.tiltY.set(Math.max(-6, Math.min(6, normY * 6)));
  }

  onFlowerClick() {
    this.flowerClicked.emit();
  }
}
