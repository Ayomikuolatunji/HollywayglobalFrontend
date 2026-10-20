import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("dashboard title mapping names listing creation routes", async () => {
  const source = await readFile(new URL("./DashboardSidebar.tsx", import.meta.url), "utf8");

  assert.match(source, /\["\/dashboard\/listings\/new", "List an item"\]/);
});
