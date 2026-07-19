export type IPO = {
  name: string;
  type: string;
  status: string;
  priceBand: string;
  gmp: string;
  listingGain: string;
  subscription: string;
  closeDate: string;
  score: string;
  overview: string;
  financials: string;
  strengths: string;
  risks: string;
  gmpTrend: string;
};

export const ipoData: IPO[] = [
  {
    name: "SBI Funds Management IPO",
    type: "MAINBOARD",
    status: "OPEN",
    priceBand: "₹545 - ₹574",
    gmp: "₹92",
    listingGain: "16.0%",
    subscription: "Tracking Live",
    closeDate: "16 Jul",
    score: "8.8",
    overview:
      "SBI Funds Management is being tracked by IPOweb for business strength, market position and listing opportunity.",
    financials:
      "Revenue, profitability, margins and financial growth are evaluated for IPO analysis.",
    strengths:
      "Strong brand presence, market position and investor interest are key positive factors.",
    risks:
      "Valuation, market sentiment and changing GMP may affect listing performance.",
    gmpTrend:
      "Grey market premium trend is positive and listing sentiment is being tracked.",
  },
  {
    name: "Millworks Technologies IPO",
    type: "SME",
    status: "OPEN",
    priceBand: "₹325 - ₹331",
    gmp: "₹390",
    listingGain: "117.8%",
    subscription: "Tracking Live",
    closeDate: "16 Jul",
    score: "9.3",
    overview:
      "Millworks Technologies is tracked for business growth, SME market opportunity and listing demand.",
    financials:
      "Financial performance, revenue growth and profitability are evaluated for the IPO opportunity score.",
    strengths:
      "Strong GMP momentum and investor interest are important positive indicators.",
    risks:
      "SME IPO liquidity, valuation and GMP volatility may increase listing risk.",
    gmpTrend:
      "GMP momentum is strong and indicates high grey market listing interest.",
  },
  {
    name: "Alpine Texworld IPO",
    type: "MAINBOARD",
    status: "OPEN",
    priceBand: "₹100 - ₹105",
    gmp: "Tracking",
    listingGain: "Tracking",
    subscription: "0.20x",
    closeDate: "16 Jul",
    score: "6.5",
    overview:
      "Alpine Texworld IPO is being monitored for business fundamentals and investor demand.",
    financials:
      "Revenue, profit, margins and financial performance are under IPO analysis.",
    strengths:
      "Business growth potential and fresh capital infusion are key factors being evaluated.",
    risks:
      "Low subscription demand and weak market sentiment may affect listing performance.",
    gmpTrend:
      "Grey market sentiment and GMP movement are currently being tracked.",
  },
];