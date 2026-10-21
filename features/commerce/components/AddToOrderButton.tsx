"use client";

import { useEffect, useState } from "react";
import CommerceIcon from "./CommerceIcon";
import { addOrderCartItem, orderCartUpdatedEvent, readOrderCart, refreshOrderCart, type OrderCartItem } from "../data/orderCart";

export default function AddToOrderButton({ item, disabled = false }: { item: Omit<OrderCartItem, "quantity">; disabled?: boolean }) {
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const sync = () => setAdded(readOrderCart().some((entry) => entry.code === item.code));
    void refreshOrderCart().then(sync).catch(() => sync());
    window.addEventListener(orderCartUpdatedEvent, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(orderCartUpdatedEvent, sync);
      window.removeEventListener("storage", sync);
    };
  }, [item.code]);

  async function addItem() {
    if (disabled) return;
    setBusy(true);
    setError("");
    try {
      await addOrderCartItem(item);
      setAdded(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The item could not be added to your cart.");
    } finally {
      setBusy(false);
    }
  }

  const label = disabled ? "Unavailable" : busy ? "Adding to cart" : added ? "In cart" : "Add to cart";
  return <span className="inline-flex min-w-0 flex-col items-end gap-1"><button className={`inline-flex h-8 w-9 items-center justify-center rounded-md disabled:cursor-not-allowed disabled:opacity-60 ${disabled ? "border border-[#e4e2da] bg-[#f5f4f0] text-[#9498a3]" : added ? "border border-[#bfe5d0] bg-[#f5fcf7] text-[#168046]" : "border border-[#1453bb] bg-white text-[#1453bb] hover:bg-[#edf4ff]"}`} type="button" aria-label={`${label}: ${item.name}`} title={`${label}: ${item.name}`} aria-pressed={added} onClick={() => void addItem()} disabled={busy || disabled}><CommerceIcon name="cart" className="h-4 w-4" /><span className="sr-only">{label}</span></button>{error && <small className="max-w-44 text-right text-[9px] font-semibold leading-3 text-[#a32929]">{error}</small>}</span>;
}
