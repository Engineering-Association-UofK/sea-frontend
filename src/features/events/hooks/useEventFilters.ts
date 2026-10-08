import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Secretariat } from "@/features/events/api/models";
import { AdminEventListRequest } from "@/features/events/api/adminModels";

export const LIMIT_OPTIONS = [10, 25, 50] as const;
export const DEFAULT_LIMIT = LIMIT_OPTIONS[0];

/**
 * Keeps page / limit / search / belonging in the URL so a filtered view
 * survives refresh and can be shared as a link.
 */
export function useEventFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const limitParam = Number(searchParams.get("limit"));
  const limit = (LIMIT_OPTIONS as readonly number[]).includes(limitParam)
    ? limitParam
    : DEFAULT_LIMIT;

  const search = searchParams.get("search") ?? "";

  const belongingParam = searchParams.get("belonging");
  const belonging = (Object.values(Secretariat) as string[]).includes(
    belongingParam ?? "",
  )
    ? (belongingParam as Secretariat)
    : undefined;

  const patch = useCallback(
    (changes: Record<string, string | number | undefined>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(changes).forEach(([key, value]) => {
            if (value === undefined || value === "" || value === null) {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          });
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setPage = useCallback((p: number) => patch({ page: p }), [patch]);
  const setLimit = useCallback(
    (l: number) => patch({ limit: l, page: 1 }),
    [patch],
  );
  const setSearch = useCallback(
    (s: string) => patch({ search: s.trim(), page: 1 }),
    [patch],
  );
  const setBelonging = useCallback(
    (b: Secretariat | "") => patch({ belonging: b || undefined, page: 1 }),
    [patch],
  );
  const reset = useCallback(
    () =>
      patch({
        page: undefined,
        limit: undefined,
        search: undefined,
        belonging: undefined,
      }),
    [patch],
  );

  const params: AdminEventListRequest = useMemo(
    () => ({
      page,
      limit,
      "search-name": search || undefined,
      belonging,
    }),
    [page, limit, search, belonging],
  );

  const hasActiveFilters = Boolean(search || belonging);

  return {
    page,
    limit,
    search,
    belonging,
    params,
    hasActiveFilters,
    setPage,
    setLimit,
    setSearch,
    setBelonging,
    reset,
  };
}
