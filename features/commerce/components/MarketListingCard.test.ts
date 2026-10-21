import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("market listing cards expose the persisted cart action", async () => {
  const source = await readFile(new URL("./MarketListingCard.tsx", import.meta.url), "utf8");

  assert.match(source, /import AddToOrderButton from "\.\/AddToOrderButton"/);
  assert.match(source, /<AddToOrderButton\s+item=\{\{\s*code: listing\.code/);
  assert.match(source, /line-clamp-2/);
  assert.match(source, /break-inside-avoid/);
  assert.match(source, /getListingCategory/);
  assert.match(source, /visualAspect/);
});
