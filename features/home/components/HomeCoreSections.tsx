import Link from "next/link";
import { Arrow } from "./HomeIcons";
import {
  adminWhatsApp,
  categories,
  audiences,
  sellWhatsApp,
  steps,
  wantedWhatsApp,
} from "../data";

const sectionShell =
  "mx-auto w-[calc(100%-40px)] max-w-[1180px] py-20 lg:w-[calc(100%-64px)] lg:py-28";
const sectionHeader = "mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end";
const kicker = "text-[10px] font-extrabold tracking-[.16em] text-[#8995a8]";

export function CategoriesSection() {
  return (
    <section id="categories" className={sectionShell}>
      <div className={sectionHeader}>
        <div>
          <span className={kicker}>SHOP · SELL · DISCOVER</span>
          <h2 className="mt-2 max-w-xl text-3xl font-extrabold leading-tight tracking-[-.05em] text-[#0b1830] sm:text-4xl">
            Everything has a <span className="text-[#ff8a00]">next buyer.</span>
          </h2>
        </div>
        <p className="max-w-sm text-xs leading-6 text-[#667085]">
          From a single household item to a container of imported stock, Hollyway helps you put it
          in front of the right audience.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {categories.map(([icon, title, text]) => (
          <Link
            href="/dashboard/marketplace"
            className="group flex min-h-52 flex-col rounded-xl border border-[#dfe4ed] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#ffbd54] hover:shadow-lg"
            key={title}
          >
            <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-[#f0f5ff] text-2xl odd:bg-[#fff3e3]">
              {icon}
            </span>
            <strong className="text-sm text-[#0b1830]">{title}</strong>
            <small className="mt-2 min-h-12 text-[10px] leading-5 text-[#8490a4]">{text}</small>
            <span className="mt-auto flex items-center gap-2 text-[10px] font-extrabold text-[#1453bb]">
              Explore <Arrow />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section id="how" className="bg-[#061936] text-white">
      <div className={`${sectionShell} py-20 lg:py-24`}>
        <div className={sectionHeader}>
          <div>
            <span className="text-[10px] font-extrabold tracking-[.16em] text-[#91a6c5]">
              A SIMPLE WAY TO MOVE ITEMS
            </span>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-.05em] sm:text-4xl">
              From listing to <span className="text-[#ff8a00]">done.</span>
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-6 text-[#a2b2c9]">
            Whether you are selling or searching, every step is designed to stay clear and
            practical.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([number, title, text], index) => (
            <div className="relative min-h-56 border-t border-white/20 p-5" key={number}>
              <span className="text-[10px] font-extrabold text-[#7890b2]">{number}</span>
              <span
                className={`mt-5 grid h-14 w-14 place-items-center rounded-full text-2xl font-extrabold shadow-lg ${index === 0 ? "bg-[#1b75d1] shadow-blue-500/20" : index === 1 ? "bg-[#ff8a00] shadow-orange-500/20" : index === 2 ? "bg-[#7e55da] shadow-purple-500/20" : "bg-[#20bd61] shadow-green-500/20"}`}
              >
                {index === 0 ? "＋" : index === 1 ? "◈" : index === 2 ? "↔" : "✓"}
              </span>
              <h3 className="mt-5 text-sm font-bold">{title}</h3>
              <p className="mt-2 max-w-52 text-[10px] leading-5 text-[#9cadc6]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AudienceSection() {
  return (
    <section className={sectionShell}>
      <div className={sectionHeader}>
        <div>
          <span className={kicker}>MADE FOR MORE THAN ONE SITUATION</span>
          <h2 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight tracking-[-.05em] text-[#0b1830] sm:text-4xl">
            One platform for <span className="text-[#ff8a00]">every kind of quick sale.</span>
          </h2>
        </div>
        <p className="max-w-sm text-xs leading-6 text-[#667085]">
          Hollyway Global brings together the people who need to sell quickly and the people
          searching for value.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {audiences.map(([label, title, text], index) => (
          <article
            className={`relative min-h-44 overflow-hidden rounded-xl p-6 ${index % 3 === 0 ? "bg-[#eef5ff]" : index % 3 === 1 ? "bg-[#fff3e3]" : "bg-[#eafaf0]"}`}
            key={label}
          >
            <span className="text-[9px] font-extrabold tracking-[.13em] text-[#71809a]">
              {label}
            </span>
            <h3 className="mt-4 max-w-[220px] text-base font-extrabold text-[#0b1830]">{title}</h3>
            <p className="mt-2 max-w-[270px] text-[10px] leading-5 text-[#65748a]">{text}</p>
          </article>
        ))}
      </div>
      <div className="mt-9 grid grid-cols-1 gap-3 md:grid-cols-2">
        <ActionCard
          label="SELLERS"
          title="Have something taking up space?"
          text="List your furniture, electronics, vehicles, appliances, fashion or stock for free."
          href={sellWhatsApp}
          action="Chat with admin to sell"
        />
        <ActionCard
          label="BUYERS"
          title="Looking for something specific?"
          text="Send a wanted request and let potential sellers know exactly what you need."
          href={wantedWhatsApp}
          action="Message admin to request"
        />
      </div>
    </section>
  );
}

function ActionCard({
  label,
  title,
  text,
  href,
  action,
}: {
  label: string;
  title: string;
  text: string;
  href: string;
  action: string;
}) {
  return (
    <div className="rounded-xl bg-[#f4f7fb] p-7 last:bg-[#fff4e7]">
      <span className="text-[10px] font-extrabold tracking-[.15em] text-[#77849a]">{label}</span>
      <b className="mt-3 block font-[Manrope] text-lg font-bold text-[#0b1830]">{title}</b>
      <p className="mt-2 max-w-md text-[11px] leading-5 text-[#667085]">{text}</p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-[10px] font-extrabold text-[#1453bb]"
      >
        {action} <Arrow />
      </a>
    </div>
  );
}

export function WhySection() {
  const benefits = [
    [
      "FREE",
      "Free item listings",
      "Put your unwanted items in front of potential buyers without a listing fee.",
    ],
    ["36", "Nationwide reach", "Connect with buyers and sellers across all 36 states and the FCT."],
    [
      "SAFE",
      "Safer transactions",
      "Escrow, inspection and tracked delivery support a more confident purchase.",
    ],
    [
      "FAST",
      "Built for speed",
      "A practical marketplace for relocation, distress sales and quick liquidation.",
    ],
  ];
  return (
    <section className="mx-auto w-[calc(100%-40px)] max-w-[1180px] py-20 lg:w-[calc(100%-64px)]">
      <div className={sectionHeader}>
        <div>
          <span className={kicker}>WHY HOLLYWAY GLOBAL</span>
          <h2 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight tracking-[-.05em] text-[#0b1830] sm:text-4xl">
            Built around real <span className="text-[#ff8a00]">people and real needs.</span>
          </h2>
        </div>
        <p className="max-w-sm text-xs leading-6 text-[#667085]">
          Decluttering, relocating, raising urgent cash or looking for a deal should not feel
          complicated.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(([tag, title, text]) => (
          <article className="min-h-48 rounded-xl border border-[#dfe4ed] p-6" key={title}>
            <span className="text-[10px] font-extrabold tracking-[.13em] text-[#ff8a00]">
              {tag}
            </span>
            <h3 className="mt-6 text-base font-bold text-[#0b1830]">{title}</h3>
            <p className="mt-2 text-[10px] leading-5 text-[#667085]">{text}</p>
          </article>
        ))}
      </div>
      <div className="mt-9 rounded-xl bg-gradient-to-r from-[#061936] to-[#4d2b96] p-7 text-white">
        <span className="text-[10px] font-extrabold tracking-[.14em] text-[#ffae1a]">
          TELL HOLLYWAY WHAT YOU NEED
        </span>
        <p className="mt-3 max-w-2xl text-xl font-bold leading-tight sm:text-2xl">
          Buy, sell, request a service, or get help from the Hollyway Admin desk.
        </p>
        <a
          href={adminWhatsApp}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-[10px] font-extrabold text-[#ffae1a]"
        >
          Start a conversation <Arrow />
        </a>
      </div>
    </section>
  );
}
