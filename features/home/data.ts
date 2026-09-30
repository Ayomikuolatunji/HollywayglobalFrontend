import { adminWhatsApp, sellWhatsApp, socialChannels, wantedWhatsApp } from "../../components/config/contact";

export {
  adminPhone,
  adminPhoneHref,
  adminWhatsApp,
  contactEmail,
  facebookGroup,
  facebookPage,
  sellWhatsApp,
  socialChannels,
  supportEmail,
  whatsappChannel,
  whatsappGroup,
  wantedWhatsApp,
} from "../../components/config/contact";

export const audienceRelayBaseUrl = (
  process.env.NEXT_PUBLIC_AUDIENCE_RELAY_BASE_URL || "https://staging.audiencerelay.com"
).replace(/\/$/, "");
export const audienceRelayTokens = {
  contact: process.env.NEXT_PUBLIC_AUDIENCE_RELAY_CONTACT_FORM_TOKEN || "",
  newsletter: process.env.NEXT_PUBLIC_AUDIENCE_RELAY_NEWSLETTER_FORM_TOKEN || "",
};

export const navLinks = [
  ["Home", "/"],
  ["How it works", "#how"],
  ["Categories", "#categories"],
  ["Fees & requests", "#pricing"],
  ["Logistics", "#logistics"],
  ["About us", "/about"],
  ["Testimonials", "/testimonials"],
  ["Contact", "#contact"],
];

export const categories = [
  ["🚗", "Vehicles", "Cars, motorcycles, generators and machinery"],
  ["📺", "Electronics", "TVs, phones, laptops, cameras and gadgets"],
  ["🛋️", "Furniture", "Sofas, beds, wardrobes and office furniture"],
  ["🍳", "Home & kitchen", "Cookers, appliances, utensils and essentials"],
  ["📦", "Business stock", "Imported goods, excess stock and wholesale lots"],
  ["👗", "Lifestyle", "Fashion, beauty, toys, gym gear and luggage"],
];

export const steps = [
  ["01", "Tell us what you have", "List an item for free or send a wanted request for ₦200."],
  [
    "02",
    "Reach the right people",
    "We share your listing or request across our marketplace channels.",
  ],
  ["03", "Connect with confidence", "Interested buyers and sellers contact each other directly."],
  [
    "04",
    "Complete the transaction",
    "Use Hollyway escrow protection for a safer, clearer transaction.",
  ],
];

export const audiences = [
  [
    "DECLUTTER SELLERS",
    "Clear your home, store or office",
    "Furniture, electronics, appliances, clothing and household goods can reach buyers instead of sitting unused.",
  ],
  [
    "DISTRESS SELLERS",
    "Convert assets into cash",
    "When you need liquidity quickly, list legitimate personal or business assets and connect with interested buyers.",
  ],
  [
    "RELOCATION SELLERS",
    "Move lighter and faster",
    "Relocating within Nigeria or abroad? Sell bulky items before you move and reduce the cost of clearing out.",
  ],
  [
    "IMPORTERS & WHOLESALERS",
    "Move excess stock",
    "Give imported goods, container lots, clearance pallets and overstock direct access to Nigerian buyers and resellers.",
  ],
  [
    "FULL HOME CLEARANCE",
    "Clear spaces responsibly",
    "Apartments, offices, warehouses and family properties can be cleared through one organised marketplace.",
  ],
  [
    "SMART BUYERS",
    "Find quality at better value",
    "Search for tested used items, relocation deals, distress sales and products matched to your budget.",
  ],
];

export const requestPoints = [
  "Exact item, brand and model",
  "Target budget in Nigerian Naira",
  "Delivery city and state",
  "Condition: new, Tokunbo or fairly used",
  "Quantity required",
  "Reachable phone number",
];
export const logistics = [
  ["Same-day & local", "Fez Delivery, Kwik, Bolt, inDrive and Uber Delivery"],
  [
    "Dedicated bulk cargo",
    "Mr. Gbenga minibus service for large furniture, appliances and whole-house moves",
  ],
  [
    "Nationwide waybill",
    "GIG Logistics, Fez Delivery, Red Star Express, CourierPlus and Deluxe Express",
  ],
  [
    "High-value & cross-border",
    "DHL, FedEx and AfricanIES for specialised freight from the USA and China",
  ],
];
export const feeRows = [
  ["₦1,000–₦10,000", "₦150–₦550"],
  ["₦10,001–₦50,000", "₦1,100"],
  ["₦50,001–₦100,000", "₦2,200"],
  ["₦100,001–₦500,000", "₦3,300"],
  ["₦500,001–₦1,000,000", "₦10,500"],
  ["Above ₦1,000,000", "1% of item value"],
];

export const channels = socialChannels.map(({ shortIcon, title, detail, href }) => [
  shortIcon,
  title,
  detail,
  href,
] as const);
