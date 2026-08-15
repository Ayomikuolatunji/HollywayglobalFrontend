"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";

const whatsappGroup = "https://chat.whatsapp.com/Ij8dR9bkwppHQq77srTSqx";
const whatsappChannel = "https://whatsapp.com/channel/0029VbDn9GO30LKWJNk81P2M";
const adminWhatsApp = `https://wa.me/2347015585967?text=${encodeURIComponent("Hello Hollyway Admin, I would like to make an enquiry.")}`;
const sellWhatsApp = `https://wa.me/2347015585967?text=${encodeURIComponent("Hello Hollyway Admin, I want to sell an item.")}`;
const wantedWhatsApp = `https://wa.me/2347015585967?text=${encodeURIComponent("Hello Hollyway Admin, I want to post a wanted item request.")}`;
const contactEmail = "contact@hollywayglobal.com";
const audienceRelayBaseUrl = (process.env.NEXT_PUBLIC_AUDIENCE_RELAY_BASE_URL || "https://audiencerelay.com").replace(/\/$/, "");
const audienceRelayTokens = {
  contact: process.env.NEXT_PUBLIC_AUDIENCE_RELAY_CONTACT_FORM_TOKEN || "",
  newsletter: process.env.NEXT_PUBLIC_AUDIENCE_RELAY_NEWSLETTER_FORM_TOKEN || "",
};

const navLinks = [["Home", "/"], ["How it works", "#how"], ["Categories", "#categories"], ["Fees & requests", "#pricing"], ["Logistics", "#logistics"], ["About us", "/about"], ["Testimonials", "/testimonials"], ["Contact", "#contact"]];
const categories = [
  ["🚗", "Vehicles", "Cars, motorcycles, generators and machinery"],
  ["📺", "Electronics", "TVs, phones, laptops, cameras and gadgets"],
  ["🛋️", "Furniture", "Sofas, beds, wardrobes and office furniture"],
  ["🍳", "Home & kitchen", "Cookers, appliances, utensils and essentials"],
  ["📦", "Business stock", "Imported goods, excess stock and wholesale lots"],
  ["👗", "Lifestyle", "Fashion, beauty, toys, gym gear and luggage"],
];
const steps = [
  ["01", "Tell us what you have", "List an item for free or send a wanted request for ₦200."],
  ["02", "Reach the right people", "We share your listing or request across our marketplace channels."],
  ["03", "Connect with confidence", "Interested buyers and sellers contact each other directly."],
  ["04", "Complete the transaction", "Use Hollyway escrow protection for a safer, clearer transaction."],
];
const benefits = [
  ["FREE", "Free item listings", "Put your unwanted items in front of potential buyers without a listing fee."],
  ["36", "Nationwide reach", "Connect with buyers and sellers across all 36 states and the FCT."],
  ["SAFE", "Safer transactions", "Escrow, inspection and tracked delivery support a more confident purchase."],
  ["FAST", "Built for speed", "A practical marketplace for relocation, distress sales and quick liquidation."],
];
const channels = [
  ["WA", "WhatsApp marketplace", "Join the trading community", whatsappGroup, "green"],
  ["WA", "WhatsApp channel", "Follow new updates", whatsappChannel, "green"],
  ["IG", "Instagram", "@hollywayglobal", "https://www.instagram.com/hollywayglobal/", "pink"],
  ["X", "X", "@hollywayglobal", "https://x.com/hollywayglobal", "dark"],
  ["f", "Facebook", "Hollyway Global", "https://www.facebook.com/Hollywayglobal/", "blue"],
  ["in", "LinkedIn", "Hollyway Global", "https://www.linkedin.com/in/hollyway-global/", "linkedin"],
  ["tiktok", "TikTok", "@hollywayglobal", "https://www.tiktok.com/@hollywayglobal", "dark"],
  ["group", "Facebook group", "Open community marketplace", "https://www.facebook.com/groups/hollywayglobal", "blue"],
];

