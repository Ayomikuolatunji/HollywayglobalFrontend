import type { ResellerOrder } from "../data/reseller";

function naira(value: number) {
  return `₦${Math.round(value).toLocaleString("en-NG")}`;
}

export default function ResellerOrderList({
  orders,
  onContinue,
}: {
  orders: ResellerOrder[];
  onContinue: (order: ResellerOrder) => void;
}) {
  if (!orders.length) return null;

  return (
    <section className="rounded-xl border border-[#e4e2da] bg-white p-4 shadow-[0_1px_2px_rgba(18,20,28,.03)] sm:p-5">
      <div className="flex items-end justify-between gap-3 border-b border-[#e4e2da] pb-3">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-[.14em] text-[#9498a3]">
            RESELLER ORDERS
          </span>
          <h2 className="mt-1 font-[Manrope] text-lg font-semibold text-[#12141c]">
            Saved order records
          </h2>
        </div>
        <span className="text-[10px] text-[#9498a3]">{orders.length} saved</span>
      </div>
      <div className="divide-y divide-[#e4e2da]">
        {orders.slice(0, 6).map((order) => (
          <article
            className="grid gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-5"
            key={order.reference}
          >
            <div className="min-w-0">
              <strong className="block truncate text-xs font-semibold text-[#12141c]">
                {order.itemName || "Unnamed item"}
              </strong>
              <span className="mt-1 block truncate text-[10px] text-[#5c5f6b]">
                {order.reference} · {order.listingCode || "No listing code"} · {order.customerName || "No customer"}
              </span>
            </div>
            <span className="text-[10px] text-[#5c5f6b]">{naira(order.customerTotal)}</span>
            <button
              className="justify-self-start text-[10px] font-bold text-[#1453bb] hover:underline sm:justify-self-end"
              type="button"
              onClick={() => onContinue(order)}
              disabled={order.status !== "Draft" && order.status !== "Cancelled"}
            >
              {order.status === "Draft" || order.status === "Cancelled" ? "Continue order" : "View status"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
