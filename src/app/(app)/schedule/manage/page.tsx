import { getRouteMeta } from "@/components/layout/navigation";
import { ManageScheduleExperience } from "@/modules/product-surfaces/schedule-experiences";

export default function ManageSchedulePage() {
  const meta = getRouteMeta("/schedule/manage");
  if (!meta) return null;
  return <ManageScheduleExperience meta={meta} />;
}
