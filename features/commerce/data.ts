export type Listing = { code: string; name: string; category: string; price: number; location: string; condition: "Brand New" | "Open Box" | "Clean Fairly Used"; date: string; views: number; mark: string; tone: string; featured?: boolean };

export const sellingRoutes = ["All selling routes", "Home & office decluttering", "Urgent distress sale", "Relocation / Japa clearance", "Importer / container clearance", "Campus & NYSC clearance", "Commercial business clearance", "Estate buyout", "Repair, refurbish & resell", "Smart trade-in & upgrade", "Agro products or handmade crafts", "Other item for sale"];
export const marketCategories = ["All markets", "Declutter Market", "Urgent Sale Market", "Relocation / Japa Market", "Importer / Container Market", "Campus & NYSC Market", "Business Clearance Market", "Estate Clearance Market", "Repair, Refurbish & Resell Market", "Trade-in & Upgrade Market", "Agro & Crafts Market", "Other Sales Market"];
export const deliveryMethods = ["All delivery methods", "Dispatch rider", "Interstate waybill", "Logistics company", "Bulk minibus", "Pickup"];

const marketDisplayNames: Record<string, string> = {
  "Estate Clearance Market": "Full Home Clearance Market",
};

export function getMarketDisplayName(market: string) {
  return marketDisplayNames[market] || market;
}

