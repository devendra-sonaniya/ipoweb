import type { ImportedIPOValue } from "@/lib/ipoDraftImport";
import type { IPOExtractionField } from "@/lib/ipoTextExtractor";

export type PartialUpdateStatus =
  | "NEW"
  | "UPDATED"
  | "CONFLICT"
  | "UNCHANGED"
  | "PRESERVED"
  | "POTENTIALLY_AMBIGUOUS"
  | "MANUALLY_EDITED";

export type PartialUpdateChoice = "KEEP_EXISTING" | "USE_NEW" | "MANUAL";

export type IPOPartialProposal = {
  field: string;
  existingValue: ImportedIPOValue;
  newValue: ImportedIPOValue;
  patchValue?: ImportedIPOValue;
  status: PartialUpdateStatus;
  choice: PartialUpdateChoice;
  conflict: boolean;
  source: string;
  warning?: string;
};

function empty(value: ImportedIPOValue | undefined) {
  return value == null || (typeof value === "string" ? !value.trim() : value.length === 0);
}

function same(left: ImportedIPOValue, right: ImportedIPOValue) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function historyKey(item: { date: string; value: string }) {
  return `${item.date.trim()}\u0000${item.value.trim()}`;
}

export function mergeGMPHistory(
  existing: Array<{ date: string; value: string }>,
  additions: Array<{ date: string; value: string }>
) {
  const seen = new Set(existing.map(historyKey));
  return [...existing, ...additions.filter((item) => {
    const key = historyKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })];
}

export function buildPartialUpdateProposals(
  existing: Record<string, unknown>,
  extracted: IPOExtractionField[],
  allowedFields: readonly string[]
) {
  const extractedByField = new Map(extracted.map((field) => [field.field, field]));
  return allowedFields.map((field): IPOPartialProposal => {
    const current = (existing[field] ?? (field === "gmpHistory" ? [] : "")) as ImportedIPOValue;
    const candidate = extractedByField.get(field);
    if (!candidate) {
      return { field, existingValue: current, newValue: current, status: "PRESERVED", choice: "KEEP_EXISTING", conflict: false, source: "Not present in new source" };
    }
    const source = `${candidate.source.page ? `Page ${candidate.source.page}` : candidate.source.label}${candidate.source.snippet ? ` — “${candidate.source.snippet.slice(0, 240)}”` : ""}`;
    if (candidate.state === "POTENTIALLY_AMBIGUOUS") {
      return { field, existingValue: current, newValue: field === "gmpHistory" ? [] : "", status: "POTENTIALLY_AMBIGUOUS", choice: "KEEP_EXISTING", conflict: false, source, warning: candidate.warning };
    }
    if (field === "gmpHistory" && Array.isArray(candidate.value)) {
      const existingHistory = Array.isArray(current) ? current : [];
      const merged = mergeGMPHistory(existingHistory, candidate.value);
      const additions = merged.slice(existingHistory.length);
      if (!additions.length) {
        return { field, existingValue: existingHistory, newValue: merged, patchValue: [], status: "UNCHANGED", choice: "KEEP_EXISTING", conflict: false, source };
      }
      return { field, existingValue: existingHistory, newValue: merged, patchValue: additions, status: "NEW", choice: "USE_NEW", conflict: false, source };
    }
    const next = candidate.value as ImportedIPOValue;
    if (same(current, next)) {
      return { field, existingValue: current, newValue: next, status: "UNCHANGED", choice: "KEEP_EXISTING", conflict: false, source };
    }
    if (empty(current)) {
      return { field, existingValue: current, newValue: next, status: "NEW", choice: "USE_NEW", conflict: false, source };
    }
    return { field, existingValue: current, newValue: next, status: "CONFLICT", choice: "KEEP_EXISTING", conflict: true, source };
  });
}

export function buildApprovedPartialPatch(proposals: IPOPartialProposal[]) {
  const changes: Record<string, ImportedIPOValue> = {};
  for (const proposal of proposals) {
    if (proposal.choice === "KEEP_EXISTING" || proposal.status === "PRESERVED" || proposal.status === "UNCHANGED" || proposal.status === "POTENTIALLY_AMBIGUOUS") continue;
    changes[proposal.field] = proposal.patchValue ?? proposal.newValue;
  }
  return changes;
}

export function summarizePartialUpdate(proposals: IPOPartialProposal[]) {
  return {
    changed: proposals.filter((item) => item.choice !== "KEEP_EXISTING" && ["UPDATED", "MANUALLY_EDITED"].includes(item.status)).length,
    added: proposals.filter((item) => item.choice !== "KEEP_EXISTING" && item.status === "NEW").length,
    preserved: proposals.filter((item) => item.choice === "KEEP_EXISTING" || item.status === "PRESERVED").length,
    conflicts: proposals.filter((item) => item.conflict).length,
    ambiguous: proposals.filter((item) => item.status === "POTENTIALLY_AMBIGUOUS").length,
  };
}
