"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  IPO_DRAFT_MAX_FILE_SIZE,
  isImportedValueEmpty,
  parseIPODraft,
  type ImportedIPOValue,
  type ParsedIPODraft,
} from "@/lib/ipoDraftImport";
import type { IPOExtractionResult } from "@/lib/ipoTextExtractor";
import {
  buildApprovedPartialPatch,
  buildPartialUpdateProposals,
  summarizePartialUpdate,
  type IPOPartialProposal,
  type PartialUpdateChoice,
} from "@/lib/ipoPartialUpdate";
type GMPHistoryItem = {
  date: string;
  value: string;
};


type IPOForm = {
  name: string;
  type: string;
  status: string;
  sentiment: string;
  priceBand: string;
  gmp: string;
  listingGain: string;
  subscription: string;
  qibSubscription: string;
  niiSubscription: string;
  retailSubscription: string;
  employeeSubscription: string;
  shareholderSubscription: string;
  closeDate: string;
  issueSize: string;
  lotSize: string;
  minimumInvestment: string;
  openDate: string;
  allotmentDate: string;
  listingDate: string;
  listingExchange: string;
  registrar: string;
  allotmentLink: string;
  growwIPOUrl: string;
  financials: string;
  faceValue: string;
  drhpLink: string;
  rhpLink: string;
retailMinLot: string;
retailMinShares: string;
retailMinAmount: string;

retailMaxLot: string;
retailMaxShares: string;
retailMaxAmount: string;

sHniLot: string;
sHniShares: string;
sHniAmount: string;

bHniLot: string;
bHniShares: string;
bHniAmount: string;

qibReservation: string;
niiReservation: string;
retailReservation: string;
employeeReservation: string;
shareholderReservation: string;

prePromoterHolding: string;
postPromoterHolding: string;
anchorAllocation: string;
anchorDetails: string;

revenueFY2024: string;
revenueFY2025: string;
revenueFY2026: string;

profitFY2024: string;
profitFY2025: string;
profitFY2026: string;
issueType: string;
freshIssue: string;
offerForSale: string;
listingAt: string;
listingPrice: string;
leadManagers: string;
marketMaker: string;
employeeDiscount: string;
retailDiscount: string;
refundDate: string;
dematCreditDate: string;
marketCapPostIPO: string;
bookValue: string;
eps: string;
dilutedEPS: string;
peRatio: string;
industryPE: string;
pbRatio: string;
roe: string;
roce: string;
ronw: string;
patMargin: string;
ebitdaMargin: string;
debtToEquity: string;
  totalAssetsFY2024: string;
  totalAssetsFY2025: string;
  totalAssetsFY2026: string;
ipoValuation: string;
  gmpTrend: string;
  strengths: string;
  risks: string;
  gmpSource: string;
subscriptionSource: string;
officialSource: string;
lastUpdated: string;
revenueGrowth: string;
patGrowth: string;
debtRisk: string;
valuation: string;
peerRevenue: string;
peerPAT: string;
peerEPS: string;
peerPE: string;
peerMarketCap: string;
peerROE: string;
peerDebtEquity: string;
peerTotalAssets: string;

peer1Name: string;
peer1Revenue: string;
peer1PAT: string;
peer1EPS: string;
peer1PE: string;
peer1MarketCap: string;
peer1ROE: string;
peer1RONW: string;
peer1DebtEquity: string;
peer1TotalAssets: string;

peer2Name: string;
peer2Revenue: string;
peer2PAT: string;
peer2EPS: string;
peer2PE: string;
peer2MarketCap: string;
peer2ROE: string;
peer2RONW: string;
peer2DebtEquity: string;
peer2TotalAssets: string;

peer3Name: string;
peer3Revenue: string;
peer3PAT: string;
peer3EPS: string;
peer3PE: string;
peer3MarketCap: string;
peer3ROE: string;
peer3RONW: string;
peer3DebtEquity: string;
peer3TotalAssets: string;
companyAddress: string;
companyOverview: string;
businessModel: string;
objectsOfIssue: string;
businessRisk: string;
  gmpHistory: GMPHistoryItem[];
};

type IPORecord = IPOForm & {
  id: string;
  slug?: string;
  oldSlugs?: string[];
};

type ImportPreview = ParsedIPODraft & {
  existingIPO: IPORecord | null;
  inputType: "TEXT" | "PDF" | "JSON";
  sourceLocations: Record<string, string>;
  fieldStates: Record<string, ImportFieldState>;
  originalFieldStates: Record<string, ImportFieldState>;
  warnings: string[];
  extractionMethod?: IPOExtractionResult["extractionMethod"];
  extractionModel?: string;
};

type ImportFieldState =
  | "POPULATED"
  | "EMPTY"
  | "POTENTIALLY_AMBIGUOUS"
  | "MANUALLY_EDITED"
  | "MANUALLY_ADDED";

type ImportStage = "PREVIEW" | "EDIT" | "FINAL_REVIEW";

const IPO_TYPE_VALUES = ["MAINBOARD", "SME", "NSE SME", "BSE SME"] as const;
const SUBSCRIPTION_EXCHANGES = ["NSE", "BSE"] as const;
const OFFICIAL_DOCUMENT_SOURCES = [
  "DRHP",
  "RHP",
  "NSE",
  "BSE",
  "SEBI",
] as const;

const IMPORT_TEXTAREA_FIELDS = new Set([
  "financials", "anchorDetails", "gmpTrend", "strengths", "risks",
  "companyAddress", "companyOverview", "businessModel", "objectsOfIssue",
]);

const IMPORT_ENUM_OPTIONS: Record<string, readonly string[]> = {
  type: ["", ...IPO_TYPE_VALUES],
  status: ["", "OPEN", "UPCOMING", "CLOSED", "LISTED"],
  sentiment: ["", "POSITIVE", "NEUTRAL", "NEGATIVE", "BULLISH", "BEARISH"],
  subscriptionSource: ["", ...SUBSCRIPTION_EXCHANGES],
  officialSource: ["", ...OFFICIAL_DOCUMENT_SOURCES],
  debtRisk: ["", "LOW", "MEDIUM", "HIGH"],
  businessRisk: ["", "LOW", "MEDIUM", "HIGH"],
  valuation: ["", "ATTRACTIVE", "FAIR", "EXPENSIVE"],
};

function normalizeIPOType(value: string | null | undefined) {
  const normalized = (value ?? "").trim().toUpperCase();

  if (normalized === "MAINBOARD IPO") return "MAINBOARD";
  if (normalized === "SME IPO") return "SME";

  return IPO_TYPE_VALUES.find((option) => option === normalized) ?? "MAINBOARD";
}

