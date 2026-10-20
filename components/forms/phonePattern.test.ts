import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("international phone patterns escape the hyphen for HTML's v flag", async () => {
  const [hookSource, fieldSource, escrowSource, serviceSource] = await Promise.all([
    readFile(new URL("./useInternationalPhoneInputs.ts", import.meta.url), "utf8"),
    readFile(new URL("../../features/commerce/components/CommerceField.tsx", import.meta.url), "utf8"),
    readFile(new URL("../../features/escrow/components/EscrowTextField.tsx", import.meta.url), "utf8"),
    readFile(new URL("../../features/services/components/ServiceField.tsx", import.meta.url), "utf8"),
  ]);

  assert.equal(hookSource.includes("[0-9\\\\(\\\\) \\\\x2d]{6,20}"), true);
  assert.equal(fieldSource.includes("[0-9\\\\(\\\\) \\\\x2d]{6,20}"), true);
  assert.equal(escrowSource.includes("[0-9\\\\(\\\\) \\\\x2d]{6,20}"), true);
  assert.equal(serviceSource.includes("[0-9\\\\(\\\\) \\\\x2d]{6,20}"), true);
});
