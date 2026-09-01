"use client";

import Link from "next/link";
import { useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardEmptyState from "../components/DashboardEmptyState";
import DashboardPageHeader from "../components/DashboardPageHeader";
import DashboardStatusTabs from "../components/DashboardStatusTabs";
import DashboardSummaryCard from "../components/DashboardSummaryCard";

const filters = ["All notifications", "Unread", "Read"] as const;

export default function NotificationsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All notifications");
  return <div className="mx-auto max-w-[980px] space-y-7 p-5 sm:p-8"><DashboardPageHeader kicker="ACCOUNT" title="Notifications" description="Keep track of listing activity, requests, orders and important Hollyway updates." action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/settings">Notification settings <Arrow /></Link>} /><section className="grid gap-3 sm:grid-cols-2"><DashboardSummaryCard label="UNREAD" value="0" note="Needs your attention" icon="bell" /><DashboardSummaryCard label="TOTAL UPDATES" value="0" note="Account and activity notices" icon="list" /></section><section className="rounded-lg border border-[#dfe4ed] bg-white p-5"><DashboardStatusTabs items={filters} active={filter} onChange={(value) => setFilter(value as (typeof filters)[number])} ariaLabel="Notification filter" /><DashboardEmptyState icon="bell" title={`No ${filter.toLowerCase()} yet`} description="Read and unread account updates, listing activity, request changes and order notices will appear here when the notification service is connected." actionHref="/dashboard" actionLabel="Back to overview" /></section></div>;
}
