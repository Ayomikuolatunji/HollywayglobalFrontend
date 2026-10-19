"use client";

import { useEffect, useState } from "react";
import HomeHeader from "../../home/components/HomeHeader";
import { HomeFooter } from "../../home/components/HomeCommunity";
import SolarDiscovery from "../components/SolarDiscovery";
import SolarLeadForm from "../components/SolarLeadForm";
import SolarPackageGrid from "../components/SolarPackageGrid";
import {
  fetchSolarPackages,
  submitSolarLead,
  type SolarLead,
  type SolarPackage,
} from "../data/solarApi";

export default function SolarPage() {
  const [packages, setPackages] = useState<SolarPackage[]>([]);
  const [energyFocus, setEnergyFocus] = useState("day_priority");
  const [selectedPackageKey, setSelectedPackageKey] = useState<string | null>(null);
  const [result, setResult] = useState<SolarLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetchSolarPackages(controller.signal)
      .then(setPackages)
      .catch((reason) => {
        if (!(reason instanceof DOMException && reason.name === "AbortError")) {
          setError(reason instanceof Error ? reason.message : "Solar packages could not be loaded.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  async function submit(input: Parameters<typeof submitSolarLead>[0]) {
    setResult(await submitSolarLead(input));
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f9fc] text-[#071a34]">
      <HomeHeader />
      <SolarHero />
      <SolarDiscovery value={energyFocus} onChange={setEnergyFocus} />
      {error && <ErrorMessage message={error} />}
      {loading ? (
        <div className="mx-auto max-w-[1180px] px-5 py-20 text-center text-xs font-bold text-[#53627a]">
          Loading published Solar systems…
        </div>
      ) : (
        <SolarPackageGrid
          packages={packages}
          onChoose={(key) => {
            setSelectedPackageKey(key);
            document.getElementById("solar-assessment")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}
      {result ? (
        <SolarSuccess lead={result} />
      ) : (
        <SolarLeadForm
          packages={packages}
          energyFocus={energyFocus}
          selectedPackageKey={selectedPackageKey}
          source="public"
          onEnergyFocusChange={setEnergyFocus}
          onPackageChange={setSelectedPackageKey}
          onSubmit={submit}
        />
      )}
      <HomeFooter />
    </main>
  );
}

function SolarHero() {
  return (
    <section className="relative overflow-hidden bg-[#071a34] text-white">
      <div className="mx-auto grid min-h-[500px] w-[calc(100%-40px)] max-w-[1180px] items-center gap-12 py-16 lg:w-[calc(100%-64px)] lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <p className="text-[10px] font-black tracking-[.2em] text-[#f4b41a]">HOLLYWAY GLOBAL SOLAR</p>
          <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[.98] tracking-[-.07em] sm:text-6xl">
            Power designed around <span className="text-[#f4b41a]">your day.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#c6d8ea]">
            From Pocket Power for essential devices to commercial and industrial high-voltage systems,
            explore published Solar starting points and ask Hollyway to assess your actual load.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a className="inline-flex h-11 items-center bg-[#f4b41a] px-5 text-xs font-black text-[#071a34] hover:bg-[#ffca45]" href="#solar-assessment">
              Get a Solar assessment
            </a>
            <a className="inline-flex h-11 items-center border border-[#7091b4] px-5 text-xs font-black text-white hover:border-white" href="#packages">
              Compare systems
            </a>
          </div>
          <p className="mt-5 max-w-lg text-[10px] leading-5 text-[#91aecb]">
            Published equipment combinations and performance statements are examples from the supplied
            specification. Final sizing, installation scope and exact hardware are confirmed after assessment.
          </p>
        </div>
        <SolarSystemGraphic />
      </div>
    </section>
  );
}

function SolarSystemGraphic() {
  return (
    <div className="relative min-h-[330px] overflow-hidden border border-[#2b5076] bg-[#0c2a51] p-6">
      <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full border-[22px] border-[#f4b41a]/20" />
      <div className="absolute bottom-7 right-7 h-40 w-64 -skew-x-12 border border-[#7bb9ea]/50 bg-[#165186]/50" />
      <div className="absolute bottom-16 right-16 h-28 w-48 -skew-x-12 border border-[#7bb9ea] bg-[#2d83d5]/40" />
      <div className="relative z-10 flex h-full min-h-[282px] flex-col justify-between">
        <span className="text-[10px] font-black tracking-[.2em] text-[#91aecb]">ENERGY SYSTEM MAP</span>
        <div>
          <p className="text-4xl font-black tracking-[-.06em]">320Wh → 50kW+</p>
          <p className="mt-2 max-w-xs text-xs leading-5 text-[#c6d8ea]">
            A practical progression from small essential-device power to published commercial and industrial systems.
          </p>
        </div>
        <div className="flex items-end justify-between border-t border-[#7091b4]/40 pt-4 text-[10px] text-[#c6d8ea]">
          <span>Day · night · balanced</span>
          <span className="text-[#f4b41a]">Assess first</span>
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <p className="mx-auto mt-6 w-[calc(100%-40px)] max-w-[1180px] rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929] lg:w-[calc(100%-64px)]" role="alert">{message}</p>;
}

function SolarSuccess({ lead }: { lead: SolarLead }) {
  return (
    <section className="bg-[#e8f5ff] py-12">
      <div className="mx-auto flex w-[calc(100%-40px)] max-w-[760px] flex-col gap-4 border border-[#b8dcf5] bg-white p-6 sm:p-8 lg:w-[calc(100%-64px)]">
        <p className="text-[10px] font-black tracking-[.18em] text-[#2d83d5]">ENQUIRY SAVED</p>
        <h2 className="text-2xl font-black tracking-[-.05em] text-[#071a34]">Your Solar reference is {lead.reference}.</h2>
        <p className="text-sm leading-6 text-[#53627a]">
          Starting point: {lead.recommendation_key.replace("tier_", "Tier ")}. {lead.recommendation_reason}
        </p>
        <div className="flex flex-wrap gap-3">
          <a className="inline-flex h-10 items-center bg-[#2d83d5] px-4 text-xs font-black text-white hover:bg-[#145b9c]" href={lead.whatsapp_url || "#solar-assessment"} target={lead.whatsapp_url ? "_blank" : undefined} rel={lead.whatsapp_url ? "noreferrer" : undefined}>
            {lead.whatsapp_url ? "Continue on WhatsApp" : "WhatsApp is not configured"}
          </a>
          <button className="h-10 border border-[#d6e3ef] px-4 text-xs font-black text-[#53627a]" type="button" onClick={() => window.location.reload()}>
            Start another enquiry
          </button>
        </div>
      </div>
    </section>
  );
}
