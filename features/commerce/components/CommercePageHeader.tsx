import type { ReactNode } from "react";

export default function CommercePageHeader({ kicker, title, description, action }: { kicker: string; title: string; description: string; action?: ReactNode }) {
  return <div className="flex flex-col justify-between gap-5 border-b border-[#dfe4ed] pb-6 sm:flex-row sm:items-end"><div><span className="text-[10px] font-extrabold tracking-[.18em] text-[#ff8a00]">{kicker}</span><h2 className="mt-2 font-[Manrope] text-3xl font-extrabold tracking-[-.06em] text-[#0b1830]">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#53627a]">{description}</p></div>{action}</div>;
}
