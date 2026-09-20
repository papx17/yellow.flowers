import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface EmotionPhrase {
  quote: string;
  body: string[];
  highlight: string;
}

@Component({
  selector: 'app-letter-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="w-full max-w-lg mx-auto rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl relative overflow-hidden transition-all duration-700 animate-float-gentle"
      [ngClass]="{
        'glass-card border-amber-300/30': !isSecretMode,
        'bg-slate-950/85 backdrop-blur-2xl border-2 border-white/60 shadow-[0_0_50px_rgba(255,255,255,0.25)]': isSecretMode
      }"
    >
      <!-- Resplandores de fondo -->
      @if (!isSecretMode) {
        <div class="absolute -top-10 -right-10 w-28 h-28 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>
        <div class="absolute -bottom-10 -left-10 w-28 h-28 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none"></div>
      } @else {
        <div class="absolute -top-12 -right-12 w-36 h-36 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-12 -left-12 w-36 h-36 bg-fuchsia-300/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-amber-200/5 pointer-events-none"></div>
      }

      <!-- Encabezado de la carta -->
      <div
        class="flex items-center justify-between border-b pb-4 mb-5"
        [ngClass]="isSecretMode ? 'border-white/20' : 'border-amber-200/20'"
      >
        <div class="flex items-center gap-2">
          <span class="text-2xl animate-bounce">
            {{ isSecretMode ? '🤍' : '🌻' }}
          </span>
          <span
            class="text-xs uppercase tracking-widest font-semibold"
            [ngClass]="isSecretMode ? 'text-cyan-200' : 'text-amber-300'"
          >
            {{ isSecretMode ? 'Detalle Exclusivo y Secreto' : 'Un detalle eterno' }}
          </span>
        </div>
        <div
          class="text-xs font-sans-custom flex items-center gap-2"
        >
          @if (!isSecretMode) {
            <div class="inline-flex rounded-full bg-slate-900/60 p-0.5 border border-amber-300/30 text-[10px]">
              <button
                (click)="onSetViewMode('bouquet')"
                class="px-2 py-0.5 rounded-full transition-all"
                [ngClass]="viewMode === 'bouquet' ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'text-amber-200/70 hover:text-white'"
              >
                💐 Ramillete
              </button>
              <button
                (click)="onSetViewMode('meadow')"
                class="px-2 py-0.5 rounded-full transition-all"
                [ngClass]="viewMode === 'meadow' ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'text-amber-200/70 hover:text-white'"
              >
                🌾 Pradera
              </button>
            </div>
          } @else {
            <span class="text-white/70">Para Katze ✨</span>
          }
        </div>
      </div>

      <!-- MODO NORMAL: Destinatario editable y frases rotativas -->
      @if (!isSecretMode) {
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

        <!-- Cita poética actual -->
        <div class="bg-amber-400/10 border-l-2 border-amber-400 px-4 py-2.5 rounded-r-xl mb-5 text-amber-100/90 font-script-custom text-lg sm:text-xl">
          {{ currentPhrase.quote }}
        </div>

        <!-- Cuerpo del mensaje emotivo -->
        <div class="space-y-3.5 text-slate-200 leading-relaxed font-sans-custom text-sm sm:text-base mb-6">
          @for (paragraph of currentPhrase.body; track paragraph) {
            <p [innerHTML]="paragraph"></p>
          }
          <p class="text-amber-100 font-serif-custom italic text-base sm:text-lg">
            {{ currentPhrase.highlight }}
          </p>
        </div>

        <!-- Firma -->
        <div class="text-right border-t border-amber-200/15 pt-3 mb-6">
          <p class="text-xs text-amber-300/70 uppercase tracking-wider font-semibold">Con todo mi cariño,</p>
          <p class="font-script-custom text-2xl sm:text-3xl text-amber-200 mt-1">
            Siempre contigo ✨
          </p>
        </div>
      } @else {
        <!-- MODO SECRETO: FLOR MÁS HERMOSA PARA KATZE -->
        <div class="py-2 text-center space-y-4">
          <div class="inline-block bg-white/10 border border-white/30 px-3 py-1 rounded-full text-xs text-cyan-200 tracking-wider uppercase font-semibold">
            ✨ Mensaje Especial Dedicado ✨
          </div>

          <h2 class="text-2xl sm:text-3xl font-serif-custom font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
            Esto esta especialmente hecho para tí Katze
          </h2>

          <div class="bg-gradient-to-r from-transparent via-white/10 to-transparent p-4 rounded-2xl text-slate-200 text-sm sm:text-base leading-relaxed space-y-3 font-sans-custom">
            <p>
              Entre todas las flores de la pradera, ninguna brilla con la pureza, magia y luz única que tú transmites.
            </p>
            <p>
              Esta flor celestial de pétalos de nácar y corazón de estrellas fue creada exclusivamente pensando en ti, para recordarte lo profundamente especial e inolvidable que eres.
            </p>
            <p class="text-cyan-200 font-serif-custom italic text-lg sm:text-xl">
              Que nunca te falten razones para sonreír ni flores que celebren tu existir. 🤍✨
            </p>
          </div>

          <!-- Firma con Atte: -D -->
          <div class="pt-4 border-t border-white/20 flex flex-col items-end">
            <span class="text-xs text-cyan-300 uppercase tracking-widest font-semibold">Con aprecio infinito,</span>
            <span class="font-serif-custom text-3xl font-bold text-white tracking-wider mt-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
              Atte: -D
            </span>
          </div>
        </div>
      }

      <!-- Botones de Acción -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
        <button
          (click)="onBurstPetals()"
          class="flex items-center justify-center gap-1.5 font-semibold px-3 py-2.5 rounded-2xl text-xs sm:text-sm shadow-lg transition-all active:scale-95"
          [ngClass]="isSecretMode
            ? 'bg-gradient-to-r from-white via-cyan-100 to-amber-100 hover:from-white hover:to-cyan-200 text-slate-950 shadow-white/20'
            : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/20'"
        >
          <span>{{ isSecretMode ? '✨ Destellos' : '🌻 Lluvia' }}</span>
        </button>

        <button
          (click)="onToggleAudio()"
          class="flex items-center justify-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 border text-amber-200 font-medium px-3 py-2.5 rounded-2xl text-xs sm:text-sm transition-all active:scale-95"
          [ngClass]="isSecretMode ? 'border-white/30 text-white' : 'border-amber-300/30 text-amber-200'"
        >
          <span>{{ isAudioMuted ? '🔇 Silencio' : '🎵 Melodía' }}</span>
        </button>

        @if (!isSecretMode) {
          <button
            (click)="onReplayBloom()"
            class="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-amber-300/30 text-amber-200 font-medium px-3 py-2.5 rounded-2xl text-xs sm:text-sm transition-all active:scale-95"
            title="Ver florecer de nuevo con otra frase"
          >
            <span>↺ Florecer</span>
          </button>
        } @else {
          <button
            (click)="onExitSecretMode()"
            class="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-300/40 text-amber-200 font-medium px-3 py-2.5 rounded-2xl text-xs sm:text-sm transition-all active:scale-95"
            title="Volver a la pradera amarilla"
          >
            <span>🌻 Pradera</span>
          </button>
        }
      </div>

      <!-- Botón para alternar frase manualmente en modo normal -->
      @if (!isSecretMode) {
        <div class="mt-3 text-center">
          <button
            (click)="onChangePhrase()"
            class="text-[11px] text-amber-300/70 hover:text-amber-200 underline decoration-amber-400/40 hover:decoration-amber-300 transition-colors"
          >
            💌 Leer otra dedicatoria (Frase {{ phraseIndex + 1 }} de {{ phrases.length }})
          </button>
        </div>
      }
    </div>
  `,
})
export class LetterModalComponent {
  @Input() isAudioMuted = false;
  @Input() isSecretMode = false;
  @Input() phraseIndex = 0;
  @Input() viewMode: 'bouquet' | 'meadow' = 'bouquet';

  @Output() burstPetals = new EventEmitter<void>();
  @Output() toggleAudio = new EventEmitter<void>();
  @Output() replayBloom = new EventEmitter<void>();
  @Output() changePhrase = new EventEmitter<void>();
  @Output() exitSecretMode = new EventEmitter<void>();
  @Output() setViewMode = new EventEmitter<'bouquet' | 'meadow'>();

  recipientName = 'Mi Persona Favorita 💛';
  isEditingName = signal(false);

  readonly phrases: EmotionPhrase[] = [
    {
      quote: '"Ella sabía que él sabía, que algún día pasaría... y vendría a buscarla con sus flores amarillas." ✨',
      body: [
        'Hoy no podía dejar pasar este día sin entregarte las flores amarillas que tanto mereces.',
        'Esta flor es especial porque <strong class="text-amber-300 font-medium">nunca se va a marchitar</strong>, al igual que el cariño tan genuino que siento por ti. Cada pétalo dorado representa una sonrisa compartida, tu luz y la promesa de estar siempre a tu lado.',
      ],
      highlight: 'Gracias por existir y por hacer que el mundo sea un lugar más cálido y luminoso. ¡Feliz día de las flores amarillas! 💛',
    },
    {
      quote: '"Dicen que las flores amarillas representan la luz del sol convertida en pétalos sobre la tierra." ☀️',
      body: [
        'Y tú eres exactamente eso: esa calidez que alegra los días más fríos, esa risa sincera que contagia y esa presencia que hace que todo sea más bonito.',
        'No hay distancia ni tiempo que apague lo que transmites con tu corazón.',
      ],
      highlight: 'Que esta pradera de flores amarillas te recuerde lo profundamente importante y valiosa que eres para mí. ✨💛',
    },
    {
      quote: '"Hay personas que florecen en el alma sin importar la estación del año." 🌼',
      body: [
        'Estas flores no necesitan agua ni tierra, porque se alimentan de los recuerdos bonitos y de los momentos especiales que compartimos.',
        'Si pudiera darte una flor por cada vez que me has hecho sonreír, no alcanzaría todo este campo dorado.',
      ],
      highlight: '¡Feliz 21 de septiembre! Que la vida siempre te regale razones para sonreír. 💛',
    },
    {
      quote: '"El 21 de septiembre no es solo una fecha; es el recordatorio de que las promesas más bonitas se cumplen." 🌻',
      body: [
        'Promesas de estar, de acompañar, de celebrar tus triunfos y de sonreír contigo en cada paso.',
        'Hoy te entrego un pedacito de sol hecho flor para que te acompañe siempre.',
      ],
      highlight: 'Mereces todo el amor, toda la paz y toda la magia del mundo. ¡Nunca dejes de brillar! ✨',
    },
    {
      quote: '"En un mundo lleno de prisa, detenerse a regalar flores amarillas es un acto de amor puro." 💛',
      body: [
        'Quería que al abrir este regalo sintieras un abrazo cálido y la certeza de que alguien piensa en ti con inmenso cariño.',
        'Cada flor que se abre en este ramillete lleva consigo un deseo sincero de felicidad infinita para ti.',
      ],
      highlight: 'Siempre estaré aquí para ti, hoy y en todas las primaveras que vendrán. 🌻✨',
    },
  ];

  get currentPhrase(): EmotionPhrase {
    return this.phrases[this.phraseIndex % this.phrases.length];
  }

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

  onChangePhrase() {
    this.changePhrase.emit();
  }

  onExitSecretMode() {
    this.exitSecretMode.emit();
  }

  onSetViewMode(mode: 'bouquet' | 'meadow') {
    this.setViewMode.emit(mode);
  }
}
