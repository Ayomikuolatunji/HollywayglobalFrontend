import WantedRequestDetailsPage from "../../../../features/commerce/pages/WantedRequestDetailsPage";

export default async function Page({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  return <WantedRequestDetailsPage reference={reference} />;
}
