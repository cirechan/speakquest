import type { STTProvider, TTSProvider, PronunciationEvaluator } from "@/types/voice";

export type VoiceBackend = "web-speech" | "whisper-chatterbox";

export async function createSTTProvider(backend: VoiceBackend = "web-speech"): Promise<STTProvider> {
  switch (backend) {
    case "web-speech": {
      const { WebSpeechSTT } = await import("./web-speech-stt");
      return new WebSpeechSTT();
    }
    case "whisper-chatterbox":
      // Future: import WhisperSTT
      throw new Error("Whisper STT not yet implemented. GPU required.");
    default:
      throw new Error(`Unknown STT backend: ${backend}`);
  }
}

export async function createTTSProvider(backend: VoiceBackend = "web-speech"): Promise<TTSProvider> {
  switch (backend) {
    case "web-speech": {
      const { WebSpeechTTS } = await import("./web-speech-tts");
      return new WebSpeechTTS();
    }
    case "whisper-chatterbox":
      // Future: import ChatterboxTTS
      throw new Error("Chatterbox TTS not yet implemented. GPU required.");
    default:
      throw new Error(`Unknown TTS backend: ${backend}`);
  }
}

export async function createPronunciationEvaluator(
  backend: VoiceBackend = "web-speech"
): Promise<PronunciationEvaluator> {
  switch (backend) {
    case "web-speech": {
      const { BasicPronunciationEvaluator } = await import("./pronunciation");
      return new BasicPronunciationEvaluator();
    }
    case "whisper-chatterbox":
      throw new Error("Advanced pronunciation evaluator not yet implemented.");
    default:
      throw new Error(`Unknown backend: ${backend}`);
  }
}
