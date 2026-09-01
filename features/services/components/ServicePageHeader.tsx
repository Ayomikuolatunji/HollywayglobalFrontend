import type { ReactNode } from "react";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";

export default function ServicePageHeader({ kicker, title, description, action }: { kicker: string; title: string; description: string; action?: ReactNode }) {
  return <DashboardPageHeader kicker={kicker} title={title} description={description} action={action} />;
}
