import { AdminEventListItem } from "@/features/events/api/adminModels";
import { SECRETARIAT_LABELS, formatDate } from "../utils";

interface EventsTableProps {
  events: AdminEventListItem[];
  isLoading: boolean;
  isFetching: boolean;
  pageSize: number;
  onManage: (event: AdminEventListItem) => void;
  onEdit: (event: AdminEventListItem) => void;
  onDelete: (event: AdminEventListItem) => void;
}

export default function EventsTable({
  events,
  isLoading,
  isFetching,
  pageSize,
  onManage,
  onEdit,
  onDelete,
}: EventsTableProps) {
  return (
    <div className={`ev-table-wrap ${isFetching ? "is-fetching" : ""}`}>
      <table className="ev-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Secretariat</th>
            <th>Applications</th>
            <th>Created</th>
            <th className="ev-table__actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
                <tr
                  key={`skeleton-${i}`}
                  className="ev-row ev-row--skeleton"
                  aria-hidden="true"
                >
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className={j === 0 ? "ev-td--event" : undefined}>
                      <span className="ev-skeleton" />
                    </td>
                  ))}
                </tr>
              ))
            : events.map((event) => (
                <tr key={event.id} className="ev-row">
                  <td className="ev-td--event">
                    <div className="ev-event-cell">
                      {event.background_url ? (
                        <img
                          className="ev-thumb"
                          src={event.background_url}
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        <span className="ev-thumb ev-thumb--empty" />
                      )}
                      <div>
                        <div className="ev-event-name">{event.name}</div>
                        <div className="ev-muted">#{event.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="ev-td--belonging">
                    <span className="ev-badge">
                      {SECRETARIAT_LABELS[event.belonging] ?? event.belonging}
                    </span>
                  </td>
                  <td className="ev-td--apply">
                    {event.require_applying ? (
                      <span className="ev-badge ev-badge--accent">
                        Required
                        {event.form_id ? ` · form #${event.form_id}` : ""}
                      </span>
                    ) : (
                      <span className="ev-muted">Open</span>
                    )}
                  </td>
                  <td className="ev-td--date">{formatDate(event.created_at)}</td>
                  <td className="ev-table__actions-col ev-td--actions">
                    <div className="ev-row-actions">
                      <button
                        type="button"
                        className="ev-btn ev-btn--small"
                        onClick={() => onManage(event)}
                      >
                        Manage
                      </button>
                      <button
                        type="button"
                        className="ev-btn ev-btn--small"
                        onClick={() => onEdit(event)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="ev-btn ev-btn--small ev-btn--danger"
                        onClick={() => onDelete(event)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
