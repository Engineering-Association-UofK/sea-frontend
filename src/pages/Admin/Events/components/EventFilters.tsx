import { useEffect, useState } from "react";
import { Secretariat } from "@/features/events/api/models";
import { LIMIT_OPTIONS } from "../../../../features/events/hooks/useEventFilters";
import { SECRETARIAT_OPTIONS } from "../utils";

interface EventFiltersProps {
  search: string;
  belonging?: Secretariat;
  limit: number;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onBelongingChange: (value: Secretariat | "") => void;
  onLimitChange: (value: number) => void;
  onReset: () => void;
}

const SEARCH_DEBOUNCE_MS = 400;

export default function EventFilters({
  search,
  belonging,
  limit,
  hasActiveFilters,
  onSearchChange,
  onBelongingChange,
  onLimitChange,
  onReset,
}: EventFiltersProps) {
  // Local input state so typing is instant; the URL/query only updates after a pause
  const [draft, setDraft] = useState(search);

  // Sync when the URL changes from outside (reset button, back/forward)
  useEffect(() => {
    setDraft(search);
  }, [search]);

  useEffect(() => {
    if (draft.trim() === search) return;
    const timer = setTimeout(() => onSearchChange(draft), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  return (
    <div className="ev-filters">
      <input
        type="search"
        className="ev-input ev-filters__search"
        placeholder="Search events by name…"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        aria-label="Search events by name"
      />

      <select
        className="ev-input"
        value={belonging ?? ""}
        onChange={(e) => onBelongingChange(e.target.value as Secretariat | "")}
        aria-label="Filter by secretariat"
      >
        <option value="">All secretariats</option>
        {SECRETARIAT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        className="ev-input"
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        aria-label="Rows per page"
      >
        {LIMIT_OPTIONS.map((l) => (
          <option key={l} value={l}>
            {l} / page
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button type="button" className="ev-btn ev-btn--ghost" onClick={onReset}>
          Clear filters
        </button>
      )}
    </div>
  );
}
