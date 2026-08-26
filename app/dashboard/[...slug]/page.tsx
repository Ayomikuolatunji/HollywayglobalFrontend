import { notFound } from "next/navigation";
import ComingSoonContent from "../../../features/dashboard/components/ComingSoonContent";

export default async function DashboardFeaturePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (slug[0] === "agro-crafts" || slug[0] === "clearance") notFound();
  return <ComingSoonContent />;
}
