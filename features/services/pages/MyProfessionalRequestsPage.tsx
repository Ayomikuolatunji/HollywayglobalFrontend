import ServiceWorkspacePage from "../components/ServiceWorkspacePage";

const tabs = ["All requests", "Pending", "Quotes received", "Booked", "Completed"] as const;

export default function MyProfessionalRequestsPage() {
  return <ServiceWorkspacePage kicker="MY PROFESSIONAL REQUESTS" title="Compare help and next steps." description="Track professional service requests, quotes, bookings and completed work from your workspace." actionHref="/dashboard/services/new" actionLabel="Hire a professional" secondaryHref="/dashboard/services/register" secondaryLabel="Register as service giver" tabs={tabs} summaries={[{ label: "PENDING", value: "0", note: "Awaiting a response", icon: "clock" }, { label: "QUOTES", value: "0", note: "Professional offers", icon: "list" }, { label: "BOOKED", value: "0", note: "Confirmed services", icon: "shield" }, { label: "COMPLETED", value: "0", note: "Finished requests", icon: "check" }]} emptyDescription="Your request reference, professional quotes, booking details and completion status will appear here when activity is available." emptyIcon="tool" />;
}
