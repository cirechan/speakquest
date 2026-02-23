import type { STTProvider, STTOptions, STTResult } from "@/types/voice";

/* eslint-disable @typescript-eslint/no-explicit-any */

export class WebSpeechSTT implements STTProvider {
  readonly name = "Web Speech API";
  private recognition: any = null;
  private interimCallbacks: ((text: string) => void)[] = [];
  private finalCallbacks: ((result: STTResult) => void)[] = [];
  private errorCallbacks: ((error: Error) => void)[] = [];

  get isAvailable(): boolean {
    if (typeof window === "undefined") return false;
    return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  }

  async startListening(options: STTOptions): Promise<void> {
    if (!this.isAvailable) {
      throw new Error("Speech recognition is not supported in this browser.");
    }

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    this.recognition = new SpeechRecognitionClass();
    this.recognition.lang = options.language;
    this.recognition.continuous = options.continuous;
    this.recognition.interimResults = options.interimResults;

    this.recognition.onresult = (event: any) => {
      const last = event.results[event.results.length - 1];
      const transcript = last[0].transcript;
      const confidence = last[0].confidence;

      if (last.isFinal) {
        const result: STTResult = {
          transcript,
          confidence,
          isFinal: true,
          alternatives: Array.from(last as ArrayLike<any>)
            .slice(1)
            .map((alt: any) => alt.transcript),
        };
        this.finalCallbacks.forEach((cb) => cb(result));
      } else {
        this.interimCallbacks.forEach((cb) => cb(transcript));
      }
    };

    this.recognition.onerror = (event: any) => {
      this.errorCallbacks.forEach((cb) => cb(new Error(event.error)));
    };

    if (options.maxDuration) {
      setTimeout(() => {
        this.recognition?.stop();
      }, options.maxDuration);
    }

    this.recognition.start();
  }

  async stopListening(): Promise<STTResult> {
    return new Promise((resolve) => {
      if (!this.recognition) {
        resolve({ transcript: "", confidence: 0, isFinal: true });
        return;
      }

      this.recognition.onend = () => {
        resolve({ transcript: "", confidence: 0, isFinal: true });
      };

      const originalCallbacks = [...this.finalCallbacks];
      this.finalCallbacks = [
        (result) => {
          resolve(result);
          this.finalCallbacks = originalCallbacks;
        },
      ];

      this.recognition.stop();
    });
  }

  onInterimResult(callback: (text: string) => void): void {
    this.interimCallbacks.push(callback);
  }

  onFinalResult(callback: (result: STTResult) => void): void {
    this.finalCallbacks.push(callback);
  }

  onError(callback: (error: Error) => void): void {
    this.errorCallbacks.push(callback);
  }
}
