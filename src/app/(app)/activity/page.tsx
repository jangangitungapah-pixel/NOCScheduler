import Link from "next/link";

import { PageHeader } from "@/components/layout/shell-content";
import { getRouteMeta } from "@/components/layout/navigation";
import { Badge, Surface } from "@/components/ui";
import { activityEvents } from "@/modules/product-surfaces/fixtures";

function toneForSeverity(severity: string) {
  if (severity === "WARNING") return "warning" as const;
  if (severity === "NOTICE") return "info" as const;
  return "neutral" as const;
}

export default function ActivityPage() {
  const meta = getRouteMeta("/activity");
  if (!meta) return null;

  return (
    <div className="app-page app-page--workspace">
      <PageHeader
        badge={
          <Badge showDot tone="brand">
            Fixture preview
          </Badge>
        }
        meta={meta}
      />
      <div className="product-page">
        <div className="product-toolbar">
          <label className="product-search">
            <input aria-label="Search activity" placeholder="Actor, resource, event ID" />
          </label>
          <div className="product-inline-meta">
            <Badge tone="neutral">Business history</Badge>
            <Badge tone="neutral">Audit evidence</Badge>
          </div>
        </div>
        <Surface className="product-activity-list" padding="none">
          {activityEvents.map((event) => (
            <Link className="product-activity-link" href={`/activity/${event.id}`} key={event.id}>
              <div className="product-activity-row">
                <span className="product-activity-marker" />
                <div>
                  <div className="product-row-title">
                    <strong>{event.action}</strong>
                    <Badge tone={toneForSeverity(event.severity)}>{event.severity}</Badge>
                  </div>
                  <p>
                    {event.actor} · {event.resource}
                  </p>
                  <span>Reason: {event.reason}</span>
                </div>
                <time>{event.time}</time>
              </div>
            </Link>
          ))}
        </Surface>
      </div>
    </div>
  );
}
