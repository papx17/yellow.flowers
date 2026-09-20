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

interface BouquetFlower {
  id: number;
  x: number;
  y: number;
  scale: number;
  angle: number;
  swayDelay: number;
  bloomDelay: number;
  stemEnd: string;
}

interface GypsophilaSprig {
  x: number;
  y: number;
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
  @Input() viewMode: 'bouquet' | 'meadow' = 'bouquet';
  @Output() flowerClicked = new EventEmitter<void>();

  tiltX = signal(0);
  tiltY = signal(0);

  // 1. Ramillete Estándar (7 flores acompañantes)
  readonly standardBouquetFlowers: BouquetFlower[] = [
    { id: 1, x: 250, y: 70, scale: 0.62, angle: 0, swayDelay: 0.3, bloomDelay: 1.0, stemEnd: 'M 250 420 Q 250 250, 250 70' },
    { id: 2, x: 170, y: 100, scale: 0.68, angle: -18, swayDelay: 0.8, bloomDelay: 1.2, stemEnd: 'M 245 420 Q 210 260, 170 100' },
    { id: 3, x: 330, y: 105, scale: 0.68, angle: 18, swayDelay: 1.1, bloomDelay: 1.3, stemEnd: 'M 255 420 Q 290 260, 330 105' },
    { id: 4, x: 125, y: 180, scale: 0.64, angle: -28, swayDelay: 1.6, bloomDelay: 1.5, stemEnd: 'M 240 420 Q 180 300, 125 180' },
    { id: 5, x: 375, y: 185, scale: 0.64, angle: 28, swayDelay: 0.5, bloomDelay: 1.6, stemEnd: 'M 260 420 Q 320 300, 375 185' },
    { id: 6, x: 155, y: 265, scale: 0.58, angle: -22, swayDelay: 2.0, bloomDelay: 1.8, stemEnd: 'M 242 420 Q 200 340, 155 265' },
    { id: 7, x: 345, y: 270, scale: 0.58, angle: 22, swayDelay: 1.4, bloomDelay: 1.9, stemEnd: 'M 258 420 Q 300 340, 345 270' },
  ];

