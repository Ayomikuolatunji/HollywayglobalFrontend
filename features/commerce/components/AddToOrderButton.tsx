"use client";

import { useEffect, useState } from "react";
import { addOrderCartItem, orderCartUpdatedEvent, readOrderCart, refreshOrderCart, type OrderCartItem } from "../data/orderCart";

export default function AddToOrderButton({ item }: { item: Omit<OrderCartItem, "quantity"> }) {
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

  return <span className="inline-flex min-w-0 flex-col items-stretch gap-1"><button className={`inline-flex h-8 items-center justify-center rounded-md px-2.5 text-[9px] font-extrabold disabled:cursor-wait disabled:opacity-60 ${added ? "border border-[#bfe5d0] bg-[#f5fcf7] text-[#168046]" : "border border-[#1453bb] bg-white text-[#1453bb] hover:bg-[#edf4ff]"}`} type="button" onClick={() => void addItem()} disabled={busy}>{busy ? "Adding…" : added ? "Added to cart" : "Add to cart"}</button>{error && <small className="max-w-44 text-[9px] font-semibold leading-3 text-[#a32929]">{error}</small>}</span>;
}
