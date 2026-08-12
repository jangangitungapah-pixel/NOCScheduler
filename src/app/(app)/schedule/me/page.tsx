import { MyScheduleExperience } from "@/modules/product-surfaces/schedule-experiences";
import { getRouteMeta } from "@/components/layout/navigation";

export default function MySchedulePage() {
  const meta = getRouteMeta("/schedule/me");
  if (!meta) return null;
  return <MyScheduleExperience meta={meta} />;
}
