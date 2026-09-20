import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-letter-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="w-full max-w-lg mx-auto glass-card rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl relative border border-amber-300/30 overflow-hidden transition-all duration-700 animate-float-gentle"
    >
      <!-- Cinta decorativa superior -->
      <div
        class="absolute -top-10 -right-10 w-28 h-28 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"
      ></div>
      <div
        class="absolute -bottom-10 -left-10 w-28 h-28 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none"
      ></div>

      <!-- Encabezado de la carta -->
      <div class="flex items-center justify-between border-b border-amber-200/20 pb-4 mb-5">
        <div class="flex items-center gap-2">
          <span class="text-2xl animate-bounce">🌻</span>
          <span class="text-xs uppercase tracking-widest text-amber-300 font-semibold">
            Un detalle eterno
          </span>
        </div>
        <div class="text-xs text-amber-200/60 font-sans-custom">
          21 de Septiembre
        </div>
      </div>

      <!-- Para: [Nombre editable] -->
      <div class="mb-4">
        <div class="text-xs text-amber-300/80 uppercase font-semibold tracking-wider">
          Para:
        </div>
        @if (isEditingName()) {
          <div class="flex gap-2 mt-1">
            <input
              type="text"
              [(ngModel)]="recipientName"
              class="bg-slate-900/80 border border-amber-400/50 rounded-xl px-3 py-1.5 text-amber-200 font-serif-custom text-xl w-full focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Escribe su nombre..."
              (keyup.enter)="saveName()"
            />
            <button
              (click)="saveName()"
              class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-3 py-1 rounded-xl text-sm transition-colors"
            >
              Guardar
            </button>
          </div>
        } @else {
          <div class="flex items-center gap-2 group">
            <h2 class="text-2xl sm:text-3xl font-serif-custom font-bold text-amber-200">
              {{ recipientName }}
            </h2>
            <button
              (click)="isEditingName.set(true)"
              class="opacity-50 group-hover:opacity-100 hover:text-amber-300 text-xs text-slate-300 transition-opacity flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full"
              title="Personalizar nombre"
            >
              <span>✎ Editar</span>
            </button>
          </div>
        }
      </div>

      <!-- Cita poética de Floricienta -->
      <div class="bg-amber-400/10 border-l-2 border-amber-400 px-4 py-2 rounded-r-xl mb-5 text-amber-100/90 text-sm font-script-custom text-lg sm:text-xl">
        "Ella sabía que él sabía, que algún día pasaría... y vendría a buscarla con sus flores amarillas." ✨
      </div>

      <!-- Cuerpo del mensaje emotivo -->
      <div class="space-y-3.5 text-slate-200 leading-relaxed font-sans-custom text-sm sm:text-base mb-6">
        <p>
          Hoy no podía dejar pasar este día sin entregarte las flores amarillas que tanto mereces.
        </p>
        <p>
          Esta flor es especial porque <strong class="text-amber-300 font-medium">nunca se va a marchitar</strong>, al igual que el cariño tan genuino que siento por ti. Cada pétalo dorado representa una sonrisa compartida, tu alegría que ilumina cualquier lugar y la promesa de estar siempre a tu lado.
        </p>
        <p class="text-amber-100 font-serif-custom italic text-base sm:text-lg">
          Gracias por existir y por hacer que el mundo sea un lugar más cálido y luminoso. ¡Feliz día de las flores amarillas! 💛
        </p>
      </div>

      <!-- Firma con tipografía manuscrita -->
      <div class="text-right border-t border-amber-200/15 pt-3 mb-6">
        <p class="text-xs text-amber-300/70 uppercase tracking-wider font-semibold">Con todo mi cariño,</p>
        <p class="font-script-custom text-2xl sm:text-3xl text-amber-200 mt-1">
          Siempre contigo ✨
        </p>
      </div>

      <!-- Botones interactivos de acción -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
        <button
          (click)="onBurstPetals()"
          class="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-semibold px-3 py-2.5 rounded-2xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95"
        >
          <span>🌻 Lluvia</span>
        </button>

        <button
          (click)="onToggleAudio()"
          class="flex items-center justify-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-amber-300/30 text-amber-200 font-medium px-3 py-2.5 rounded-2xl text-xs sm:text-sm transition-all active:scale-95"
        >
          <span>{{ isAudioMuted ? '🔇 Silencio' : '🎵 Música' }}</span>
        </button>

        <button
          (click)="onReplayBloom()"
          class="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-amber-300/30 text-amber-200 font-medium px-3 py-2.5 rounded-2xl text-xs sm:text-sm transition-all active:scale-95"
          title="Ver florecer de nuevo"
        >
          <span>↺ Florecer</span>
        </button>
      </div>
    </div>
  `,
})
export class LetterModalComponent {
  @Input() isAudioMuted = false;
  @Output() burstPetals = new EventEmitter<void>();
  @Output() toggleAudio = new EventEmitter<void>();
  @Output() replayBloom = new EventEmitter<void>();

  recipientName = 'Mi Persona Favorita 💛';
  isEditingName = signal(false);

  saveName() {
    if (!this.recipientName.trim()) {
      this.recipientName = 'Para Ti ✨';
    }
    this.isEditingName.set(false);
  }

  onBurstPetals() {
    this.burstPetals.emit();
  }

  onToggleAudio() {
    this.toggleAudio.emit();
  }

  onReplayBloom() {
    this.replayBloom.emit();
  }
}
