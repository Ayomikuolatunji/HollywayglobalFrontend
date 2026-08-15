import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Customer Stories",
  description:
    "Explore Hollyway Global customer-story themes for decluttering, distress sales, relocation clearance, importer stock, wanted requests and safer transactions in Nigeria.",
  alternates: { canonical: "/testimonials" },
  openGraph: {
    title: "Hollyway Global Customer Stories",
    description: "Stories from the people and businesses Hollyway Global is built to serve.",
    url: "https://hollywayglobal.com/testimonials",
  },
};

const adminWhatsApp = `https://wa.me/2347015585967?text=${encodeURIComponent("Hello Hollyway Admin, I would like to ask about your services.")}`;

const stories = [
  ["DECLUTTERING", "From unused household items to useful cash", "A family clearing a living room, bedroom or store can use a free listing to give furniture, appliances and electronics a chance to reach a new owner.", "Home clear-out"],
  ["DISTRESS SALE", "A clearer route when cash is urgent", "A seller facing an urgent financial need can send item details, price and location to the Admin and reach interested buyers without leaving the asset unseen.", "Urgent liquidity"],
  ["RELOCATION", "Move to the next chapter with less baggage", "Relocating within Nigeria or abroad often means leaving behind bulky items. Hollyway helps a relocating seller connect with buyers before the move.", "Relocation clearance"],
  ["IMPORTER & WHOLESALER", "Move excess stock faster", "Importers can present consumer goods, electronics, fashion, kitchenware and clearance stock to Nigerian retail buyers and resellers.", "Bulk clearance"],
  ["SMART BUYER", "Find what the market does not currently show", "A buyer looking for a particular model, budget or condition can submit a wanted request for review, coding and broadcast across Hollyway channels.", "Wanted request"],
  ["ESCROW & LOGISTICS", "More clarity from agreement to delivery", "When both parties proceed with Hollyway support, delivery, inspection, escrow confirmation and seller payout follow a documented process.", "Safer transaction"],
];

export default function TestimonialsPage() {
  return (
    <main className="storiesPage">
      <SiteHeader />

      <section className="storiesHero pageShell">
        <div><span className="sectionKicker">WHAT HOLLYWAY IS BUILT FOR</span><h1>Real needs. <em>Real marketplace moments.</em></h1><p>From clearing a home to liquidating imported stock, Hollyway Global helps people and businesses move items forward.</p><a className="button buttonPrimary" href={adminWhatsApp} target="_blank" rel="noreferrer">Share your Hollyway story <span>↗</span></a></div>
        <div className="storiesHeroArt"><span>“</span><strong>Buy with confidence.<br />Sell with confidence.</strong><small>Hollyway Global Quick Sales</small></div>
      </section>

      <section className="storyNotice"><div className="pageShell"><strong>Story page setup</strong><span>These are illustrative customer-story templates prepared from Hollyway&apos;s service brief. Replace each card with an approved quote from a real user before presenting it as a testimonial.</span></div></section>

      <section className="storiesSection pageShell"><div className="storiesSectionHead"><span className="sectionKicker">THE PEOPLE WE SERVE</span><h2>Every sale has a <span>reason behind it.</span></h2><p>Hollyway&apos;s marketplace is designed around the different situations that bring sellers and buyers together.</p></div><div className="storyGrid">{stories.map(([category, title, text, label], index) => <article className={`storyCard storyCard${index + 1}`} key={category}><div className="storyTop"><span>{category}</span><b>0{index + 1}</b></div><div className="storyQuote">“</div><h3>{title}</h3><p>{text}</p><footer><span>{label}</span><small>Illustrative story</small></footer></article>)}</div></section>

      <section className="storyProof"><div className="pageShell storyProofInner"><div><span className="sectionKicker">HAVE YOU USED HOLLYWAY?</span><h2>Your experience can help the next person <em>buy or sell with confidence.</em></h2></div><div><p>Send your approved feedback, first name or business name, service used and city to the Hollyway Admin. We can publish it with your permission.</p><a className="button buttonPrimary" href={adminWhatsApp} target="_blank" rel="noreferrer">Send feedback to admin <span>↗</span></a></div></div></section>

      <footer className="storiesFooter"><div className="pageShell"><a href="/">← Return to Hollyway Global Quick Sales</a><span>© 2026 Hollyway Global Investment Int&apos;l Ltd. · CAC RC 1611033</span></div></footer>
    </main>
  );
}
