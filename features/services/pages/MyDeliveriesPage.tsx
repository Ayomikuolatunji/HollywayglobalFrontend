import ServiceWorkspacePage from "../components/ServiceWorkspacePage";

const tabs = ["All deliveries", "Booked", "Picked up", "In transit", "Delivered"] as const;

export default function MyDeliveriesPage() {
  return <ServiceWorkspacePage kicker="MY SHIPMENTS" title="Track every delivery clearly." description="Manage delivery bookings, waybills, tracking numbers and proof of delivery from one workspace." actionHref="/dashboard/logistics/new" actionLabel="Book delivery" tabs={tabs} summaries={[{ label: "BOOKED", value: "0", note: "Awaiting pickup", icon: "clock" }, { label: "IN TRANSIT", value: "0", note: "Moving with a carrier", icon: "truck" }, { label: "DELIVERED", value: "0", note: "Awaiting confirmation", icon: "box" }, { label: "WAYBILLS", value: "0", note: "Tracking references", icon: "list" }]} emptyDescription="Your delivery reference, waybill status, tracking number and proof of delivery will appear here when activity is available." />;
}
