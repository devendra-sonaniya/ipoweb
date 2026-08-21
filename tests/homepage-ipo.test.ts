import assert from "node:assert/strict";
import test from "node:test";
import { getCurrentGMP } from "../lib/homepageIPO";

test("homepage GMP uses the latest valid history value", () => {
  assert.equal(
    getCurrentGMP("12", [
      { date: "2026-08-13", value: "18" },
      { date: "2026-08-14", value: " 21 " },
    ]),
    "21"
  );
});

test("homepage GMP skips invalid trailing history entries", () => {
  assert.equal(
    getCurrentGMP("12", [
      { date: "2026-08-13", value: "18" },
      { date: "2026-08-14", value: "" },
      null,
    ]),
    "18"
  );
});

test("homepage GMP falls back to the stored snapshot without valid history", () => {
  assert.equal(getCurrentGMP(" 12 ", []), "12");
  assert.equal(getCurrentGMP(undefined, undefined), "");
});
