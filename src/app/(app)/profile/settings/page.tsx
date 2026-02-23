"use client";

import { Card } from "@/components/ui/Card";
import { useGameStore } from "@/stores/game-store";
import { SENSORY_PROFILES, type SensoryProfile } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

const SENSORY_EMOJIS: Record<SensoryProfile, string> = {
  standard: "🎨",
  calm: "🌿",
  minimal: "🔲",
};

const SENSORY_LABELS: Record<SensoryProfile, { title: string; desc: string }> = {
  standard: { title: "Normal", desc: "Animaciones y colores completos" },
  calm: { title: "Tranquilo", desc: "Colores suaves, animaciones lentas" },
  minimal: { title: "Mínimo", desc: "Sin animaciones, muy simple" },
};

const TEXT_SIZE_OPTIONS = [
  { value: "small" as const, label: "A", desc: "Pequeña", size: "text-sm" },
  { value: "medium" as const, label: "A", desc: "Normal", size: "text-base" },
  { value: "large" as const, label: "A", desc: "Grande", size: "text-lg" },
  { value: "xlarge" as const, label: "A", desc: "Muy grande", size: "text-xl" },
];

const CELEBRATION_OPTIONS = [
  { value: "full" as const, emoji: "🎉", label: "¡A tope!" },
  { value: "moderate" as const, emoji: "🎊", label: "Normal" },
  { value: "subtle" as const, emoji: "👍", label: "Sutil" },
  { value: "none" as const, emoji: "🔇", label: "Sin" },
];

export default function SettingsPage() {
  const {
    sensoryMode, setSensoryMode,
    reducedMotion, setReducedMotion,
    textSize, setTextSize,
    highContrast, setHighContrast,
    celebrationLevel, setCelebrationLevel,
    reducedSound, setReducedSound,
    timerVisible, setTimerVisible,
  } = useGameStore();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-3"
        >
          ← Volver al perfil
        </Link>
        <h1 className="text-3xl font-bold text-[var(--color-text)]">
          ⚙️ Ajustes
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] mt-1">
          Personaliza cómo funciona la app
        </p>
      </div>

      {/* Sensory Mode - most important for TEA */}
      <Card padding="lg">
        <h2 className="text-lg font-bold text-[var(--color-text)] mb-1">
          🧠 Modo sensorial
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          Elige cómo quieres que se vea y se sienta la app
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(Object.keys(SENSORY_PROFILES) as SensoryProfile[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSensoryMode(mode)}
              className={cn(
                "p-4 rounded-[var(--radius-lg)] border-2 text-center transition-all duration-200",
                sensoryMode === mode
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] shadow-md scale-[1.03]"
                  : "border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:scale-[1.02]"
              )}
            >
              <span className="text-4xl block mb-2">{SENSORY_EMOJIS[mode]}</span>
              <p className="font-bold text-[var(--color-text)]">
                {SENSORY_LABELS[mode].title}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                {SENSORY_LABELS[mode].desc}
              </p>
            </button>
          ))}
        </div>
      </Card>

      {/* Visual settings */}
      <Card padding="lg">
        <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">
          👁️ Visual
        </h2>
        <div className="space-y-5">
          <ToggleSetting
            emoji="🎬"
            label="Reducir movimiento"
            description="Quita animaciones y transiciones"
            checked={reducedMotion}
            onChange={setReducedMotion}
          />
          <ToggleSetting
            emoji="🔲"
            label="Alto contraste"
            description="Colores más fuertes para ver mejor"
            checked={highContrast}
            onChange={setHighContrast}
          />
          <ToggleSetting
            emoji="⏱️"
            label="Mostrar temporizadores"
            description="Muestra el tiempo en los ejercicios"
            checked={timerVisible}
            onChange={setTimerVisible}
          />
        </div>
      </Card>

      {/* Text size - big visual buttons */}
      <Card padding="lg">
        <h2 className="text-lg font-bold text-[var(--color-text)] mb-1">
          🔤 Tamaño de texto
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          Elige el tamaño que te resulte más cómodo
        </p>
        <div className="grid grid-cols-4 gap-2">
          {TEXT_SIZE_OPTIONS.map(({ value, label, desc, size }) => (
            <button
              key={value}
              onClick={() => setTextSize(value)}
              className={cn(
                "flex flex-col items-center gap-1 py-3 px-2 rounded-[var(--radius-md)] font-medium transition-all duration-200",
                textSize === value
                  ? "bg-[var(--color-primary)] text-white shadow-md scale-[1.05]"
                  : "bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] hover:scale-[1.02]"
              )}
            >
              <span className={cn("font-bold", size)}>{label}</span>
              <span className="text-xs">{desc}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Sound */}
      <Card padding="lg">
        <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">
          🔊 Sonido
        </h2>
        <div className="space-y-5">
          <ToggleSetting
            emoji="🔇"
            label="Reducir sonidos"
            description="Quita los efectos de sonido de la app"
            checked={reducedSound}
            onChange={setReducedSound}
          />

          <div>
            <p className="font-medium text-[var(--color-text)] mb-3">
              🎉 Nivel de celebración
            </p>
            <div className="grid grid-cols-4 gap-2">
              {CELEBRATION_OPTIONS.map(({ value, emoji, label }) => (
                <button
                  key={value}
                  onClick={() => setCelebrationLevel(value)}
                  className={cn(
                    "flex flex-col items-center gap-1 py-3 px-2 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200",
                    celebrationLevel === value
                      ? "bg-[var(--color-primary)] text-white shadow-md scale-[1.05]"
                      : "bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] hover:scale-[1.02]"
                  )}
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ToggleSetting({
  emoji,
  label,
  description,
  checked,
  onChange,
}: {
  emoji: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="text-xl">{emoji}</span>
        <div>
          <p className="font-medium text-[var(--color-text)]">{label}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "w-14 h-8 rounded-full transition-all relative shrink-0",
          checked ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"
        )}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        <span
          className={cn(
            "block w-6 h-6 bg-white rounded-full shadow-md transition-transform absolute top-1",
            checked ? "translate-x-7" : "translate-x-1"
          )}
        />
        <span className="sr-only">{checked ? "Activado" : "Desactivado"}</span>
      </button>
    </div>
  );
}
