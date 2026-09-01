"use client";

import { useEffect, useState } from "react";
import { addOrderCartItem, orderCartUpdatedEvent, readOrderCart, type OrderCartItem } from "../data/orderCart";

export default function AddToOrderButton({ item }: { item: Omit<OrderCartItem, "quantity"> }) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const sync = () => setAdded(readOrderCart().some((entry) => entry.code === item.code));
    sync();
    window.addEventListener(orderCartUpdatedEvent, sync);
    return () => window.removeEventListener(orderCartUpdatedEvent, sync);
  }, [item.code]);

  function addItem() {
    addOrderCartItem(item);
    setAdded(true);
  }

  return <button className={`inline-flex h-8 items-center justify-center rounded-md px-2.5 text-[9px] font-extrabold ${added ? "border border-[#bfe5d0] bg-[#f5fcf7] text-[#168046]" : "border border-[#1453bb] bg-white text-[#1453bb] hover:bg-[#edf4ff]"}`} type="button" onClick={addItem}>{added ? "Added to cart" : "Add to cart"}</button>;
}
