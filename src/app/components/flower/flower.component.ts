import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
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

interface MeadowCompanion {
  id: number;
  scale: number;
  xOffset: number;
  yOffset: number;
  swayDelay: number;
  swayDuration: number;
  bloomDelay: number;
  stemD: string;
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
  @Input() isSecretMode = false;
  @Output() flowerClicked = new EventEmitter<void>();

  // Inclinación orgánica interactiva que sigue el cursor
  tiltX = signal(0);
  tiltY = signal(0);

  // Flores acompañantes que componen la pradera / ramillete abundante
  readonly meadowFlowers: MeadowCompanion[] = [
    {
      id: 1,
      scale: 0.68,
      xOffset: -155,
      yOffset: 35,
      swayDelay: 0.7,
      swayDuration: 6.2,
      bloomDelay: 1.1,
      stemD: 'M250 550 Q 200 420, 210 260 T 250 170',
    },
    {
      id: 2,
      scale: 0.72,
      xOffset: 160,
      yOffset: 25,
      swayDelay: 1.4,
      swayDuration: 5.8,
      bloomDelay: 1.3,
      stemD: 'M250 550 Q 290 410, 275 270 T 250 170',
    },
    {
      id: 3,
      scale: 0.52,
      xOffset: -245,
      yOffset: 80,
      swayDelay: 2.1,
      swayDuration: 7.0,
      bloomDelay: 1.6,
      stemD: 'M250 550 Q 170 440, 180 300 T 250 170',
    },
    {
      id: 4,
      scale: 0.54,
      xOffset: 250,
      yOffset: 75,
      swayDelay: 0.4,
      swayDuration: 6.5,
      bloomDelay: 1.8,
      stemD: 'M250 550 Q 320 430, 310 290 T 250 170',
    },
    {
      id: 5,
      scale: 0.46,
      xOffset: -85,
      yOffset: -15,
      swayDelay: 1.8,
      swayDuration: 5.4,
      bloomDelay: 0.9,
      stemD: 'M250 550 Q 230 400, 235 280 T 250 170',
    },
    {
      id: 6,
      scale: 0.48,
      xOffset: 90,
      yOffset: -10,
      swayDelay: 2.6,
      swayDuration: 6.0,
      bloomDelay: 1.0,
      stemD: 'M250 550 Q 270 390, 265 270 T 250 170',
    },
  ];

  // 12 pétalos para las flores de la pradera
  readonly companionPetals = Array.from({ length: 12 }, (_, i) => ({
    angle: i * 30,
  }));

  // Capa 1: Pétalos Exteriores Mayores de la Flor Reina (18 pétalos)
  readonly layer1Petals: PetalConfig[] = Array.from({ length: 18 }, (_, i) => ({
    angle: i * 20,
    delay: 1.2 + (i % 6) * 0.08,
    scale: 1.0,
    length: 125,
    width: 28,
  }));

  // Capa 2: Pétalos Medios Dorados (18 pétalos)
  readonly layer2Petals: PetalConfig[] = Array.from({ length: 18 }, (_, i) => ({
    angle: i * 20 + 10,
    delay: 1.5 + (i % 5) * 0.09,
    scale: 0.94,
    length: 116,
    width: 26,
  }));

  // Capa 3: Pétalos Interiores Brillantes (16 pétalos)
  readonly layer3Petals: PetalConfig[] = Array.from({ length: 16 }, (_, i) => ({
    angle: i * 22.5 + 5,
    delay: 1.8 + (i % 4) * 0.1,
    scale: 0.86,
    length: 102,
    width: 24,
  }));

  // Capa 4: Pétalos Florales del Corazón (14 pétalos)
  readonly layer4Petals: PetalConfig[] = Array.from({ length: 14 }, (_, i) => ({
    angle: i * (360 / 14) + 12,
    delay: 2.1 + (i % 3) * 0.11,
    scale: 0.76,
    length: 88,
    width: 22,
  }));

  // Espiral de Fibonacci para el corazón (Filotaxis real de 68 floretes)
  readonly spiralSeeds: SpiralSeed[] = (() => {
    const seeds: SpiralSeed[] = [];
    const phi = 137.507764 * (Math.PI / 180);
    const c = 4.4;

    for (let i = 1; i <= 68; i++) {
      const r = c * Math.sqrt(i);
      const theta = i * phi;
      const x = 250 + r * Math.cos(theta);
      const y = 170 + r * Math.sin(theta);

      let color = '#451a03';
      if (i > 15 && i <= 35) color = '#78350f';
      if (i > 35 && i <= 52) color = '#b45309';
      if (i > 52) color = '#f59e0b';

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
  readonly sunRays = Array.from({ length: 14 }, (_, i) => ({
    angle: i * (360 / 14),
  }));

  // Partículas mágicas que orbitan la flor
  readonly auraSparks = Array.from({ length: 10 }, (_, i) => ({
    delay: i * 0.6,
    duration: 3.5 + (i % 4) * 0.8,
    radius: 65 + (i % 5) * 18,
  }));

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.isBloomed) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const normX = (e.clientX - w / 2) / (w / 2);
    const normY = (e.clientY - h / 2) / (h / 2);

    this.tiltX.set(Math.max(-8, Math.min(8, normX * 8)));
    this.tiltY.set(Math.max(-6, Math.min(6, normY * 6)));
  }

  onFlowerClick() {
    this.flowerClicked.emit();
  }
}
