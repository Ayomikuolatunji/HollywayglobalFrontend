import type { ReactNode } from "react";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";

export default function CommercePageHeader({ kicker, title, description, action, compact = false }: { kicker: string; title: string; description: string; action?: ReactNode; compact?: boolean }) {
  return <DashboardPageHeader kicker={kicker} title={title} description={description} action={action} compact={compact} />;
}
