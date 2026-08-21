export const IPO_IMPORT_FIELD_NAMES = [
  "name", "type", "status", "sentiment", "priceBand", "gmp", "listingGain", "listingPrice",
  "subscription", "qibSubscription", "niiSubscription", "retailSubscription", "employeeSubscription",
  "shareholderSubscription", "closeDate", "issueSize", "lotSize", "minimumInvestment", "openDate",
  "allotmentDate", "listingDate", "drhpLink", "rhpLink", "listingExchange", "registrar", "allotmentLink",
  "growwIPOUrl", "financials", "faceValue", "retailMinLot", "retailMinShares", "retailMinAmount",
  "retailMaxLot", "retailMaxShares", "retailMaxAmount", "sHniLot", "sHniShares", "sHniAmount",
  "bHniLot", "bHniShares", "bHniAmount", "qibReservation", "niiReservation", "retailReservation",
  "employeeReservation", "shareholderReservation", "prePromoterHolding", "postPromoterHolding",
  "anchorAllocation", "anchorDetails", "revenueFY2024", "revenueFY2025", "revenueFY2026",
  "profitFY2024", "profitFY2025", "profitFY2026", "issueType", "freshIssue", "offerForSale",
  "listingAt", "leadManagers", "marketMaker", "employeeDiscount", "retailDiscount", "refundDate",
  "dematCreditDate", "marketCapPostIPO", "bookValue", "eps", "dilutedEPS", "peRatio", "industryPE",
  "pbRatio", "roe", "roce", "ronw", "patMargin", "ebitdaMargin", "debtToEquity", "totalAssetsFY2024", "totalAssetsFY2025", "totalAssetsFY2026",
  "ipoValuation", "gmpTrend", "strengths", "risks", "gmpSource", "subscriptionSource",
  "officialSource", "lastUpdated", "revenueGrowth", "patGrowth", "debtRisk", "valuation",
  "peerRevenue", "peerPAT", "peerEPS", "peerPE", "peerMarketCap", "peerROE", "peerDebtEquity",
  "peerTotalAssets", "peer1Name", "peer1Revenue", "peer1PAT", "peer1EPS", "peer1PE",
  "peer1MarketCap", "peer1ROE", "peer1RONW", "peer1DebtEquity", "peer1TotalAssets", "peer2Name", "peer2Revenue",
  "peer2PAT", "peer2EPS", "peer2PE", "peer2MarketCap", "peer2ROE", "peer2RONW", "peer2DebtEquity",
  "peer2TotalAssets", "peer3Name", "peer3Revenue", "peer3PAT", "peer3EPS", "peer3PE",
  "peer3MarketCap", "peer3ROE", "peer3RONW", "peer3DebtEquity", "peer3TotalAssets", "companyAddress", "companyOverview",
  "businessModel", "objectsOfIssue", "businessRisk", "gmpHistory",
] as const;

export type IPOImportFieldName = (typeof IPO_IMPORT_FIELD_NAMES)[number];

export const IPO_IMPORT_FIELD_SET: ReadonlySet<string> = new Set(IPO_IMPORT_FIELD_NAMES);
