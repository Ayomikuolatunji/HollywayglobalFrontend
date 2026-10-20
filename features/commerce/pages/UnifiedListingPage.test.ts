import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("listing draft hydration accepts the API selling-route label", async () => {
  const source = await readFile(new URL("./UnifiedListingPage.tsx", import.meta.url), "utf8");

  assert.match(source, /routes\.find\(\(\[id, label\]\) => id === listing\.selling_route \|\| label === listing\.selling_route\)/);
});
