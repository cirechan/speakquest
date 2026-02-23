import type { PronunciationEvaluator, PronunciationScore } from "@/types/voice";

export class BasicPronunciationEvaluator implements PronunciationEvaluator {
  async evaluate(
    spokenText: string,
    expectedText: string
  ): Promise<PronunciationScore> {
    const spoken = this.normalize(spokenText);
    const expected = this.normalize(expectedText);

    // Overall similarity using Levenshtein distance
    const distance = this.levenshteinDistance(spoken, expected);
    const maxLen = Math.max(spoken.length, expected.length);
    const overall = maxLen === 0 ? 1 : 1 - distance / maxLen;

    // Word-level comparison
    const spokenWords = spoken.split(/\s+/).filter(Boolean);
    const expectedWords = expected.split(/\s+/).filter(Boolean);

    const wordScores = expectedWords.map((word, i) => {
      if (!spokenWords[i]) {
        return { word, score: 0 };
      }
      const wDist = this.levenshteinDistance(spokenWords[i], word);
      const wMax = Math.max(spokenWords[i].length, word.length);
      return {
        word,
        score: wMax === 0 ? 1 : 1 - wDist / wMax,
      };
    });

    return {
      overall: Math.max(0, Math.min(1, overall)),
      wordScores,
    };
  }

  private normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  private levenshteinDistance(a: string, b: string): number {
    const m = a.length;
    const n = b.length;

    if (m === 0) return n;
    if (n === 0) return m;

    const dp: number[][] = Array.from({ length: m + 1 }, () =>
      new Array(n + 1).fill(0)
    );

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }

    return dp[m][n];
  }
}
