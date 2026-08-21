import "server-only";

import { GoogleGenAI } from "@google/genai";
import { IPO_IMPORT_FIELD_NAMES, IPO_IMPORT_FIELD_SET } from "@/lib/ipoImportFields";
import type { IPOExtractionField, IPOExtractionInputType, IPOExtractionResult } from "@/lib/ipoTextExtractor";

type SourcePage = { page?: number; text: string };
type AIItem = {
  field: string;
  value: string;
  state: "POPULATED" | "POTENTIALLY_AMBIGUOUS";
  sourcePage: number | null;
  sourceSnippet: string;
  reason: string;
};

export const GEMINI_IPO_EXTRACTION_MODEL = process.env.GEMINI_IPO_EXTRACTION_MODEL || "gemini-3.5-flash";
const GEMINI_TIMEOUT_MS = 120_000;
const NUMERIC_FIELDS: ReadonlySet<string> = new Set(IPO_IMPORT_FIELD_NAMES.filter((field) =>
  !["type", "issueType"].includes(field) &&
  /(?:price|gain|subscription|size|lot|shares|amount|holding|allocation|revenue|profit|discount|cap|value|eps|ratio|equity|assets|growth|reservation|valuation|roe|roce|ronw|margin|pat|pe)$/i.test(field)
));
const ENUMS: Record<string, Set<string>> = {
  type: new Set(["MAINBOARD", "SME", "NSE SME", "BSE SME"]),
  status: new Set(["OPEN", "UPCOMING", "CLOSED", "LISTED"]),
  sentiment: new Set(["POSITIVE", "NEUTRAL", "NEGATIVE", "BULLISH", "BEARISH"]),
  subscriptionSource: new Set(["NSE", "BSE"]),
  officialSource: new Set(["DRHP", "RHP", "NSE", "BSE", "SEBI"]),
  debtRisk: new Set(["LOW", "MEDIUM", "HIGH"]),
  businessRisk: new Set(["LOW", "MEDIUM", "HIGH"]),
  valuation: new Set(["ATTRACTIVE", "FAIR", "EXPENSIVE"]),
};
const DATE_FIELDS = new Set(["openDate", "closeDate", "allotmentDate", "listingDate", "refundDate", "dematCreditDate", "lastUpdated"]);

function validISODate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function hasExpectedFinancialYear(field: string, snippet: string, pages: SourcePage[], sourcePage: number | null) {
  const match = field.match(/FY(2024|2025|2026)$/);
  if (!match) return true;
  const year = Number(match[1]);
  const shortYear = String(year).slice(-2);
  const pageEvidence = sourcePage == null
    ? pages.map((page) => page.text).join("\n")
    : pages.find((page) => page.page === sourcePage)?.text ?? "";
  return new RegExp(`(?:FY\\s*${year}|${year - 1}\\s*[-/]\\s*${shortYear}|31\\s+(?:March|Mar)\\s+${year}|${year})`, "i")
    .test(`${snippet}\n${pageEvidence}`);
}

function normalized(value: string) {
  return value.replace(/[\u2010-\u2015]/g, "-").replace(/\s+/g, " ").trim().toLowerCase();
}

function canonicalEnumValue(field: string, value: string) {
  const upper = value.trim().toUpperCase();
  if (field === "type") {
    if (upper === "SME IPO") return "SME";
    if (upper === "MAINBOARD IPO") return "MAINBOARD";
  }
  if (field === "officialSource") {
    const match = upper.match(/^(?:OFFICIAL\s+)?(DRHP|RHP|NSE|BSE|SEBI)$/);
    if (match) return match[1];
  }
  return upper;
}

function locateSnippet(item: AIItem, pages: SourcePage[]) {
  const candidates = item.sourcePage == null ? pages : pages.filter((page) => page.page === item.sourcePage);
  const needle = normalized(item.sourceSnippet);
  return needle.length >= 4 && candidates.some((page) => normalized(page.text).includes(needle));
}

function sourceLabel(item: AIItem, pages: SourcePage[]) {
  return pages.some((page) => page.page != null) && item.sourcePage != null
    ? `PDF page ${item.sourcePage}`
    : "Pasted text";
}

