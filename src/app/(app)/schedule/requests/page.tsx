import { getRouteMeta } from "@/components/layout/navigation";
import { RequestsExperience } from "@/modules/product-surfaces/schedule-experiences";

type RequestsPageProps = {
  searchParams: Promise<{ create?: string }>;
};

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  const query = await searchParams;
  const meta = getRouteMeta("/schedule/requests");
  if (!meta) return null;
  return <RequestsExperience initialCreate={query.create === "1"} meta={meta} />;
}
