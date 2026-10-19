export type ResellerMarkupType = "Fixed amount" | "Percentage";
export type ResellerOrderStatus = "Draft" | "Pending review" | "Confirmed" | "Completed" | "Cancelled";

export type ResellerOrder = {
  id: string;
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
  statusLabel: string;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
};

export function parseAmount(value: string) { return Number(value.replace(/[^0-9.]/g, "")) || 0; }
export function formatAmount(value: string) { const digits = value.replace(/\D/g, ""); return digits ? Number(digits).toLocaleString("en-NG") : ""; }

export function calculateResellerTotals(baseUnitPrice: number, quantity: number, markupType: ResellerMarkupType, markupValue: number) {
  const safeUnitPrice = Math.max(0, baseUnitPrice);
  const safeQuantity = Math.max(1, quantity || 1);
  const safeMarkup = Math.max(0, markupValue);
  const subtotal = safeUnitPrice * safeQuantity;
  const markupTotal = markupType === "Percentage" ? Math.round(subtotal * (safeMarkup / 100)) : safeMarkup * safeQuantity;
  return { subtotal, markupTotal, customerTotal: subtotal + markupTotal };
}

export function toApiMarkupType(value: ResellerMarkupType) { return value === "Percentage" ? "percentage" : "fixed"; }
export function fromApiStatus(value: string): ResellerOrderStatus { return value === "pending_review" ? "Pending review" : value === "confirmed" ? "Confirmed" : value === "completed" ? "Completed" : value === "cancelled" ? "Cancelled" : "Draft"; }
