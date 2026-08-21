import assert from "node:assert/strict";
import test from "node:test";
import { validateAIExtraction } from "../lib/ipoAIExtractor";
import { extractIPOFields } from "../lib/ipoTextExtractor";
import { extractSource } from "../app/api/ipos/extract/route";

const sample = [
  "IPO Name: Example Industries Limited",
  "IPO Type: MAINBOARD",
  "IPO Status: UPCOMING",
  "Price Band: ₹100 - ₹110",
  "Issue Size: ₹500 crore",
  "Open Date: 2026-08-20",
  "Close Date: 2026-08-24",
  "Listing Date: 2026-08-28",
  "QIB Subscription: 4.2x",
  "NII Subscription: 3.1x",
  "Retail Subscription: 2.4x",
  "Employee Subscription: 1.2x",
  "Shareholder Subscription: 1.8x",
  "Total Subscription: 3.0x",
  "Revenue FY2025: ₹900 crore",
  "Company Overview: Manufactures explicitly described industrial components.",
  "Business Model: Sells components to domestic manufacturers.",
  "Objects of Issue: Repay borrowings and fund capital expenditure.",
  "Strengths: Long-standing customer relationships.",
  "Risks: Customer concentration.",
  "GMP: ₹15",
  "GMP History: 2026-08-14: ₹12; 2026-08-15: ₹15",
].join("\n");

function aiItem(field: string, value: string, sourceSnippet: string, overrides = {}) {
  return { field, value, state: "POPULATED", sourcePage: null, sourceSnippet, reason: "", ...overrides };
}

test("deterministic extractor preserves representative IPO fields and missing fields", () => {
  const result = extractIPOFields([{ text: sample }], "TEXT");
  const fields = new Map(result.fields.map((field) => [field.field, field.value]));
  for (const field of ["name", "type", "status", "priceBand", "issueSize", "openDate", "closeDate", "listingDate",
    "qibSubscription", "niiSubscription", "retailSubscription", "employeeSubscription", "shareholderSubscription",
    "subscription", "revenueFY2025", "companyOverview", "businessModel", "objectsOfIssue", "strengths", "risks", "gmp", "gmpHistory"]) {
    assert.ok(fields.has(field), `expected ${field}`);
  }
  assert.equal(fields.has("revenueFY2024"), false);
});

test("Gemini output validation enforces source traceability and valid dates", () => {
  const valid = validateAIExtraction([
    aiItem("name", "Example Industries Limited", "IPO Name: Example Industries Limited"),
    aiItem("openDate", "2026-08-20", "Open Date: 2026-08-20"),
  ], [{ text: sample }]);
  assert.equal(valid.fields[0].source.label, "Pasted text");
  const invalid = validateAIExtraction([
    aiItem("openDate", "2026-02-30", "Open Date: 2026-02-30"),
  ], [{ text: "Open Date: 2026-02-30" }]);
  assert.equal(invalid.fields[0].state, "POTENTIALLY_AMBIGUOUS");
  assert.equal(invalid.fields[0].value, "");
});

test("financial years require explicit year evidence", () => {
  const result = validateAIExtraction([
    aiItem("revenueFY2025", "₹900 crore", "Revenue: ₹900 crore"),
  ], [{ text: "Revenue: ₹900 crore" }]);
  assert.equal(result.fields[0].state, "POTENTIALLY_AMBIGUOUS");
  assert.match(result.warnings[0], /financial year/i);
});

test("financial table values use explicit year headers on the same PDF page", () => {
  const page = "FY2024 FY2025 FY2026\nREVENUE FROM OPERATIONS 75.73 77.94 214.16";
  const result = validateAIExtraction([
    aiItem("revenueFY2024", "75.73", "REVENUE FROM OPERATIONS 75.73", { sourcePage: 3 }),
    aiItem("revenueFY2025", "77.94", "REVENUE FROM OPERATIONS 75.73 77.94", { sourcePage: 3 }),
    aiItem("revenueFY2026", "214.16", "REVENUE FROM OPERATIONS 75.73 77.94 214.16", { sourcePage: 3 }),
  ], [{ page: 3, text: page }]);
  assert.deepEqual(result.fields.map((field) => field.value), ["75.73", "77.94", "214.16"]);
  assert.ok(result.fields.every((field) => field.state === "POPULATED"));
});

test("non-numeric type fields are accepted when explicitly supported", () => {
  const result = validateAIExtraction([
    aiItem("type", "SME", "CATEGORY SME IPO", { sourcePage: 1 }),
    aiItem("issueType", "BOOK-BUILT", "ISSUE TYPE BOOK-BUILT", { sourcePage: 1 }),
  ], [{ page: 1, text: "CATEGORY SME IPO\nISSUE TYPE BOOK-BUILT" }]);
  assert.ok(result.fields.every((field) => field.state === "POPULATED"));
});

test("explicit importer enum aliases are canonicalized", () => {
  const result = validateAIExtraction([
    aiItem("type", "SME IPO", "CATEGORY SME IPO", { sourcePage: 1 }),
    aiItem("officialSource", "OFFICIAL RHP", "OFFICIAL RHP", { sourcePage: 5 }),
  ], [{ page: 1, text: "CATEGORY SME IPO" }, { page: 5, text: "OFFICIAL RHP" }]);
  assert.deepEqual(result.fields.map((field) => field.value), ["SME", "RHP"]);
});

test("GMP Reservation, malformed history, negative subscriptions, and empty replacements are rejected", () => {
  const text = "GMP: Reservation\nGMP History: broken\nQIB Subscription: -2x\nRegistrar: N/A";
  const result = validateAIExtraction([
    aiItem("gmp", "Reservation", "GMP: Reservation"),
    aiItem("gmpHistory", "broken", "GMP History: broken"),
    aiItem("qibSubscription", "-2x", "QIB Subscription: -2x"),
    aiItem("registrar", "N/A", "Registrar: N/A"),
  ], [{ text }]);
  assert.ok(result.fields.every((field) => field.state === "POTENTIALLY_AMBIGUOUS" && field.value === ""));
});

test("unsupported fields fail validation", () => {
  assert.throws(() => validateAIExtraction([
    aiItem("inventedField", "value", "inventedField: value"),
  ], [{ text: "inventedField: value" }]), /unsupported or malformed/);
});

test("Gemini failure uses deterministic fallback and does not invoke a database writer", async () => {
  let semanticCalls = 0;
  const result = await extractSource([{ text: sample }], "TEXT", async () => {
    semanticCalls += 1;
    throw new Error("mock timeout");
  });
  assert.equal(semanticCalls, 1);
  assert.equal(result.extractionMethod, "DETERMINISTIC_FALLBACK");
  assert.match(result.warnings.at(-1) ?? "", /Gemini AI extraction unavailable.*mock timeout/);
  assert.ok(result.fields.some((field) => field.field === "name"));
});
