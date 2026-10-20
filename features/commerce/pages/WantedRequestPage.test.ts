import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("wanted request details provide a continue-editing path for editable records", async () => {
  const source = await readFile(new URL("./WantedRequestDetailsPage.tsx", import.meta.url), "utf8");

  assert.match(source, /requests\/new\?reference=/);
  assert.match(source, /record\.status === "draft" \|\| record\.status === "cancelled"/);
});

test("wanted request form loads an existing request and defaults quantity to one", async () => {
  const source = await readFile(new URL("./WantedRequestPage.tsx", import.meta.url), "utf8");

  assert.match(source, /fetchWantedRequest\(editingReference\)/);
  assert.match(source, /defaultValue=\{value\("quantity", "1"\)\}/);
  assert.match(source, /defaultValue=\{value\("item_name"\)\}/);
  assert.match(source, /saveWantedRequest\([^\n]+, editingReference \|\| undefined\)/);
});
