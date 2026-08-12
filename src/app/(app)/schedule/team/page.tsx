import { getRouteMeta } from "@/components/layout/navigation";
import { TeamScheduleExperience } from "@/modules/product-surfaces/schedule-experiences";

export default function TeamSchedulePage() {
  const meta = getRouteMeta("/schedule/team");
  if (!meta) return null;
  return <TeamScheduleExperience meta={meta} />;
}