  // 2. RAMILLETE CELESTIAL MASIVO: 27 flores para cubrir todo el espacio izquierdo en modo secreto
  readonly secretCelestialFlowers: BouquetFlower[] = [
    // Borde superior expansivo
    { id: 101, x: 250, y: -20, scale: 0.62, angle: 0, swayDelay: 0.2, bloomDelay: 0.7, stemEnd: 'M 250 420 Q 250 180, 250 -20' },
    { id: 102, x: 140, y: 5, scale: 0.64, angle: -20, swayDelay: 0.5, bloomDelay: 0.8, stemEnd: 'M 245 420 Q 190 190, 140 5' },
    { id: 103, x: 360, y: 10, scale: 0.64, angle: 20, swayDelay: 0.8, bloomDelay: 0.8, stemEnd: 'M 255 420 Q 310 190, 360 10' },
    { id: 104, x: 30, y: 40, scale: 0.60, angle: -36, swayDelay: 1.1, bloomDelay: 0.9, stemEnd: 'M 240 420 Q 130 210, 30 40' },
    { id: 105, x: 470, y: 45, scale: 0.60, angle: 36, swayDelay: 1.3, bloomDelay: 0.9, stemEnd: 'M 260 420 Q 370 210, 470 45' },

    // Flanco izquierdo y derecho extremos
    { id: 106, x: -60, y: 120, scale: 0.66, angle: -48, swayDelay: 1.5, bloomDelay: 1.1, stemEnd: 'M 238 420 Q 90 260, -60 120' },
    { id: 107, x: 550, y: 125, scale: 0.66, angle: 48, swayDelay: 1.7, bloomDelay: 1.1, stemEnd: 'M 262 420 Q 410 260, 550 125' },
    { id: 108, x: -80, y: 220, scale: 0.62, angle: -60, swayDelay: 2.0, bloomDelay: 1.3, stemEnd: 'M 236 420 Q 70 320, -80 220' },
    { id: 109, x: 570, y: 225, scale: 0.62, angle: 60, swayDelay: 0.6, bloomDelay: 1.3, stemEnd: 'M 264 420 Q 430 320, 570 225' },
    { id: 110, x: -50, y: 320, scale: 0.58, angle: -50, swayDelay: 1.8, bloomDelay: 1.5, stemEnd: 'M 238 420 Q 80 370, -50 320' },
    { id: 111, x: 540, y: 325, scale: 0.58, angle: 50, swayDelay: 1.4, bloomDelay: 1.5, stemEnd: 'M 262 420 Q 420 370, 540 325' },

    // Cascada inferior
    { id: 112, x: 40, y: 390, scale: 0.54, angle: -35, swayDelay: 1.2, bloomDelay: 1.7, stemEnd: 'M 240 420 Q 140 405, 40 390' },
    { id: 113, x: 450, y: 395, scale: 0.54, angle: 35, swayDelay: 1.9, bloomDelay: 1.7, stemEnd: 'M 260 420 Q 360 405, 450 395' },
    { id: 114, x: 140, y: 440, scale: 0.50, angle: -18, swayDelay: 2.2, bloomDelay: 1.9, stemEnd: 'M 245 420 Q 190 435, 140 440' },
    { id: 115, x: 360, y: 445, scale: 0.50, angle: 18, swayDelay: 0.9, bloomDelay: 1.9, stemEnd: 'M 255 420 Q 310 435, 360 445' },

    // Anillo medio denso
    { id: 116, x: 190, y: 70, scale: 0.68, angle: -12, swayDelay: 0.4, bloomDelay: 1.0, stemEnd: 'M 246 420 Q 215 240, 190 70' },
    { id: 117, x: 310, y: 75, scale: 0.68, angle: 12, swayDelay: 0.7, bloomDelay: 1.0, stemEnd: 'M 254 420 Q 285 240, 310 75' },
    { id: 118, x: 100, y: 140, scale: 0.66, angle: -28, swayDelay: 1.0, bloomDelay: 1.2, stemEnd: 'M 242 420 Q 170 280, 100 140' },
    { id: 119, x: 400, y: 145, scale: 0.66, angle: 28, swayDelay: 1.3, bloomDelay: 1.2, stemEnd: 'M 258 420 Q 330 280, 400 145' },
    { id: 120, x: 80, y: 240, scale: 0.64, angle: -32, swayDelay: 1.6, bloomDelay: 1.4, stemEnd: 'M 240 420 Q 150 330, 80 240' },
    { id: 121, x: 420, y: 245, scale: 0.64, angle: 32, swayDelay: 1.8, bloomDelay: 1.4, stemEnd: 'M 260 420 Q 350 330, 420 245' },

    // Anillo interior que abraza a la reina
    { id: 122, x: 200, y: 130, scale: 0.70, angle: -8, swayDelay: 0.3, bloomDelay: 0.9, stemEnd: 'M 248 420 Q 225 270, 200 130' },
    { id: 123, x: 300, y: 135, scale: 0.70, angle: 8, swayDelay: 0.6, bloomDelay: 0.9, stemEnd: 'M 252 420 Q 275 270, 300 135' },
    { id: 124, x: 170, y: 195, scale: 0.66, angle: -15, swayDelay: 1.1, bloomDelay: 1.2, stemEnd: 'M 246 420 Q 210 310, 170 195' },
    { id: 125, x: 330, y: 200, scale: 0.66, angle: 15, swayDelay: 1.4, bloomDelay: 1.2, stemEnd: 'M 254 420 Q 290 310, 330 200' },
    { id: 126, x: 200, y: 255, scale: 0.62, angle: -10, swayDelay: 1.7, bloomDelay: 1.5, stemEnd: 'M 248 420 Q 225 340, 200 255' },
    { id: 127, x: 300, y: 260, scale: 0.62, angle: 10, swayDelay: 1.9, bloomDelay: 1.5, stemEnd: 'M 252 420 Q 275 340, 300 260' },
  ];

  get currentBouquetFlowers(): BouquetFlower[] {
    return this.isSecretMode ? this.secretCelestialFlowers : this.standardBouquetFlowers;
  }

