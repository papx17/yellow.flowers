import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  HostListener,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  color: string;
  opacity: number;
}

interface Sparkle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  targetAlpha: number;
  speedY: number;
  speedX: number;
  color: string;
}

@Component({
  selector: 'app-particles',
  standalone: true,
  template: `
    <canvas
      #canvas
      class="fixed inset-0 pointer-events-none z-0 w-full h-full"
    ></canvas>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ParticlesComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private platformId = inject(PLATFORM_ID);
  private ctx: CanvasRenderingContext2D | null = null;
  private animId: number | null = null;

  private petals: Petal[] = [];
  private sparkles: Sparkle[] = [];

  private petalColors = [
    '#fef08a', // yellow-200
    '#fde047', // yellow-300
    '#facc15', // yellow-400
    '#eab308', // yellow-500
    '#fbbf24', // amber-400
    '#f59e0b', // amber-500
  ];

  @HostListener('window:resize')
  onResize() {
    this.updateCanvasDimensions();
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    this.updateCanvasDimensions();
    this.initParticles();
    this.startAnimation();
  }

  ngOnDestroy() {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
    }
  }

  private updateCanvasDimensions() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private initParticles() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Inicializar pétalos
    const petalCount = Math.min(35, Math.floor(w / 35));
    this.petals = [];
    for (let i = 0; i < petalCount; i++) {
      this.petals.push(this.createPetal(Math.random() * w, Math.random() * h));
    }

    // Inicializar polen brillante / luciérnagas
    const sparkleCount = Math.min(45, Math.floor(w / 25));
    this.sparkles = [];
    for (let i = 0; i < sparkleCount; i++) {
      this.sparkles.push(this.createSparkle(Math.random() * w, Math.random() * h));
    }
  }

  private createPetal(x: number, y: number): Petal {
    return {
      x,
      y,
      size: 10 + Math.random() * 14,
      speedY: 0.8 + Math.random() * 1.6,
      speedX: -0.5 + Math.random() * 1.0,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      flip: Math.random() * Math.PI,
      flipSpeed: 0.02 + Math.random() * 0.03,
      color: this.petalColors[Math.floor(Math.random() * this.petalColors.length)],
      opacity: 0.4 + Math.random() * 0.5,
    };
  }

  private createSparkle(x: number, y: number): Sparkle {
    return {
      x,
      y,
      radius: 1 + Math.random() * 2.2,
      alpha: Math.random() * 0.8,
      targetAlpha: 0.2 + Math.random() * 0.8,
      speedY: -0.2 - Math.random() * 0.4,
      speedX: (Math.random() - 0.5) * 0.3,
      color: Math.random() > 0.3 ? '#fde047' : '#ffffff',
    };
  }

  /**
   * Dispara una explosión festiva de pétalos dorados
   */
  burstPetals(count = 25) {
    const w = window.innerWidth;
    for (let i = 0; i < count; i++) {
      const p = this.createPetal(w * 0.2 + Math.random() * (w * 0.6), -20 - Math.random() * 100);
      p.speedY = 1.5 + Math.random() * 2.5;
      p.size = 14 + Math.random() * 12;
      this.petals.push(p);
    }
  }

  /**
   * Dispara una explosión de destellos blancos, plateados y celestes celestiales
   */
  burstWhiteSparks(count = 35) {
    const w = window.innerWidth;
    const celestialColors = ['#ffffff', '#e0f2fe', '#bae6fd', '#fef08a', '#f3e8ff'];
    for (let i = 0; i < count; i++) {
      const p = this.createPetal(w * 0.15 + Math.random() * (w * 0.7), -20 - Math.random() * 80);
      p.speedY = 1.2 + Math.random() * 2.2;
      p.size = 12 + Math.random() * 10;
      p.color = celestialColors[Math.floor(Math.random() * celestialColors.length)];
      p.opacity = 0.8;
      this.petals.push(p);

      const s = this.createSparkle(w * 0.2 + Math.random() * (w * 0.6), window.innerHeight * 0.4 + (Math.random() - 0.5) * 200);
      s.color = '#ffffff';
      s.radius = 2.5 + Math.random() * 2.5;
      s.alpha = 1;
      this.sparkles.push(s);
    }
  }

  private startAnimation() {
    const render = () => {
      this.draw();
      this.animId = requestAnimationFrame(render);
    };
    this.animId = requestAnimationFrame(render);
  }

  private draw() {
    if (!this.ctx) return;
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.width;
    const h = canvas.height;

    this.ctx.clearRect(0, 0, w, h);

    // Dibujar destellos de polen / luciérnagas
    for (const s of this.sparkles) {
      s.y += s.speedY;
      s.x += s.speedX;
      s.alpha += (s.targetAlpha - s.alpha) * 0.03;
      if (Math.abs(s.alpha - s.targetAlpha) < 0.05) {
        s.targetAlpha = 0.1 + Math.random() * 0.8;
      }

      if (s.y < -10) {
        s.y = h + 10;
        s.x = Math.random() * w;
      }

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = '#facc15';
      this.ctx.fill();
      this.ctx.restore();
    }

    // Dibujar pétalos flotantes
    for (let i = this.petals.length - 1; i >= 0; i--) {
      const p = this.petals[i];
      p.y += p.speedY;
      p.x += Math.sin(p.flip) * 1.2 + p.speedX;
      p.rotation += p.rotationSpeed;
      p.flip += p.flipSpeed;

      // Si sobrepasa el fondo, reubicar arriba
      if (p.y > h + 30) {
        if (this.petals.length > 50) {
          this.petals.splice(i, 1);
          continue;
        }
        p.y = -20;
        p.x = Math.random() * w;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.scale(Math.cos(p.flip), 1);

      this.ctx.beginPath();
      // Forma de pétalo curvo orgánico
      this.ctx.moveTo(0, 0);
      this.ctx.bezierCurveTo(
        -p.size * 0.6,
        -p.size * 0.8,
        -p.size * 0.4,
        -p.size * 1.6,
        0,
        -p.size * 1.8
      );
      this.ctx.bezierCurveTo(
        p.size * 0.4,
        -p.size * 1.6,
        p.size * 0.6,
        -p.size * 0.8,
        0,
        0
      );

      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.opacity;
      this.ctx.shadowBlur = 4;
      this.ctx.shadowColor = 'rgba(234, 179, 8, 0.4)';
      this.ctx.fill();

      // Línea de nervadura central del pétalo
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0, -p.size * 1.3);
      this.ctx.strokeStyle = 'rgba(217, 119, 6, 0.3)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      this.ctx.restore();
    }
  }
}
