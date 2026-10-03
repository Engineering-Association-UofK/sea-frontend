import { useEffect, useState } from "react";
import { AdminEventListItem } from "@/features/events/api/adminModels";
import {
  useAdminEventList,
  useDeleteEvent,
} from "@/features/events/hooks/useAdminEvents";
import DeleteEventDialog from "./components/DeleteEventDialog";
import EventFilters from "./components/EventFilters";
import EventFormModal from "./components/EventFormModal";
import EventManageModal from "./components/manage/EventManageModal";
import EventsTable from "./components/EventsTable";
import Pagination from "./components/Pagination";
import { useEventFilters } from "@/features/events/hooks/useEventFilters";
import { getErrorMessage } from "./utils";
import "./events.css";

type FormTarget = { mode: "create" } | { mode: "edit"; id: number } | null;

interface Notice {
  type: "success" | "error";
  text: string;
}

export default function EventsControlCenter() {
  const filters = useEventFilters();
  const { data, isLoading, isFetching, isError, error, refetch } =
    useAdminEventList(filters.params);

  const deleteMutation = useDeleteEvent();

  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminEventListItem | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [manageTarget, setManageTarget] = useState<AdminEventListItem | null>(
    null,
  );
  const [notice, setNotice] = useState<Notice | null>(null);

  const events = data?.list ?? [];
  const totalPages = data?.total_pages ?? 0;

  // Auto-dismiss notices
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  // If the last item of a page was deleted (or the URL has a page past the end), step back
  useEffect(() => {
    if (!data || isFetching) return;
    if (filters.page > 1 && data.list.length === 0) {
      filters.setPage(Math.max(1, data.total_pages || 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isFetching]);

  const handleSaved = (message: string) => {
    setFormTarget(null);
    setNotice({ type: "success", text: message });
  };

  const openDelete = (event: AdminEventListItem) => {
    setDeleteError(null);
    setDeleteTarget(event);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      setNotice({ type: "success", text: "Event deleted successfully" });
    } catch (err) {
      setDeleteError(getErrorMessage(err, "Couldn't delete the event."));
    }
  };

  const showEmpty = !isLoading && !isError && events.length === 0;

  return (
    <div className="ev-page">
      <header className="ev-header">
        <div>
          <h1 className="ev-title">Events control center</h1>
          <p className="ev-muted">
            Create, edit and remove events across all secretariats.
          </p>
        </div>
        <button
          type="button"
          className="ev-btn ev-btn--primary"
          onClick={() => setFormTarget({ mode: "create" })}
        >
          + New event
        </button>
      </header>

      {notice && (
        <div
          className={`ev-notice ev-notice--${notice.type}`}
          role="status"
          aria-live="polite"
        >
          {notice.text}
        </div>
      )}

      <EventFilters
        search={filters.search}
        belonging={filters.belonging}
        limit={filters.limit}
        hasActiveFilters={filters.hasActiveFilters}
        onSearchChange={filters.setSearch}
        onBelongingChange={filters.setBelonging}
        onLimitChange={filters.setLimit}
        onReset={filters.reset}
      />

      {isError ? (
        <div className="ev-state">
          <p className="ev-error">
            {getErrorMessage(error, "Couldn't load events.")}
          </p>
          <button type="button" className="ev-btn" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : showEmpty ? (
        <div className="ev-state">
          <p>
            {filters.hasActiveFilters
              ? "No events match these filters."
              : "No events yet."}
          </p>
          {filters.hasActiveFilters ? (
            <button type="button" className="ev-btn" onClick={filters.reset}>
              Clear filters
            </button>
          ) : (
            <button
              type="button"
              className="ev-btn ev-btn--primary"
              onClick={() => setFormTarget({ mode: "create" })}
            >
              Create the first event
            </button>
          )}
        </div>
      ) : (
        <>
          <EventsTable
            events={events}
            isLoading={isLoading}
            isFetching={isFetching}
            pageSize={filters.limit}
            onManage={setManageTarget}
            onEdit={(event) => setFormTarget({ mode: "edit", id: event.id })}
            onDelete={openDelete}
          />
          <Pagination
            currentPage={data?.current_page ?? filters.page}
            totalPages={totalPages}
            totalCount={data?.count ?? 0}
            disabled={isFetching}
            onPageChange={filters.setPage}
          />
        </>
      )}

      {formTarget && (
        <EventFormModal
          // Remount per target so form state never leaks between events
          key={formTarget.mode === "edit" ? formTarget.id : "create"}
          eventId={formTarget.mode === "edit" ? formTarget.id : null}
          onClose={() => setFormTarget(null)}
          onSaved={handleSaved}
        />
      )}

      {manageTarget && (
        <EventManageModal
          // Remount per event so tab and page state never leak between events
          key={manageTarget.id}
          eventId={manageTarget.id}
          eventName={manageTarget.name}
          requireApplying={manageTarget.require_applying}
          onClose={() => setManageTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteEventDialog
          eventName={deleteTarget.name}
          isDeleting={deleteMutation.isPending}
          error={deleteError}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