const audiences = [
  ["DECLUTTER SELLERS", "Clear your home, store or office", "Furniture, electronics, appliances, clothing and household goods can reach buyers instead of sitting unused."],
  ["DISTRESS SELLERS", "Convert assets into cash", "When you need liquidity quickly, list legitimate personal or business assets and connect with interested buyers."],
  ["RELOCATION SELLERS", "Move lighter and faster", "Relocating within Nigeria or abroad? Sell bulky items before you move and reduce the cost of clearing out."],
  ["IMPORTERS & WHOLESALERS", "Move excess stock", "Give imported goods, container lots, clearance pallets and overstock direct access to Nigerian buyers and resellers."],
  ["PROPERTY & ESTATE CLEARANCE", "Clear spaces responsibly", "Apartments, offices, warehouses and family properties can be cleared through one organised marketplace."],
  ["SMART BUYERS", "Find quality at better value", "Search for tested used items, relocation deals, distress sales and products matched to your budget."],
];

const requestPoints = ["Exact item, brand and model", "Target budget in Nigerian Naira", "Delivery city and state", "Condition: new, Tokunbo or fairly used", "Quantity required", "Reachable phone number"];
const logistics = [
  ["Same-day & local", "Fez Delivery, Kwik, Bolt, inDrive and Uber Delivery"],
  ["Dedicated bulk cargo", "Mr. Gbenga minibus service for large furniture, appliances and whole-house moves"],
  ["Nationwide waybill", "GIG Logistics, Fez Delivery, Red Star Express, CourierPlus and Deluxe Express"],
  ["High-value & cross-border", "DHL, FedEx and AfricanIES for specialised freight from the USA and China"],
];
const feeRows = [["₦1,000–₦10,000", "₦150–₦550"], ["₦10,001–₦50,000", "₦1,100"], ["₦50,001–₦100,000", "₦2,200"], ["₦100,001–₦500,000", "₦3,300"], ["₦500,001–₦1,000,000", "₦10,500"], ["Above ₦1,000,000", "1% of item value"]];

function Brand({ footer = false }: { footer?: boolean }) {
  return <Link href="/" className={footer ? "brand brandFooter" : "brand"} aria-label="Hollyway Global home"><span className="brandMark" aria-hidden="true"><Image src="/brand-logo.png" alt="" width={80} height={80} priority={!footer} /></span><span className="brandName"><strong>HOLLYWAY</strong><small>GLOBAL</small></span></Link>;
}
function SocialIcon({ name }: { name: string }) {
  if (name === "whatsapp") return <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.4 14.55L2.2 21.8l5.2-1.36A9.8 9.8 0 1 0 12 2.2Zm0 17.65a8 8 0 0 1-4.08-1.12l-.3-.18-3.08.8.82-3-.2-.31A8.03 8.03 0 1 1 12 19.85Zm4.4-5.98c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" /></svg>;
  if (name === "instagram") return <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" /></svg>;
  if (name === "x") return <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4 19 20M19 4 5 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>;
  if (name === "facebook") return <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.6 21v-8h2.7l.4-3h-3.1V8.1c0-.87.24-1.46 1.5-1.46h1.7V4a22 22 0 0 0-2.48-.13c-2.46 0-4.14 1.5-4.14 4.25V10H7.4v3h2.78v8h3.42Z" /></svg>;
  if (name === "tiktok") return <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.4 3c.2 1.65 1.12 2.9 2.6 3.55v2.6a7.3 7.3 0 0 1-2.58-.8v5.3A5.35 5.35 0 1 1 10.8 8.3v2.72a2.7 2.7 0 1 0 2 2.63V3h2.6Z" /></svg>;
  if (name === "group") return <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="9" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="16.5" cy="10" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M3.5 18c.5-2.5 2.2-3.8 5.5-3.8s5 1.3 5.5 3.8M14 14.7c2.8-.3 4.7.8 5.3 3.3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  return <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 4.5A1.5 1.5 0 1 1 5 7.5 1.5 1.5 0 0 1 5 4.5ZM3.7 9h2.6v11H3.7V9Zm4.2 0h2.5v1.5h.04c.35-.67 1.2-1.74 3-1.74 3.2 0 3.8 2.1 3.8 4.83V20h-2.6v-5.7c0-1.36-.02-3.1-1.9-3.1-1.9 0-2.2 1.48-2.2 3V20H7.9V9Z" /></svg>;
}
function Arrow() { return <span className="arrowIcon" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>; }
function ThemeIcon({ dark }: { dark: boolean }) {
  return dark ? <svg className="themeSvg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> : <svg className="themeSvg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.7 15.3A8.5 8.5 0 0 1 8.7 3.3 8.5 8.5 0 1 0 20.7 15.3Z" /></svg>;
}

