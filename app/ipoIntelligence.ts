export type GMPHistoryItem = {
  date: string;
  value: string;
};

export type IPOIntelligenceInput = {
  priceBand: string;
  gmp: string;
  subscription: string;
  qibSubscription: string;
  niiSubscription: string;
  retailSubscription: string;
  gmpHistory: GMPHistoryItem[];

  revenueGrowth?: string;
  patGrowth?: string;
  debtRisk?: string;
  valuation?: string;
  businessRisk?: string;
};

function getNumber(value?: string) {
  const number = Number(
    String(value || "").replace(/[^\d.-]/g, "")
  );

  return Number.isFinite(number) ? number : 0;
}

function hasRealValue(value?: string) {
  return String(value || "").trim().length > 0;
}

export function calculateIPOIntelligence(
  form: IPOIntelligenceInput
) {
  const history = Array.isArray(form.gmpHistory)
    ? form.gmpHistory
    : [];

  const latestGMPText =
    history.length > 0
      ? history[history.length - 1].value
      : form.gmp;

  const latestGMP = getNumber(latestGMPText);

  const priceNumbers = form.priceBand.match(
    /\d+(?:\.\d+)?/g
  );

  const upperPrice =
    priceNumbers && priceNumbers.length > 0
      ? Number(priceNumbers[priceNumbers.length - 1])
      : 0;

  const listingGain =
    upperPrice > 0
      ? (latestGMP / upperPrice) * 100
      : 0;

  const total = getNumber(form.subscription);
  const qib = getNumber(form.qibSubscription);
  const nii = getNumber(form.niiSubscription);
  const retail = getNumber(form.retailSubscription);

  const revenueGrowth = getNumber(form.revenueGrowth);
  const patGrowth = getNumber(form.patGrowth);

  const historyValues = history.map((item) =>
    getNumber(item.value)
  );

  const firstGMP =
    historyValues.length > 0
      ? historyValues[0]
      : latestGMP;

  const gmpRising =
    historyValues.length >= 2 &&
    latestGMP > firstGMP;

  const gmpFalling =
    historyValues.length >= 2 &&
    latestGMP < firstGMP;

  let points = 0;

  // GMP TREND — 15 POINTS
  if (listingGain >= 50) points += 12;
  else if (listingGain >= 25) points += 10;
  else if (listingGain >= 10) points += 7;
  else if (listingGain > 0) points += 3;

  if (gmpRising) points += 3;
  if (gmpFalling) points -= 3;
  if (latestGMP < 0) points -= 5;

  // QIB DEMAND — 15 POINTS
  if (qib >= 50) points += 15;
  else if (qib >= 20) points += 12;
  else if (qib >= 5) points += 8;
  else if (qib >= 1) points += 4;

  // NII DEMAND — 8 POINTS
  if (nii >= 50) points += 8;
  else if (nii >= 20) points += 6;
  else if (nii >= 5) points += 4;
  else if (nii >= 1) points += 2;

  // RETAIL DEMAND — 5 POINTS
  if (retail >= 20) points += 5;
  else if (retail >= 10) points += 4;
  else if (retail >= 2) points += 2;

  // TOTAL SUBSCRIPTION — 7 POINTS
  if (total >= 50) points += 7;
  else if (total >= 20) points += 5;
  else if (total >= 5) points += 3;
  else if (total >= 1) points += 1;

  // REVENUE GROWTH — 10 POINTS
  if (revenueGrowth >= 30) points += 10;
  else if (revenueGrowth >= 20) points += 8;
  else if (revenueGrowth >= 10) points += 6;
  else if (revenueGrowth > 0) points += 3;

  // PAT GROWTH — 10 POINTS
  if (patGrowth >= 40) points += 10;
  else if (patGrowth >= 25) points += 8;
  else if (patGrowth >= 10) points += 6;
  else if (patGrowth > 0) points += 3;
  else if (patGrowth < 0) points -= 3;

  // DEBT / FINANCIAL RISK — 8 POINTS
  if (form.debtRisk === "LOW") points += 8;
  else if (form.debtRisk === "MEDIUM") points += 4;

  // VALUATION — 12 POINTS
  if (form.valuation === "ATTRACTIVE") points += 12;
  else if (form.valuation === "FAIR") points += 7;
  else if (form.valuation === "EXPENSIVE") points += 2;

  // BUSINESS / SECTOR / ISSUE RISK — 10 POINTS
  if (form.businessRisk === "LOW") points += 10;
  else if (form.businessRisk === "MEDIUM") points += 5;

  points = Math.max(0, Math.min(100, points));

  const finalScore = Number(
    (points / 10).toFixed(1)
  );

  const availableInputs = [
    hasRealValue(form.priceBand),
    hasRealValue(latestGMPText),
    hasRealValue(form.subscription),
    hasRealValue(form.qibSubscription),
    hasRealValue(form.niiSubscription),
    hasRealValue(form.retailSubscription),
    history.length >= 2,
    hasRealValue(form.revenueGrowth),
    hasRealValue(form.patGrowth),
    hasRealValue(form.debtRisk),
    hasRealValue(form.valuation),
    hasRealValue(form.businessRisk),
  ].filter(Boolean).length;

  let dataConfidence = "LOW";

  if (availableInputs >= 10) {
    dataConfidence = "HIGH";
  } else if (availableInputs >= 7) {
    dataConfidence = "MEDIUM";
  }

  let recommendation = "MIXED DATA SIGNAL";

  if (
    finalScore >= 7.5 &&
    dataConfidence === "HIGH"
  ) {
    recommendation = "STRONG DATA SIGNAL";
  } else if (
    finalScore < 4 &&
    dataConfidence !== "LOW"
  ) {
    recommendation = "WEAK DATA SIGNAL";
  }

  const listingGainView =
    listingGain >= 15 && !gmpFalling
      ? "POSITIVE"
      : listingGain <= 0 || gmpFalling
        ? "NEGATIVE"
        : "NEUTRAL";

  let riskLevel = "MEDIUM";

  if (
    finalScore >= 7.5 &&
    dataConfidence === "HIGH" &&
    !gmpFalling
  ) {
    riskLevel = "LOW";
  } else if (
    finalScore < 4 ||
    gmpFalling ||
    latestGMP < 0
  ) {
    riskLevel = "HIGH";
  }

  const reasons: string[] = [];

  reasons.push(
    `Estimated GMP-based premium is ${listingGain.toFixed(1)}%.`
  );

  reasons.push(
    `IPOweb Data Score is ${finalScore}/10 based on a 100-point evidence model.`
  );

  reasons.push(
    `Data confidence is ${dataConfidence}.`
  );

  if (gmpRising) {
    reasons.push("GMP trend is rising.");
  }

  if (gmpFalling) {
    reasons.push("GMP trend is falling.");
  }

  return {
    gmp: latestGMPText,
    listingGain: `${listingGain.toFixed(1)}%`,
    score: String(finalScore),
    recommendation,
    listingGainView,
    riskLevel,
    dataConfidence,
    verdictReason: reasons.join(" "),
  };
}