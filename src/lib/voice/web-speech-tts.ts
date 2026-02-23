import type { TTSProvider, TTSOptions, VoiceInfo } from "@/types/voice";

export class WebSpeechTTS implements TTSProvider {
  readonly name = "Web Speech Synthesis";

  get isAvailable(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  async speak(text: string, options?: TTSOptions): Promise<void> {
    if (!this.isAvailable) {
      throw new Error("Speech synthesis is not supported in this browser.");
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options?.language || "en-US";
      utterance.rate = options?.rate || 1.0;
      utterance.pitch = options?.pitch || 1.0;

      if (options?.voice) {
        const voices = speechSynthesis.getVoices();
        const selected = voices.find((v) => v.name === options.voice);
        if (selected) utterance.voice = selected;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(new Error(e.error));

      speechSynthesis.speak(utterance);
    });
  }

  stop(): void {
    if (this.isAvailable) {
      speechSynthesis.cancel();
    }
  }

  async getVoices(): Promise<VoiceInfo[]> {
    if (!this.isAvailable) return [];

    // Voices may load asynchronously
    let voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
      voices = await new Promise((resolve) => {
        speechSynthesis.onvoiceschanged = () => {
          resolve(speechSynthesis.getVoices());
        };
      });
    }

    return voices
      .filter((v) => v.lang.startsWith("en"))
      .map((v) => ({
        id: v.name,
        name: v.name,
        language: v.lang,
        isLocal: v.localService,
      }));
  }
}
