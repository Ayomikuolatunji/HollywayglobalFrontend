export type ResellerMarkupType = "Fixed amount" | "Percentage";
export type ResellerOrderStatus = "Draft";

export type ResellerOrder = {
  reference: string;
  listingCode: string;
  itemName: string;
  quantity: number;
  baseUnitPrice: number;
  markupType: ResellerMarkupType;
  markupValue: number;
  subtotal: number;
  markupTotal: number;
  customerTotal: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  alternatePhone: string;
  deliveryAddress: string;
  notes: string;
  status: ResellerOrderStatus;
  createdAt: string;
};

export const resellerOrdersStorageKey = "hollyway-reseller-orders";

export function parseAmount(value: string) {
  return Number(value.replace(/[^0-9.]/g, "")) || 0;
}

export function formatAmount(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("en-NG") : "";
}

export function calculateResellerTotals(
  baseUnitPrice: number,
  quantity: number,
  markupType: ResellerMarkupType,
  markupValue: number,
) {
  const safeUnitPrice = Math.max(0, baseUnitPrice);
  const safeQuantity = Math.max(1, quantity || 1);
  const safeMarkup = Math.max(0, markupValue);
  const subtotal = safeUnitPrice * safeQuantity;
  const markupTotal = markupType === "Percentage"
    ? subtotal * (safeMarkup / 100)
    : safeMarkup * safeQuantity;
  return { subtotal, markupTotal, customerTotal: subtotal + markupTotal };
}

export function readResellerOrders() {
  if (typeof window === "undefined") return [] as ResellerOrder[];
  try {
    const value = JSON.parse(window.localStorage.getItem(resellerOrdersStorageKey) || "[]");
    return Array.isArray(value) ? value as ResellerOrder[] : [];
  } catch {
    return [] as ResellerOrder[];
  }
}

export function saveResellerOrder(order: ResellerOrder) {
  const orders = [order, ...readResellerOrders().filter((item) => item.reference !== order.reference)].slice(0, 50);
  window.localStorage.setItem(resellerOrdersStorageKey, JSON.stringify(orders));
  return orders;
}
