import ServiceWorkspacePage from "../components/ServiceWorkspacePage";

const tabs = ["Referrals", "Reseller orders", "Pending payments", "Payment history"] as const;

export default function MyReferralsPage() {
  return <ServiceWorkspacePage kicker="REFERRALS & RESELLER" title="See your partner activity clearly." description="Review referral counts, reseller orders, markups, profits, pending payments and payout history." actionHref="/dashboard/referrals/new" actionLabel="Start partner enquiry" tabs={tabs} summaries={[{ label: "REFERRALS", value: "0", note: "Attributed activity", icon: "users" }, { label: "PENDING PAYMENTS", value: "₦0", note: "Awaiting payout", icon: "clock" }, { label: "PROFITS", value: "₦0", note: "Reseller markup", icon: "wallet" }, { label: "PAYOUTS", value: "₦0", note: "Payment history", icon: "check" }]} emptyDescription="Your referral code, attributed registrations, reseller order markups, profits and payouts will appear here when activity is available." emptyIcon="users" />;
}
