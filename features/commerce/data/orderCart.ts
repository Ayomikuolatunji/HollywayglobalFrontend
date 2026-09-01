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
    return Array.isArray(saved) ? saved.filter((item) => item?.code && item?.name) : [];
  } catch {
    return [];
  }
}

export function writeOrderCart(items: OrderCartItem[]) {
  window.localStorage.setItem(orderCartStorageKey, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(orderCartUpdatedEvent));
}

export function clearOrderCart() {
  writeOrderCart([]);
}

export function addOrderCartItem(item: Omit<OrderCartItem, "quantity">) {
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
  writeOrderCart(readOrderCart().map((item) => item.code === code ? { ...item, quantity: Math.max(1, quantity) } : item));
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
