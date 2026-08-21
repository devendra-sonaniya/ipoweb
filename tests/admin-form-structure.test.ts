import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { IPO_IMPORT_FIELD_SET } from "../lib/ipoImportFields";

const source = readFileSync(new URL("../app/admin/page.tsx", import.meta.url), "utf8");
const visibleStart = source.indexOf('adminSection("Basic IPO Information")');
const visibleEnd = source.indexOf('<div style={{ display: "none" }}', visibleStart);
const visible = source.slice(visibleStart, visibleEnd);

test("visible Admin sections follow the requested sequence", () => {
  const sections = [
    "Basic IPO Information", "Subscription", "DRHP & RHP Documents", "IPO Signal / Risk Data",
    "GMP HISTORY TRACKER", "IPO Details", "Financial Performance", "IPO Market Lot", "IPO Reservation",
    "Promoter Holding & Anchor Investors", "IPO Fundamentals", "Peer Comparison", "Company Address", "Company Overview",
  ];
  let cursor = -1;
  for (const section of sections) {
    const next = visible.indexOf(`adminSection("${section}")`);
    assert.ok(next > cursor, `${section} must appear in sequence`);
    cursor = next;
  }
});

test("duplicate and unwanted manual controls are absent from the visible form", () => {
  assert.equal((visible.match(/adminField\("listingExchange"/g) ?? []).length, 1);
  for (const field of ["gmp", "listingGain", "listingAt", "listingPrice", "bookValue", "dilutedEPS", "ipoValuation",
    "peerMarketCap", "peerTotalAssets", "peer1MarketCap", "peer1TotalAssets", "peer2MarketCap", "peer2TotalAssets",
    "peer3MarketCap", "peer3TotalAssets"]) {
    assert.equal(visible.includes(`adminField("${field}"`), false, `${field} must not be a visible manual control`);
  }
});

test("new backend-compatible extraction fields are registered", () => {
  for (const field of ["roe", "roce", "ronw", "patMargin", "ebitdaMargin", "companyAddress", "peer1RONW", "peer2RONW", "peer3RONW"]) {
    assert.equal(IPO_IMPORT_FIELD_SET.has(field), true, `${field} must remain importable`);
  }
});

test("peer blocks expose exactly the requested reusable bindings", () => {
  for (const suffix of ["Name", "Revenue", "PAT", "EPS", "PE", "ROE", "RONW", "DebtEquity"]) {
    assert.ok(visible.includes('adminField(`${prefix}' + suffix + '`'), `peer ${suffix} binding missing`);
  }
  assert.equal(visible.includes('adminField(`${prefix}MarketCap`'), false);
  assert.equal(visible.includes('adminField(`${prefix}TotalAssets`'), false);
});

test("current GMP remains derived from the latest GMP history point", () => {
  assert.match(source, /form\.gmpHistory\[\s*form\.gmpHistory\.length - 1\s*\]\.value/);
  assert.match(source, /gmp:\s*latestHistoryGMP/);
  assert.equal(visible.includes('adminField("gmp"'), false);
});
