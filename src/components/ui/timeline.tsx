export type AuditTimelineEvent = {
  id: string;
  title: string;
  actor: string;
  timestamp: string;
  change?: string;
  reason?: string;
};

type AuditTimelineProps = {
  events: AuditTimelineEvent[];
};

export function AuditTimeline({ events }: AuditTimelineProps) {
  return (
    <ol className="ui-timeline">
      {events.map((event) => (
        <li className="ui-timeline__item" key={event.id}>
          <span aria-hidden="true" className="ui-timeline__marker" />
          <div className="ui-timeline__content">
            <p className="ui-timeline__title">{event.title}</p>
            <p className="ui-timeline__meta">
              {event.actor} · {event.timestamp}
            </p>
            {event.change ? <p className="ui-timeline__change">{event.change}</p> : null}
            {event.reason ? <p className="ui-timeline__reason">Alasan: {event.reason}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
