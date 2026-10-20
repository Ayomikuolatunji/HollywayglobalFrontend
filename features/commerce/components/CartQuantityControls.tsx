"use client";

import { useState } from "react";
import { removeOrderCartItem, updateOrderCartQuantity, type OrderCartItem } from "../data/orderCart";

function messageFor(reason: unknown) {
  return reason instanceof Error ? reason.message : "The cart could not be updated. Try again.";
}

export default function CartQuantityControls({ item, compact = false, showRemove = false }: { item: OrderCartItem; compact?: boolean; showRemove?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const atLimit = typeof item.availableQuantity === "number" && item.quantity >= item.availableQuantity;
  const buttonSize = compact ? "h-6 w-6 text-xs" : "h-9 w-9 text-base";

  async function changeQuantity(nextQuantity: number) {
    setBusy(true);
    setError("");
    try {
      if (nextQuantity < 1) await removeOrderCartItem(item.code);
      else await updateOrderCartQuantity(item.code, nextQuantity);
    } catch (reason) {
      setError(messageFor(reason));
    } finally {
      setBusy(false);
    }
  }

  return <div className="flex flex-col items-end gap-1"><div className="flex items-center gap-1"><button className={`grid ${buttonSize} place-items-center rounded border border-[#dfe4ed] text-[#1453bb] hover:bg-[#edf4ff] disabled:cursor-wait disabled:opacity-50`} type="button" aria-label={`Decrease ${item.name} quantity`} disabled={busy} onClick={() => void changeQuantity(item.quantity - 1)}>-</button><b className="min-w-5 text-center text-[10px] text-[#0b1830]">{item.quantity}</b><button className={`grid ${buttonSize} place-items-center rounded border border-[#dfe4ed] text-[#1453bb] hover:bg-[#edf4ff] disabled:cursor-not-allowed disabled:opacity-40`} type="button" aria-label={`Increase ${item.name} quantity`} title={atLimit ? `Only ${item.availableQuantity} unit${item.availableQuantity === 1 ? "" : "s"} available` : undefined} disabled={busy || atLimit} onClick={() => void changeQuantity(item.quantity + 1)}>+</button></div>{showRemove && <button className="text-[10px] font-extrabold text-[#a32929] hover:underline disabled:cursor-wait disabled:opacity-50" type="button" disabled={busy} onClick={() => void changeQuantity(0)}>Remove</button>}{atLimit && typeof item.availableQuantity === "number" && <small className="text-[9px] text-[#687895]">{item.availableQuantity === 0 ? "No units currently available" : `Only ${item.availableQuantity} available`}</small>}{error && <small className="max-w-52 text-right text-[9px] font-semibold leading-3 text-[#a32929]" role="alert">{error}</small>}</div>;
}
