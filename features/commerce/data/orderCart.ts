import { addCartItem, clearCart, fetchCart, removeCartItem, updateCartItem } from "./cartApi";

export type OrderCartItem = {
  code: string;
  name: string;
  price: number;
  quantity: number;
};

export const orderCartUpdatedEvent = "hollyway-order-cart-updated";

let cachedItems: OrderCartItem[] = [];
let remoteLoad: Promise<OrderCartItem[]> | null = null;

export function readOrderCart(): OrderCartItem[] {
  return cachedItems;
}

export function writeOrderCart(items: OrderCartItem[]) {
  cachedItems = items;
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(orderCartUpdatedEvent));
}

export async function refreshOrderCart() {
  if (remoteLoad) return remoteLoad;
  remoteLoad = fetchCart()
    .then((items) => {
      writeOrderCart(items);
      return items;
    })
    .finally(() => {
      remoteLoad = null;
    });
  return remoteLoad;
}

export async function clearOrderCart() {
  await clearCart();
  writeOrderCart([]);
}

export async function addOrderCartItem(item: Omit<OrderCartItem, "quantity">) {
  if (!Number.isFinite(item.price) || item.price < 0 || !item.code.trim() || !item.name.trim()) return;
  const items = await addCartItem(item.code);
  writeOrderCart(items);
  return items;
}

export async function removeOrderCartItem(code: string) {
  const items = await removeCartItem(code);
  writeOrderCart(items);
  return items;
}

export async function updateOrderCartQuantity(code: string, quantity: number) {
  const nextQuantity = Number.isFinite(quantity) ? Math.floor(quantity) : 1;
  const safeQuantity = Math.max(1, nextQuantity);
  const items = await updateCartItem(code, safeQuantity);
  writeOrderCart(items);
  return items;
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
