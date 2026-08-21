import { getRegistrarLink } from "@/lib/registrarLinks";

export type AllotmentButtonIPO = {
  openDate?: string;
  closeDate?: string;
  allotmentDate?: string;
  registrar?: string;
  growwIPOUrl?: string;
};

export type AllotmentButtonState =
  | { kind: "hidden" }
  | { kind: "soon" }
  | { kind: "available"; url: string };

export type HomeTableCTAState =
  | { kind: "hidden" }
  | { kind: "soon" }
  | { kind: "apply"; url?: string }
  | { kind: "apply-soon" }
  | { kind: "status"; url?: string };

const monthIndexes: Record<string, number> = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};

export function parseIPODate(value?: string): Date | null {
  const match = value
    ?.trim()
    .toUpperCase()
    .match(/^(\d{1,2})\s+([A-Z]{3})(?:\s+(\d{4}))?$/);

  if (!match || monthIndexes[match[2]] === undefined) {
    return null;
  }

  const date = new Date(
    Number(match[3] || new Date().getFullYear()),
    monthIndexes[match[2]],
    Number(match[1])
  );
  date.setHours(0, 0, 0, 0);

  return date;
}

function todayAtMidnight() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getAllotmentButtonState(
  ipo: AllotmentButtonIPO
): AllotmentButtonState {
  const today = todayAtMidnight();
  const closeDate = parseIPODate(ipo.closeDate);

  if (!closeDate || today < closeDate) {
    return { kind: "hidden" };
  }

  const allotmentDate = parseIPODate(ipo.allotmentDate);

  if (!allotmentDate || today < allotmentDate) {
    return { kind: "soon" };
  }

  const registrarUrl = ipo.registrar?.trim()
    ? getRegistrarLink(ipo.registrar)
    : "#";

  return registrarUrl === "#"
    ? { kind: "soon" }
    : { kind: "available", url: registrarUrl };
}

export function getHomeTableCTAState(
  ipo: AllotmentButtonIPO
): HomeTableCTAState {
  const today = todayAtMidnight();
  const openDate = parseIPODate(ipo.openDate);
  const closeDate = parseIPODate(ipo.closeDate);

  if (openDate && today < openDate) {
    return { kind: "apply-soon" };
  }

  if (openDate && closeDate && today >= openDate && today <= closeDate) {
    const growwIPOUrl = ipo.growwIPOUrl?.trim();

    return { kind: "apply", url: growwIPOUrl || undefined };
  }

  if (closeDate && today > closeDate) {
    const allotmentDate = parseIPODate(ipo.allotmentDate);

    if (!allotmentDate || today < allotmentDate) {
      return { kind: "soon" };
    }

    const registrarUrl = ipo.registrar?.trim()
      ? getRegistrarLink(ipo.registrar)
      : undefined;

    return {
      kind: "status",
      url: registrarUrl === "#" ? undefined : registrarUrl,
    };
  }

  return { kind: "hidden" };
}
