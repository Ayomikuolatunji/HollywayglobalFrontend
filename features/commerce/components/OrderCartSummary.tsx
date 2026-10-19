"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getOrderCartItemCount, orderCartUpdatedEvent, readOrderCart, refreshOrderCart, removeOrderCartItem, updateOrderCartQuantity, type OrderCartItem } from "../data/orderCart";

export default function OrderCartSummary() {
  const [items, setItems] = useState<OrderCartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readOrderCart());
    sync();
    void refreshOrderCart().then(setItems).catch(() => null);
    window.addEventListener(orderCartUpdatedEvent, sync);
    return () => window.removeEventListener(orderCartUpdatedEvent, sync);
  }, []);

  const itemCount = useMemo(() => getOrderCartItemCount(items), [items]);
  if (!items.length) return null;

  return <section className="rounded-xl border border-[#cfe0f7] bg-[#f4f8ff] p-4" aria-label="Cart summary"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><span className="text-[10px] font-extrabold tracking-[.16em] text-[#1453bb]">CART</span><h3 className="mt-1 font-[Manrope] text-base font-extrabold text-[#0b1830]">{itemCount} item{itemCount === 1 ? "" : "s"} in your cart</h3><p className="mt-1 text-xs text-[#53627a]">Add more items before sending one order request to Hollyway Admin.</p></div><Link className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white hover:bg-[#0b3f91]" href="/dashboard/cart">View cart</Link></div><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <div className="flex items-center justify-between gap-2 rounded-lg border border-[#dbe7f7] bg-white px-3 py-2" key={item.code}><span className="min-w-0"><strong className="block truncate text-[10px] text-[#0b1830]">{item.name}</strong><span className="text-[9px] text-[#687895]">{item.code} · ₦{item.price.toLocaleString("en-NG")}</span></span><span className="flex shrink-0 items-center gap-1"><button className="grid h-6 w-6 place-items-center rounded border border-[#dfe4ed] text-xs font-extrabold text-[#1453bb]" type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => void (item.quantity > 1 ? updateOrderCartQuantity(item.code, item.quantity - 1) : removeOrderCartItem(item.code))}>-</button><b className="min-w-5 text-center text-[10px] text-[#0b1830]">{item.quantity}</b><button className="grid h-6 w-6 place-items-center rounded border border-[#dfe4ed] text-xs font-extrabold text-[#1453bb]" type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => void updateOrderCartQuantity(item.code, item.quantity + 1)}>+</button></span></div>)}</div></section>;
}
