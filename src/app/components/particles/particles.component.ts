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

interface MiniFlower {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  isWhite: boolean;
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
  private miniFlowers: MiniFlower[] = [];
  isSecretMode = false;

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

  private createMiniFlower(x: number, y: number): MiniFlower {
    return {
      x,
      y,
      size: 8 + Math.random() * 10,
      speedY: 0.6 + Math.random() * 1.2,
      speedX: (Math.random() - 0.5) * 0.8,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      opacity: 0.6 + Math.random() * 0.35,
      isWhite: true,
    };
  }

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
   * Dispara una explosión masiva de flores y destellos celestiales
   */
  burstWhiteSparks(count = 50) {
    const w = window.innerWidth;
    const celestialColors = ['#ffffff', '#e0f2fe', '#bae6fd', '#fef08a', '#f3e8ff'];
    for (let i = 0; i < count; i++) {
      const p = this.createPetal(w * 0.1 + Math.random() * (w * 0.8), -20 - Math.random() * 120);
      p.speedY = 1.2 + Math.random() * 2.5;
      p.size = 12 + Math.random() * 12;
      p.color = celestialColors[Math.floor(Math.random() * celestialColors.length)];
      p.opacity = 0.85;
      this.petals.push(p);

      const s = this.createSparkle(w * 0.1 + Math.random() * (w * 0.8), window.innerHeight * 0.5 + (Math.random() - 0.5) * 300);
      s.color = '#ffffff';
      s.radius = 2.5 + Math.random() * 3;
      s.alpha = 1;
      this.sparkles.push(s);
    }

    // Disparar oleada de mini flores flotantes
    for (let i = 0; i < 24; i++) {
      this.miniFlowers.push(this.createMiniFlower(Math.random() * w, -30 - Math.random() * 150));
    }
  }

  setSecretMode(active: boolean) {
    this.isSecretMode = active;
    if (active && this.miniFlowers.length < 15) {
      const w = window.innerWidth;
      for (let i = 0; i < 20; i++) {
        this.miniFlowers.push(this.createMiniFlower(Math.random() * w, Math.random() * window.innerHeight));
      }
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

    // 1. Dibujar destellos de polen / luciérnagas
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
      this.ctx.shadowColor = this.isSecretMode ? '#bae6fd' : '#facc15';
      this.ctx.fill();
      this.ctx.restore();
    }

    // 2. Dibujar pétalos flotantes
    for (let i = this.petals.length - 1; i >= 0; i--) {
      const p = this.petals[i];
      p.y += p.speedY;
      p.x += Math.sin(p.flip) * 1.2 + p.speedX;
      p.rotation += p.rotationSpeed;
      p.flip += p.flipSpeed;

      if (p.y > h + 30) {
        if (this.petals.length > 60) {
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
      this.ctx.shadowColor = this.isSecretMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(234, 179, 8, 0.4)';
      this.ctx.fill();
      this.ctx.restore();
    }

    // 3. Dibujar mini flores celestiales flotantes en modo secreto
    for (let i = this.miniFlowers.length - 1; i >= 0; i--) {
      const mf = this.miniFlowers[i];
      mf.y += mf.speedY;
      mf.x += Math.sin(mf.rotation * 0.02) * 0.6 + mf.speedX;
      mf.rotation += mf.rotationSpeed;

      if (mf.y > h + 30) {
        if (!this.isSecretMode || this.miniFlowers.length > 35) {
          this.miniFlowers.splice(i, 1);
          continue;
        }
        mf.y = -20;
        mf.x = Math.random() * w;
      }

      this.ctx.save();
      this.ctx.translate(mf.x, mf.y);
      this.ctx.rotate((mf.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = mf.opacity;

      // 6 pétalos de flor blanca
      for (let j = 0; j < 6; j++) {
        this.ctx.save();
        this.ctx.rotate((j * 60 * Math.PI) / 180);
        this.ctx.beginPath();
        this.ctx.ellipse(0, -mf.size * 0.7, mf.size * 0.35, mf.size * 0.6, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = '#e0f2fe';
        this.ctx.fill();
        this.ctx.restore();
      }

      // Centro dorado
      this.ctx.beginPath();
      this.ctx.arc(0, 0, mf.size * 0.3, 0, Math.PI * 2);
      this.ctx.fillStyle = '#facc15';
      this.ctx.fill();

      this.ctx.restore();
    }
  }
}
