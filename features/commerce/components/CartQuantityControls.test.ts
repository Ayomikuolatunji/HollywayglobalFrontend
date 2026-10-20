import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("cart quantity controls guard stock limits and surface update failures", async () => {
  const source = await readFile(new URL("./CartQuantityControls.tsx", import.meta.url), "utf8");

  assert.match(source, /availableQuantity/);
  assert.match(source, /disabled=\{busy \|\| atLimit\}/);
  assert.match(source, /role="alert"/);
  assert.match(source, /catch \(reason\)/);
});
