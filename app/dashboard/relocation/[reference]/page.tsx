import RelocationDetailsPage from "../../../../features/services/pages/RelocationDetailsPage";

export default async function Page({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  return <RelocationDetailsPage reference={reference} />;
}