function normalizeLegacyOption(
  value: string | null | undefined,
  options: readonly string[],
  fallback: string
) {
  const normalized = (value ?? "").trim().toUpperCase();

  if (options.includes(normalized)) return normalized;

  const legacyParts = normalized
    .split(/[\/,|]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return options.find((option) => legacyParts.includes(option)) ?? fallback;
}

const initialForm: IPOForm = {
  name: "",
  type: "MAINBOARD",
  status: "OPEN",
  sentiment: "NEUTRAL",
  priceBand: "",
  gmp: "",
  listingGain: "",
  listingPrice: "",
  subscription: "",
  qibSubscription: "",
  niiSubscription: "",
  retailSubscription: "",
  employeeSubscription: "",
  shareholderSubscription: "",
  closeDate: "",
  issueSize: "",
  lotSize: "",
  minimumInvestment: "",
  openDate: "",
  allotmentDate: "",
  listingDate: "",
  drhpLink: "",
  rhpLink: "",
  listingExchange: "",
  registrar: "",
  allotmentLink: "",
  growwIPOUrl: "",
  financials: "",
  faceValue: "",

retailMinLot: "",
retailMinShares: "",
retailMinAmount: "",

retailMaxLot: "",
retailMaxShares: "",
retailMaxAmount: "",

sHniLot: "",
sHniShares: "",
sHniAmount: "",

bHniLot: "",
bHniShares: "",
bHniAmount: "",

qibReservation: "",
niiReservation: "",
retailReservation: "",
employeeReservation: "",
shareholderReservation: "",

prePromoterHolding: "",
postPromoterHolding: "",
anchorAllocation: "",
anchorDetails: "",

revenueFY2024: "",
revenueFY2025: "",
revenueFY2026: "",

profitFY2024: "",
profitFY2025: "",
profitFY2026: "",
issueType: "",
freshIssue: "",
offerForSale: "",
listingAt: "",
leadManagers: "",
marketMaker: "",
employeeDiscount: "",
retailDiscount: "",
refundDate: "",
dematCreditDate: "",
marketCapPostIPO: "",
bookValue: "",
eps: "",
dilutedEPS: "",
peRatio: "",
industryPE: "",
pbRatio: "",
roe: "",
roce: "",
ronw: "",
patMargin: "",
ebitdaMargin: "",
debtToEquity: "",
totalAssetsFY2024: "",
totalAssetsFY2025: "",
totalAssetsFY2026: "",
ipoValuation: "",
  gmpTrend: "",
  strengths: "",
  risks: "",
  gmpSource: "GREY MARKET",
subscriptionSource: "NSE",
officialSource: "DRHP",
lastUpdated: "",
revenueGrowth: "",
patGrowth: "",
debtRisk: "",
valuation: "",
peerRevenue: "",
peerPAT: "",
peerEPS: "",
peerPE: "",
peerMarketCap: "",
peerROE: "",
peerDebtEquity: "",
peerTotalAssets: "",

peer1Name: "",
peer1Revenue: "",
peer1PAT: "",
peer1EPS: "",
peer1PE: "",
peer1MarketCap: "",
peer1ROE: "",
peer1RONW: "",
peer1DebtEquity: "",
peer1TotalAssets: "",

peer2Name: "",
peer2Revenue: "",
peer2PAT: "",
peer2EPS: "",
peer2PE: "",
peer2MarketCap: "",
peer2ROE: "",
peer2RONW: "",
peer2DebtEquity: "",
peer2TotalAssets: "",

peer3Name: "",
peer3Revenue: "",
peer3PAT: "",
peer3EPS: "",
peer3PE: "",
peer3MarketCap: "",
peer3ROE: "",
peer3RONW: "",
peer3DebtEquity: "",
peer3TotalAssets: "",
companyAddress: "",
companyOverview: "",
businessModel: "",
objectsOfIssue: "",
businessRisk: "",
  gmpHistory: [],
};

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [form, setForm] = useState<IPOForm>(initialForm);
  const [ipos, setIpos] = useState<IPORecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingName, setEditingName] = useState<string | null>(
    null
  );

  const [gmpDate, setGmpDate] = useState("");
  const [gmpValue, setGmpValue] = useState("");
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [clearImportedEmptyFields, setClearImportedEmptyFields] = useState(false);
  const [importSaving, setImportSaving] = useState(false);
  const [sourceText, setSourceText] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [importStage, setImportStage] = useState<ImportStage>("PREVIEW");
  const [gmpHistoryEditText, setGmpHistoryEditText] = useState("[]");
  const [partialProposals, setPartialProposals] = useState<IPOPartialProposal[] | null>(null);
  const [showOnlyNewInformation, setShowOnlyNewInformation] = useState(true);

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 outline-none focus:border-green-500";

  function createClientSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function normalizeImportedFields(fields: Record<string, ImportedIPOValue>) {
    const normalized = { ...fields };

    if (typeof normalized.type === "string" && normalized.type) {
      const type = normalizeIPOType(normalized.type);
      const suppliedType = normalized.type.trim().toUpperCase();
      const recognized = IPO_TYPE_VALUES.includes(suppliedType as (typeof IPO_TYPE_VALUES)[number]) ||
        suppliedType === "MAINBOARD IPO" || suppliedType === "SME IPO";
      if (!recognized) throw new Error(`Invalid IPO type: ${normalized.type}`);
      normalized.type = type;
    }

    if (typeof normalized.status === "string" && normalized.status) {
      const status = normalized.status.trim().toUpperCase();
      if (!["OPEN", "UPCOMING", "CLOSED", "LISTED"].includes(status)) {
        throw new Error(`Invalid IPO status: ${normalized.status}`);
      }
      normalized.status = status;
    }

    if (typeof normalized.subscriptionSource === "string" && normalized.subscriptionSource) {
      const source = normalized.subscriptionSource.trim().toUpperCase();
      if (!SUBSCRIPTION_EXCHANGES.includes(source as (typeof SUBSCRIPTION_EXCHANGES)[number])) {
        throw new Error(`Invalid subscription source: ${normalized.subscriptionSource}`);
      }
      normalized.subscriptionSource = source;
    }

    if (typeof normalized.officialSource === "string" && normalized.officialSource) {
      const source = normalized.officialSource.trim().toUpperCase();
      if (!OFFICIAL_DOCUMENT_SOURCES.includes(source as (typeof OFFICIAL_DOCUMENT_SOURCES)[number])) {
        throw new Error(`Invalid official source: ${normalized.officialSource}`);
      }
      normalized.officialSource = source;
    }

    return normalized;
  }

  function resetImport() {
    setImportText("");
    setSourceText("");
    setPdfFile(null);
    setImportError("");
    setImportPreview(null);
    setClearImportedEmptyFields(false);
    setImportStage("PREVIEW");
    setGmpHistoryEditText("[]");
    setPartialProposals(null);
    setShowOnlyNewInformation(true);
  }

  function previewImport() {
    try {
      const parsed = parseIPODraft(importText, Object.keys(initialForm));
      const mappedFields = normalizeImportedFields(parsed.mappedFields);
      const name = mappedFields.name as string;
      const candidateSlug = createClientSlug(name);
      const existingIPO = ipos.find((ipo) =>
        ipo.name.trim().toLowerCase() === name.trim().toLowerCase() ||
        Boolean(candidateSlug && ipo.slug === candidateSlug)
      ) ?? null;

      const fieldStates = Object.fromEntries(Object.entries(mappedFields).map(([field, value]) => [field, isImportedValueEmpty(value) ? "EMPTY" : "POPULATED"])) as Record<string, ImportFieldState>;
      setImportPreview({
        ...parsed,
        mappedFields,
        existingIPO,
        inputType: "JSON",
        sourceLocations: Object.fromEntries(Object.keys(mappedFields).map((field) => [field, "JSON draft"])),
        fieldStates,
        originalFieldStates: { ...fieldStates },
        warnings: [],
      });
      setImportError("");
      setImportStage("PREVIEW");
    } catch (error) {
      setImportPreview(null);
      setImportError(error instanceof Error ? error.message : "Unable to preview this IPO draft.");
    }
  }

  async function extractVerifiedSource(inputType: "TEXT" | "PDF") {
    setExtracting(true);
    setImportError("");
    setImportPreview(null);

    try {
      if (!adminKey) throw new Error("Enter the Admin API key before extracting.");
      if (inputType === "TEXT" && !sourceText.trim()) throw new Error("Paste verified IPO text before extracting.");
      if (inputType === "PDF" && !pdfFile) throw new Error("Choose a PDF before extracting.");

      const body = new FormData();
      body.set("inputType", inputType);
      if (inputType === "TEXT") body.set("text", sourceText);
      if (inputType === "PDF" && pdfFile) body.set("file", pdfFile);

      const response = await fetch("/api/ipos/extract", {
        method: "POST",
        headers: { Authorization: `Bearer ${adminKey}` },
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Unable to extract this source.");

      const result = data as IPOExtractionResult;
      const currentEditingIPO = editingName
        ? ipos.find((ipo) => ipo.name === editingName) ?? null
        : null;
      const mappedFields = Object.fromEntries(
        (Object.keys(initialForm) as (keyof IPOForm)[]).map((field) => [field, field === "gmpHistory" ? [] : ""])
      ) as Record<string, ImportedIPOValue>;
      const sourceFields: Record<string, string> = {};
      const sourceLocations: Record<string, string> = {};
      const fieldStates = Object.fromEntries(
        Object.keys(initialForm).map((field) => [field, "EMPTY"])
      ) as Record<string, ImportFieldState>;

      for (const extracted of result.fields) {
        if (!Object.hasOwn(mappedFields, extracted.field)) continue;
        mappedFields[extracted.field] = extracted.state === "POPULATED" ? extracted.value : extracted.field === "gmpHistory" ? [] : "";
        sourceFields[extracted.field] = extracted.source.label;
        const location = inputType === "PDF" && extracted.source.page
          ? `Page ${extracted.source.page}`
          : "Pasted text";
        sourceLocations[extracted.field] = extracted.source.snippet
          ? `${location} — “${extracted.source.snippet.slice(0, 180)}”`
          : location;
        fieldStates[extracted.field] = extracted.state;
      }

      const normalizedFields = normalizeImportedFields(mappedFields);
      const name = typeof normalizedFields.name === "string" ? normalizedFields.name : "";
      const candidateSlug = createClientSlug(name);
      const existingIPO = name ? ipos.find((ipo) =>
        ipo.name.trim().toLowerCase() === name.trim().toLowerCase() ||
        Boolean(candidateSlug && ipo.slug === candidateSlug)
      ) ?? null : null;
      const fieldsWithValues = Object.values(normalizedFields).filter((value) => !isImportedValueEmpty(value)).length;

      if (currentEditingIPO) {
        setPartialProposals(buildPartialUpdateProposals(
          currentEditingIPO as unknown as Record<string, unknown>,
          result.fields,
          Object.keys(initialForm)
        ));
      } else {
        setPartialProposals(null);
      }

      setImportPreview({
        inputType,
        mappedFields: normalizedFields,
        sourceFields,
        sourceLocations,
        fieldStates,
        originalFieldStates: { ...fieldStates },
        warnings: result.warnings,
        extractionMethod: result.extractionMethod,
        extractionModel: result.model,
        fieldsDetected: result.fields.length,
        fieldsWithValues,
        emptyFields: Object.keys(initialForm).length - fieldsWithValues,
        existingIPO: currentEditingIPO ?? existingIPO,
      });
      setImportStage("PREVIEW");
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Unable to extract this source.");
    } finally {
      setExtracting(false);
    }
  }

  function fieldLabel(field: string) {
    return field
      .replace(/FY(\d{4})/g, " FY$1")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/^./, (character) => character.toUpperCase())
      .replace(/Gmp/g, "GMP")
      .replace(/Ipo/g, "IPO")
      .replace(/Qib/g, "QIB")
      .replace(/Nii/g, "NII")
      .replace(/Pat/g, "PAT")
      .replace(/Eps/g, "EPS")
      .replace(/Pe /g, "P/E ")
      .replace(/Pb /g, "P/B ");
  }

  function beginImportEditing() {
    if (!importPreview) return;
    const history = importPreview.mappedFields.gmpHistory;
    setGmpHistoryEditText(JSON.stringify(Array.isArray(history) ? history : [], null, 2));
    setImportError("");
    setImportStage("EDIT");
  }

  function updateImportedField(field: string, value: string) {
    setImportPreview((current) => {
      if (!current) return current;
      const wasOriginallyEmpty = current.originalFieldStates[field] === "EMPTY" ||
        current.originalFieldStates[field] === "POTENTIALLY_AMBIGUOUS";
      return {
        ...current,
        mappedFields: { ...current.mappedFields, [field]: value },
        fieldStates: {
          ...current.fieldStates,
          [field]: wasOriginallyEmpty && value ? "MANUALLY_ADDED" : "MANUALLY_EDITED",
        },
        sourceLocations: { ...current.sourceLocations, [field]: "Manual correction" },
      };
    });
  }

  function updatePartialChoice(field: string, choice: PartialUpdateChoice) {
    setPartialProposals((current) => current?.map((proposal) =>
      proposal.field === field
        ? {
            ...proposal,
            choice,
            status: choice === "MANUAL"
              ? "MANUALLY_EDITED"
              : proposal.conflict
                ? choice === "USE_NEW" ? "UPDATED" : "CONFLICT"
                : proposal.status,
          }
        : proposal
    ) ?? null);
  }

  function updatePartialValue(field: string, value: string) {
    setPartialProposals((current) => current?.map((proposal) =>
      proposal.field === field
        ? { ...proposal, newValue: value, patchValue: value, choice: "MANUAL", status: "MANUALLY_EDITED", source: "Manual correction" }
        : proposal
    ) ?? null);
  }

  function validateImportDate(field: string, value: string) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      throw new Error(`${fieldLabel(field)} contains an invalid date.`);
    }
  }

  function finalizeImportReview() {
    if (!importPreview) return;
    if (partialProposals) {
      setImportError("");
      setImportStage("FINAL_REVIEW");
      return;
    }
    try {
      const parsedHistory = JSON.parse(gmpHistoryEditText) as unknown;
      if (!Array.isArray(parsedHistory) || !parsedHistory.every((item) =>
        item && typeof item === "object" && !Array.isArray(item) &&
        typeof (item as Record<string, unknown>).date === "string" &&
        typeof (item as Record<string, unknown>).value === "string" &&
        Object.keys(item).every((key) => key === "date" || key === "value")
      )) {
        throw new Error("GMP History must be a JSON array containing only date/value string objects.");
      }

      const historyWasChanged = JSON.stringify(importPreview.mappedFields.gmpHistory) !== JSON.stringify(parsedHistory);
      const mappedFields = normalizeImportedFields({
        ...importPreview.mappedFields,
        gmpHistory: parsedHistory as GMPHistoryItem[],
      });
      const name = typeof mappedFields.name === "string" ? mappedFields.name.trim() : "";
      if (!name) throw new Error("IPO Name is required before final review.");

      for (const field of ["openDate", "closeDate", "allotmentDate", "listingDate", "refundDate", "dematCreditDate"]) {
        const value = mappedFields[field];
        if (typeof value === "string") validateImportDate(field, value);
      }

      const candidateSlug = createClientSlug(name);
      const existingIPO = importPreview.existingIPO ?? ipos.find((ipo) =>
        ipo.name.trim().toLowerCase() === name.toLowerCase() ||
        Boolean(candidateSlug && ipo.slug === candidateSlug)
      ) ?? null;
      const fieldStates = { ...importPreview.fieldStates };
      if (historyWasChanged) {
        const originallyEmpty = importPreview.originalFieldStates.gmpHistory !== "POPULATED";
        fieldStates.gmpHistory = originallyEmpty && parsedHistory.length ? "MANUALLY_ADDED" : "MANUALLY_EDITED";
      }
      const fieldsWithValues = Object.values(mappedFields).filter((value) => !isImportedValueEmpty(value)).length;

      setImportPreview({
        ...importPreview,
        mappedFields,
        existingIPO,
        fieldStates,
        sourceLocations: historyWasChanged
          ? { ...importPreview.sourceLocations, gmpHistory: "Manual correction" }
          : importPreview.sourceLocations,
        fieldsWithValues,
        emptyFields: Object.keys(initialForm).length - fieldsWithValues,
      });
      setImportError("");
      setImportStage("FINAL_REVIEW");
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Correct the edited data before final review.");
    }
  }

  async function chooseImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".json") || (file.type && file.type !== "application/json")) {
      setImportError("Only JSON files are accepted.");
      return;
    }
    if (file.size > IPO_DRAFT_MAX_FILE_SIZE) {
      setImportError("JSON file is too large. Maximum size is 256 KB.");
      return;
    }

    setImportText(await file.text());
    setImportPreview(null);
    setImportError("");
  }

  async function saveImportedIPO() {
    if (!importPreview) return;
    setImportSaving(true);
    setImportError("");

    try {
      const existing = importPreview.existingIPO;
      if (partialProposals) {
        if (!existing?.id || !existing.slug) throw new Error("Reload this IPO before applying additional data.");
        const changes = buildApprovedPartialPatch(partialProposals);
        if (Object.keys(changes).length === 0) throw new Error("Choose at least one new or edited value to save.");
        const response = await fetch("/api/ipos", {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminKey}` },
          body: JSON.stringify({ id: existing.id, slug: existing.slug, changes }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || "Unable to apply approved IPO changes.");
        setMessage(`${existing.name} updated with ${Object.keys(changes).length} approved field changes.`);
        resetImport();
        setForm(initialForm);
        setEditingName(null);
        await loadIPOs();
        return;
      }
      const base = existing ? { ...initialForm, ...existing } : { ...initialForm };
      const ipo = Object.fromEntries(
        (Object.keys(initialForm) as (keyof IPOForm)[]).map((key) => [key, base[key]])
      ) as IPOForm;

      for (const [field, value] of Object.entries(importPreview.mappedFields)) {
        if (!existing || clearImportedEmptyFields || !isImportedValueEmpty(value)) {
          (ipo as unknown as Record<string, ImportedIPOValue>)[field] = value;
        }
      }

      const response = await fetch("/api/ipos", {
        method: existing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminKey}`,
        },
        body: existing
          ? JSON.stringify({ originalName: existing.name, ipo })
          : JSON.stringify(ipo),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Unable to import IPO data.");

      setMessage(existing ? `${ipo.name} updated from verified draft.` : `${ipo.name} imported from verified draft.`);
      resetImport();
      await loadIPOs();
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Unable to import IPO data.");
    } finally {
      setImportSaving(false);
    }
  }

  async function loadIPOs() {
    try {
      const response = await fetch("/api/ipos", {
        cache: "no-store",
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        setIpos(data);
      }
    } catch (error) {
      console.error("Unable to load IPOs:", error);
    }
  }

  useEffect(() => {
    // Data loading completes asynchronously; state is not changed during setup.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadIPOs();
  }, []);

  function updateField(
    field: keyof IPOForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function addGMPHistory() {
    if (!gmpDate || !gmpValue) {
      setMessage("Enter GMP date and GMP value.");
      return;
    }

    setForm((current) => ({
      ...current,
      gmpHistory: [
        ...(current.gmpHistory || []),
        {
          date: gmpDate,
          value: gmpValue,
        },
      ],
    }));

    setGmpDate("");
    setGmpValue("");

    setMessage(
      "GMP history point added. Save or update IPO."
    );
  }

  function removeGMPHistory(index: number) {
    setForm((current) => ({
      ...current,
      gmpHistory: current.gmpHistory.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  }

  function editIPO(ipo: IPORecord) {
    resetImport();
    setForm({
      ...initialForm,
      ...ipo,
      type: normalizeIPOType(ipo.type),
      gmpSource: "GREY MARKET",
      subscriptionSource: normalizeLegacyOption(
        ipo.subscriptionSource,
        SUBSCRIPTION_EXCHANGES,
        "NSE"
      ),
      officialSource: normalizeLegacyOption(
        ipo.officialSource,
        OFFICIAL_DOCUMENT_SOURCES,
        "DRHP"
      ),
      gmpHistory: Array.isArray(ipo.gmpHistory)
        ? ipo.gmpHistory
        : [],
    });

    setEditingName(ipo.name);
    setMessage(`Editing ${ipo.name}`);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setForm(initialForm);
    setEditingName(null);
    setGmpDate("");
    setGmpValue("");
    setMessage("Edit cancelled.");
    resetImport();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const latestHistoryGMP =
        form.gmpHistory &&
        form.gmpHistory.length > 0
          ? form.gmpHistory[
              form.gmpHistory.length - 1
            ].value
          : form.gmp;

      const priceNumbers = form.priceBand.match(
        /\d+(?:\.\d+)?/g
      );

      const upperPrice =
        priceNumbers && priceNumbers.length > 0
          ? Number(
              priceNumbers[priceNumbers.length - 1]
            )
          : 0;

      const latestGMPNumber = Number(
        latestHistoryGMP.replace(/[^\d.-]/g, "")
      );

      const validGMPNumber = Number.isFinite(
        latestGMPNumber
      )
        ? latestGMPNumber
        : 0;

      const autoListingGain =
        upperPrice > 0
          ? `${(
              (validGMPNumber / upperPrice) *
              100
            ).toFixed(1)}%`
          : form.listingGain;


const mappedForm = Object.fromEntries(
  (Object.keys(initialForm) as (keyof IPOForm)[]).map((key) => [key, form[key]])
) as IPOForm;

const formToSave: IPOForm = {
  ...mappedForm,
  gmpSource: "GREY MARKET",
  gmp: latestHistoryGMP,
  listingGain: autoListingGain,
};

      const response = await fetch("/api/ipos", {
        method: editingName ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminKey}`,
        },
        body: editingName
          ? JSON.stringify({
              originalName: editingName,
              ipo: formToSave,
            })
          : JSON.stringify(formToSave),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            (editingName
              ? "Unable to update IPO."
              : "Unable to save IPO data.")
        );
      }

      setMessage(
        editingName
          ? "IPO updated successfully! GMP and listing gain synced automatically."
          : "IPO saved successfully! GMP and listing gain calculated automatically."
      );

      setForm(initialForm);
      setEditingName(null);
      setGmpDate("");
      setGmpValue("");

      await loadIPOs();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteIPO(name: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch("/api/ipos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminKey}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to delete IPO."
        );
      }

      if (editingName === name) {
        setForm(initialForm);
        setEditingName(null);
      }

      setMessage(`${name} deleted successfully!`);

      await loadIPOs();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    }
  }

  const partialSummary = partialProposals ? summarizePartialUpdate(partialProposals) : null;
  const visiblePartialProposals = partialProposals?.filter((proposal) =>
    !showOnlyNewInformation || !["PRESERVED", "UNCHANGED"].includes(proposal.status)
  ) ?? [];
  const displayImportedValue = (value: ImportedIPOValue) =>
    Array.isArray(value) ? JSON.stringify(value) : value;
  const adminSection = (title: string) => (
    <div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
      <h2 className="text-2xl font-black text-green-400">{title}</h2>
    </div>
  );
  const adminField = (field: keyof IPOForm, label: string, type = "text") => (
    <label className="font-bold" key={field}>
      {label}
      <input type={type} value={form[field] as string} onChange={(event) => updateField(field, event.target.value)} className={inputClass} />
    </label>
  );
  const adminTextarea = (field: keyof IPOForm, label: string, rows = 4) => (
    <label className="font-bold md:col-span-2" key={field}>
      {label}
      <textarea rows={rows} value={form[field] as string} onChange={(event) => updateField(field, event.target.value)} className={inputClass} />
    </label>
  );
  const adminSelect = (field: keyof IPOForm, label: string, options: readonly string[]) => (
    <label className="font-bold" key={field}>
      {label}
      <select value={form[field] as string} onChange={(event) => updateField(field, event.target.value)} className={inputClass}>
        {options.map((option) => <option key={option || "empty"} value={option}>{option || `SELECT ${label.toUpperCase()}`}</option>)}
      </select>
    </label>
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white max-sm:py-6">
      <div className="mx-auto max-w-5xl">
        <p className="font-bold uppercase tracking-wider text-green-400">
          IPOWEB.IN ADMIN
        </p>

        <h1 className="mt-2 text-4xl font-black max-sm:text-3xl">
          IPO Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-300">
          Add, edit and manage complete IPO intelligence
          data.
        </p>

        <label className="mt-6 block font-bold">
          Admin API key
          <input
            required
            type="password"
            autoComplete="current-password"
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            className={`${inputClass} max-w-xl`}
          />
        </label>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 max-sm:rounded-2xl max-sm:p-4">
          <h2 className="text-2xl font-black text-green-400">
            {editingName ? "IMPORT ADDITIONAL DATA" : "IMPORT VERIFIED IPO DATA"}
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            {editingName
              ? `Update ${editingName} only with approved values explicitly present in the new source. Existing values are preserved by default.`
              : "Extract only explicitly supplied values from verified text or a short PDF. Nothing is saved until you review the preview and confirm."}
          </p>

          <label className="mt-5 block font-bold">
            Paste Verified IPO Text
            <textarea
              rows={10}
              value={sourceText}
              onChange={(event) => {
                setSourceText(event.target.value);
                setImportPreview(null);
                setImportError("");
              }}
              className={inputClass}
              placeholder={'IPO Name: Example Limited\nIPO Type: SME\nPrice Band: ₹100–₹110\nIssue Size: ₹50 Crore'}
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={extracting}
              onClick={() => extractVerifiedSource("TEXT")}
              className="rounded-xl bg-green-500 px-5 py-3 font-black text-slate-950 disabled:opacity-50"
            >
              {extracting ? "Extracting..." : "Extract Text & Preview"}
            </button>
          </div>

          <div className="mt-6 border-t border-slate-700 pt-6">
            <label className="block font-bold">
              Upload Verified IPO PDF
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setPdfFile(file);
                  setImportPreview(null);
                  setImportError("");
                }}
                className={`${inputClass} file:mr-4 file:rounded-lg file:border-0 file:bg-green-500 file:px-4 file:py-2 file:font-black file:text-slate-950`}
              />
            </label>
            <button
              type="button"
              disabled={extracting || !pdfFile}
              onClick={() => extractVerifiedSource("PDF")}
              className="mt-4 rounded-xl bg-green-500 px-5 py-3 font-black text-slate-950 disabled:opacity-50"
            >
              {extracting ? "Extracting..." : "Extract PDF & Preview"}
            </button>
          </div>

          <details className="mt-6 border-t border-slate-700 pt-5">
            <summary className="cursor-pointer font-bold text-slate-300">Advanced: JSON import</summary>
            <label className="mt-4 block font-bold">
              Verified IPO JSON
              <textarea
                rows={7}
                value={importText}
                onChange={(event) => {
                  setImportText(event.target.value);
                  setImportPreview(null);
                  setImportError("");
                }}
                className={`${inputClass} font-mono text-sm`}
                placeholder={'{\n  "name": "Example IPO",\n  "type": "MAINBOARD"\n}'}
              />
            </label>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="cursor-pointer rounded-xl border border-slate-600 px-5 py-3 font-black">
                Choose JSON File
                <input type="file" accept=".json,application/json" onChange={chooseImportFile} className="sr-only" />
              </label>
              <button type="button" onClick={previewImport} className="rounded-xl border border-green-500 px-5 py-3 font-black text-green-400">
                Preview JSON
              </button>
            </div>
          </details>

          {(sourceText || pdfFile || importText || importPreview) && (
            <button type="button" onClick={resetImport} className="mt-5 rounded-xl border border-slate-600 px-5 py-3 font-black">
              Cancel Import
            </button>
          )}

          {importError && (
            <p role="alert" className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 font-bold text-red-300">
              {importError}
            </p>
          )}

          {importPreview && (
            <div className="mt-5 rounded-2xl border border-slate-600 bg-slate-950 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-black">
                  {importStage === "PREVIEW" ? "Extraction Preview" : importStage === "EDIT" ? "Edit / Correct / Add Missing Data" : "Final Review — Exact Values to Save"}
                </h3>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${importPreview.existingIPO ? "bg-yellow-400 text-slate-950" : typeof importPreview.mappedFields.name === "string" && importPreview.mappedFields.name.trim() ? "bg-green-500 text-slate-950" : "bg-slate-600 text-white"}`}>
                  {importPreview.existingIPO ? "EXISTING IPO FOUND" : typeof importPreview.mappedFields.name === "string" && importPreview.mappedFields.name.trim() ? "NEW IPO" : "NEEDS MANUAL VERIFICATION"}
                </span>
              </div>

              <p className="mt-3 text-sm font-bold text-slate-300">
                Input type: {importPreview.inputType} · IPO: {importPreview.existingIPO?.name || typeof importPreview.mappedFields.name === "string" && importPreview.mappedFields.name || "Needs manual verification"}
              </p>
              {importPreview.inputType !== "JSON" && (
                <p className={`mt-2 text-xs font-bold ${importPreview.extractionMethod === "AI_SEMANTIC" ? "text-green-400" : "text-yellow-300"}`}>
                  Extraction: {importPreview.extractionMethod === "AI_SEMANTIC" ? `Gemini semantic${importPreview.extractionModel ? ` (${importPreview.extractionModel})` : ""}` : "Deterministic safety fallback — manually verify"}
                </p>
              )}

              {!partialProposals && <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div><dt className="text-slate-400">Fields detected</dt><dd className="text-lg font-black">{importPreview.fieldsDetected}</dd></div>
                <div><dt className="text-slate-400">With values</dt><dd className="text-lg font-black text-green-400">{importPreview.fieldsWithValues}</dd></div>
                <div><dt className="text-slate-400">Empty</dt><dd className="text-lg font-black text-yellow-300">{importPreview.emptyFields}</dd></div>
              </dl>}

              {partialProposals && partialSummary && (
                <>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-5">
                    <div><dt className="text-slate-400">Updated</dt><dd className="text-lg font-black">{partialSummary.changed}</dd></div>
                    <div><dt className="text-slate-400">Added</dt><dd className="text-lg font-black text-green-400">{partialSummary.added}</dd></div>
                    <div><dt className="text-slate-400">Preserved</dt><dd className="text-lg font-black">{partialSummary.preserved}</dd></div>
                    <div><dt className="text-slate-400">Conflicts</dt><dd className="text-lg font-black text-yellow-300">{partialSummary.conflicts}</dd></div>
                    <div><dt className="text-slate-400">Ambiguous</dt><dd className="text-lg font-black text-yellow-300">{partialSummary.ambiguous}</dd></div>
                  </dl>
                  <label className="mt-4 flex items-center gap-3 text-sm font-bold">
                    <input type="checkbox" checked={showOnlyNewInformation} onChange={(event) => setShowOnlyNewInformation(event.target.checked)} className="size-4 accent-green-500" />
                    Show only fields with new information
                  </label>
                  <div className="mt-4 max-h-[34rem] overflow-auto rounded-xl border border-slate-700">
                    <table className="w-full min-w-[900px] text-left text-sm">
                      <thead className="sticky top-0 bg-slate-800 text-slate-300">
                        <tr><th className="px-3 py-2">Field</th><th className="px-3 py-2">Existing Value</th><th className="px-3 py-2">New / Final Value</th><th className="px-3 py-2">Source / Evidence</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Decision</th></tr>
                      </thead>
                      <tbody>
                        {visiblePartialProposals.map((proposal) => (
                          <tr key={proposal.field} className="border-t border-slate-800 align-top">
                            <td className="px-3 py-2 font-mono text-green-400">{proposal.field}</td>
                            <td className="max-w-xs whitespace-pre-wrap break-words px-3 py-2">{Array.isArray(proposal.existingValue) ? JSON.stringify(proposal.existingValue) : proposal.existingValue || <span className="text-slate-500">EMPTY</span>}</td>
                            <td className="max-w-xs px-3 py-2">
                              {importStage === "FINAL_REVIEW" || Array.isArray(proposal.newValue) ? (
                                <span className="whitespace-pre-wrap break-words">{displayImportedValue(proposal.choice === "KEEP_EXISTING" ? proposal.existingValue : proposal.newValue) || <span className="text-slate-500">EMPTY</span>}</span>
                              ) : (
                                <input value={proposal.newValue} onChange={(event) => updatePartialValue(proposal.field, event.target.value)} className={inputClass} />
                              )}
                            </td>
                            <td className="max-w-sm px-3 py-2 text-slate-300">{proposal.source}{proposal.warning ? ` — ${proposal.warning}` : ""}</td>
                            <td className="px-3 py-2 text-xs font-black text-yellow-300">{proposal.status}</td>
                            <td className="px-3 py-2">
                              {importStage === "FINAL_REVIEW" ? proposal.choice.replace("_", " ") : (
                                <select value={proposal.choice} onChange={(event) => updatePartialChoice(proposal.field, event.target.value as PartialUpdateChoice)} className={inputClass}>
                                  <option value="KEEP_EXISTING">Keep existing</option>
                                  {proposal.status !== "POTENTIALLY_AMBIGUOUS" && <option value="USE_NEW">Use new value</option>}
                                  {!Array.isArray(proposal.newValue) && <option value="MANUAL">Edit manually</option>}
                                </select>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {!partialProposals && (importStage === "EDIT" ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {Object.entries(importPreview.mappedFields).map(([field, value]) => (
                    <label key={field} className={`font-bold ${IMPORT_TEXTAREA_FIELDS.has(field) || field === "gmpHistory" ? "md:col-span-2" : ""}`}>
                      <span>{fieldLabel(field)}</span>
                      <span className={`ml-2 text-xs ${importPreview.fieldStates[field] === "POPULATED" ? "text-green-400" : importPreview.fieldStates[field] === "MANUALLY_ADDED" ? "text-cyan-300" : importPreview.fieldStates[field] === "MANUALLY_EDITED" ? "text-blue-300" : importPreview.fieldStates[field] === "POTENTIALLY_AMBIGUOUS" ? "text-yellow-300" : "text-slate-500"}`}>
                        {importPreview.fieldStates[field]}
                      </span>
                      {field === "gmpHistory" ? (
                        <textarea
                          rows={6}
                          value={gmpHistoryEditText}
                          onChange={(event) => setGmpHistoryEditText(event.target.value)}
                          className={`${inputClass} font-mono text-sm`}
                          aria-label="GMP History JSON"
                        />
                      ) : IMPORT_ENUM_OPTIONS[field] ? (
                        <select value={typeof value === "string" ? value : ""} onChange={(event) => updateImportedField(field, event.target.value)} className={inputClass}>
                          {IMPORT_ENUM_OPTIONS[field].map((option) => <option key={option || "empty"} value={option}>{option || "EMPTY"}</option>)}
                        </select>
                      ) : IMPORT_TEXTAREA_FIELDS.has(field) ? (
                        <textarea rows={4} value={typeof value === "string" ? value : ""} onChange={(event) => updateImportedField(field, event.target.value)} className={inputClass} />
                      ) : (
                        <input value={typeof value === "string" ? value : ""} onChange={(event) => updateImportedField(field, event.target.value)} className={inputClass} />
                      )}
                      <span className="mt-1 block text-xs font-normal text-slate-400">
                        Source: {importPreview.sourceLocations[field] || "Not present in source"}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
              <div className="mt-4 max-h-80 overflow-auto rounded-xl border border-slate-700">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-slate-800 text-slate-300">
                    <tr><th className="px-3 py-2">Field</th><th className="px-3 py-2">Extracted value</th><th className="px-3 py-2">Source</th><th className="px-3 py-2">State</th></tr>
                  </thead>
                  <tbody>
                    {Object.entries(importPreview.mappedFields).map(([field, value]) => (
                      <tr key={field} className="border-t border-slate-800 align-top">
                        <td className="px-3 py-2 font-mono text-green-400">{field}</td>
                        <td className="max-w-md whitespace-pre-wrap break-words px-3 py-2">{Array.isArray(value) ? value.length ? JSON.stringify(value) : <span className="text-slate-500">EMPTY</span> : value || <span className="text-slate-500">EMPTY</span>}</td>
                        <td className="px-3 py-2 text-slate-300">{importPreview.sourceLocations[field] || "Not present in source"}</td>
                        <td className={`px-3 py-2 text-xs font-black ${importPreview.fieldStates[field] === "POPULATED" ? "text-green-400" : importPreview.fieldStates[field] === "MANUALLY_ADDED" ? "text-cyan-300" : importPreview.fieldStates[field] === "MANUALLY_EDITED" ? "text-blue-300" : importPreview.fieldStates[field] === "POTENTIALLY_AMBIGUOUS" ? "text-yellow-300" : "text-slate-500"}`}>
                          {importPreview.fieldStates[field] || "EMPTY"}{importPreview.fieldStates[field] === "POTENTIALLY_AMBIGUOUS" ? " — Needs manual verification" : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              ))}

              {importPreview.warnings.length > 0 && (
                <div className="mt-4 rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-yellow-200">
                  <p className="font-black">Needs manual verification</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">{importPreview.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
                </div>
              )}

              {!partialProposals && importStage === "FINAL_REVIEW" && importPreview.existingIPO && (
                <label className="mt-4 flex items-start gap-3 text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={clearImportedEmptyFields}
                    onChange={(event) => setClearImportedEmptyFields(event.target.checked)}
                    className="mt-1 size-4 accent-red-500"
                  />
                  Clear existing fields when the imported value is empty (off by default)
                </label>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                {importStage === "PREVIEW" && (
                  <button type="button" onClick={beginImportEditing} className="rounded-xl bg-yellow-400 px-5 py-3 font-black text-slate-950">
                    Edit / Correct Data
                  </button>
                )}
                {importStage === "EDIT" && (
                  <button type="button" onClick={finalizeImportReview} className="rounded-xl bg-blue-500 px-5 py-3 font-black text-white">
                    Continue to Final Review
                  </button>
                )}
                {importStage === "FINAL_REVIEW" && (
                  <>
                    <button
                      type="button"
                      disabled={importSaving || !adminKey || (!partialProposals && (typeof importPreview.mappedFields.name !== "string" || !importPreview.mappedFields.name.trim()))}
                      onClick={saveImportedIPO}
                      className="rounded-xl bg-green-500 px-5 py-3 font-black text-slate-950 disabled:opacity-50"
                    >
                      {importSaving ? "Saving..." : "IMPORT & SAVE"}
                    </button>
                    <button type="button" onClick={beginImportEditing} className="rounded-xl border border-blue-400 px-5 py-3 font-black text-blue-300">
                      Back to Edit
                    </button>
                  </>
                )}
                <button type="button" onClick={resetImport} className="rounded-xl border border-slate-600 px-5 py-3 font-black">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-5 rounded-3xl border border-slate-700 bg-slate-900 p-6 max-sm:mt-6 max-sm:rounded-2xl max-sm:p-4 md:grid-cols-2"
        >
          {editingName && (
            <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 font-bold text-yellow-300 md:col-span-2">
              Edit Mode: {editingName}
            </div>
          )}

          {adminSection("Basic IPO Information")}
          {adminField("name", "IPO Name")}
          {adminSelect("type", "IPO Type", IPO_TYPE_VALUES)}
          {adminSelect("status", "Status", ["", "OPEN", "UPCOMING", "CLOSED", "LISTED"])}
          {adminSelect("sentiment", "Market Sentiment", ["", "POSITIVE", "NEUTRAL", "NEGATIVE", "BULLISH", "BEARISH"])}
          {adminField("priceBand", "Price Band")}
          {adminField("openDate", "Open Date", "date")}
          {adminField("closeDate", "Close Date", "date")}
          {adminField("allotmentDate", "Allotment Date", "date")}
          {adminField("refundDate", "Refund Date", "date")}
          {adminField("dematCreditDate", "Demat Credit Date", "date")}
          {adminField("listingDate", "Listing Date", "date")}
          {adminField("issueSize", "Issue Size")}
          {adminField("lotSize", "Lot Size")}
          {adminField("minimumInvestment", "Minimum Investment")}
          {adminField("faceValue", "Face Value")}
          {adminField("listingExchange", "Exchange")}
          {adminField("registrar", "Registrar")}
          {adminField("allotmentLink", "Allotment Link", "url")}
          {adminField("growwIPOUrl", "Groww IPO Link", "url")}

          {adminSection("Subscription")}
          {adminField("qibSubscription", "QIB Subscription")}
          {adminField("niiSubscription", "NII / HNI Subscription")}
          {adminField("retailSubscription", "Retail Subscription")}
          {adminField("employeeSubscription", "Employee Subscription")}
          {adminField("subscription", "Total Subscription")}

          {adminSection("DRHP & RHP Documents")}
          {adminField("drhpLink", "DRHP Link", "url")}
          {adminField("rhpLink", "RHP Link", "url")}

          {adminSection("IPO Signal / Risk Data")}
          {adminField("revenueGrowth", "Revenue Growth")}
          {adminField("patGrowth", "PAT Growth")}
          {adminSelect("debtRisk", "Debt Risk", ["", "LOW", "MEDIUM", "HIGH"])}
          {adminSelect("valuation", "Valuation", ["", "ATTRACTIVE", "FAIR", "EXPENSIVE"])}
          {adminSelect("businessRisk", "Business Risk", ["", "LOW", "MEDIUM", "HIGH"])}

          {adminSection("GMP HISTORY TRACKER")}
          {adminField("lastUpdated", "Last Updated")}
          <label className="font-bold">
            GMP Date
            <input type="date" value={gmpDate} onChange={(event) => setGmpDate(event.target.value)} className={inputClass} />
          </label>
          <label className="font-bold">
            GMP Value
            <input value={gmpValue} onChange={(event) => setGmpValue(event.target.value)} className={inputClass} />
          </label>
          <button type="button" onClick={addGMPHistory} className="rounded-xl bg-blue-500 px-6 py-3 font-black text-white md:col-span-2">
            Add GMP History Point
          </button>
          {form.gmpHistory.length > 0 && (
            <div className="grid gap-3 md:col-span-2">
              {form.gmpHistory.map((item, index) => (
                <div key={`${item.date}-${index}`} className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
                  <div><span className="font-black text-green-400">{item.value}</span><span className="ml-4 text-slate-400">{item.date}</span></div>
                  <button type="button" onClick={() => removeGMPHistory(index)} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-black">Remove</button>
                </div>
              ))}
            </div>
          )}

          {adminSection("IPO Details")}
          {adminField("issueType", "Issue Type")}
          {adminField("freshIssue", "Fresh Issue")}
          {adminField("offerForSale", "Offer For Sale (OFS)")}
          {adminField("leadManagers", "Lead Manager")}
          {adminField("marketMaker", "Market Maker")}

          <label className="font-bold">
            Listing Price
            <input
              value={form.listingPrice}
              onChange={(event) =>
                updateField("listingPrice", event.target.value)
              }
              inputMode="decimal"
              placeholder="₹150"
              className={inputClass}
            />
          </label>

          {adminSection("Financial Performance")}
          {adminField("revenueFY2024", "Revenue FY2024")}
          {adminField("revenueFY2025", "Revenue FY2025")}
          {adminField("revenueFY2026", "Revenue FY2026")}
          {adminField("profitFY2024", "PAT FY2024")}
          {adminField("profitFY2025", "PAT FY2025")}
          {adminField("profitFY2026", "PAT FY2026")}
          {adminField("totalAssetsFY2024", "Total Assets FY2024")}
          {adminField("totalAssetsFY2025", "Total Assets FY2025")}
          {adminField("totalAssetsFY2026", "Total Assets FY2026")}

          {adminSection("IPO Market Lot")}
          {adminField("retailMinLot", "Retail Min Lot")}
          {adminField("retailMinShares", "Retail Min Shares")}
          {adminField("retailMinAmount", "Retail Min Amount")}
          {adminField("retailMaxLot", "Retail Max Lot")}
          {adminField("retailMaxShares", "Retail Max Shares")}
          {adminField("retailMaxAmount", "Retail Max Amount")}
          {adminField("sHniLot", "sHNI Lot")}
          {adminField("sHniShares", "sHNI Shares")}
          {adminField("sHniAmount", "sHNI Amount")}
          {adminField("bHniLot", "bHNI Lot")}
          {adminField("bHniShares", "bHNI Shares")}
          {adminField("bHniAmount", "bHNI Amount")}

          {adminSection("IPO Reservation")}
          {adminField("qibReservation", "QIB Reservation")}
          {adminField("niiReservation", "NII Reservation")}
          {adminField("retailReservation", "Retail Reservation")}
          {adminField("employeeReservation", "Employee Reservation")}
          {adminField("shareholderReservation", "Shareholder Reservation")}

          {adminSection("Promoter Holding & Anchor Investors")}
          {adminField("prePromoterHolding", "Pre IPO Promoter Holding")}
          {adminField("postPromoterHolding", "Post IPO Promoter Holding")}
          {adminField("anchorAllocation", "Anchor Allocation")}
          {adminTextarea("anchorDetails", "Anchor Details", 5)}

          {adminSection("IPO Fundamentals")}
          {adminField("marketCapPostIPO", "Market Cap (Post IPO)")}
          {adminField("roe", "ROE")}
          {adminField("roce", "ROCE")}
          {adminField("debtToEquity", "Debt / Equity")}
          {adminField("ronw", "RONW")}
          {adminField("patMargin", "PAT Margin")}
          {adminField("ebitdaMargin", "EBITDA Margin")}
          {adminField("pbRatio", "Price to Book Value")}
          {adminField("eps", "EPS")}
          {adminField("peRatio", "P/E Ratio")}
          {adminField("industryPE", "Industry P/E")}

          {adminSection("Peer Comparison")}
          {([1, 2, 3] as const).map((peer) => {
            const prefix = `peer${peer}` as const;
            return (
              <div key={peer} className="grid gap-5 rounded-2xl border border-slate-700 bg-slate-950 p-4 md:col-span-2 md:grid-cols-2">
                <h3 className="text-xl font-black text-green-400 md:col-span-2">PEER {peer}</h3>
                {adminField(`${prefix}Name` as keyof IPOForm, "Peer Name")}
                {adminField(`${prefix}Revenue` as keyof IPOForm, "Revenue")}
                {adminField(`${prefix}PAT` as keyof IPOForm, "PAT")}
                {adminField(`${prefix}EPS` as keyof IPOForm, "EPS")}
                {adminField(`${prefix}PE` as keyof IPOForm, "P/E")}
                {adminField(`${prefix}ROE` as keyof IPOForm, "ROE")}
                {adminField(`${prefix}RONW` as keyof IPOForm, "RONW")}
                {adminField(`${prefix}DebtEquity` as keyof IPOForm, "Debt / Equity")}
              </div>
            );
          })}

          {adminSection("Company Address")}
          {adminTextarea("companyAddress", "Company Address", 3)}

          {adminSection("Company Overview")}
          {adminTextarea("companyOverview", "Company Overview", 6)}
          {adminTextarea("businessModel", "Business", 5)}
          {adminTextarea("objectsOfIssue", "Objects of the Issue", 5)}
          {adminTextarea("strengths", "Strengths", 5)}
          {adminTextarea("risks", "Risks", 5)}

          <div style={{ display: "none" }} aria-hidden="true" className="contents">

          <label className="font-bold">
            IPO Name
            <input
              required
              value={form.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            IPO Type
            <select
              value={form.type}
              onChange={(event) =>
                updateField("type", event.target.value)
              }
              className={inputClass}
            >
              <option value="MAINBOARD">Mainboard IPO</option>
              <option value="SME">SME IPO</option>
              <option value="NSE SME">NSE SME</option>
              <option value="BSE SME">BSE SME</option>
            </select>
          </label>

          <label className="font-bold">
            Status
            <select
              value={form.status}
              onChange={(event) =>
                updateField("status", event.target.value)
              }
              className={inputClass}
            >
              <option value="OPEN">OPEN</option>
              <option value="UPCOMING">UPCOMING</option>
              <option value="CLOSED">CLOSED</option>
              <option value="LISTED">LISTED</option>
            </select>
          </label>

          <label className="font-bold">
            Market Sentiment
            <select
              value={form.sentiment}
              onChange={(event) =>
                updateField("sentiment", event.target.value)
              }
              className={inputClass}
            >
              <option value="POSITIVE">POSITIVE</option>
              <option value="NEUTRAL">NEUTRAL</option>
              <option value="NEGATIVE">NEGATIVE</option>
            </select>
          </label>

          <label className="font-bold">
            Price Band
            <input
              required
              value={form.priceBand}
              onChange={(event) =>
                updateField(
                  "priceBand",
                  event.target.value
                )
              }
              placeholder="₹100 - ₹130"
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Current GMP
            <input
              value={form.gmp}
              onChange={(event) =>
                updateField("gmp", event.target.value)
              }
              placeholder="Auto synced from latest GMP history"
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Estimated Listing Gain
            <input
              value={form.listingGain}
              readOnly
              placeholder="Calculated automatically"
              className={`${inputClass} opacity-70`}
            />
          </label>

          <label className="font-bold">
            Total Subscription
            <input
              value={form.subscription}
              onChange={(event) =>
                updateField(
                  "subscription",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            QIB Subscription
            <input
              value={form.qibSubscription}
              onChange={(event) =>
                updateField(
                  "qibSubscription",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            NII / HNI Subscription
            <input
              value={form.niiSubscription}
              onChange={(event) =>
                updateField(
                  "niiSubscription",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Retail Subscription
            <input
              value={form.retailSubscription}
              onChange={(event) =>
                updateField(
                  "retailSubscription",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Employee Subscription
            <input
              value={form.employeeSubscription}
              onChange={(event) =>
                updateField(
                  "employeeSubscription",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Close Date
            <input
              value={form.closeDate}
              onChange={(event) =>
                updateField(
                  "closeDate",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          

          <label className="font-bold">
            Issue Size
            <input
              value={form.issueSize}
              onChange={(event) =>
                updateField(
                  "issueSize",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Lot Size
            <input
              value={form.lotSize}
              onChange={(event) =>
                updateField(
                  "lotSize",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Minimum Investment
            <input
              value={form.minimumInvestment}
              onChange={(event) =>
                updateField(
                  "minimumInvestment",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Open Date
            <input
              value={form.openDate}
              onChange={(event) =>
                updateField(
                  "openDate",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Allotment Date
            <input
              value={form.allotmentDate}
              onChange={(event) =>
                updateField(
                  "allotmentDate",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Listing Date
            <input
              value={form.listingDate}
              onChange={(event) =>
                updateField(
                  "listingDate",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Exchange
            <input
              value={form.listingExchange}

onChange={(event) =>
  updateField(
    "listingExchange",
    event.target.value
  )
}
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            Registrar
            <input
              value={form.registrar}
              onChange={(event) =>
                updateField(
                  "registrar",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold md:col-span-2">
            Allotment Link
            <input
              type="url"
              value={form.allotmentLink}
              onChange={(event) =>
                updateField("allotmentLink", event.target.value)
              }
              className={inputClass}
              placeholder="https://registrar.example.com/ipo-status"
            />
          </label>

          <label className="font-bold md:col-span-2">
            Groww IPO Link
            <input
              type="url"
              value={form.growwIPOUrl}
              onChange={(event) =>
                updateField("growwIPOUrl", event.target.value)
              }
              className={inputClass}
              placeholder="https://groww.in/ipo/ardee-industries-ipo"
            />
          </label>

          <label className="font-bold">
  Listing Exchange
  <input
    value={form.listingExchange}
    onChange={(e) => updateField("listingExchange", e.target.value)}
    className={inputClass}
    placeholder="NSE / BSE"
  />
</label>
          <label className="font-bold">
  Face Value
  <input
    value={form.faceValue}
    onChange={(event) =>
      updateField("faceValue", event.target.value)
    }
    placeholder="₹10 per share"
    className={inputClass}
  />
</label>
          <div className="mt-4 border-t border-slate-700 pt-6 md:col-span-2">
            <h2 className="text-2xl font-black text-green-400">
              GMP History Tracker
            </h2>

            <p className="mt-2 text-slate-400">
              Latest GMP history value automatically becomes
              current GMP.
            </p>
          </div>
<div className="mt-6 grid gap-4 md:grid-cols-2">
  <label className="font-bold">
    GMP Source
    <input
      value="GREY MARKET"
      readOnly
      className={inputClass}
    />
  </label>

  <label className="font-bold">
    Subscription Exchange
    <select
      value={form.subscriptionSource}
      onChange={(event) =>
        updateField("subscriptionSource", event.target.value)
      }
      className={inputClass}
    >
      <option value="NSE">NSE</option>
      <option value="BSE">BSE</option>
    </select>
  </label>

  <label className="font-bold">
    Official Documents
    <select
      value={form.officialSource}
      onChange={(event) =>
        updateField("officialSource", event.target.value)
      }
      className={inputClass}
    >
      <option value="DRHP">DRHP</option>
      <option value="RHP">RHP</option>
      <option value="NSE">NSE</option>
      <option value="BSE">BSE</option>
      <option value="SEBI">SEBI</option>
    </select>
  </label>

  <label className="font-bold">
    Last Updated
    <input
      value={form.lastUpdated}
      onChange={(event) =>
        setForm({ ...form, lastUpdated: event.target.value })
      }
      className={inputClass}
      placeholder="Example: 15 Jul 2026, 12:30 AM"
    />
  </label>
</div>
          <label className="font-bold">
            GMP Date
            <input
              type="date"
              value={gmpDate}
              onChange={(event) =>
                setGmpDate(event.target.value)
              }
              className={inputClass}
            />
          </label>

          <label className="font-bold">
            GMP Value
            <input
              value={gmpValue}
              onChange={(event) =>
                setGmpValue(event.target.value)
              }
              placeholder="₹80"
              className={inputClass}
            />
          </label>

          <button
            type="button"
            onClick={addGMPHistory}
            className="rounded-xl bg-blue-500 px-6 py-3 font-black text-white md:col-span-2"
          >
            Add GMP History Point
          </button>

          {form.gmpHistory.length > 0 && (
            <div className="grid gap-3 md:col-span-2">
              {form.gmpHistory.map((item, index) => (
                <div
                  key={`${item.date}-${index}`}
                  className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
                >
                  <div>
                    <span className="font-black text-green-400">
                      {item.value}
                    </span>

                    <span className="ml-4 text-slate-400">
                      {item.date}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeGMPHistory(index)
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 font-bold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
  <h2 className="text-2xl font-black text-green-400">
    IPO Details
  </h2>

  <p className="mt-2 text-slate-400">
    Enter complete IPO issue information.
  </p>
</div>
          <label className="font-bold">
  Issue Type
  <input
    value={form.issueType}
    onChange={(e) => updateField("issueType", e.target.value)}
    className={inputClass}
    placeholder="Book Built / Fixed Price"
  />
</label>

<label className="font-bold">
  Fresh Issue
  <input
    value={form.freshIssue}
    onChange={(e) => updateField("freshIssue", e.target.value)}
    className={inputClass}
    placeholder="₹500 Cr"
  />
</label>

<label className="font-bold">
  Offer For Sale (OFS)
  <input
    value={form.offerForSale}
    onChange={(e) => updateField("offerForSale", e.target.value)}
    className={inputClass}
    placeholder="₹200 Cr"
  />
</label>

<label className="font-bold">
  Listing At
  <input
    value={form.listingAt}
    onChange={(e) => updateField("listingAt", e.target.value)}
    className={inputClass}
    placeholder="NSE, BSE"
  />
</label>

<label className="font-bold">
  Lead Managers
  <input
    value={form.leadManagers}
    onChange={(e) => updateField("leadManagers", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Market Maker
  <input
    value={form.marketMaker}
    onChange={(e) => updateField("marketMaker", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Refund Date
  <input
    value={form.refundDate}
    onChange={(e) => updateField("refundDate", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Demat Credit Date
  <input
    value={form.dematCreditDate}
    onChange={(e) => updateField("dematCreditDate", e.target.value)}
    className={inputClass}
  />
</label>
          <label className="font-bold md:col-span-2">
            Financial Performance
            <div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
  <h2 className="text-2xl font-black text-green-400">
    Financial Performance
  </h2>
</div>

<label className="font-bold">
  Revenue FY2024
  <input
    value={form.revenueFY2024}
    onChange={(e) => updateField("revenueFY2024", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Revenue FY2025
  <input
    value={form.revenueFY2025}
    onChange={(e) => updateField("revenueFY2025", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Revenue FY2026
  <input
    value={form.revenueFY2026}
    onChange={(e) => updateField("revenueFY2026", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  PAT FY2024
  <input
    value={form.profitFY2024}
    onChange={(e) => updateField("profitFY2024", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  PAT FY2025
  <input
    value={form.profitFY2025}
    onChange={(e) => updateField("profitFY2025", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  PAT FY2026
  <input
    value={form.profitFY2026}
    onChange={(e) => updateField("profitFY2026", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Total Assets FY2024
  <input
    value={form.totalAssetsFY2024}
    onChange={(e) => updateField("totalAssetsFY2024", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Total Assets FY2025
  <input
    value={form.totalAssetsFY2025}
    onChange={(e) => updateField("totalAssetsFY2025", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Total Assets FY2026
  <input
    value={form.totalAssetsFY2026}
    onChange={(e) => updateField("totalAssetsFY2026", e.target.value)}
    className={inputClass}
  />
</label>
       
             <div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
  <h2 className="text-2xl font-black text-green-400">
    IPO Market Lot
  </h2>
</div>

<label className="font-bold">
  Retail Min Lot
  <input
    value={form.retailMinLot}
    onChange={(e) => updateField("retailMinLot", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Retail Min Shares
  <input
    value={form.retailMinShares}
    onChange={(e) => updateField("retailMinShares", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Retail Min Amount
  <input
    value={form.retailMinAmount}
    onChange={(e) => updateField("retailMinAmount", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Retail Max Lot
  <input
    value={form.retailMaxLot}
    onChange={(e) => updateField("retailMaxLot", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Retail Max Shares
  <input
    value={form.retailMaxShares}
    onChange={(e) => updateField("retailMaxShares", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Retail Max Amount
  <input
    value={form.retailMaxAmount}
    onChange={(e) => updateField("retailMaxAmount", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  sHNI Lot
  <input
    value={form.sHniLot}
    onChange={(e) => updateField("sHniLot", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  sHNI Shares
  <input
    value={form.sHniShares}
    onChange={(e) => updateField("sHniShares", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  sHNI Amount
  <input
    value={form.sHniAmount}
    onChange={(e) => updateField("sHniAmount", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  bHNI Lot
  <input
    value={form.bHniLot}
    onChange={(e) => updateField("bHniLot", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  bHNI Shares
  <input
    value={form.bHniShares}
    onChange={(e) => updateField("bHniShares", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  bHNI Amount
  <input
    value={form.bHniAmount}
    onChange={(e) => updateField("bHniAmount", e.target.value)}
    className={inputClass}
  />
</label>

              <div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
  <h2 className="text-2xl font-black text-green-400">
    IPO Reservation
  </h2>
</div>

<label className="font-bold">
  QIB Reservation
  <input
    value={form.qibReservation}
    onChange={(e) => updateField("qibReservation", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  NII Reservation
  <input
    value={form.niiReservation}
    onChange={(e) => updateField("niiReservation", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Retail Reservation
  <input
    value={form.retailReservation}
    onChange={(e) => updateField("retailReservation", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Employee Reservation
  <input
    value={form.employeeReservation}
    onChange={(e) => updateField("employeeReservation", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Shareholder Reservation
  <input
    value={form.shareholderReservation}
    onChange={(e) => updateField("shareholderReservation", e.target.value)}
    className={inputClass}
  />
</label>

             <div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
  <h2 className="text-2xl font-black text-green-400">
    Promoter Holding & Anchor Investors
  </h2>
</div>

<label className="font-bold">
  Pre IPO Promoter Holding
  <input
    value={form.prePromoterHolding}
    onChange={(e) => updateField("prePromoterHolding", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Post IPO Promoter Holding
  <input
    value={form.postPromoterHolding}
    onChange={(e) => updateField("postPromoterHolding", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Anchor Allocation
  <input
    value={form.anchorAllocation}
    onChange={(e) => updateField("anchorAllocation", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold md:col-span-2">
  Anchor Details
  <textarea
    rows={4}
    value={form.anchorDetails}
    onChange={(e) => updateField("anchorDetails", e.target.value)}
    className={inputClass}
  />
</label>

             <div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
  <h2 className="text-2xl font-black text-green-400">
    IPO Fundamentals
  </h2>
</div>

<label className="font-bold">
  Market Cap (Post IPO)
  <input
    value={form.marketCapPostIPO}
    onChange={(e) => updateField("marketCapPostIPO", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Book Value
  <input
    value={form.bookValue}
    onChange={(e) => updateField("bookValue", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  EPS
  <input
    value={form.eps}
    onChange={(e) => updateField("eps", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Diluted EPS
  <input
    value={form.dilutedEPS}
    onChange={(e) => updateField("dilutedEPS", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  P/E Ratio
  <input
    value={form.peRatio}
    onChange={(e) => updateField("peRatio", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Industry P/E
  <input
    value={form.industryPE}
    onChange={(e) => updateField("industryPE", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  P/B Ratio
  <input
    value={form.pbRatio}
    onChange={(e) => updateField("pbRatio", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Debt / Equity
  <input
    value={form.debtToEquity}
    onChange={(e) => updateField("debtToEquity", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  IPO Valuation
  <input
    value={form.ipoValuation}
    onChange={(e) => updateField("ipoValuation", e.target.value)}
    className={inputClass}
  />
</label>

<div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
  <h2 className="text-2xl font-black text-green-400">
    Peer Comparison
  </h2>
</div>
 
             <label className="font-bold">
  IPO Revenue
  <input
    value={form.peerRevenue}
    onChange={(e) => updateField("peerRevenue", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  IPO PAT
  <input
    value={form.peerPAT}
    onChange={(e) => updateField("peerPAT", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  IPO EPS
  <input
    value={form.peerEPS}
    onChange={(e) => updateField("peerEPS", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  IPO P/E
  <input
    value={form.peerPE}
    onChange={(e) => updateField("peerPE", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  IPO Total Assets
  <input
    value={form.peerTotalAssets}
    onChange={(e) => updateField("peerTotalAssets", e.target.value)}
    className={inputClass}
  />
</label>

             <label className="font-bold">
  Peer 1 Name
  <input
    value={form.peer1Name}
    onChange={(e) => updateField("peer1Name", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 1 Revenue
  <input
    value={form.peer1Revenue}
    onChange={(e) => updateField("peer1Revenue", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 1 PAT
  <input
    value={form.peer1PAT}
    onChange={(e) => updateField("peer1PAT", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 1 P/E
  <input
    value={form.peer1PE}
    onChange={(e) => updateField("peer1PE", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 1 Total Assets
  <input
    value={form.peer1TotalAssets}
    onChange={(e) => updateField("peer1TotalAssets", e.target.value)}
    className={inputClass}
  />
</label>
             <label className="font-bold">
  Peer 2 Name
  <input
    value={form.peer2Name}
    onChange={(e) => updateField("peer2Name", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 2 Revenue
  <input
    value={form.peer2Revenue}
    onChange={(e) => updateField("peer2Revenue", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 2 PAT
  <input
    value={form.peer2PAT}
    onChange={(e) => updateField("peer2PAT", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 2 EPS
  <input
    value={form.peer2EPS}
    onChange={(e) => updateField("peer2EPS", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 2 P/E
  <input
    value={form.peer2PE}
    onChange={(e) => updateField("peer2PE", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 2 Market Cap
  <input
    value={form.peer2MarketCap}
    onChange={(e) => updateField("peer2MarketCap", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 2 ROE
  <input
    value={form.peer2ROE}
    onChange={(e) => updateField("peer2ROE", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 2 Debt/Equity
  <input
    value={form.peer2DebtEquity}
    onChange={(e) => updateField("peer2DebtEquity", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 2 Total Assets
  <input
    value={form.peer2TotalAssets}
    onChange={(e) => updateField("peer2TotalAssets", e.target.value)}
    className={inputClass}
  />
</label>
              <label className="font-bold">
  Peer 3 Name
  <input
    value={form.peer3Name}
    onChange={(e) => updateField("peer3Name", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 3 Revenue
  <input
    value={form.peer3Revenue}
    onChange={(e) => updateField("peer3Revenue", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 3 PAT
  <input
    value={form.peer3PAT}
    onChange={(e) => updateField("peer3PAT", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 3 EPS
  <input
    value={form.peer3EPS}
    onChange={(e) => updateField("peer3EPS", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 3 P/E
  <input
    value={form.peer3PE}
    onChange={(e) => updateField("peer3PE", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 3 Market Cap
  <input
    value={form.peer3MarketCap}
    onChange={(e) => updateField("peer3MarketCap", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 3 ROE
  <input
    value={form.peer3ROE}
    onChange={(e) => updateField("peer3ROE", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold">
  Peer 3 Debt/Equity
  <input
    value={form.peer3DebtEquity}
    onChange={(e) => updateField("peer3DebtEquity", e.target.value)}
    className={inputClass}
  />
</label>     

<label className="font-bold">
  Peer 3 Total Assets
  <input
    value={form.peer3TotalAssets}
    onChange={(e) => updateField("peer3TotalAssets", e.target.value)}
    className={inputClass}
  />
</label>
              <div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
  <h2 className="text-2xl font-black text-green-400">
    Company Overview
  </h2>
</div>

<label className="font-bold md:col-span-2">
  Company Overview
  <textarea
    rows={6}
    value={form.companyOverview}
    onChange={(e) => updateField("companyOverview", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold md:col-span-2">
  Business Model
  <textarea
    rows={5}
    value={form.businessModel}
    onChange={(e) => updateField("businessModel", e.target.value)}
    className={inputClass}
  />
</label>

<label className="font-bold md:col-span-2">
  Objects of the Issue
  <textarea
    rows={5}
    value={form.objectsOfIssue}
    onChange={(e) => updateField("objectsOfIssue", e.target.value)}
    className={inputClass}
  />
</label>

             <div className="mt-6 border-t border-slate-700 pt-6 md:col-span-2">
  <h2 className="text-2xl font-black text-green-400">
    DRHP & RHP Documents
  </h2>
</div>

<label className="font-bold md:col-span-2">
  DRHP Link
  <input
    type="url"
    value={form.drhpLink}
    onChange={(e) => updateField("drhpLink", e.target.value)}
    className={inputClass}
    placeholder="https://..."
  />
</label>

<label className="font-bold md:col-span-2">
  RHP Link
  <input
    type="url"
    value={form.rhpLink}
    onChange={(e) => updateField("rhpLink", e.target.value)}
    className={inputClass}
    placeholder="https://..."
  />
</label>
              rows={5}
              className={inputClass}
            /
          </label>
<label className="font-bold">
  Revenue Growth
  <input
    value={form.revenueGrowth}
    onChange={(event) =>
      updateField("revenueGrowth", event.target.value)
    }
    className={inputClass}
    placeholder="Example: 35%"
  />
</label>

<label className="font-bold">
  PAT Growth
  <input
    value={form.patGrowth}
    onChange={(event) =>
      updateField("patGrowth", event.target.value)
    }
    className={inputClass}
    placeholder="Example: 42%"
  />
</label>

<label className="font-bold">
  Debt Risk
  <select
    value={form.debtRisk}
    onChange={(event) =>
      updateField("debtRisk", event.target.value)
    }
    className={inputClass}
  >
    <option value="">SELECT DEBT RISK</option>
    <option value="LOW">LOW</option>
    <option value="MEDIUM">MEDIUM</option>
    <option value="HIGH">HIGH</option>
  </select>
</label>

<label className="font-bold">
  Valuation
  <select
    value={form.valuation}
    onChange={(event) =>
      updateField("valuation", event.target.value)
    }
    className={inputClass}
  >
    <option value="">SELECT VALUATION</option>
    <option value="ATTRACTIVE">ATTRACTIVE</option>
    <option value="FAIR">FAIR</option>
    <option value="EXPENSIVE">EXPENSIVE</option>
  </select>
</label>

<label className="font-bold">
  Business Risk
  <select
    value={form.businessRisk}
    onChange={(event) =>
      updateField("businessRisk", event.target.value)
    }
    className={inputClass}
  >
    <option value="">SELECT BUSINESS RISK</option>
    <option value="LOW">LOW</option>
    <option value="MEDIUM">MEDIUM</option>
    <option value="HIGH">HIGH</option>
  </select>
</label>
          <label className="font-bold md:col-span-2">
            GMP Trend
            <textarea
              value={form.gmpTrend}
              onChange={(event) =>
                updateField(
                  "gmpTrend",
                  event.target.value
                )
              }
              rows={4}
              className={inputClass}
            />
          </label>

          <label className="font-bold md:col-span-2">
            Strengths
            <textarea
              value={form.strengths}
              onChange={(event) =>
                updateField(
                  "strengths",
                  event.target.value
                )
              }
              rows={5}
              className={inputClass}
            />
          </label>

          <label className="font-bold md:col-span-2">
            Risks
            <textarea
              value={form.risks}
              onChange={(event) =>
                updateField("risks", event.target.value)
              }
              rows={5}
              className={inputClass}
            />
          </label>

          </div>

          <div className="flex items-end gap-3 max-sm:flex-col md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-green-500 px-6 py-3 font-black text-slate-950 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingName
                  ? "Update IPO"
                  : "Save IPO Data"}
            </button>

            {editingName && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-slate-600 px-6 py-3 font-black max-sm:min-h-12 max-sm:w-full"
              >
                Cancel
              </button>
            )}
          </div>

          {message && (
            <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-bold text-green-400 md:col-span-2">
              {message}
            </div>
          )}
        </form>

        <section className="mt-10">
          <h2 className="text-3xl font-black max-sm:text-2xl">
            Manage IPOs
          </h2>

          <div className="mt-6 grid gap-4">
            {ipos.map((ipo, index) => (
              <div
                key={`${ipo.name}-${index}`}
                className="flex flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-900 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-xl font-black">
                    {ipo.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {ipo.type} • {ipo.status} •{" "}
                    {ipo.priceBand}
                  </p>

                  <p className="mt-2 text-sm font-bold text-green-400">
                    GMP: {ipo.gmp || "Tracking"} • Est.
                    Gain:{" "}
                    {ipo.listingGain || "Tracking"}
                  </p>
                </div>

                <div className="flex gap-3 max-sm:flex-col">
                  <button
                    type="button"
                    onClick={() => editIPO(ipo)}
                    className="rounded-xl bg-yellow-500 px-5 py-3 font-black text-slate-950 max-sm:min-h-12 max-sm:w-full"
                  >
                    Edit IPO
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteIPO(ipo.name)
                    }
                    className="rounded-xl bg-red-600 px-5 py-3 font-black text-white max-sm:min-h-12 max-sm:w-full"
                  >
                    Delete IPO
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
