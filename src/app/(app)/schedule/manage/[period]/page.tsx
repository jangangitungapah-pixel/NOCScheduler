import { getRouteMeta } from "@/components/layout/navigation";
import { ManageScheduleExperience } from "@/modules/product-surfaces/schedule-experiences";

type ManageSchedulePeriodPageProps = {
  params: Promise<{ period: string }>;
};

export default async function ManageSchedulePeriodPage({ params }: ManageSchedulePeriodPageProps) {
  const { period } = await params;
  const meta = getRouteMeta(`/schedule/manage/${period}`);
  if (!meta) return null;
  return <ManageScheduleExperience meta={meta} period={period} />;
}
