import ProfessionalRequestDetailsPage from "../../../../features/services/pages/ProfessionalRequestDetailsPage";

export default async function Page({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  return <ProfessionalRequestDetailsPage reference={reference} />;
}
