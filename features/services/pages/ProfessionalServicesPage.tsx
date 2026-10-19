"use client";

import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";
import ProfessionalDirectory from "../components/ProfessionalDirectory";
import ProfessionalRequestForm from "../components/ProfessionalRequestForm";
import ServicePageHeader from "../components/ServicePageHeader";

export default function ProfessionalServicesPage() {
  return <div className="mx-auto max-w-[1120px] space-y-5 p-5 sm:p-8"><ServicePageHeader kicker="PROFESSIONAL SERVICES" title="Hire a verified service professional." description="Browse approved profiles or tell Hollyway what you need, where the work is, and when you need it." action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/services">Back to professional requests <Arrow /></Link>} /><ProfessionalDirectory /><section className="rounded-xl border border-[#dfe4ed] bg-white p-4 shadow-sm sm:p-5"><div className="border-b border-[#eef1f4] pb-3"><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#1453bb]">REQUEST A MATCH</p><h2 className="mt-1 text-lg font-extrabold tracking-[-.03em] text-[#0b1830]">Tell Hollyway what you need</h2><p className="mt-1 text-xs leading-5 text-[#53627a]">Your request is saved on Hollyway, reviewed by the team and connected to quotations from approved professionals.</p></div><div className="mt-4"><ProfessionalRequestForm /></div></section></div>;
}
