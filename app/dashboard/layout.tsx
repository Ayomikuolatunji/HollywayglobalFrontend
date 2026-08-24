import type { ReactNode } from "react";
import DashboardShell from "../../features/dashboard/components/DashboardShell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell><div className="w-full [&>div]:!max-w-none">{children}</div></DashboardShell>;
}
