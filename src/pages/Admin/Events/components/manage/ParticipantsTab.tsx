import { useEffect, useState } from "react";
import {
  useEventParticipants,
  useRemoveParticipant,
} from "@/features/events/hooks/useEventManagement";
import { formatDate, getErrorMessage } from "../../utils";
import Pagination from "../Pagination";
import ConfirmButton from "./ConfirmButton";

interface ParticipantsTabProps {
  eventId: number;
}

const PAGE_SIZE = 10;

export default function ParticipantsTab({ eventId }: ParticipantsTabProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, error, refetch } =
    useEventParticipants(eventId, { page, limit: PAGE_SIZE });

  const removeMutation = useRemoveParticipant(eventId);
  const [actionError, setActionError] = useState<string | null>(null);

  const participants = data?.list ?? [];

  // Step back if the last row of a page was removed
  useEffect(() => {
    if (!data || isFetching) return;
    if (page > 1 && data.list.length === 0) {
      setPage(Math.max(1, data.total_pages || 1));
    }
  }, [data, isFetching, page]);

  const handleRemove = async (id: number) => {
    setActionError(null);
    try {
      await removeMutation.mutateAsync(id);
    } catch (err) {
      setActionError(getErrorMessage(err, "Couldn't remove the participant."));
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
          {getErrorMessage(error, "Couldn't load participants.")}
        </p>
        <button type="button" className="ev-btn" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    );
  }

  if (participants.length === 0) {
    return <p className="ev-muted ev-empty">No participants yet.</p>;
  }

  return (
    <div>
      {actionError && <p className="ev-error">{actionError}</p>}

      <ul className={`ev-list ${isFetching ? "is-fetching" : ""}`}>
        {participants.map((p) => (
          <li key={p.id} className="ev-list__item">
            <div className="ev-list__main">
              <span className="ev-list__title">User #{p.user_id}</span>
              <span className="ev-muted">Joined {formatDate(p.joined_at)}</span>
            </div>
            <div className="ev-list__actions">
              <ConfirmButton
                label="Remove"
                disabled={removeMutation.isPending}
                onConfirm={() => handleRemove(p.id)}
              />
            </div>
          </li>
        ))}
      </ul>

      <Pagination
        currentPage={data?.current_page ?? page}
        totalPages={data?.total_pages ?? 0}
        totalCount={data?.count ?? 0}
        itemLabel="participant"
        disabled={isFetching}
        onPageChange={setPage}
      />
    </div>
  );
}
