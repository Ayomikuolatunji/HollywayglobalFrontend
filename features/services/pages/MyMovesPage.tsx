import ServiceWorkspacePage from "../components/ServiceWorkspacePage";

const tabs = ["All moves", "Booked", "Confirmed", "In progress", "Completed"] as const;

export default function MyMovesPage() {
  return <ServiceWorkspacePage kicker="MY RELOCATIONS" title="Keep every move organised." description="Track relocation bookings, vehicle details, crew coordination and completion from your workspace." actionHref="/dashboard/relocation/new" actionLabel="Request relocation" tabs={tabs} summaries={[{ label: "BOOKED", value: "0", note: "Requests received", icon: "clock" }, { label: "CONFIRMED", value: "0", note: "Vehicle and crew assigned", icon: "truck" }, { label: "IN PROGRESS", value: "0", note: "Move underway", icon: "box" }, { label: "COMPLETED", value: "0", note: "Finished moves", icon: "check" }]} emptyDescription="Your relocation reference, vehicle details, crew information and current move status will appear here when activity is available." />;
}
