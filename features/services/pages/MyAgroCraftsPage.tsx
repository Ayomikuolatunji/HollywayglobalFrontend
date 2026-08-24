import ServiceWorkspacePage from "../components/ServiceWorkspacePage";

const tabs = ["All listings", "Draft", "Pending review", "Active", "Sold"] as const;

export default function MyAgroCraftsPage() {
  return <ServiceWorkspacePage kicker="MY AGRO & CRAFTS" title="Manage local product listings." description="Review agro-commodity, agricultural equipment and handmade craft listings from one workspace." actionHref="/dashboard/agro-crafts/new" actionLabel="List agro or crafts" tabs={tabs} summaries={[{ label: "DRAFTS", value: "0", note: "Ready to continue", icon: "box" }, { label: "PENDING REVIEW", value: "0", note: "Awaiting Admin review", icon: "clock" }, { label: "ACTIVE", value: "0", note: "Visible to buyers", icon: "store" }, { label: "SOLD", value: "0", note: "Completed sales", icon: "check" }]} emptyDescription="Your product code, category, location, listing review and sale status will appear here when activity is available." emptyIcon="store" />;
}
