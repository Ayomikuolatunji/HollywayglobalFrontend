"use client";

import { useState } from "react";

export type OrderCopyDetails = {
  title: string;
  reference: string;
  status: string;
  createdAt: string;
  fields: Array<{ label: string; value: string }>;
  note: string;
};

export function createOrderReference(prefix: string) {
  return `${prefix}-${Date.now().toString().slice(-6)}`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] || character);
}

function printOrderCopy(copy: OrderCopyDetails) {
  const printWindow = window.open("", "_blank", "width=820,height=900");
  if (!printWindow) return false;

  const styles = Array.from(document.head.querySelectorAll('link[rel="stylesheet"], style')).map((node) => node.outerHTML).join("");
  const fields = copy.fields.map(({ label, value }) => `<div class="rounded-lg border border-[#dfe4ed] bg-[#f8fafc] p-4"><dt class="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#8b97a9]">${escapeHtml(label)}</dt><dd class="mt-2 break-words text-sm font-extrabold text-[#0b1830]">${escapeHtml(value)}</dd></div>`).join("");

  printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8" /><title>${escapeHtml(copy.title)} · ${escapeHtml(copy.reference)}</title>${styles}</head><body class="min-h-screen bg-[#eef1f5] p-5 text-[#0b1830] sm:p-10"><main class="mx-auto max-w-3xl rounded-2xl border border-[#dfe4ed] bg-white p-6 shadow-sm sm:p-10"><div class="flex items-start justify-between gap-5 border-b border-[#dfe4ed] pb-6"><div><p class="text-[10px] font-extrabold tracking-[.18em] text-[#ff8a00]">HOLLYWAY GLOBAL</p><h1 class="mt-2 font-[Manrope] text-2xl font-extrabold tracking-[-.05em]">${escapeHtml(copy.title)}</h1></div><span class="rounded-full bg-[#f5fcf7] px-3 py-2 text-[10px] font-extrabold text-[#168046]">${escapeHtml(copy.status)}</span></div><dl class="mt-6 grid gap-3 sm:grid-cols-2"><div class="rounded-lg border border-[#dfe4ed] bg-[#f8fafc] p-4"><dt class="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#8b97a9]">REFERENCE</dt><dd class="mt-2 text-sm font-extrabold text-[#0b1830]">${escapeHtml(copy.reference)}</dd></div><div class="rounded-lg border border-[#dfe4ed] bg-[#f8fafc] p-4"><dt class="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#8b97a9]">CREATED</dt><dd class="mt-2 text-sm font-extrabold text-[#0b1830]">${escapeHtml(copy.createdAt)}</dd></div>${fields}</dl><p class="mt-6 rounded-lg border border-[#f1d8a9] bg-[#fffaf1] p-4 text-xs leading-5 text-[#6b5a3d]">${escapeHtml(copy.note)}</p><p class="mt-8 border-t border-[#eef1f4] pt-5 text-[10px] leading-5 text-[#8490a4]">Keep this reference for Hollyway support. This copy records the request submitted through the Hollyway Global user workspace.</p></main></body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.addEventListener("afterprint", () => printWindow.close(), { once: true });
  window.setTimeout(() => printWindow.print(), 400);
  return true;
}

export default function OrderCopyActions({ copy }: { copy: OrderCopyDetails }) {
  const [popupBlocked, setPopupBlocked] = useState(false);

  function savePdf() {
    setPopupBlocked(!printOrderCopy(copy));
  }

  return <div className="mt-6 rounded-xl border border-[#cfe0f7] bg-[#f4f8ff] p-4 text-left"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><strong className="block text-xs font-extrabold text-[#0b1830]">Keep a copy of this submission</strong><p className="mt-1 text-[10px] leading-5 text-[#53627a]">Reference: <span className="font-extrabold text-[#1453bb]">{copy.reference}</span></p></div><button className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white hover:bg-[#0b3f91]" type="button" onClick={savePdf}>Save PDF copy</button></div>{popupBlocked && <p className="mt-3 text-[10px] font-semibold leading-5 text-[#a32929]" role="alert">Your browser blocked the PDF window. Allow pop-ups for Hollyway, then try again.</p>}<p className="mt-3 text-[10px] leading-5 text-[#687895]">A print window will open. Select “Save as PDF” in your browser to download the copy.</p></div>;
}
