export type IPOExtractionInputType = "TEXT" | "PDF";

export type IPOExtractionSource = {
  page?: number;
  label: string;
  snippet?: string;
};

export type IPOExtractionField = {
  field: string;
  value: string | Array<{ date: string; value: string }>;
  state: "POPULATED" | "POTENTIALLY_AMBIGUOUS";
  source: IPOExtractionSource;
  warning?: string;
};

export type IPOExtractionResult = {
  inputType: IPOExtractionInputType;
  pageCount?: number;
  fields: IPOExtractionField[];
  warnings: string[];
  extractionMethod?: "AI_SEMANTIC" | "DETERMINISTIC_FALLBACK";
  model?: string;
};

type SourcePage = { page?: number; text: string };

const LABELS: Record<string, string[]> = {
  name: ["ipo name", "company name", "issuer name"],
  type: ["ipo type", "issue category"],
  status: ["ipo status", "issue status"],
  sentiment: ["sentiment", "market sentiment"],
  priceBand: ["price band", "issue price band"],
  gmp: ["gmp", "grey market premium"],
  listingGain: ["listing gain", "estimated listing gain"],
  subscription: ["total subscription", "overall subscription", "subscription"],
  qibSubscription: ["qib subscription", "qib subscribed"],
  niiSubscription: ["nii subscription", "hni subscription", "nii / hni subscription"],
  retailSubscription: ["retail subscription", "rii subscription"],
  employeeSubscription: ["employee subscription"],
  shareholderSubscription: ["shareholder subscription"],
  issueSize: ["issue size", "total issue size"],
  lotSize: ["lot size", "market lot"],
  minimumInvestment: ["minimum investment", "minimum application amount"],
  faceValue: ["face value"],
  openDate: ["open date", "issue opens", "opening date"],
  closeDate: ["close date", "issue closes", "closing date"],
  allotmentDate: ["allotment date", "basis of allotment date"],
  listingDate: ["listing date"],
  refundDate: ["refund date", "initiation of refunds"],
  dematCreditDate: ["demat credit date", "credit of shares to demat"],
  listingExchange: ["exchange", "listing exchange", "stock exchange"],
  registrar: ["registrar", "registrar to the issue"],
  drhpLink: ["drhp", "drhp link"],
  rhpLink: ["rhp", "rhp link"],
  issueType: ["issue type"],
  freshIssue: ["fresh issue"],
  offerForSale: ["offer for sale", "ofs"],
  listingAt: ["listing at"],
  listingPrice: ["listing price"],
  leadManagers: ["lead managers", "merchant banker", "book running lead managers"],
  marketMaker: ["market maker"],
  prePromoterHolding: ["pre ipo promoter holding", "promoter holding pre issue"],
  postPromoterHolding: ["post ipo promoter holding", "promoter holding post issue"],
  anchorAllocation: ["anchor allocation"],
  anchorDetails: ["anchor details", "anchor investors"],
  revenueFY2024: ["revenue fy2024", "revenue fy 2024", "revenue 2024"],
  revenueFY2025: ["revenue fy2025", "revenue fy 2025", "revenue 2025"],
  revenueFY2026: ["revenue fy2026", "revenue fy 2026", "revenue 2026"],
  profitFY2024: ["profit fy2024", "pat fy2024", "profit after tax 2024"],
  profitFY2025: ["profit fy2025", "pat fy2025", "profit after tax 2025"],
  profitFY2026: ["profit fy2026", "pat fy2026", "profit after tax 2026"],
  totalAssetsFY2024: ["total assets fy2024", "total assets fy 2024", "total assets 2024"],
  totalAssetsFY2025: ["total assets fy2025", "total assets fy 2025", "total assets 2025"],
  totalAssetsFY2026: ["total assets fy2026", "total assets fy 2026", "total assets 2026"],
  marketCapPostIPO: ["market cap post ipo", "post issue market cap"],
  bookValue: ["book value"],
  eps: ["eps", "earnings per share"],
  dilutedEPS: ["diluted eps"],
  peRatio: ["p/e ratio", "pe ratio"],
  industryPE: ["industry p/e", "industry pe"],
  pbRatio: ["p/b ratio", "pb ratio"],
  roe: ["roe", "return on equity"],
  roce: ["roce", "return on capital employed"],
  ronw: ["ronw", "return on net worth"],
  patMargin: ["pat margin", "profit after tax margin"],
  ebitdaMargin: ["ebitda margin"],
  debtToEquity: ["debt to equity", "debt/equity"],
  ipoValuation: ["ipo valuation"],
  revenueGrowth: ["revenue growth"],
  patGrowth: ["pat growth", "profit growth"],
  debtRisk: ["debt risk"],
  valuation: ["valuation"],
  qibReservation: ["qib reservation"],
  niiReservation: ["nii reservation", "hni reservation"],
  retailReservation: ["retail reservation"],
  employeeReservation: ["employee reservation"],
  shareholderReservation: ["shareholder reservation"],
  financials: ["financials", "financial summary"],
  strengths: ["strengths", "key strengths"],
  risks: ["risks", "risk factors", "key risks"],
  companyOverview: ["company overview", "overview"],
  businessModel: ["business model"],
  objectsOfIssue: ["objects of issue", "objects of the issue", "issue objects"],
  businessRisk: ["business risk"],
  peerRevenue: ["ipo revenue"],
  peerPAT: ["ipo pat"],
  peerEPS: ["ipo eps"],
  peerPE: ["ipo p/e", "ipo pe"],
  peerMarketCap: ["ipo market cap"],
  peerROE: ["ipo roe"],
  peerDebtEquity: ["ipo debt equity"],
  peerTotalAssets: ["ipo total assets"],
  peer1RONW: ["peer 1 ronw"],
  peer2RONW: ["peer 2 ronw"],
  peer3RONW: ["peer 3 ronw"],
  companyAddress: ["company address", "registered office", "registered office address"],
  gmpHistory: ["gmp history"],
};

