import { useEffect, useState } from "react";
import {
  useAcceptApplication,
  useEventApplications,
  useRejectApplication,
} from "@/features/events/hooks/useEventManagement";
import { formatDate, getErrorMessage } from "../../utils";
import Pagination from "../Pagination";
import ConfirmButton from "./ConfirmButton";

interface ApplicationsTabProps {
  eventId: number;
}

const PAGE_SIZE = 10;

export default function ApplicationsTab({ eventId }: ApplicationsTabProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, error, refetch } =
    useEventApplications(eventId, { page, limit: PAGE_SIZE });

  const acceptMutation = useAcceptApplication(eventId);
  const rejectMutation = useRejectApplication(eventId);
  const busy = acceptMutation.isPending || rejectMutation.isPending;

  const [actionError, setActionError] = useState<string | null>(null);

  const applications = data?.list ?? [];

  // Step back if the last row of a page was removed
  useEffect(() => {
    if (!data || isFetching) return;
    if (page > 1 && data.list.length === 0) {
      setPage(Math.max(1, data.total_pages || 1));
    }
  }, [data, isFetching, page]);

  const run = async (action: () => Promise<unknown>, fallback: string) => {
    setActionError(null);
    try {
      await action();
    } catch (err) {
      setActionError(getErrorMessage(err, fallback));
    }
  };

  if (isLoading) {
    return (
      <ul className="ev-list" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <li key={i} className="ev-list__item">
            <span className="ev-skeleton" />
          </li>
        ))}
      </ul>
    );
  }

  if (isError) {
    return (
      <div className="ev-state">
        <p className="ev-error">
          {getErrorMessage(error, "Couldn't load applications.")}
        </p>
        <button type="button" className="ev-btn" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    );
  }

  if (applications.length === 0) {
    return <p className="ev-muted ev-empty">No applications yet.</p>;
  }

  return (
    <div>
      {actionError && <p className="ev-error">{actionError}</p>}

      <ul className={`ev-list ${isFetching ? "is-fetching" : ""}`}>
        {applications.map((app) => (
          <li key={app.id} className="ev-list__item">
            <div className="ev-list__main">
              <span className="ev-list__title">User #{app.user_id}</span>
              <span
                className={`ev-badge ${app.accepted ? "ev-badge--success" : "ev-badge--accent"}`}
              >
                {app.accepted ? "Accepted" : "Pending"}
              </span>
              <span className="ev-muted">
                {app.form_id ? `Form #${app.form_id} · ` : ""}
                {formatDate(app.started_at)}
              </span>
            </div>
            <div className="ev-list__actions">
              {!app.accepted && (
                <button
                  type="button"
                  className="ev-btn ev-btn--small ev-btn--primary"
                  disabled={busy}
                  onClick={() =>
                    run(
                      () => acceptMutation.mutateAsync(app.id),
                      "Couldn't accept the application.",
                    )
                  }
                >
                  Accept
                </button>
              )}
              <ConfirmButton
                label="Reject"
                disabled={busy}
                onConfirm={() =>
                  run(
                    () => rejectMutation.mutateAsync(app.id),
                    "Couldn't reject the application.",
                  )
                }
              />
            </div>
          </li>
        ))}
      </ul>

      <Pagination
        currentPage={data?.current_page ?? page}
        totalPages={data?.total_pages ?? 0}
        totalCount={data?.count ?? 0}
        itemLabel="application"
        disabled={isFetching}
        onPageChange={setPage}
      />
    </div>
  );
}
