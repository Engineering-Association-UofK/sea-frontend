import React from "react";
import Pagination from "react-bootstrap/Pagination";

/**
 * Reusable paginator for all admin dashboards.
 *
 * Props:
 * - currentPage  {number}   - Current active page (1-indexed)
 * - totalPages   {number}   - Total number of pages from the API
 * - onPageChange {function} - Called with the new page number when user clicks
 * - disabled     {boolean}  - Disables all controls while fetching (optional)
 */
const TablePaginator = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}) => {
  if (!totalPages || totalPages <= 1) return null;

  const handleClick = (newPage) => {
    if (
      disabled ||
      newPage < 1 ||
      newPage > totalPages ||
      newPage === currentPage
    )
      return;
    onPageChange(newPage);
  };

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);

  const items = [];

  // Previous Page Button
  items.push(
    <Pagination.Prev
      key="prev"
      onClick={() => handleClick(currentPage - 1)}
      disabled={disabled || currentPage === 1}
    >
      <i className="bi bi-chevron-left"></i>
    </Pagination.Prev>,
  );

  // First Page + Ellipsis
  if (start > 1) {
    items.push(
      <Pagination.Item
        key={1}
        onClick={() => handleClick(1)}
        disabled={disabled}
      >
        1
      </Pagination.Item>,
    );
    if (start > 2) {
      items.push(
        <Pagination.Ellipsis key="start-ellipsis" disabled className="px-1" />,
      );
    }
  }

  // Numbered Pages
  for (let p = start; p <= end; p++) {
    items.push(
      <Pagination.Item
        key={p}
        active={p === currentPage}
        onClick={() => handleClick(p)}
        disabled={disabled}
      >
        {p}
      </Pagination.Item>,
    );
  }

  // Last Page + Ellipsis
  if (end < totalPages) {
    if (end < totalPages - 1) {
      items.push(
        <Pagination.Ellipsis key="end-ellipsis" disabled className="px-1" />,
      );
    }
    items.push(
      <Pagination.Item
        key={totalPages}
        onClick={() => handleClick(totalPages)}
        disabled={disabled}
      >
        {totalPages}
      </Pagination.Item>,
    );
  }

  // Next Page Button
  items.push(
    <Pagination.Next
      key="next"
      onClick={() => handleClick(currentPage + 1)}
      disabled={disabled || currentPage === totalPages}
    >
      <i className="bi bi-chevron-right"></i>
    </Pagination.Next>,
  );

  return (
    <div className="custom-pagination-container d-flex justify-content-center align-items-center py-3 mt-2">
      <Pagination size="sm" className="mb-0 gap-1">
        {items}
      </Pagination>
    </div>
  );
};

export default TablePaginator;
