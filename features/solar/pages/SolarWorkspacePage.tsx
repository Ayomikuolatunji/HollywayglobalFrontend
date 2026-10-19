"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import { useDashboard } from "../../dashboard/components/DashboardShell";
import SolarLeadForm from "../components/SolarLeadForm";
import SolarPackageGrid from "../components/SolarPackageGrid";
import {
  fetchMySolarLeads,
  fetchSolarPackages,
  submitSolarLead,
  type SolarLead,
  type SolarPackage,
} from "../data/solarApi";

export default function SolarWorkspacePage() {
  const { accountName } = useDashboard();
  const [packages, setPackages] = useState<SolarPackage[]>([]);
  const [leads, setLeads] = useState<SolarLead[]>([]);
  const [energyFocus, setEnergyFocus] = useState("day_priority");
  const [selectedPackageKey, setSelectedPackageKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([fetchSolarPackages(controller.signal), fetchMySolarLeads(controller.signal)])
      .then(([catalogue, history]) => {
        setPackages(catalogue);
        setLeads(history);
      })
      .catch((reason) => {
        if (!(reason instanceof DOMException && reason.name === "AbortError")) {
          setError(reason instanceof Error ? reason.message : "Solar workspace could not be loaded.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  async function submit(input: Parameters<typeof submitSolarLead>[0]) {
    const lead = await submitSolarLead(input);
    setLeads((current) => [lead, ...current]);
    if (lead.whatsapp_url) window.open(lead.whatsapp_url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="w-full space-y-4 px-4 pb-16 pt-1 sm:px-6 lg:px-8">
      <DashboardPageHeader
        kicker="SOLAR"
        title={`Plan power for ${accountName}.`}
        description="Use the published Solar starting points, then send Hollyway one clear assessment enquiry."
        compact
        action={<Link className="inline-flex h-8 items-center gap-2 rounded-lg border border-[#e4e2da] bg-white px-3 text-[11px] font-bold text-[#14213d]" href="/dashboard">Back to overview <Arrow /></Link>}
      />
      {error && <p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}
      {loading ? (
        <div className="py-16 text-center text-xs font-bold text-[#53627a]">Loading Solar workspace…</div>
      ) : (
        <>
          <SolarLeadForm
            packages={packages}
            energyFocus={energyFocus}
            selectedPackageKey={selectedPackageKey}
            source="dashboard"
            initialName={accountName === "Hollyway user" ? "" : accountName}
            onEnergyFocusChange={setEnergyFocus}
            onPackageChange={setSelectedPackageKey}
            onSubmit={submit}
          />
          <SolarPackageGrid
            packages={packages}
            onChoose={(key) => {
              setSelectedPackageKey(key);
              document.getElementById("solar-assessment")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
          <SolarLeadHistory leads={leads} />
        </>
      )}
    </div>
  );
}

function SolarLeadHistory({ leads }: { leads: SolarLead[] }) {
  return (
    <section className="rounded-[14px] border border-[#e4e2da] bg-white p-4 sm:p-5">
      <p className="text-[9px] font-black tracking-[.14em] text-[#b8560d]">YOUR ENQUIRIES</p>
      <h2 className="mt-1 text-lg font-black text-[#12141c]">Solar assessment history</h2>
      {leads.length ? (
        <div className="mt-4 divide-y divide-[#e4e2da]">
          {leads.map((lead) => (
            <div className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0" key={lead.id}>
              <div>
                <strong className="block text-xs text-[#12141c]">{lead.reference}</strong>
                <span className="mt-1 block text-[10px] text-[#5c5f6b]">{lead.location} · {lead.status.replaceAll("_", " ")}</span>
              </div>
              {lead.whatsapp_url && <a className="text-[10px] font-bold text-[#1453bb]" href={lead.whatsapp_url} target="_blank" rel="noreferrer">Open WhatsApp</a>}
            </div>
          ))}
        </div>
      ) : <p className="mt-3 text-xs text-[#687895]">No Solar enquiries yet.</p>}
    </section>
  );
}