  // Paniculata / gypsophila
  readonly gypsophila: GypsophilaSprig[] = [
    { x: 195, y: 145 },
    { x: 305, y: 150 },
    { x: 140, y: 225 },
    { x: 360, y: 230 },
    { x: 210, y: 75 },
    { x: 290, y: 80 },
    { x: 250, y: 275 },
    { x: 110, y: 110 },
    { x: 390, y: 115 },
    { x: 90, y: 270 },
    { x: 410, y: 275 },
    { x: 20, y: 180 },
    { x: 480, y: 185 },
    { x: 60, y: 340 },
    { x: 440, y: 345 },
  ];

  readonly meadowFlowers = [
    { id: 1, x: 95, y: 205, scale: 0.68, swayDelay: 0.7, swayDuration: 6.2, bloomDelay: 1.1, stemD: 'M 95 550 Q 80 400, 95 205' },
    { id: 2, x: 410, y: 195, scale: 0.72, swayDelay: 1.4, swayDuration: 5.8, bloomDelay: 1.3, stemD: 'M 410 550 Q 425 390, 410 195' },
    { id: 3, x: 15, y: 250, scale: 0.52, swayDelay: 2.1, swayDuration: 7.0, bloomDelay: 1.6, stemD: 'M 15 550 Q 0 420, 15 250' },
    { id: 4, x: 500, y: 245, scale: 0.54, swayDelay: 0.4, swayDuration: 6.5, bloomDelay: 1.8, stemD: 'M 500 550 Q 515 410, 500 245' },
    { id: 5, x: 165, y: 155, scale: 0.46, swayDelay: 1.8, swayDuration: 5.4, bloomDelay: 0.9, stemD: 'M 165 550 Q 155 380, 165 155' },
    { id: 6, x: 340, y: 160, scale: 0.48, swayDelay: 2.6, swayDuration: 6.0, bloomDelay: 1.0, stemD: 'M 340 550 Q 350 370, 340 160' },
    { id: 7, x: -40, y: 300, scale: 0.50, swayDelay: 1.2, swayDuration: 5.5, bloomDelay: 1.4, stemD: 'M -40 550 Q -50 430, -40 300' },
    { id: 8, x: 550, y: 295, scale: 0.50, swayDelay: 1.7, swayDuration: 6.8, bloomDelay: 1.5, stemD: 'M 550 550 Q 560 430, 550 295' },
    { id: 9, x: 230, y: 120, scale: 0.44, swayDelay: 0.9, swayDuration: 5.0, bloomDelay: 0.8, stemD: 'M 230 550 Q 220 360, 230 120' },
    { id: 10, x: 270, y: 125, scale: 0.44, swayDelay: 2.3, swayDuration: 6.1, bloomDelay: 0.9, stemD: 'M 270 550 Q 280 360, 270 125' },
  ];

  readonly companionPetals = Array.from({ length: 12 }, (_, i) => ({
    angle: i * 30,
  }));

  readonly layer1Petals: PetalConfig[] = Array.from({ length: 18 }, (_, i) => ({
    angle: i * 20,
    delay: 1.2 + (i % 6) * 0.08,
    scale: 1.0,
    length: 125,
    width: 28,
  }));

  readonly layer2Petals: PetalConfig[] = Array.from({ length: 18 }, (_, i) => ({
    angle: i * 20 + 10,
    delay: 1.5 + (i % 5) * 0.09,
    scale: 0.94,
    length: 116,
    width: 26,
  }));

  readonly layer3Petals: PetalConfig[] = Array.from({ length: 16 }, (_, i) => ({
    angle: i * 22.5 + 5,
    delay: 1.8 + (i % 4) * 0.1,
    scale: 0.86,
    length: 102,
    width: 24,
  }));

  readonly layer4Petals: PetalConfig[] = Array.from({ length: 14 }, (_, i) => ({
    angle: i * (360 / 14) + 12,
    delay: 2.1 + (i % 3) * 0.11,
    scale: 0.76,
    length: 88,
    width: 22,
  }));

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

  readonly sunRays = Array.from({ length: 16 }, (_, i) => ({
    angle: i * (360 / 16),
  }));

  readonly auraSparks = Array.from({ length: 12 }, (_, i) => ({
    delay: i * 0.5,
    duration: 3.5 + (i % 4) * 0.8,
    radius: 65 + (i % 6) * 18,
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
