"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/game-store";
import { INITIAL_THEMES, SENSORY_PROFILES, type SensoryProfile } from "@/lib/utils/constants";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

type Step = "welcome" | "name" | "photo" | "preferences" | "themes" | "complete";
const STEPS: Step[] = ["welcome", "name", "photo", "preferences", "themes", "complete"];

const SENSORY_INFO: Record<SensoryProfile, { emoji: string; title: string; desc: string }> = {
  standard: { emoji: "🎨", title: "Normal", desc: "Animaciones y colores completos" },
  calm: { emoji: "🌿", title: "Tranquilo", desc: "Colores suaves, animaciones lentas" },
  minimal: { emoji: "🔲", title: "Minimo", desc: "Sin animaciones, muy simple" },
};

// Compress image to small avatar size to fit in localStorage
function compressImage(dataUrl: string, maxSize = 128): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = maxSize;
      canvas.height = maxSize;
      const ctx = canvas.getContext("2d")!;
      // Draw centered/cropped square
      const minDim = Math.min(img.width, img.height);
      const sx = (img.width - minDim) / 2;
      const sy = (img.height - minDim) / 2;
      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, maxSize, maxSize);
      resolve(canvas.toDataURL("image/jpeg", 0.6));
    };
    img.src = dataUrl;
  });
}

