import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("cart action uses the shared cart icon with an accessible label", async () => {
  const source = await readFile(new URL("./AddToOrderButton.tsx", import.meta.url), "utf8");

  assert.match(source, /import CommerceIcon from "\.\/CommerceIcon"/);
  assert.match(source, /<CommerceIcon name="cart"/);
  assert.match(source, /aria-label=/);
  assert.match(source, /title=/);
});