const AMBIGUOUS_LABELS: Record<string, string> = {
  "risk level": "No single equivalent field exists; choose businessRisk or debtRisk manually.",
  promoters: "The current IPOWEB schema has no promoters field.",
  cin: "The current IPOWEB schema has no CIN field.",
  "drhp date": "The current IPOWEB schema has no DRHP date field.",
  "total assets": "A financial year is required to map total assets safely.",
};

const MULTILINE_FIELDS = new Set([
  "anchorDetails", "financials", "strengths", "risks", "companyAddress", "companyOverview",
  "businessModel", "objectsOfIssue", "gmpHistory",
]);

const labelEntries = Object.entries(LABELS)
  .flatMap(([field, labels]) => labels.map((label) => ({ field, label })))
  .sort((a, b) => b.label.length - a.label.length);

function matchLabel(line: string) {
  const cleanLine = line.trim().replace(/^[•*–—-]\s*/, "");
  const normalized = cleanLine.toLowerCase();
  for (const entry of labelEntries) {
    if (normalized === entry.label) return { ...entry, value: "" };
    if (normalized.startsWith(`${entry.label}:`) || normalized.startsWith(`${entry.label} -`)) {
      return { ...entry, value: cleanLine.slice(entry.label.length).replace(/^\s*[:\-]\s*/, "").trim() };
    }
    if (normalized.startsWith(`${entry.label}\t`)) {
      return { ...entry, value: cleanLine.slice(entry.label.length).trim() };
    }
    if (normalized.startsWith(entry.label)) {
      const remainder = cleanLine.slice(entry.label.length);
      if (/^\s{2,}/.test(remainder)) {
        return { ...entry, value: remainder.trim() };
      }
    }
  }
  return null;
}

function matchAmbiguousLabel(line: string) {
  const normalized = line.trim().replace(/^[•*–—-]\s*/, "").toLowerCase();
  return Object.entries(AMBIGUOUS_LABELS).find(([label]) =>
    normalized === label || normalized.startsWith(`${label}:`) || normalized.startsWith(`${label} -`)
  );
}

export function extractIPOFields(
  pages: SourcePage[],
  inputType: IPOExtractionInputType
): IPOExtractionResult {
  const extracted = new Map<string, IPOExtractionField>();
  const warnings: string[] = [];

  for (const sourcePage of pages) {
    const lines = sourcePage.text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    let active: { field: string; label: string; value: string } | null = null;

    const commit = () => {
      if (!active) return;
      let value: IPOExtractionField["value"] = active.value.trim();
      if (active.field === "gmpHistory" && value) {
        const history = value.split(/\n|;/).map((entry) => {
          const match = entry.trim().match(/^(.+?)\s*(?:=|:|\|)\s*(.+)$/);
          return match ? { date: match[1].trim(), value: match[2].trim() } : null;
        });
        if (history.some((entry) => !entry)) {
          value = "";
        } else {
          value = history.filter((entry): entry is { date: string; value: string } => Boolean(entry));
        }
      }
      if (active.field === "gmp" && typeof value === "string" && value && !/\d/.test(value)) {
        const warning = "GMP did not contain an explicit numeric value; manual verification is required.";
        warnings.push(warning);
        extracted.set(active.field, {
          field: active.field,
          value: "",
          state: "POTENTIALLY_AMBIGUOUS",
          source: { page: sourcePage.page, label: active.label, snippet: active.value.trim() },
          warning,
        });
        active = null;
        return;
      }
      const prior = extracted.get(active.field);
      const source = { page: sourcePage.page, label: active.label, snippet: active.value.trim() };
      if (prior && prior.value && value && JSON.stringify(prior.value) !== JSON.stringify(value)) {
        const warning = `Conflicting or invalid values were found for ${active.field}; manual verification is required.`;
        warnings.push(warning);
        extracted.set(active.field, {
          field: active.field,
          value: "",
          state: "POTENTIALLY_AMBIGUOUS",
          source,
          warning,
        });
      } else if (!prior || (!prior.value && prior.state !== "POTENTIALLY_AMBIGUOUS")) {
        extracted.set(active.field, { field: active.field, value, state: value ? "POPULATED" : "POTENTIALLY_AMBIGUOUS", source, warning: value ? undefined : "Needs manual verification" });
      }
      active = null;
    };

    for (const line of lines) {
      const ambiguous = matchAmbiguousLabel(line);
      if (ambiguous) {
        commit();
        warnings.push(`${ambiguous[0]}: ${ambiguous[1]}`);
        continue;
      }

      const match = matchLabel(line);
      if (match) {
        commit();
        active = match;
        if (match.value && !MULTILINE_FIELDS.has(match.field)) commit();
        continue;
      }

      if (active) {
        active.value = active.value ? `${active.value}\n${line}` : line;
        if (!MULTILINE_FIELDS.has(active.field)) commit();
      }
    }
    commit();
  }

  return {
    inputType,
    pageCount: inputType === "PDF" ? pages.length : undefined,
    fields: [...extracted.values()],
    warnings: [...new Set(warnings)],
  };
}
