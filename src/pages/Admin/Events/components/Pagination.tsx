interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  disabled?: boolean;
  /** Singular noun for the summary line, e.g. "event" or "participant" */
  itemLabel?: string;
  onPageChange: (page: number) => void;
}

/** Builds [1, "…", 4, 5, 6, "…", 12] style lists. */
function getPageItems(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) items.push("…");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push("…");
  items.push(total);
  return items;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  disabled,
  itemLabel = "event",
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 0) return null;

  return (
    <nav className="ev-pagination" aria-label="Pagination">
      <span className="ev-muted">
        {totalCount} {itemLabel}
        {totalCount === 1 ? "" : "s"} · page {currentPage} of{" "}
        {totalPages}
      </span>

      <div className="ev-pagination__buttons">
        <button
          type="button"
          className="ev-btn ev-btn--small"
          disabled={disabled || currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        {getPageItems(currentPage, totalPages).map((item, i) =>
          item === "…" ? (
            <span key={`gap-${i}`} className="ev-pagination__gap">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`ev-btn ev-btn--small ${
                item === currentPage ? "ev-btn--primary" : ""
              }`}
              aria-current={item === currentPage ? "page" : undefined}
              disabled={disabled}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          className="ev-btn ev-btn--small"
          disabled={disabled || currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
