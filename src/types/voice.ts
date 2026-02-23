export interface STTOptions {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxDuration?: number;
}

export interface TTSOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  language?: string;
}

export interface STTResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  alternatives?: string[];
}

export interface PronunciationScore {
  overall: number;
  wordScores?: { word: string; score: number }[];
  phonemeAccuracy?: number;
  fluency?: number;
}

export interface VoiceInfo {
  id: string;
  name: string;
  language: string;
  gender?: "male" | "female" | "neutral";
  isLocal: boolean;
}

export interface STTProvider {
  readonly name: string;
  readonly isAvailable: boolean;
  startListening(options: STTOptions): Promise<void>;
  stopListening(): Promise<STTResult>;
  onInterimResult(callback: (text: string) => void): void;
  onFinalResult(callback: (result: STTResult) => void): void;
  onError(callback: (error: Error) => void): void;
}

export interface TTSProvider {
  readonly name: string;
  readonly isAvailable: boolean;
  speak(text: string, options?: TTSOptions): Promise<void>;
  stop(): void;
  getVoices(): Promise<VoiceInfo[]>;
}

export interface PronunciationEvaluator {
  evaluate(
    spokenText: string,
    expectedText: string,
    audioData?: ArrayBuffer
  ): Promise<PronunciationScore>;
}
