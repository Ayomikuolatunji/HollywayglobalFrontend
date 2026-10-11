import type { Metadata } from "next";
import type { ReactNode } from "react";
import DashboardShell from "../../features/dashboard/components/DashboardShell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell><div className="w-full [&>div]:!max-w-none">{children}</div></DashboardShell>;
}