export default function Home() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("hollyway-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setDarkMode(shouldUseDark);
    document.documentElement.dataset.theme = shouldUseDark ? "dark" : "light";
  }, []);

  function toggleTheme() {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    document.documentElement.dataset.theme = nextTheme ? "dark" : "light";
    window.localStorage.setItem("hollyway-theme", nextTheme ? "dark" : "light");
  }

  async function submitToAudienceRelay(type: "contact" | "newsletter", data: Record<string, string | boolean>) {
    const token = audienceRelayTokens[type];
    if (!token) throw new Error("AudienceRelay form token is not configured");
    const response = await fetch(`${audienceRelayBaseUrl}/api/v1/forms/${encodeURIComponent(token)}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("AudienceRelay submission failed");
  }

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const topic = String(formData.get("topic") || "General enquiry");
    const message = String(formData.get("message") || "");
    setContactStatus("sending");
    try {
      await submitToAudienceRelay("contact", { name, email, topic, message });
      form.reset();
      setContactStatus("sent");
    } catch {
      setContactStatus("error");
    }
  }

  async function handleSubscribeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("subscriberEmail") || "");
    const marketingConsent = formData.get("marketingConsent") === "yes";
    setSubscribeStatus("sending");
    try {
      await submitToAudienceRelay("newsletter", { email, marketing_consent: marketingConsent });
      form.reset();
      setSubscribeStatus("sent");
    } catch {
      setSubscribeStatus("error");
    }
  }

  return <main>
    <header className="nav"><div className="navInner"><Brand /><button className="menuButton" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}><span></span><span></span><span></span></button><nav className={menuOpen ? "navLinks open" : "navLinks"}>{navLinks.map(([label, href]) => { const target = href.startsWith("#") && pathname !== "/" ? `/${href}` : href; const active = href === "/" ? pathname === "/" : href.startsWith("/") && pathname === href; return <Link href={target} className={active ? "active" : undefined} key={href} onClick={() => setMenuOpen(false)}>{label}</Link>; })}</nav><div className="navActions"><button className="themeToggle" onClick={toggleTheme} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"} title={darkMode ? "Switch to light mode" : "Switch to dark mode"}><ThemeIcon dark={darkMode} /></button><a className="navCta" href={adminWhatsApp} target="_blank" rel="noreferrer"><SocialIcon name="whatsapp" /> Chat with admin <Arrow /></a></div></div></header>

    <section id="home" className="hero"><div className="heroBackdrop"></div><div className="pageShell heroGrid"><div className="heroCopy"><div className="eyebrow"><span className="pulse"></span> NIGERIA&apos;S QUICK-SALES MARKETPLACE</div><h1>Turn what you no longer want into <em>quick cash.</em></h1><p className="heroLead">Sell unwanted items in Nigeria for free, clear furniture and electronics, move relocation goods, liquidate distress-sale assets or reach buyers for excess imported stock.</p><div className="heroActions"><a className="button buttonPrimary" href={sellWhatsApp} target="_blank" rel="noreferrer">Sell an item free <Arrow /></a><a className="button buttonGhost" href="#contact">Talk to Hollyway <Arrow /></a></div><div className="heroNote"><span>✓</span> Free listings <i></i><span>✓</span> Nationwide reach <i></i><span>✓</span> Safer transactions</div></div><div className="heroPanel" aria-label="Ways to use Hollyway Global"><div className="heroPanelTop"><span>BUY · SELL · CONNECT</span><b>01</b></div><div className="heroPanelTitle">One marketplace.<br /><strong>Many ways to move forward.</strong></div><div className="heroObjects"><span className="object objectCar">🚙</span><span className="object objectPhone">📱</span><span className="object objectSofa">🛋️</span><span className="object objectBox">📦</span></div><div className="heroPanelBottom"><span>Sell what you have</span><span>Find what you need <Arrow /></span></div></div></div><div className="heroQuickLinks pageShell"><a className="whatsappQuickLink" href={adminWhatsApp} target="_blank" rel="noreferrer"><span className="quickIcon green"><SocialIcon name="whatsapp" /></span><span><b>Chat with admin</b><small>Sell or ask for help</small></span><Arrow /></a><a className="whatsappQuickLink" href={whatsappChannel} target="_blank" rel="noreferrer"><span className="quickIcon green"><SocialIcon name="whatsapp" /></span><span><b>WhatsApp channel</b><small>Follow new updates</small></span><Arrow /></a><a href={wantedWhatsApp} target="_blank" rel="noreferrer"><span className="quickIcon orange">⌕</span><span><b>Post a wanted request</b><small>Message admin · ₦200</small></span><Arrow /></a></div></section>

    <section id="categories" className="section pageShell"><div className="sectionHeader"><div><span className="sectionKicker">SHOP · SELL · DISCOVER</span><h2>Everything has a <span>next buyer.</span></h2></div><p>From a single household item to a container of imported stock, Hollyway helps you put it in front of the right audience.</p></div><div className="categoryGrid">{categories.map(([icon, title, text]) => <a className="categoryCard" href="#sell" key={title}><span className="categoryIcon">{icon}</span><strong>{title}</strong><small>{text}</small><span className="cardLink">Explore <Arrow /></span></a>)}</div></section>

    <section id="how" className="section processSection"><div className="pageShell"><div className="sectionHeader lightHeader"><div><span className="sectionKicker">A SIMPLE WAY TO MOVE ITEMS</span><h2>From listing to <span>done.</span></h2></div><p>Whether you are selling or searching, every step is designed to stay clear and practical.</p></div><div className="processGrid">{steps.map(([number, title, text], index) => <div className="processCard" key={number}><div className="processNumber">{number}</div><div className={`processIcon processIcon${index + 1}`}>{index === 0 ? "＋" : index === 1 ? "◈" : index === 2 ? "↔" : "✓"}</div><h3>{title}</h3><p>{text}</p>{index < steps.length - 1 && <span className="processArrow">→</span>}</div>)}</div></div></section>

    <section id="why" className="section pageShell whySection"><div className="sectionHeader"><div><span className="sectionKicker">WHY HOLLYWAY GLOBAL</span><h2>Built around real <span>people and real needs.</span></h2></div><p>Decluttering, relocating, raising urgent cash or looking for a deal should not feel complicated.</p></div><div className="benefitGrid">{benefits.map(([tag, title, text]) => <article className="benefitCard" key={title}><span className="benefitTag">{tag}</span><h3>{title}</h3><p>{text}</p></article>)}</div><div id="wanted" className="audienceRow"><div><span>SELLERS</span><b>Have something taking up space?</b><p>List your furniture, electronics, vehicles, appliances, fashion or stock for free.</p><a href={sellWhatsApp} target="_blank" rel="noreferrer">Chat with admin to sell <Arrow /></a></div><div><span>BUYERS</span><b>Looking for something specific?</b><p>Send a wanted request and let potential sellers know exactly what you need.</p><a href={wantedWhatsApp} target="_blank" rel="noreferrer">Message admin to request <Arrow /></a></div></div></section>

    <section className="section audienceSection pageShell"><div className="sectionHeader"><div><span className="sectionKicker">MADE FOR MORE THAN ONE SITUATION</span><h2>One platform for <span>every kind of quick sale.</span></h2></div><p>Hollyway Global brings together the people who need to sell quickly and the people searching for value.</p></div><div className="audienceGrid">{audiences.map(([label, title, text], index) => <article className={`audienceCard audienceCard${index + 1}`} key={label}><span>{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section id="pricing" className="section pricingSection"><div className="pageShell"><div className="sectionHeader"><div><span className="sectionKicker">WANTED ITEM REQUESTS</span><h2>Tell us what you want. <span>We broadcast it.</span></h2></div><p>A wanted request is reviewed, assigned a tracking code and shared across Hollyway channels so matching sellers can respond.</p></div><div className="pricingLayout"><div className="requestSteps"><div className="requestFee"><strong>₦200</strong><span>per request · active for 7 days</span><b>Renew for ₦100 if you need another 7 days</b></div><div className="requestFlow"><div><b>01</b><span>Submit details</span></div><div><b>02</b><span>Pay ₦200</span></div><div><b>03</b><span>Review & code</span></div><div><b>04</b><span>Broadcast</span></div><div><b>05</b><span>Seller response</span></div><div><b>06</b><span>Match & escrow</span></div></div><p className="notice"><strong>Important:</strong> the ₦200 covers review, coding and broadcast. It does not guarantee that a seller will have the item or accept your budget. If you complete the purchase through Hollyway Escrow, the request fee is deducted from your final escrow fee.</p></div><div className="requestFormat"><h3>What to include</h3><ol>{requestPoints.map((point, index) => <li key={point}><b>{index + 1}</b>{point}</li>)}</ol><a className="button buttonPrimary" href={wantedWhatsApp} target="_blank" rel="noreferrer">Message admin to post <Arrow /></a></div></div></div></section>

    <section id="logistics" className="section logisticsSection pageShell"><div className="sectionHeader"><div><span className="sectionKicker">LOGISTICS & ESCROW</span><h2>Move items with a <span>clearer process.</span></h2></div><p>Delivery fees are confirmed before dispatch. Buyers provide a reachable phone number, inspect the item on arrival, and funds are released after confirmation.</p></div><div className="logisticsGrid">{logistics.map(([title, providers], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{providers}</p></article>)}</div><div className="escrowBanner"><div><b>Hollyway Escrow</b><span>Submit → Verify & code → Pay securely → Tracked dispatch → Inspect → Seller payout</span></div><a href="#contact">Ask about a transaction <Arrow /></a></div><div className="policyNotes"><div><b>Delivery funds upfront</b><span>Dispatch fees are paid before shipping so approved riders and carriers are not stranded.</span></div><div><b>Approved dispatch only</b><span>Uncoordinated private meetups are at the parties&apos; own risk and are not monitored by Hollyway.</span></div><div><b>Inspect before confirmation</b><span>Check the item, specifications and condition during the agreed inspection window.</span></div></div></section>

    <section className="section feesSection pageShell"><div className="sectionHeader"><div><span className="sectionKicker">TRANSPARENT FEES</span><h2>Know the cost before you <span>commit.</span></h2></div><p>Standard marketplace listings are free. Escrow facilitation follows the transaction value schedule below.</p></div><div className="feesLayout"><div className="feeTable"><div className="feeTableHead"><span>Item value</span><span>Escrow fee</span></div>{feeRows.map(([value, fee]) => <div className="feeTableRow" key={value}><span>{value}</span><b>{fee}</b></div>)}</div><div className="serviceFees"><h3>Service fees</h3><div><span>Standard item listing</span><b>FREE</b></div><div><span>Wanted request · 7 days</span><b>₦200</b></div><div><span>Wanted request renewal · 7 days</span><b>₦100</b></div><div><span>Featured promotion</span><b>Quoted by platform</b></div><small>Fees, carriers and delivery arrangements should be confirmed with Hollyway Admin before payment.</small></div></div></section>

    <section id="sell" className="sellCta"><div className="pageShell sellCtaInner"><div><span className="sectionKicker">READY WHEN YOU ARE</span><h2>Give your unused items<br />a <em>new home.</em></h2><p>Start with a free listing or speak with our team about your sale.</p></div><div className="ctaActions"><a className="button buttonPrimary" href={sellWhatsApp} target="_blank" rel="noreferrer">Chat with admin to sell <Arrow /></a><a className="button buttonLight" href="#contact">Contact our team <Arrow /></a></div></div></section>

    <section id="channels" className="section pageShell channelsSection"><div className="sectionHeader"><div><span className="sectionKicker">STAY IN THE LOOP</span><h2>Start with <span>WhatsApp.</span></h2></div><p>Our WhatsApp marketplace is where buyers and sellers connect. Follow the channel for updates, then find us across our official social platforms.</p></div><div className="channelGrid">{channels.map(([icon, title, text, href, tone], index) => <a className={`channelCard ${index < 2 ? "whatsappChannelCard" : ""}`} href={href} target="_blank" rel="noreferrer" key={title}><span className={`channelIcon ${tone}`}><SocialIcon name={icon === "WA" ? "whatsapp" : icon === "IG" ? "instagram" : icon === "X" ? "x" : icon === "f" ? "facebook" : icon === "tiktok" ? "tiktok" : icon === "group" ? "group" : "linkedin"} /></span><span><b>{title}</b><small>{text}</small></span><Arrow /></a>)}</div></section>

    <section className="subscribeSection"><div className="pageShell subscribeInner"><div><span className="sectionKicker">NEWS &amp; INFORMATION</span><h2>Stay close to the <em>next opportunity.</em></h2><p>Subscribe for Hollyway marketplace updates, new listings, buyer requests and practical buying or selling information.</p></div><div className="subscribeFormCard"><form onSubmit={handleSubscribeSubmit}><label htmlFor="subscriberEmail">Email address</label><div className="subscribeFormRow"><input id="subscriberEmail" name="subscriberEmail" type="email" placeholder="you@example.com" autoComplete="email" required /><button className="button buttonPrimary" type="submit" disabled={subscribeStatus === "sending"}>{subscribeStatus === "sending" ? "Subscribing…" : <>Subscribe <Arrow /></>}</button></div><label className="consentCheck"><input name="marketingConsent" type="checkbox" value="yes" required /> <span>I agree to receive Hollyway email updates and can unsubscribe later.</span></label><small>For instant updates, <a href={whatsappChannel} target="_blank" rel="noreferrer">follow our WhatsApp channel</a>.</small>{subscribeStatus === "sent" && <p className="formStatus success" role="status">You are subscribed. Welcome to Hollyway updates.</p>}{subscribeStatus === "error" && <p className="formStatus error" role="alert">We could not subscribe you right now. Please try again.</p>}</form></div></div></section>

    <section className="trustStrip"><div className="pageShell trustInner"><div><span>🇳🇬</span><b>Nationwide coverage</b><small>All 36 states + FCT</small></div><div><span>🛡️</span><b>Safer transactions</b><small>Escrow, inspection and delivery support</small></div><div><span>⚡</span><b>Fast support</b><small>Monday–Saturday, 8AM–9PM WAT</small></div></div></section>

    <section id="contact" className="contactSection pageShell"><div className="contactIntro"><span className="sectionKicker">WE ARE HERE TO HELP</span><h2>Let&apos;s talk about your <span>buying or selling goal.</span></h2><p>Business actions go directly to the Hollyway Admin WhatsApp DM. Use email for general contact, support and formal enquiries.</p><div className="contactDetails"><a className="contactDetail" href={`mailto:${contactEmail}`}><span>✉</span><div><b>Email support</b><small>{contactEmail}</small></div></a><a className="contactDetail" href={adminWhatsApp} target="_blank" rel="noreferrer"><span><SocialIcon name="whatsapp" /></span><div><b>Admin WhatsApp DM</b><small>+234 701 558 5967</small></div></a><a className="contactDetail" href="tel:+2347015585967"><span>☎</span><div><b>Phone support</b><small>+234 701 558 5967</small></div></a><div className="contactDetail"><span>⌚</span><div><b>Support hours</b><small>Mon–Sat, 8AM–9PM WAT</small></div></div></div><div className="contactSocials"><span>Follow Hollyway</span><a href="https://www.instagram.com/hollywayglobal/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.tiktok.com/@hollywayglobal" target="_blank" rel="noreferrer">TikTok</a><a href="https://x.com/hollywayglobal" target="_blank" rel="noreferrer">X</a><a href="https://www.facebook.com/Hollywayglobal/" target="_blank" rel="noreferrer">Facebook</a></div></div><div className="contactFormCard"><div className="formHeading"><h3>Send us a message</h3><p>Tell us what you need and we&apos;ll help you find the right next step.</p></div><form onSubmit={handleContactSubmit}><div className="formRow"><label>Name<input name="name" type="text" placeholder="Your name" required /></label><label>Email<input name="email" type="email" placeholder="you@example.com" required /></label></div><label>What can we help with?<select name="topic" defaultValue="General enquiry"><option>General enquiry</option><option>Company information</option><option>Support or dispute</option><option>Partnership</option><option>Business enquiry</option></select></label><label>Message<textarea name="message" rows={4} placeholder="How can Hollyway help?" required /></label><button className="button buttonPrimary" type="submit" disabled={contactStatus === "sending"}>{contactStatus === "sending" ? "Sending…" : <>Send message <Arrow /></>}</button><small className="formNote">Your message is sent securely to Hollyway.</small>{contactStatus === "sent" && <p className="formStatus success" role="status">Your message was sent. Our team will respond soon.</p>}{contactStatus === "error" && <p className="formStatus error" role="alert">We could not send your message. Please try again or email us directly.</p>}</form></div></section>

    <footer className="footer"><div className="pageShell footerTop"><div className="footerBrand"><Brand footer /><p>Nigeria&apos;s marketplace for decluttering, distress sales, relocation clearance and quick liquidation.</p><strong>Buy with confidence. Sell with confidence.</strong></div><div><h4>EXPLORE</h4><a href="#home">Home</a><a href="#categories">Categories</a><a href="#how">How it works</a><a href="#why">Why Hollyway</a><a href="/about">About us</a><a href="/testimonials">Testimonials</a></div><div><h4>TAKE ACTION</h4><a href={sellWhatsApp} target="_blank" rel="noreferrer">Chat with admin to sell</a><a href={wantedWhatsApp} target="_blank" rel="noreferrer">Message admin to request</a><a href={whatsappChannel} target="_blank" rel="noreferrer">Follow WhatsApp channel</a><a href="#contact">Contact support</a></div><div><h4>CONTACT</h4><a href={`mailto:${contactEmail}`}>{contactEmail}</a><a href="mailto:support@hollywayglobal.com">support@hollywayglobal.com</a><a href="mailto:hollywayglobal@gmail.com">hollywayglobal@gmail.com</a><span className="footerMeta">Admin WhatsApp: +234 701 558 5967<br />Mon–Sat, 8AM–9PM WAT</span></div></div><div className="pageShell footerBottom"><span>© 2026 Hollyway Global · CAC RC 1611033</span><span>Buy · Sell · Connect · Nationwide</span></div></footer>
  </main>;
}
