import { notFound } from "next/navigation";

export default async function DashboardFeaturePage({ params }: { params: Promise<{ slug: string[] }> }) {
  await params;
  notFound();
}
