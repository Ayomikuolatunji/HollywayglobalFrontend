import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's strip-types test runner requires the explicit extension.
import { shouldShowEscrowPaymentAction } from "./escrow.ts";

test("hides the payment action after Hollyway receives the transfer", () => {
  assert.equal(
    shouldShowEscrowPaymentAction({
      status: "payment_received",
      can_accept_funding: false,
      manual_payment: true,
      manual_payment_unavailable: undefined,
    }),
    false,
  );
});

test("keeps the payment action available while proof is still pending", () => {
  assert.equal(
    shouldShowEscrowPaymentAction({
      status: "payment_pending",
      can_accept_funding: false,
      manual_payment: true,
      manual_payment_unavailable: undefined,
    }),
    true,
  );
});
