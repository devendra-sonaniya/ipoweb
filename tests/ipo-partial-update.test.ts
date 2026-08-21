import assert from "node:assert/strict";
import test from "node:test";
import { buildApprovedPartialPatch, buildPartialUpdateProposals, mergeGMPHistory } from "../lib/ipoPartialUpdate";
import type { IPOExtractionField } from "../lib/ipoTextExtractor";
import { IPO_IMPORT_FIELD_NAMES } from "../lib/ipoImportFields";

function extracted(field: string, value: IPOExtractionField["value"], state: IPOExtractionField["state"] = "POPULATED"): IPOExtractionField {
  return { field, value, state, source: { label: "Pasted text", snippet: `${field}: ${Array.isArray(value) ? JSON.stringify(value) : value}` }, warning: state === "POTENTIALLY_AMBIGUOUS" ? "Invalid source value" : undefined };
}

test("three missing fields are NEW while populated existing fields are preserved", () => {
  const existing = Object.fromEntries(Array.from({ length: 90 }, (_, index) => [`existing${index}`, `value${index}`]));
  const allowed = [...Object.keys(existing), "qibSubscription", "niiSubscription", "retailSubscription"];
  const proposals = buildPartialUpdateProposals(existing, [extracted("qibSubscription", "15.20x"), extracted("niiSubscription", "21.40x"), extracted("retailSubscription", "8.50x")], allowed);
  assert.equal(proposals.filter((item) => item.status === "NEW").length, 3);
  assert.equal(proposals.filter((item) => item.status === "PRESERVED").length, 90);
});

test("different populated value is a conflict and is not approved by default", () => {
  const proposals = buildPartialUpdateProposals({ gmp: "55" }, [extracted("gmp", "60")], ["gmp"]);
  assert.equal(proposals[0].status, "CONFLICT");
  assert.equal(proposals[0].conflict, true);
  assert.deepEqual(buildApprovedPartialPatch(proposals), {});
});

test("absent and ambiguous values preserve existing data", () => {
  const absent = buildPartialUpdateProposals({ priceBand: "179-189" }, [], ["priceBand"]);
  const ambiguous = buildPartialUpdateProposals({ gmp: "55" }, [extracted("gmp", "", "POTENTIALLY_AMBIGUOUS")], ["gmp"]);
  assert.equal(absent[0].status, "PRESERVED");
  assert.equal(ambiguous[0].choice, "KEEP_EXISTING");
  assert.deepEqual(buildApprovedPartialPatch([...absent, ...ambiguous]), {});
});

test("approved new field is the only emitted patch", () => {
  const proposals = buildPartialUpdateProposals({ name: "Existing IPO", qibSubscription: "" }, [extracted("qibSubscription", "15.20x")], ["name", "qibSubscription"]);
  assert.deepEqual(buildApprovedPartialPatch(proposals), { qibSubscription: "15.20x" });
});

test("GMP history appends unique points without replacing existing history", () => {
  const existing = [{ date: "2026-08-14", value: "55" }];
  const incoming = [{ date: "2026-08-14", value: "55" }, { date: "2026-08-15", value: "60" }];
  assert.deepEqual(mergeGMPHistory(existing, incoming), [...existing, incoming[1]]);
  const proposals = buildPartialUpdateProposals({ gmpHistory: existing }, [extracted("gmpHistory", incoming)], ["gmpHistory"]);
  assert.deepEqual(buildApprovedPartialPatch(proposals), { gmpHistory: [incoming[1]] });
});

test("realistic 90 populated and 39 empty fixture proposes only three NEW subscriptions plus one CONFLICT", () => {
  const newFields = new Set(["qibSubscription", "niiSubscription", "retailSubscription", "gmp"]);
  const compatibilityFields = new Set(["roe", "roce", "ronw", "patMargin", "ebitdaMargin", "companyAddress", "peer1RONW", "peer2RONW", "peer3RONW"]);
  const legacyFields = IPO_IMPORT_FIELD_NAMES.filter((field) => !compatibilityFields.has(field));
  assert.equal(legacyFields.length, 129);
  const otherFields = legacyFields.filter((field) => !newFields.has(field));
  const existing: Record<string, unknown> = Object.fromEntries(legacyFields.map((field) => [field, field === "gmpHistory" ? [] : ""]));
  for (const field of otherFields.slice(0, 89)) existing[field] = field === "gmpHistory" ? [{ date: "2026-08-14", value: "55" }] : `existing-${field}`;
  existing.gmp = "55";
  const before = structuredClone(existing);
  const proposals = buildPartialUpdateProposals(existing, [
    extracted("qibSubscription", "15.20x"),
    extracted("niiSubscription", "21.40x"),
    extracted("retailSubscription", "8.50x"),
    extracted("gmp", "60"),
  ], legacyFields);
  assert.equal(Object.values(existing).filter((value) => Array.isArray(value) ? value.length > 0 : Boolean(value)).length, 90);
  assert.equal(proposals.filter((item) => item.status === "NEW").length, 3);
  assert.equal(proposals.filter((item) => item.status === "CONFLICT").length, 1);
  assert.equal(proposals.filter((item) => item.status === "PRESERVED").length, 125);
  assert.deepEqual(buildApprovedPartialPatch(proposals), {
    qibSubscription: "15.20x",
    niiSubscription: "21.40x",
    retailSubscription: "8.50x",
  });
  assert.deepEqual(existing, before, "preview/cancel must not mutate the stored fixture");
  assert.equal(Object.hasOwn(buildApprovedPartialPatch(proposals), "slug"), false);
});
