import CustomerListingDetailsPage from "../../../../features/commerce/pages/CustomerListingDetailsPage";

export default async function Page({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  return <CustomerListingDetailsPage reference={reference} />;
}
