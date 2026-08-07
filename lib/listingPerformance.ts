export function parseIPOAmount(value?: string) {
  if (!value) return null;

  const normalized = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/g);
  if (!normalized?.length) return null;

  const amount = Number(normalized[normalized.length - 1]);
  return Number.isFinite(amount) ? amount : null;
}

export function calculateListingGain(
  priceBand: string,
  listingPrice?: string
) {
  const issuePrice = parseIPOAmount(priceBand);
  const listedAt = parseIPOAmount(listingPrice);

  if (!issuePrice || listedAt === null) return null;

  return ((listedAt - issuePrice) / issuePrice) * 100;
}
