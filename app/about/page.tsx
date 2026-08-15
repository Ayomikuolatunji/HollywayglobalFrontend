import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Hollyway Global Investment Int'l Ltd., its quick-sales marketplace, leadership, and mission to connect Nigerian buyers and sellers safely.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Hollyway Global Quick Sales",
    description:
      "The story, leadership and marketplace mission behind Hollyway Global Quick Sales.",
    url: "https://hollywayglobal.com/about",
    images: [{ url: "/admin.jpeg", width: 712, height: 1072, alt: "Hollyway Global CEO in an aviation maintenance setting" }],
  },
};

const whatsappGroup = "https://chat.whatsapp.com/Ij8dR9bkwppHQq77srTSqx";

export default function AboutPage() {
  return (
    <main className="aboutPage">
      <header className="aboutHeader">
        <a className="aboutBack" href="/">← Back to Hollyway Global</a>
        <span className="aboutHeaderLabel">HOLLYWAY GLOBAL QUICK SALES</span>
      </header>

      <section className="aboutHero pageShell">
        <div className="aboutHeroCopy">
          <span className="sectionKicker">ABOUT THE COMPANY</span>
          <h1>Helping people turn unwanted items into <em>new opportunities.</em></h1>
          <p>
            Hollyway Global Investment Int&apos;l Ltd. is a Nigerian marketplace and transaction-support business helping individuals, families, importers and organisations connect with buyers for unwanted items, surplus stock, relocation goods and distress-sale assets.
          </p>
          <div className="aboutActions">
            <a className="button buttonPrimary" href={whatsappGroup} target="_blank" rel="noreferrer">Join our marketplace <span>↗</span></a>
            <a className="button buttonAboutGhost" href="mailto:contact@hollywayglobal.com">Contact the team <span>↗</span></a>
          </div>
        </div>
        <div className="aboutHeroVisual">
          <div className="aboutImageFrame">
            <Image src="/admin.jpeg" alt="Olumide Joseph Olatunji in an aviation maintenance setting" fill priority sizes="(max-width: 760px) 90vw, 430px" />
          </div>
          <div className="aboutImageBadge"><strong>BUILDING TRUST</strong><span>THROUGH BUSINESS &amp; SERVICE</span></div>
        </div>
      </section>

      <section className="aboutStatement">
        <div className="pageShell aboutStatementInner">
          <span className="statementMark">“</span>
          <div><span className="sectionKicker">OUR SIMPLE PRINCIPLE</span><h2>If you have something you no longer want, help us help you find someone who does.</h2></div>
        </div>
      </section>

      <section className="aboutSection pageShell">
        <div className="aboutSectionHeader"><span className="sectionKicker">WHAT WE DO</span><h2>A practical marketplace for <span>real-life transitions.</span></h2><p>People sell for many reasons. Hollyway gives those reasons a clear route to a potential buyer while keeping communication, verification and transaction steps visible.</p></div>
        <div className="aboutPillars">
          <article><span>01</span><h3>Quick sales</h3><p>Make legitimate unwanted items, household goods, vehicles, appliances and business assets visible to buyers across Nigeria.</p></article>
          <article><span>02</span><h3>Buyer requests</h3><p>When a buyer cannot find a specific item, a reviewed and coded wanted request helps matching sellers respond.</p></article>
          <article><span>03</span><h3>Transaction support</h3><p>Hollyway coordinates marketplace communication, escrow facilitation, delivery confirmation and buyer inspection.</p></article>
        </div>
      </section>

      <section className="aboutLeadership">
        <div className="pageShell leadershipGrid">
          <div><span className="sectionKicker">LEADERSHIP</span><h2>Olumide Joseph Olatunji</h2><p className="leadershipRole">Chief Executive Officer · Aviation professional · Business leader</p><p>Olumide Joseph Olatunji leads Hollyway Global Investment Int&apos;l Ltd. with an aviation-informed focus on precision, responsibility and reliable processes. His work across aviation and business shapes Hollyway&apos;s practical approach to documentation, coordination, customer trust and service delivery.</p><p>Under his leadership, Hollyway is building a Nigerian commerce ecosystem that brings together decluttering sellers, distress sellers, relocating families, importers, businesses and smart buyers.</p><div className="leadershipFacts"><span><b>2019</b>Incorporated</span><span><b>RC 1611033</b>CAC registration</span><span><b>Nigeria</b>Nationwide focus</span></div></div>
          <div className="leadershipQuote"><span>AVIATION MINDSET</span><strong>Precision. Coordination. Accountability.</strong><p>Those principles guide how Hollyway communicates listings, coordinates logistics and supports safer transactions.</p></div>
        </div>
      </section>

      <section className="aboutSection pageShell companyDetails"><div className="aboutSectionHeader"><span className="sectionKicker">COMPANY PROFILE</span><h2>Hollyway Global Investment <span>Int&apos;l Ltd.</span></h2></div><div className="companyDetailsGrid"><div><span>Registered company</span><b>HOLLYWAY GLOBAL INVESTMENT INT&apos;L LTD</b></div><div><span>CAC registration</span><b>RC 1611033</b></div><div><span>Entity type</span><b>Private company limited by shares</b></div><div><span>Registered in</span><b>Lagos State, Nigeria</b></div></div><p className="companyDisclaimer">Hollyway acts as a marketplace manager and escrow facilitator. It does not manufacture, own or store third-party goods listed by sellers. Buyers should verify specifications, condition, delivery arrangements and official payment instructions before proceeding.</p></section>

      <section className="aboutCta"><div className="pageShell aboutCtaInner"><div><span className="sectionKicker">CONNECT WITH HOLLYWAY</span><h2>Buy with confidence.<br /><em>Sell with confidence.</em></h2></div><a className="button buttonPrimary" href={whatsappGroup} target="_blank" rel="noreferrer">Join the WhatsApp marketplace <span>↗</span></a></div></section>

      <footer className="aboutFooter"><div className="pageShell"><a href="/">← Return to Hollyway Global Quick Sales</a><span>© 2026 Hollyway Global Investment Int&apos;l Ltd. · CAC RC 1611033</span></div></footer>
    </main>
  );
}
