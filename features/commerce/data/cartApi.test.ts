import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("cart API keeps the listing availability for quantity controls", async () => {
  const source = await readFile(new URL("./cartApi.ts", import.meta.url), "utf8");

  assert.match(source, /availableQuantity/);
  assert.match(source, /listing\.quantity/);
  assert.match(source, /availableQuantity:\s*typeof listing\.quantity/);
});
