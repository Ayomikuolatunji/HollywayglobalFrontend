export type Listing = {
  code: string;
  name: string;
  category: string;
  price: number;
  quantity?: number;
  location: string;
  condition: string;
  date: string;
  views: number;
  mark: string;
  tone: string;
  featured?: boolean;
  market?: string;
  deliveryMethod?: string;
  imageUrl?: string;
  description?: string;
  isOwnedByRequester?: boolean;
  media?: Array<{ id: string; kind: "photo" | "video"; name: string; mime_type: string; byte_size: number; download_path: string }>;
};

export const sellingRoutes = [
  "All selling routes", "Home & office decluttering", "Urgent distress sale", "Relocation / Japa clearance",
  "Importer / container clearance", "Campus & NYSC clearance", "Commercial business clearance", "Full home clearance",
  "Repair, refurbish & resell", "Smart trade-in & upgrade", "Agro products or handmade crafts", "Other item for sale",
];

export const marketCategories = [
  "All markets", "Declutter Market", "Urgent Sale Market", "Relocation / Japa Market", "Importer / Container Market",
  "Campus & NYSC Market", "Business Clearance Market", "Full Home Clearance Market", "Repair, Refurbish & Resell Market",
  "Trade-in & Upgrade Market", "Agro & Crafts Market", "Other Sales Market",
];

export const deliveryMethods = ["All delivery methods", "Dispatch rider", "Interstate waybill", "Logistics company", "Bulk minibus", "Pickup"];
export const categories = [
  "All categories", "Vehicles & machinery", "Home & kitchen appliances", "Household essentials & utensils",
  "Living room & electronics", "Gadgets & computing", "Furniture & interior decor", "Fashion, toys & personal items",
  "Imported clearance & excess stock", "Agro products", "Handmade crafts", "Commercial equipment", "Other",
];
export const conditions = ["All conditions", "Brand New", "Open Box", "Clean Fairly Used", "Foreign Used Tokunbo"];

const marketDisplayNames: Record<string, string> = { "Estate Clearance Market": "Full Home Clearance Market" };
const marketLabels: Record<string, string> = {
  declutter: "Declutter Market", distress: "Urgent Sale Market", relocation: "Relocation / Japa Market",
  importer: "Importer / Container Market", campus: "Campus & NYSC Market", commercial: "Business Clearance Market",
  estate: "Full Home Clearance Market", repair: "Repair, Refurbish & Resell Market", "trade-in": "Trade-in & Upgrade Market",
  "agro-crafts": "Agro & Crafts Market", other: "Other Sales Market",
};
const routeByMarket = Object.fromEntries(Object.entries(marketLabels).map(([route, label]) => [label, route]));

export function getMarketDisplayName(market: string) { return marketDisplayNames[market] || market; }
export function marketSlug(market: string) { return market.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
export function getMarketFromSlug(slug: string) { return marketCategories.find((market) => marketSlug(market) === slug) || null; }
export function getMarketRoute(market: string) { return routeByMarket[market] || ""; }
export function getListingCategory(listing: Pick<Listing, "category">) { return listing.category || "Other"; }
export function getListingMarket(listing: Pick<Listing, "category" | "market"> & { selling_route?: string }) { return listing.market || marketLabels[listing.selling_route || ""] || "Other Sales Market"; }
export function getListingSellingRoute(listing: Pick<Listing, "category" | "market"> & { selling_route?: string }) { return listing.selling_route || getListingMarket(listing); }
export function getListingDeliveryMethod(listing: Pick<Listing, "category" | "deliveryMethod">) { return listing.deliveryMethod || "To be confirmed"; }
export function getListingImageUrl(listing: Pick<Listing, "imageUrl">) { return listing.imageUrl || ""; }
export function getListingsForMarket(items: Listing[], market: string) { return items.filter((listing) => getListingMarket(listing) === market); }
