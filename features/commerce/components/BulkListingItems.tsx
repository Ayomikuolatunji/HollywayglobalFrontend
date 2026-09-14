"use client";

import { useState } from "react";

type BulkItem = { id: string; name: string; category: string; quantity: string; price: string };

export default function BulkListingItems() {
  const [items, setItems] = useState<BulkItem[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  function addItem() {
    if (!name.trim() || !category.trim()) {
      setError("Add an item name and category before adding it to the batch.");
      return;
    }
    setItems((current) => [...current, { id: crypto.randomUUID(), name: name.trim(), category: category.trim(), quantity: quantity || "1", price }]);
    setName("");
    setCategory("");
    setQuantity("1");
    setPrice("");
    setError("");
  }

  return <section className="rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-sm"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><span className="text-[10px] font-extrabold tracking-[.16em] text-[#1453bb]">BULK LISTING</span><h3 className="mt-2 font-[Manrope] text-lg font-extrabold tracking-[-.04em] text-[#0b1830]">Add more items to this submission</h3><p className="mt-2 max-w-2xl text-xs leading-5 text-[#53627a]">Use this for several items that should be reviewed together. The main form remains the primary listing; added items are saved with the same Draft.</p></div><span className="shrink-0 rounded-full bg-[#f4f8ff] px-3 py-2 text-[10px] font-extrabold text-[#1453bb]">{items.length} added</span></div>{items.length > 0 && <div className="mt-5 grid gap-2">{items.map((item) => <div className="flex flex-col justify-between gap-3 rounded-lg border border-[#eef1f4] bg-[#f8fafc] p-3 sm:flex-row sm:items-center" key={item.id}><div><strong className="block text-xs text-[#0b1830]">{item.name}</strong><span className="mt-1 block text-[10px] text-[#687895]">{item.category} · Quantity {item.quantity}{item.price ? ` · ₦${Number(item.price).toLocaleString("en-NG")}` : ""}</span></div><button className="self-start text-[10px] font-extrabold text-[#a32929] hover:underline sm:self-auto" type="button" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}>Remove</button><input type="hidden" name="additionalItemName" value={item.name} /><input type="hidden" name="additionalItemCategory" value={item.category} /><input type="hidden" name="additionalItemQuantity" value={item.quantity} /><input type="hidden" name="additionalItemPrice" value={item.price} /></div>)}</div>}{error && <p className="mt-4 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}<div className="mt-5 grid gap-3 sm:grid-cols-[1.2fr_1fr_.6fr_1fr_auto]"><label className="grid gap-1.5 text-[10px] font-extrabold text-[#31425e]">Item name<input className="h-10 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none focus:border-[#1453bb]" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. 3 office chairs" /></label><label className="grid gap-1.5 text-[10px] font-extrabold text-[#31425e]">Category<input className="h-10 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none focus:border-[#1453bb]" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="e.g. Furniture" /></label><label className="grid gap-1.5 text-[10px] font-extrabold text-[#31425e]">Quantity<input className="h-10 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none focus:border-[#1453bb]" type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label><label className="grid gap-1.5 text-[10px] font-extrabold text-[#31425e]">Price (₦)<input className="h-10 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none focus:border-[#1453bb]" inputMode="numeric" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Optional" /></label><button className="h-10 self-end rounded-lg border border-[#1453bb] px-3 text-[10px] font-extrabold text-[#1453bb] hover:bg-[#edf4ff]" type="button" onClick={addItem}>Add item</button></div></section>;
}
