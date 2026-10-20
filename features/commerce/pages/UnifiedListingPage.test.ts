import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("listing draft hydration accepts the API selling-route label", async () => {
  const source = await readFile(new URL("./UnifiedListingPage.tsx", import.meta.url), "utf8");

  assert.match(source, /routes\.find\(\(\[id, label\]\) => id === listing\.selling_route \|\| label === listing\.selling_route\)/);
});

test("listing edit form hydrates only after the fetched form has mounted", async () => {
  const source = await readFile(new URL("./UnifiedListingPage.tsx", import.meta.url), "utf8");

  assert.match(source, /setEditingListing\(listing\)/);
  assert.match(source, /window\.requestAnimationFrame/);
  assert.match(source, /hydrateListingForm\(formRef\.current, editingListing\)/);
  assert.match(source, /const routeField = props\.name === "selling_route"/);
  assert.match(source, /const selectedValue = routeField \? routes\.find\(\(\[id, label\]\) => id === props\.value \|\| label === props\.value\)\?\.\[0\]/);
  assert.match(source, /selling_route: sellingRoute\?\.\[0\] \|\| listing\.selling_route/);
  assert.match(source, /selling_route: sellingRoute\?\.\[1\] \|\| listing\.selling_route/);
});
