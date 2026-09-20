import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface PetalConfig {
  angle: number;
  delay: number;
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

  // Capa exterior de 16 pétalos
  readonly outerPetals: PetalConfig[] = Array.from({ length: 16 }, (_, i) => ({
    angle: i * (360 / 16),
    delay: 1.4 + (i % 4) * 0.12 + Math.random() * 0.15,
  }));

  // Capa interior de 16 pétalos intercalados
  readonly innerPetals: PetalConfig[] = Array.from({ length: 16 }, (_, i) => ({
    angle: i * (360 / 16) + 11.25,
    delay: 1.8 + (i % 3) * 0.14 + Math.random() * 0.1,
  }));

  onFlowerClick() {
    this.flowerClicked.emit();
  }
}
