import ServiceWorkspacePage from "../components/ServiceWorkspacePage";

const tabs = ["All events", "Vendor contracts", "Deliveries"] as const;

export default function MyEventsPage() {
  return <ServiceWorkspacePage kicker="MY EVENTS" title="Keep event coordination together." description="Review event requests, vendor contracts and related deliveries from one workspace." actionHref="/dashboard/events/new" actionLabel="Plan an event" tabs={tabs} summaries={[{ label: "EVENT REQUESTS", value: "0", note: "Submitted enquiries", icon: "list" }, { label: "VENDOR CONTRACTS", value: "0", note: "Agreements to review", icon: "shield" }, { label: "DELIVERIES", value: "0", note: "Event items in transit", icon: "truck" }]} emptyDescription="Your event request, vendor contract details and delivery updates will appear here when activity is available." />;
}
