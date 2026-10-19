import OrderDetailsPage from "../../../../features/commerce/pages/OrderDetailsPage";

export default async function Page({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  return <OrderDetailsPage reference={reference} />;
}