export function marketSlug(market: string) {
  return market.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getMarketFromSlug(slug: string) {
  return marketCategories.find((market) => marketSlug(market) === slug) || null;
}

const categoryLabels: Record<string, string> = {
  Electronics: "Living room & electronics",
  Furniture: "Furniture & interior decor",
  Appliances: "Home & kitchen appliances",
  Vehicles: "Vehicles & machinery",
  Gadgets: "Gadgets & computing",
  Fashion: "Fashion, toys & personal items",
  Machinery: "Vehicles & machinery",
  "Imported Goods": "Imported clearance & excess stock",
  Agro: "Agro products",
  Crafts: "Handmade crafts",
  "Commercial Equipment": "Commercial equipment",
};

export function getListingCategory(listing: Pick<Listing, "category">) {
  return categoryLabels[listing.category] || listing.category;
}

export function getListingSellingRoute(listing: Pick<Listing, "category">) {
  const category = getListingCategory(listing);
  if (category === "Imported clearance & excess stock") return "Importer / container clearance";
  if (category === "Commercial equipment") return "Commercial business clearance";
  if (category === "Agro products" || category === "Handmade crafts") return "Agro products or handmade crafts";
  return "Home & office decluttering";
}

const marketLabels: Record<string, string> = {
  "Home & office decluttering": "Declutter Market",
  "Urgent distress sale": "Urgent Sale Market",
  "Relocation / Japa clearance": "Relocation / Japa Market",
  "Importer / container clearance": "Importer / Container Market",
  "Campus & NYSC clearance": "Campus & NYSC Market",
  "Commercial business clearance": "Business Clearance Market",
  "Estate buyout": "Estate Clearance Market",
  "Repair, refurbish & resell": "Repair, Refurbish & Resell Market",
  "Smart trade-in & upgrade": "Trade-in & Upgrade Market",
  "Agro products or handmade crafts": "Agro & Crafts Market",
  "Other item for sale": "Other Sales Market",
};

const localMarketByCode: Record<string, string> = {
  "HWG-0096": "Urgent Sale Market",
  "HWG-0084": "Relocation / Japa Market",
  "HWG-0088": "Campus & NYSC Market",
  "HWG-0078": "Campus & NYSC Market",
  "HWG-0036": "Campus & NYSC Market",
  "HWG-0101": "Estate Clearance Market",
  "HWG-0086": "Estate Clearance Market",
  "HWG-0054": "Trade-in & Upgrade Market",
  "HWG-0039": "Repair, Refurbish & Resell Market",
};

export function getListingMarket(listing: Pick<Listing, "code" | "category">) {
  if (localMarketByCode[listing.code]) return localMarketByCode[listing.code];
  return marketLabels[getListingSellingRoute(listing)] || "Other Sales Market";
}

export function getListingDeliveryMethod(listing: Pick<Listing, "category">) {
  const category = getListingCategory(listing);
  if (category === "Vehicles & machinery" || category === "Furniture & interior decor") return "Pickup";
  if (category === "Imported clearance & excess stock" || category === "Commercial equipment") return "Logistics company";
  if (category === "Agro products") return "Interstate waybill";
  return "Dispatch rider";
}

const listingImageTerms: Record<string, string> = {
  Electronics: "television,electronics",
  Furniture: "furniture,interior",
  Appliances: "home,appliance",
  Vehicles: "car,vehicle",
  Gadgets: "computer,smartphone",
  Fashion: "fashion,clothing",
  Machinery: "industrial,machinery",
  "Imported Goods": "warehouse,goods",
  Agro: "agriculture,produce",
  Crafts: "handmade,craft",
  "Commercial Equipment": "office,equipment",
};

export function getListingImageUrl(listing: Pick<Listing, "category" | "code">) {
  const terms = listingImageTerms[listing.category] || "marketplace,product";
  const lock = listing.code.replace(/\D/g, "") || "1";
  return `https://loremflickr.com/640/480/${terms}/all?lock=${lock}`;
}

export const listings: Listing[] = [
  { code: "HWG-0102", name: "Samsung 55-inch Smart TV", category: "Electronics", price: 485000, location: "Lekki, Lagos", condition: "Clean Fairly Used", date: "Today", views: 184, mark: "TV", tone: "from-[#2364ae] to-[#122f62]", featured: true },
  { code: "HWG-0101", name: "L-shaped family sofa set", category: "Furniture", price: 320000, location: "Ikeja, Lagos", condition: "Clean Fairly Used", date: "Yesterday", views: 142, mark: "SOFA", tone: "from-[#ead7bb] to-[#c99e6d]" , featured: true },
  { code: "HWG-0098", name: "Imported kitchen appliance lot", category: "Imported Goods", price: 780000, location: "Onitsha, Anambra", condition: "Brand New", date: "2 days ago", views: 226, mark: "LOT", tone: "from-[#eb7620] to-[#a64118]", featured: true },
  { code: "HWG-0096", name: "Honda Accord 2012", category: "Vehicles", price: 8500000, location: "Abuja, FCT", condition: "Clean Fairly Used", date: "3 days ago", views: 318, mark: "CAR", tone: "from-[#173d75] to-[#081a38]" },
  { code: "HWG-0093", name: "Executive office desk and chair", category: "Commercial Equipment", price: 185000, location: "Yaba, Lagos", condition: "Open Box", date: "4 days ago", views: 96, mark: "DESK", tone: "from-[#7d5ab8] to-[#372064]" },
  { code: "HWG-0090", name: "Chest freezer, 220 litres", category: "Appliances", price: 265000, location: "Ibadan, Oyo", condition: "Clean Fairly Used", date: "5 days ago", views: 117, mark: "FREEZER", tone: "from-[#318e75] to-[#135348]" },
  { code: "HWG-0088", name: "MacBook Pro M2 14-inch", category: "Gadgets", price: 1850000, location: "Victoria Island, Lagos", condition: "Open Box", date: "6 days ago", views: 271, mark: "MAC", tone: "from-[#64748b] to-[#1e293b]" },
  { code: "HWG-0086", name: "Modern six-seater dining set", category: "Furniture", price: 410000, location: "Gwarinpa, Abuja", condition: "Brand New", date: "1 week ago", views: 133, mark: "DINING", tone: "from-[#c08457] to-[#713f12]" },
  { code: "HWG-0084", name: "Toyota Corolla 2015", category: "Vehicles", price: 11200000, location: "Port Harcourt, Rivers", condition: "Clean Fairly Used", date: "1 week ago", views: 402, mark: "AUTO", tone: "from-[#0f766e] to-[#042f2e]" },
  { code: "HWG-0081", name: "Industrial sewing machine", category: "Machinery", price: 620000, location: "Aba, Abia", condition: "Clean Fairly Used", date: "8 days ago", views: 88, mark: "SEW", tone: "from-[#be123c] to-[#4c0519]" },
  { code: "HWG-0078", name: "Premium native senator outfit", category: "Fashion", price: 145000, location: "Surulere, Lagos", condition: "Brand New", date: "9 days ago", views: 151, mark: "STYLE", tone: "from-[#a855f7] to-[#581c87]" },
  { code: "HWG-0075", name: "Solar inverter and battery package", category: "Machinery", price: 980000, location: "Kaduna, Kaduna", condition: "Brand New", date: "10 days ago", views: 219, mark: "SOLAR", tone: "from-[#eab308] to-[#854d0e]", featured: true },
  { code: "HWG-0072", name: "Locally woven raffia baskets", category: "Crafts", price: 68000, location: "Benin City, Edo", condition: "Brand New", date: "11 days ago", views: 64, mark: "CRAFT", tone: "from-[#d97706] to-[#78350f]" },
  { code: "HWG-0069", name: "Dried beans bulk supply", category: "Agro", price: 375000, location: "Minna, Niger", condition: "Brand New", date: "12 days ago", views: 174, mark: "AGRO", tone: "from-[#65a30d] to-[#365314]" },
  { code: "HWG-0066", name: "Double-door refrigerator", category: "Appliances", price: 540000, location: "Calabar, Cross River", condition: "Open Box", date: "13 days ago", views: 109, mark: "FRIDGE", tone: "from-[#0891b2] to-[#164e63]" },
  { code: "HWG-0063", name: "Wireless sound system", category: "Electronics", price: 235000, location: "Enugu, Enugu", condition: "Brand New", date: "2 weeks ago", views: 143, mark: "SOUND", tone: "from-[#4f46e5] to-[#312e81]" },
  { code: "HWG-0060", name: "Commercial popcorn machine", category: "Commercial Equipment", price: 295000, location: "Osogbo, Osun", condition: "Open Box", date: "2 weeks ago", views: 73, mark: "POP", tone: "from-[#f97316] to-[#7c2d12]" },
  { code: "HWG-0057", name: "Imported children’s bicycles", category: "Imported Goods", price: 460000, location: "Lagos Island, Lagos", condition: "Brand New", date: "15 days ago", views: 188, mark: "BIKES", tone: "from-[#06b6d4] to-[#155e75]" },
  { code: "HWG-0054", name: "Google Pixel 8 Pro", category: "Gadgets", price: 920000, location: "Wuse, Abuja", condition: "Clean Fairly Used", date: "16 days ago", views: 206, mark: "PIXEL", tone: "from-[#475569] to-[#0f172a]" },
  { code: "HWG-0051", name: "Handmade leather lounge chair", category: "Furniture", price: 275000, location: "Uyo, Akwa Ibom", condition: "Brand New", date: "17 days ago", views: 91, mark: "LEATHER", tone: "from-[#92400e] to-[#451a03]" },
  { code: "HWG-0048", name: "LG split air conditioner", category: "Appliances", price: 390000, location: "Lekki, Lagos", condition: "Clean Fairly Used", date: "18 days ago", views: 157, mark: "AC", tone: "from-[#0284c7] to-[#0c4a6e]" },
  { code: "HWG-0045", name: "Compact office printer", category: "Commercial Equipment", price: 180000, location: "Ikeja, Lagos", condition: "Open Box", date: "3 weeks ago", views: 82, mark: "PRINT", tone: "from-[#64748b] to-[#334155]" },
  { code: "HWG-0042", name: "Cassava flour wholesale lot", category: "Agro", price: 290000, location: "Akure, Ondo", condition: "Brand New", date: "3 weeks ago", views: 119, mark: "FLOUR", tone: "from-[#ca8a04] to-[#713f12]" },
  { code: "HWG-0039", name: "Honda generator 7.5KVA", category: "Machinery", price: 735000, location: "Warri, Delta", condition: "Clean Fairly Used", date: "3 weeks ago", views: 164, mark: "GEN", tone: "from-[#334155] to-[#0f172a]" },
  { code: "HWG-0036", name: "Vintage denim jacket collection", category: "Fashion", price: 125000, location: "Yaba, Lagos", condition: "Clean Fairly Used", date: "1 month ago", views: 98, mark: "DENIM", tone: "from-[#2563eb] to-[#1e3a8a]" },
  { code: "HWG-0033", name: "Hand-painted wall art set", category: "Crafts", price: 95000, location: "Jos, Plateau", condition: "Brand New", date: "1 month ago", views: 61, mark: "ART", tone: "from-[#db2777] to-[#831843]" },
  { code: "HWG-0030", name: "Nissan X-Trail 2014", category: "Vehicles", price: 9800000, location: "Ibadan, Oyo", condition: "Clean Fairly Used", date: "1 month ago", views: 287, mark: "SUV", tone: "from-[#475569] to-[#1e293b]" },
];

export function getListingsForMarket(market: string) {
  return listings.filter((listing) => getListingMarket(listing) === market);
}

export const categories = ["All categories", "Vehicles & machinery", "Home & kitchen appliances", "Household essentials & utensils", "Living room & electronics", "Gadgets & computing", "Furniture & interior decor", "Fashion, toys & personal items", "Imported clearance & excess stock", "Agro products", "Handmade crafts", "Commercial equipment", "Other"];
export const conditions = ["All conditions", "Brand New", "Open Box", "Clean Fairly Used"];