export default function OnboardingPage() {
  const router = useRouter();
  const {
    onboardingComplete,
    setPlayerName,
    setAvatarUrl,
    setSensoryMode,
    setFavoriteThemes,
    completeOnboarding,
    sensoryMode,
  } = useGameStore();

  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<SensoryProfile>("standard");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (onboardingComplete) {
      router.replace("/dashboard");
    }
  }, [onboardingComplete, router]);

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = ((stepIndex) / (STEPS.length - 1)) * 100;

  function goNext() {
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) {
      setDirection("forward");
      setCurrentStep(STEPS[idx + 1]);
    }
  }

  function goBack() {
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) {
      setDirection("back");
      setCurrentStep(STEPS[idx - 1]);
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const result = reader.result as string;
      const compressed = await compressImage(result);
      setAvatarPreview(compressed);
    };
    reader.readAsDataURL(file);
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 320, height: 320 },
      });
      setCameraStream(stream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      // Camera not available — just show file upload
    }
  }

  function capturePhoto() {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, 128, 128);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
    setAvatarPreview(dataUrl);
    stopCamera();
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
  }

  function toggleTheme(slug: string) {
    setSelectedThemes((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]
    );
  }

  function handleFinish() {
    setPlayerName(name || "Aventurero");
    setAvatarUrl(avatarPreview);
    setSensoryMode(selectedMode);
    if (selectedThemes.length > 0) {
      setFavoriteThemes(selectedThemes);
    }
    completeOnboarding();
    router.replace("/dashboard");
  }

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cameraStream]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress bar */}
      {currentStep !== "welcome" && (
        <div className="mb-6">
          <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1 text-center">
            Paso {stepIndex} de {STEPS.length - 1}
          </p>
        </div>
      )}

      {/* Steps */}
      <div
        key={currentStep}
        className={cn(
          "animate-slide-up"
        )}
      >
        {/* === WELCOME === */}
        {currentStep === "welcome" && (
          <div className="text-center space-y-6">
            <div className="text-7xl animate-bounce-subtle">🎮</div>
            <h1 className="text-3xl font-bold text-[var(--color-text)]">
              Speak<span className="text-[var(--color-primary)]">Quest</span>
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)]">
              Aprende ingles como si fuera un videojuego
            </p>
            <div className="space-y-3 text-left max-w-xs mx-auto">
              {[
                { emoji: "🎯", text: "Ejercicios divertidos" },
                { emoji: "🃏", text: "Colecciona cartas de vocabulario" },
                { emoji: "🔥", text: "Mantén tu racha diaria" },
                { emoji: "🏆", text: "Sube de nivel y rango" },
              ].map(({ emoji, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-[var(--color-text)]">{text}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="w-full text-xl py-5 font-bold" onClick={goNext}>
              🚀 ¡Empezar!
            </Button>
          </div>
        )}

        {/* === NAME === */}
        {currentStep === "name" && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl block mb-3">👋</span>
              <h2 className="text-2xl font-bold text-[var(--color-text)]">
                ¿Como te llamas?
              </h2>
              <p className="text-[var(--color-text-secondary)] mt-1">
                Este sera tu nombre de aventurero
              </p>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre..."
              maxLength={20}
              autoFocus
              className="w-full text-center text-2xl font-bold px-4 py-4 rounded-[var(--radius-lg)] bg-[var(--color-bg-card)] border-2 border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
            />
            <div className="flex gap-3">
              <Button variant="ghost" size="lg" onClick={goBack} className="px-6">
                ←
              </Button>
              <Button size="lg" className="flex-1 text-lg font-bold" onClick={goNext}>
                Siguiente →
              </Button>
            </div>
          </div>
        )}

        {/* === PHOTO === */}
        {currentStep === "photo" && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl block mb-3">📸</span>
              <h2 className="text-2xl font-bold text-[var(--color-text)]">
                Tu foto de perfil
              </h2>
              <p className="text-[var(--color-text-secondary)] mt-1">
                Opcional — puedes saltarte este paso
              </p>
            </div>

            {/* Preview / Camera / Placeholder */}
            <div className="flex justify-center">
              {avatarPreview ? (
                <div className="relative">
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-40 h-40 rounded-full object-cover border-4 border-[var(--color-primary)] shadow-lg"
                  />
                  <button
                    onClick={() => setAvatarPreview(null)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--color-error)] text-white rounded-full flex items-center justify-center text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>
              ) : cameraActive ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-40 h-40 rounded-full object-cover border-4 border-[var(--color-primary)]"
                  />
                  <button
                    onClick={capturePhoto}
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-12 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-xl shadow-lg active:scale-95 transition-transform"
                  >
                    📷
                  </button>
                </div>
              ) : (
                <div className="w-40 h-40 rounded-full bg-[var(--color-bg-card)] border-4 border-dashed border-[var(--color-border)] flex items-center justify-center">
                  <span className="text-5xl">👤</span>
                </div>
              )}
            </div>

            {!avatarPreview && !cameraActive && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={startCamera}
                  className="flex flex-col items-center gap-2 p-4 rounded-[var(--radius-lg)] bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
                >
                  <span className="text-3xl">🤳</span>
                  <span className="text-sm font-medium text-[var(--color-text)]">Selfie</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-2 p-4 rounded-[var(--radius-lg)] bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
                >
                  <span className="text-3xl">🖼️</span>
                  <span className="text-sm font-medium text-[var(--color-text)]">Galeria</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            )}

            {cameraActive && !avatarPreview && (
              <Button variant="ghost" className="w-full" onClick={stopCamera}>
                Cancelar camara
              </Button>
            )}

            <div className="flex gap-3">
              <Button variant="ghost" size="lg" onClick={goBack} className="px-6">
                ←
              </Button>
              <Button size="lg" className="flex-1 text-lg font-bold" onClick={goNext}>
                {avatarPreview ? "Siguiente →" : "Saltar →"}
              </Button>
            </div>
          </div>
        )}

        {/* === PREFERENCES (Sensory Mode) === */}
        {currentStep === "preferences" && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl block mb-3">🧠</span>
              <h2 className="text-2xl font-bold text-[var(--color-text)]">
                ¿Como prefieres la app?
              </h2>
              <p className="text-[var(--color-text-secondary)] mt-1">
                Puedes cambiarlo luego en Ajustes
              </p>
            </div>

            <div className="space-y-3">
              {(Object.keys(SENSORY_PROFILES) as SensoryProfile[]).map((mode) => {
                const info = SENSORY_INFO[mode];
                return (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={cn(
                      "w-full p-4 rounded-[var(--radius-lg)] border-2 flex items-center gap-4 text-left transition-all duration-200",
                      selectedMode === mode
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] shadow-md scale-[1.02]"
                        : "border-[var(--color-border)] hover:border-[var(--color-text-muted)]"
                    )}
                  >
                    <span className="text-4xl">{info.emoji}</span>
                    <div>
                      <p className="font-bold text-[var(--color-text)]">{info.title}</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">{info.desc}</p>
                    </div>
                    {selectedMode === mode && (
                      <span className="ml-auto text-2xl">✅</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" size="lg" onClick={goBack} className="px-6">
                ←
              </Button>
              <Button size="lg" className="flex-1 text-lg font-bold" onClick={goNext}>
                Siguiente →
              </Button>
            </div>
          </div>
        )}

        {/* === THEMES === */}
        {currentStep === "themes" && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl block mb-3">📚</span>
              <h2 className="text-2xl font-bold text-[var(--color-text)]">
                ¿Que te gusta?
              </h2>
              <p className="text-[var(--color-text-secondary)] mt-1">
                Elige tus temas favoritos (al menos 1)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {INITIAL_THEMES.map((theme) => {
                const isSelected = selectedThemes.includes(theme.slug);
                return (
                  <button
                    key={theme.slug}
                    onClick={() => toggleTheme(theme.slug)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-[var(--radius-lg)] border-2 transition-all duration-200",
                      isSelected
                        ? "border-[var(--color-primary)] shadow-md scale-[1.05]"
                        : "border-[var(--color-border)] hover:scale-[1.02]"
                    )}
                    style={{
                      backgroundColor: isSelected ? `${theme.color}20` : undefined,
                    }}
                  >
                    <span className="text-4xl">{theme.emoji}</span>
                    <span className="font-medium text-sm text-[var(--color-text)]">
                      {theme.nameEs}
                    </span>
                    {isSelected && <span className="text-lg">✅</span>}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" size="lg" onClick={goBack} className="px-6">
                ←
              </Button>
              <Button
                size="lg"
                className="flex-1 text-lg font-bold"
                onClick={goNext}
                disabled={selectedThemes.length === 0}
              >
                Siguiente →
              </Button>
            </div>
          </div>
        )}

        {/* === COMPLETE === */}
        {currentStep === "complete" && (
          <div className="text-center space-y-6">
            <div className="text-7xl animate-bounce-subtle">🎉</div>
            <h2 className="text-3xl font-bold text-[var(--color-text)]">
              ¡Todo listo, {name || "Aventurero"}!
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)]">
              Tu aventura en ingles empieza ahora
            </p>

            {/* Summary card */}
            <Card padding="lg" className="text-left space-y-3">
              <div className="flex items-center gap-3">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[var(--color-primary)]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-2xl">
                    👤
                  </div>
                )}
                <div>
                  <p className="font-bold text-[var(--color-text)]">{name || "Aventurero"}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">Rango: 🥉 Rookie</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <span>{SENSORY_INFO[selectedMode].emoji}</span>
                <span>Modo {SENSORY_INFO[selectedMode].title}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedThemes.map((slug) => {
                  const theme = INITIAL_THEMES.find((t) => t.slug === slug);
                  if (!theme) return null;
                  return (
                    <span
                      key={slug}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: `${theme.color}20`, color: theme.color }}
                    >
                      {theme.emoji} {theme.nameEs}
                    </span>
                  );
                })}
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="ghost" size="lg" onClick={goBack} className="px-6">
                ←
              </Button>
              <Button
                size="lg"
                className="flex-1 text-xl py-5 font-bold animate-pulse-subtle"
                onClick={handleFinish}
              >
                🎮 ¡A jugar!
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