function ambiguous(item: AIItem, pages: SourcePage[], warning: string): IPOExtractionField {
  return {
    field: item.field,
    value: "",
    state: "POTENTIALLY_AMBIGUOUS",
    source: { page: item.sourcePage ?? undefined, label: sourceLabel(item, pages), snippet: item.sourceSnippet },
    warning,
  };
}

export function validateAIExtraction(items: unknown, pages: SourcePage[]): { fields: IPOExtractionField[]; warnings: string[] } {
  if (!Array.isArray(items)) throw new Error("AI response did not contain a fields array.");
  const fields = new Map<string, IPOExtractionField>();
  const warnings: string[] = [];

  for (const raw of items) {
    if (!raw || typeof raw !== "object") throw new Error("AI response contained a malformed field entry.");
    const item = raw as AIItem;
    if (!IPO_IMPORT_FIELD_SET.has(item.field) || typeof item.value !== "string" ||
        !["POPULATED", "POTENTIALLY_AMBIGUOUS"].includes(item.state) ||
        !Number.isInteger(item.sourcePage) && item.sourcePage !== null ||
        typeof item.sourceSnippet !== "string" || typeof item.reason !== "string") {
      throw new Error("AI response contained an unsupported or malformed field.");
    }
    if (item.sourcePage != null && !pages.some((page) => page.page === item.sourcePage)) {
      throw new Error(`AI response referenced an invalid source page for ${item.field}.`);
    }

    let field: IPOExtractionField;
    if (item.state === "POTENTIALLY_AMBIGUOUS" || !item.value.trim()) {
      field = ambiguous(item, pages, item.reason || `The source was ambiguous for ${item.field}.`);
    } else if (!locateSnippet(item, pages)) {
      field = ambiguous(item, pages, `The source snippet for ${item.field} could not be verified verbatim.`);
    } else if (ENUMS[item.field] && !ENUMS[item.field].has(canonicalEnumValue(item.field, item.value))) {
      field = ambiguous(item, pages, `${item.field} did not match an allowed value.`);
    } else if (DATE_FIELDS.has(item.field) && !validISODate(item.value.trim())) {
      field = ambiguous(item, pages, `${item.field} was not a valid YYYY-MM-DD date.`);
    } else if (!hasExpectedFinancialYear(item.field, item.sourceSnippet, pages, item.sourcePage)) {
      field = ambiguous(item, pages, `The source snippet did not explicitly support the financial year for ${item.field}.`);
    } else if (NUMERIC_FIELDS.has(item.field) && !/\d/.test(item.value)) {
      field = ambiguous(item, pages, `${item.field} did not contain a numeric value.`);
    } else if (/subscription/i.test(item.field) && /(?:^|[^\d])-\s*\d/.test(item.value)) {
      field = ambiguous(item, pages, `${item.field} contained a negative subscription value.`);
    } else if (/^(?:n\/?a|unknown|not available)$/i.test(item.value.trim())) {
      field = ambiguous(item, pages, `${item.field} contained an unsupported empty replacement.`);
    } else if (item.field === "gmp" && !/\bGMP\b|grey\s+market(?:\s+premium)?/i.test(item.sourceSnippet)) {
      field = ambiguous(item, pages, "GMP was not explicitly identified as GMP or grey market premium in the source.");
    } else if (item.field === "gmp" && !/\d/.test(item.value)) {
      field = ambiguous(item, pages, "GMP did not contain an explicit numeric value.");
    } else {
      let value: IPOExtractionField["value"] = ENUMS[item.field]
        ? canonicalEnumValue(item.field, item.value)
        : item.value.trim();
      if (item.field === "gmpHistory") {
        try {
          const parsed = JSON.parse(item.value);
          if (!Array.isArray(parsed) || parsed.some((entry) => !entry || typeof entry.date !== "string" || typeof entry.value !== "string")) throw new Error();
          value = parsed;
        } catch {
          field = ambiguous(item, pages, "GMP history was not a valid date/value array.");
          warnings.push(field.warning!);
          fields.set(item.field, field);
          continue;
        }
      }
      field = {
        field: item.field,
        value,
        state: "POPULATED",
        source: { page: item.sourcePage ?? undefined, label: sourceLabel(item, pages), snippet: item.sourceSnippet },
      };
    }

    const previous = fields.get(item.field);
    if (previous && JSON.stringify(previous.value) !== JSON.stringify(field.value)) {
      field = ambiguous(item, pages, `Conflicting values were extracted for ${item.field}.`);
    }
    if (field.warning) warnings.push(field.warning);
    fields.set(item.field, field);
  }
  return { fields: [...fields.values()], warnings: [...new Set(warnings)] };
}

