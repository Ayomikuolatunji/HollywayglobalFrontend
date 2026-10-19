import SalesDetailsPage from "../../../../features/commerce/pages/SalesDetailsPage";

export default async function Page({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  return <SalesDetailsPage reference={reference} />;
}
