const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const;

const MONTH_INDEX = new Map<string, number>(
  MONTHS.map((month, index) => [month, index + 1])
);

function formatParts(day: number, month: number, year: number) {
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return `${String(day).padStart(2, "0")} ${MONTHS[month - 1]}`;
}

export function formatIPODate(
  value?: string | null,
  fallback = "-"
) {
  const input = value?.trim();
  if (!input) return fallback;

  const isoMatch = input.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:T.*)?$/);
  if (isoMatch) {
    return (
      formatParts(Number(isoMatch[3]), Number(isoMatch[2]), Number(isoMatch[1])) ||
      input
    );
  }

  const numericMatch = input.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (numericMatch) {
    return (
      formatParts(
        Number(numericMatch[1]),
        Number(numericMatch[2]),
        Number(numericMatch[3])
      ) || input
    );
  }

  const textMatch = input
    .toUpperCase()
    .match(/^(\d{1,2})[\s/-]+([A-Z]{3,9})[\s,/-]+(\d{4})$/);
  if (textMatch) {
    const month = MONTH_INDEX.get(textMatch[2].slice(0, 3));
    if (month) {
      return formatParts(Number(textMatch[1]), month, Number(textMatch[3])) || input;
    }
  }

  return input;
}
