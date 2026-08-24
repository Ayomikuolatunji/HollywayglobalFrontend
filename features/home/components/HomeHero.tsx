import Link from "next/link";
import { Arrow, SocialIcon } from "./HomeIcons";
import { adminWhatsApp, sellWhatsApp, wantedWhatsApp, whatsappChannel } from "../data";

export default function HomeHero() {
  return (
    <section className="relative overflow-visible bg-gradient-to-br from-[#04152f] via-[#082b61] to-[#0d3b7c] text-white">
      <div className="mx-auto grid min-h-[560px] w-[calc(100%-40px)] max-w-[1180px] items-center gap-12 py-16 lg:w-[calc(100%-64px)] lg:grid-cols-[1fr_.82fr] lg:gap-[70px]">
        <div>
          <span className="mb-5 block text-[10px] font-extrabold tracking-[.16em] text-[#ffb11b]">
            ● &nbsp; NIGERIA&apos;S QUICK-SALES MARKETPLACE
          </span>
          <h1 className="max-w-[650px] text-5xl font-extrabold leading-[1.02] tracking-[-.06em] sm:text-6xl">
            Turn what you no longer want into{" "}
            <em className="not-italic text-[#ff8a00]">quick cash.</em>
          </h1>
          <p className="mb-6 max-w-[570px] text-sm leading-7 text-[#c5d2e6]">
            Sell unwanted items in Nigeria for free, clear furniture and electronics, move
            relocation goods, liquidate distress-sale assets or reach buyers for excess imported
            stock.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={sellWhatsApp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-3 rounded-lg bg-gradient-to-br from-[#ff8a00] to-[#ffb01c] px-4 py-3 text-[11px] font-extrabold text-[#142039] shadow-lg shadow-orange-950/20"
            >
              Sell an item free <Arrow />
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-11 items-center gap-3 rounded-lg border border-white/40 px-4 py-3 text-[11px] font-extrabold text-white hover:bg-white/10"
            >
              Talk to Hollyway <Arrow />
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-[10px] text-[#a8b9d3]">
            <span className="text-[#39d477]">✓ Free listings</span>
            <i>·</i>
            <span className="text-[#39d477]">✓ Nationwide reach</span>
            <i>·</i>
            <span className="text-[#39d477]">✓ Safer transactions</span>
          </div>
        </div>
        <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-7 shadow-2xl">
          <div className="flex items-center justify-between text-[9px] font-extrabold tracking-[.13em] text-[#9db0cc]">
            <span>BUY · SELL · CONNECT</span>
            <b className="text-2xl tracking-tight text-[#ffae1a]">01</b>
          </div>
          <div className="relative z-10 mt-9 text-3xl font-bold leading-tight tracking-[-.06em]">
            One marketplace.
            <br />
            <strong className="text-[#ffad18]">Many ways to move forward.</strong>
          </div>
          <div className="mt-3 flex h-44 items-end justify-around border-b border-white/15 text-6xl drop-shadow-2xl">
            <span>🛋️</span>
            <span className="text-4xl">📦</span>
            <span>📱</span>
            <span className="text-7xl">🚙</span>
          </div>
          <div className="flex justify-between pt-5 text-[11px] text-[#d5e0ef]">
            <span>Sell what you have</span>
            <span className="flex items-center gap-2 text-[#ffac17]">
              Find what you need <Arrow />
            </span>
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto grid w-[calc(100%-40px)] max-w-[1180px] translate-y-10 grid-cols-1 overflow-hidden rounded-xl bg-white text-[#0b1830] shadow-2xl sm:grid-cols-3 lg:w-[calc(100%-64px)]">
        <QuickLink
          href={adminWhatsApp}
          icon="whatsapp"
          title="Chat with admin"
          text="Sell or ask for help"
        />
        <QuickLink
          href={whatsappChannel}
          icon="whatsapp"
          title="WhatsApp channel"
          text="Follow new updates"
        />
        <QuickLink
          href={wantedWhatsApp}
          icon="search"
          title="Post a wanted request"
          text="Message admin · ₦200"
        />
      </div>
    </section>
  );
}

function QuickLink({
  href,
  icon,
  title,
  text,
}: {
  href: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 border-b border-[#dfe4ed] p-4 last:border-0 hover:bg-[#f7f9fc] sm:border-b-0 sm:border-r sm:last:border-0"
    >
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white ${icon === "whatsapp" ? "bg-[#20bd61]" : "bg-[#ff8a00]"}`}
      >
        {icon === "whatsapp" ? <SocialIcon name="whatsapp" /> : "⌕"}
      </span>
      <span className="min-w-0">
        <b className="block text-[11px]">{title}</b>
        <small className="mt-1 block text-[9px] text-[#8995a8]">{text}</small>
      </span>
      <Arrow />
    </a>
  );
}
