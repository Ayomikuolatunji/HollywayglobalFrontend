import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";

test("required quantity fields default to one when no value is provided", async () => {
  const source = await readFile(new URL("./CommerceField.tsx", import.meta.url), "utf8");

  assert.match(source, /name === "quantity" \? "1"/);
});
