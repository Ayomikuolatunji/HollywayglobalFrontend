"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import CartQuantityControls from "../components/CartQuantityControls";
import CommerceIcon from "../components/CommerceIcon";
import CommercePageHeader from "../components/CommercePageHeader";
import { clearOrderCart, getOrderCartItemCount, getOrderCartSubtotal, orderCartUpdatedEvent, readOrderCart, refreshOrderCart, type OrderCartItem } from "../data/orderCart";

const money = (value: number) => `₦${value.toLocaleString("en-NG")}`;

function CartItemRow({ item }: { item: OrderCartItem }) {
  return <article className="flex flex-col gap-4 border-b border-[#eef1f4] py-5 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-center"><div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#173d75] to-[#081a38] text-[10px] font-extrabold tracking-[.08em] text-white">{item.code}</div><div className="min-w-0 flex-1"><span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#6b45c7]">Marketplace item</span><h3 className="mt-1 truncate text-sm font-extrabold text-[#0b1830]">{item.name}</h3><p className="mt-1 text-[10px] text-[#687895]">{item.code} · {money(item.price)} per item</p></div><div className="flex items-center justify-between gap-4 sm:justify-end"><strong className="min-w-24 text-right text-sm font-extrabold text-[#0b1830]">{money(item.price * item.quantity)}</strong><CartQuantityControls item={item} showRemove /></div></article>;
}

export default function CartPage() {
  const [items, setItems] = useState<OrderCartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readOrderCart());
    sync();
    void refreshOrderCart().then(setItems).catch(() => null);
    window.addEventListener(orderCartUpdatedEvent, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(orderCartUpdatedEvent, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const itemCount = useMemo(() => getOrderCartItemCount(items), [items]);
  const subtotal = useMemo(() => getOrderCartSubtotal(items), [items]);
  const orderHref = "/dashboard/orders/interest";

  if (!items.length) return <div className="mx-auto max-w-[980px] space-y-4 p-4 sm:p-6"><CommercePageHeader compact kicker="YOUR CART" title="Your cart is empty." description="Browse the Hollyway marketplace and add items here before sending one order request." action={<Link className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-xs font-extrabold text-white" href="/dashboard/marketplace">Browse marketplace <Arrow /></Link>} /><section className="grid place-items-center rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-5 py-12 text-center"><span className="grid h-11 w-11 place-items-center rounded-lg bg-white text-[#1453bb] shadow-sm"><CommerceIcon name="cart" className="h-5 w-5" /></span><h2 className="mt-3 font-[Manrope] text-lg font-extrabold tracking-[-.04em] text-[#0b1830]">Nothing added yet</h2><p className="mt-2 max-w-md text-xs leading-5 text-[#687895]">Select Add to cart on any marketplace listing. Your cart is saved to your Hollyway account until you are ready to submit an order request.</p><Link className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[#ff8a00] px-3 text-xs font-extrabold text-[#17223a]" href="/dashboard/marketplace">Find items <Arrow /></Link></section></div>;

  return <div className="mx-auto max-w-[1180px] space-y-4 p-4 sm:p-6"><CommercePageHeader compact kicker="YOUR CART" title="Review your items before ordering." description="Adjust quantities or remove items before sending one order request to Hollyway Admin." action={<Link className="inline-flex h-11 items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/marketplace">Continue shopping <Arrow /></Link>} /><div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]"><section className="rounded-lg border border-[#dfe4ed] bg-white p-4"><div className="flex items-center justify-between gap-3 border-b border-[#eef1f4] pb-4"><div><span className="text-[10px] font-extrabold tracking-[.16em] text-[#1453bb]">CART ITEMS</span><h2 className="mt-1 font-[Manrope] text-lg font-extrabold text-[#0b1830]">{itemCount} item{itemCount === 1 ? "" : "s"}</h2></div><button className="text-[10px] font-extrabold text-[#a32929] hover:underline" type="button" onClick={() => void clearOrderCart()}>Clear cart</button></div><div className="mt-4">{items.map((item) => <CartItemRow item={item} key={item.code} />)}</div></section><aside className="h-fit rounded-lg border border-[#dfe4ed] bg-white p-4 lg:sticky lg:top-24"><span className="text-[10px] font-extrabold tracking-[.16em] text-[#1453bb]">ORDER SUMMARY</span><h2 className="mt-1 font-[Manrope] text-lg font-extrabold text-[#0b1830]">{itemCount} item{itemCount === 1 ? "" : "s"}</h2><dl className="mt-4 space-y-2 border-y border-[#eef1f4] py-4 text-xs"><div className="flex justify-between gap-4"><dt className="text-[#687895]">Subtotal</dt><dd className="font-extrabold text-[#0b1830]">{money(subtotal)}</dd></div><div className="flex justify-between gap-4"><dt className="text-[#687895]">Delivery</dt><dd className="font-semibold text-[#53627a]">Confirmed by Admin</dd></div><div className="flex justify-between gap-4"><dt className="text-[#687895]">Escrow terms</dt><dd className="font-semibold text-[#53627a]">Confirmed by Admin</dd></div></dl><div className="flex justify-between gap-4 text-sm"><span className="font-extrabold text-[#0b1830]">Estimated total</span><strong className="font-[Manrope] text-lg font-extrabold text-[#1453bb]">{money(subtotal)}</strong></div><Link className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white hover:bg-[#0b3f91]" href={orderHref}>Proceed to order request <Arrow /></Link><p className="mt-3 text-[10px] leading-5 text-[#687895]">This is not payment. Hollyway Admin will confirm availability, delivery fees, escrow terms and official payment instructions before you pay.</p></aside></div></div>;
}
