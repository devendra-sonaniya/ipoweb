export const IPO_DRAFT_MAX_FILE_SIZE = 256 * 1024;

export type ImportedGMPHistoryItem = {
  date: string;
  value: string;
};

export type ImportedIPOValue = string | ImportedGMPHistoryItem[];

export type ParsedIPODraft = {
  mappedFields: Record<string, ImportedIPOValue>;
  sourceFields: Record<string, string>;
  fieldsDetected: number;
  fieldsWithValues: number;
  emptyFields: number;
};

const FIELD_ALIASES: Record<string, string> = {
  exchange: "listingExchange",
  drhp: "drhpLink",
  rhp: "rhpLink",
  overview: "companyOverview",
  totalAssets: "totalAssetsFY2026",
};

const LIST_FIELDS = new Set(["strengths", "risks"]);

function isEmpty(value: ImportedIPOValue) {
  return typeof value === "string" ? value.length === 0 : value.length === 0;
}

function validateISODate(field: string, value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`${field} contains an invalid ISO date.`);
  }
}

export function parseIPODraft(
  jsonText: string,
  allowedFields: readonly string[]
): ParsedIPODraft {
  if (!jsonText.trim()) throw new Error("Paste IPO JSON or choose a JSON file.");

  let draft: unknown;
  try {
    draft = JSON.parse(jsonText);
  } catch {
    throw new Error("Invalid JSON. Correct the draft before previewing it.");
  }

  if (!draft || typeof draft !== "object" || Array.isArray(draft)) {
    throw new Error("The IPO draft must be one JSON object.");
  }

  const allowed = new Set(allowedFields);
  const mappedFields: Record<string, ImportedIPOValue> = {};
  const sourceFields: Record<string, string> = {};

  for (const [sourceField, rawValue] of Object.entries(draft)) {
    if (["__proto__", "constructor", "prototype"].includes(sourceField)) {
      throw new Error(`Unsafe field is not allowed: ${sourceField}`);
    }

    const field = FIELD_ALIASES[sourceField] ?? sourceField;
    if (!allowed.has(field)) {
      throw new Error(`Unknown IPO field: ${sourceField}`);
    }
    if (Object.hasOwn(mappedFields, field)) {
      throw new Error(`Both ${sourceField} and another field map to ${field}.`);
    }

    let value: ImportedIPOValue;
    if (field === "gmpHistory") {
      if (!Array.isArray(rawValue)) {
        throw new Error("gmpHistory must be an array of date/value objects.");
      }
      value = rawValue.map((item, index) => {
        if (
          !item ||
          typeof item !== "object" ||
          Array.isArray(item) ||
          typeof (item as Record<string, unknown>).date !== "string" ||
          typeof (item as Record<string, unknown>).value !== "string" ||
          Object.keys(item).some((key) => key !== "date" && key !== "value")
        ) {
          throw new Error(`gmpHistory item ${index + 1} must contain only string date and value fields.`);
        }
        return {
          date: (item as Record<string, string>).date,
          value: (item as Record<string, string>).value,
        };
      });
    } else if (LIST_FIELDS.has(field) && Array.isArray(rawValue)) {
      if (!rawValue.every((item) => typeof item === "string")) {
        throw new Error(`${sourceField} must be a string or an array of strings.`);
      }
      value = rawValue.join("\n");
    } else {
      if (typeof rawValue !== "string") {
        throw new Error(`${sourceField} must be a string.`);
      }
      value = rawValue;
    }

    if (["openDate", "closeDate", "allotmentDate", "listingDate", "refundDate", "dematCreditDate"].includes(field) && typeof value === "string" && value) {
      validateISODate(field, value);
    }

    mappedFields[field] = value;
    sourceFields[field] = sourceField;
  }

  if (typeof mappedFields.name !== "string" || !mappedFields.name.trim()) {
    throw new Error("A non-empty IPO name is required in every draft.");
  }

  const values = Object.values(mappedFields);
  const emptyFields = values.filter(isEmpty).length;
  return {
    mappedFields,
    sourceFields,
    fieldsDetected: values.length,
    fieldsWithValues: values.length - emptyFields,
    emptyFields,
  };
}

export function isImportedValueEmpty(value: ImportedIPOValue) {
  return isEmpty(value);
}
