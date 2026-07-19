export type SourceType = "OFFICIAL" | "UNOFFICIAL" | "NEWS";

export type IPOSource = {
  id: string;
  name: string;
  type: SourceType;
  purpose: string;
};

export const IPO_SOURCES: IPOSource[] = [
  {
    id: "NSE",
    name: "NSE India",
    type: "OFFICIAL",
    purpose:
      "IPO issue details, exchange data and official market information",
  },
  {
    id: "BSE",
    name: "BSE India",
    type: "OFFICIAL",
    purpose:
      "IPO issue details, subscription data and exchange information",
  },
  {
    id: "RHP",
    name: "RHP / DRHP",
    type: "OFFICIAL",
    purpose:
      "Company business, financials, risks and issue disclosures",
  },
  {
    id: "GMP_TRACKER_1",
    name: "GMP Tracker Source 1",
    type: "UNOFFICIAL",
    purpose:
      "Grey market premium observation",
  },
  {
    id: "GMP_TRACKER_2",
    name: "GMP Tracker Source 2",
    type: "UNOFFICIAL",
    purpose:
      "Secondary grey market premium verification",
  },
  {
    id: "FINANCIAL_NEWS",
    name: "Financial News Source",
    type: "NEWS",
    purpose:
      "IPO news, demand context and market developments",
  },
];

export function getSourceById(id: string) {
  return IPO_SOURCES.find((source) => source.id === id);
}