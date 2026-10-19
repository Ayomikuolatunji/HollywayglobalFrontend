import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";

export function DashboardAccessState({ status, onRetry }: { status: "unauthenticated" | "error"; onRetry: () => void }) {
  const unavailable = status === "error";
  return <section className="grid min-h-[70vh] place-items-center p-6"><div className="w-full max-w-lg rounded-2xl border border-[#e4e2da] bg-white p-8 text-center shadow-xl shadow-[#061936]/10"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#14213d] font-[Manrope] font-extrabold text-white">H</span><span className="mt-6 block text-[10px] font-extrabold tracking-[.2em] text-[#dd6b12]">HOLLYWAY GLOBAL</span><h2 className="mt-3 font-[Manrope] text-3xl font-extrabold tracking-[-.05em] text-[#12141c]">{unavailable ? "Dashboard unavailable" : "Sign in to continue"}</h2><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#5c5f6b]">{unavailable ? "We could not reach the Hollyway service. Check the API connection and try again." : "Your dashboard is protected. Sign in with your Hollyway user account to continue."}</p><div className="mt-7 flex flex-wrap justify-center gap-3">{unavailable && <button className="h-11 rounded-lg border border-[#e4e2da] px-4 text-xs font-extrabold text-[#3b4b6b]" type="button" onClick={onRetry}>Try again</button>}<Link className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#14213d] px-4 text-xs font-extrabold text-white" href="/login">{unavailable ? "Open sign in" : "Go to sign in"}<Arrow /></Link></div><Link className="mt-5 block text-xs font-bold text-[#14213d] hover:underline" href="/">Return to Hollyway Global</Link></div></section>;
}

export function DashboardLoadingState() {
  return <section className="grid min-h-[70vh] place-items-center p-6"><div className="rounded-xl border border-[#e4e2da] bg-white px-6 py-5 text-sm font-bold text-[#53627a] shadow-sm">Checking your Hollyway session…</div></section>;
}
