export type OrderCartItem = {
  code: string;
  name: string;
  price: number;
  quantity: number;
};

export const orderCartStorageKey = "hollyway-order-cart";
export const orderCartUpdatedEvent = "hollyway-order-cart-updated";

export function readOrderCart(): OrderCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = JSON.parse(window.localStorage.getItem(orderCartStorageKey) || "[]") as OrderCartItem[];
    if (!Array.isArray(saved)) return [];
    return saved.flatMap((item) => {
      if (!item || typeof item.code !== "string" || !item.code.trim() || typeof item.name !== "string" || !item.name.trim()) return [];
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      if (!Number.isFinite(price) || price < 0 || !Number.isFinite(quantity) || quantity < 1) return [];
      return [{ code: item.code.trim(), name: item.name.trim(), price, quantity: Math.floor(quantity) }];
    });
  } catch {
    return [];
  }
}

export function writeOrderCart(items: OrderCartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(orderCartStorageKey, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(orderCartUpdatedEvent));
  } catch {
    // A full or restricted browser store must not break the marketplace UI.
  }
}

export function clearOrderCart() {
  writeOrderCart([]);
}

export function addOrderCartItem(item: Omit<OrderCartItem, "quantity">) {
  if (!Number.isFinite(item.price) || item.price < 0 || !item.code.trim() || !item.name.trim()) return;
  const current = readOrderCart();
  const existing = current.find((entry) => entry.code === item.code);
  if (existing) existing.quantity += 1;
  else current.push({ ...item, quantity: 1 });
  writeOrderCart(current);
}

export function removeOrderCartItem(code: string) {
  writeOrderCart(readOrderCart().filter((item) => item.code !== code));
}

export function updateOrderCartQuantity(code: string, quantity: number) {
  const nextQuantity = Number.isFinite(quantity) ? Math.floor(quantity) : 1;
  writeOrderCart(readOrderCart().map((item) => item.code === code ? { ...item, quantity: Math.max(1, nextQuantity) } : item));
}

export function getOrderCartItemCount(items: OrderCartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getOrderCartSubtotal(items: OrderCartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function encodeOrderCart(items: OrderCartItem[]) {
  return items.map((item) => `${item.code}:${item.quantity}`).join(",");
}
