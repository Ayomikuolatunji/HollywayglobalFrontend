"use client";

import { useEffect, useState, type ReactNode } from "react";

export type ToastKind = "success" | "error" | "info";

type ToastPayload = {
  kind: ToastKind;
  message: string;
};

type ToastRecord = ToastPayload & { id: number };

export const toastEventName = "hollyway-toast";

let nextToastId = 0;

export function showToast(kind: ToastKind, message: string) {
  if (typeof window === "undefined" || !message.trim()) return;
  window.dispatchEvent(
    new CustomEvent<ToastPayload>(toastEventName, {
      detail: { kind, message: message.trim() },
    }),
  );
}

const kindClasses: Record<ToastKind, string> = {
  success: "border-[#b6e9c9] bg-[#f5fcf7] text-[#126b3b]",
  error: "border-[#f0c5c0] bg-[#fff4f2] text-[#a12b24]",
  info: "border-[#cfe0f7] bg-[#f4f8ff] text-[#31527f]",
};

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  useEffect(() => {
    function receive(event: Event) {
      const detail = event instanceof CustomEvent ? event.detail as ToastPayload : null;
      if (!detail?.message) return;
      const id = nextToastId++;
      setToasts((current) => [...current.slice(-2), { ...detail, id }]);
    }

    window.addEventListener(toastEventName, receive);
    return () => window.removeEventListener(toastEventName, receive);
  }, []);

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((toast) =>
      window.setTimeout(
        () => setToasts((current) => current.filter((item) => item.id !== toast.id)),
        4500,
      ),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [toasts]);

  return (
    <>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-2 sm:left-auto sm:w-[min(360px,calc(100%-32px))]"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div
            className={`pointer-events-auto flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-xs font-bold shadow-lg shadow-[#061936]/10 ${kindClasses[toast.kind]}`}
            key={toast.id}
            role={toast.kind === "error" ? "alert" : "status"}
          >
            <span aria-hidden="true" className="text-sm">
              {toast.kind === "success" ? "✓" : toast.kind === "error" ? "!" : "i"}
            </span>
            <span className="min-w-0 flex-1 leading-5">{toast.message}</span>
            <button
              className="shrink-0 text-base leading-none opacity-60 hover:opacity-100"
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
