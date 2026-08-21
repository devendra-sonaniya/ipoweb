export type GMPHistoryItem = {
  date: string;
  value: string;
};

export function getCurrentGMP(
  gmp: unknown,
  history: unknown
): string {
  if (Array.isArray(history)) {
    for (let index = history.length - 1; index >= 0; index -= 1) {
      const item = history[index];
      if (!item || typeof item !== "object") continue;

      const value = (item as { value?: unknown }).value;
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }

  return typeof gmp === "string" ? gmp.trim() : "";
}