export async function extractIPOFieldsWithAI(
  pages: SourcePage[], inputType: IPOExtractionInputType
): Promise<IPOExtractionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
  const ai = new GoogleGenAI({ apiKey });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  try {
    const response = await ai.models.generateContent({
        model: GEMINI_IPO_EXTRACTION_MODEL,
        contents: pages.map((page) => `${page.page ? `[PAGE ${page.page}]\n` : ""}${page.text}`).join("\n\n"),
        config: {
          abortSignal: controller.signal,
          systemInstruction: [
          "Extract IPO data only from the supplied source. Never use model knowledge, infer facts, browse, or fabricate.",
          "Return only explicitly supported values. If absent, omit the field. If ambiguous, return an empty value with POTENTIALLY_AMBIGUOUS and explain why.",
            "Map narrative sentences and tables semantically to the listed IPOWEB fields; do not require conventional labels such as IPO Name or Price Band.",
            "Read every supplied page and all table headers, row labels, column positions, surrounding headings, and units before mapping values.",
            "For financial tables, map each value to the year in its explicit column header (including FY2024, FY2025, and FY2026). Never shift a value into an adjacent year and never calculate a missing metric.",
            "Map explicit lot and application statements to lotSize and the supported retail/sHNI/bHNI lot, share, and amount fields; map explicit promoter pre/post issue percentages and peer-table columns to their corresponding fields.",
            "Map narrative business descriptions, objects, strengths, and risks semantically. Only classify debtRisk or businessRisk when the source explicitly provides an equivalent risk classification; do not derive one.",
            "Extract companyAddress only from an explicit company or registered-office address. Map explicit ROE, ROCE, RONW, PAT margin, EBITDA margin, and peer RONW values without calculating them.",
            "Convert explicit calendar dates to valid YYYY-MM-DD values; keep all numbers, units, currency, percentages, and subscription multiples faithful to the source.",
          "For GMP, populate gmp only when the source explicitly labels the value GMP or grey market premium. Never map reservation, subscription, issue size, price band, or an unrelated number to GMP.",
          "Map FY financial values only when the financial year is explicit. A generic total-assets figure without a year is ambiguous.",
          "sourceSnippet must be a short verbatim excerpt that supports the value. sourcePage must be its page number for PDF input, otherwise null.",
          "For gmpHistory, encode the value as a JSON string containing an array of objects with string date and value properties.",
          ].join(" "),
          responseMimeType: "application/json",
          responseJsonSchema: {
              type: "object", additionalProperties: false, required: ["fields"],
              properties: {
                fields: {
                  type: "array",
                  items: {
                    type: "object", additionalProperties: false,
                    required: ["field", "value", "state", "sourcePage", "sourceSnippet", "reason"],
                    properties: {
                      field: { type: "string", enum: IPO_IMPORT_FIELD_NAMES },
                      value: { type: "string" },
                      state: { type: "string", enum: ["POPULATED", "POTENTIALLY_AMBIGUOUS"] },
                      sourcePage: { type: ["integer", "null"] },
                      sourceSnippet: { type: "string" },
                      reason: { type: "string" },
                    },
                  },
                },
              },
          },
        },
    });
    if (!response.text) throw new Error("Gemini response contained no structured output text.");
    const parsed = JSON.parse(response.text) as { fields?: unknown };
    const validated = validateAIExtraction(parsed.fields, pages);
    return {
      inputType, pageCount: inputType === "PDF" ? pages.length : undefined,
      ...validated, extractionMethod: "AI_SEMANTIC", model: GEMINI_IPO_EXTRACTION_MODEL,
    };
  } finally {
    clearTimeout(timeout);
  }
}
