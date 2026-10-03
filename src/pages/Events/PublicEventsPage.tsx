import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // or 'next/navigation'
import { useEventList } from "@/features/events/hooks/useEvents";
import {
  EventListItemResponse,
  EventListRequest,
  Secretariat,
} from "@/features/events/api/models";
import { useLanguage } from "@/context/LanguageContext";
import TablePaginator from "@/components/TablePaginator";
import EventCard from "./components/EventCard";
import EventApplicationOverlay from "./components/EventApplicationOverlay";

const PAGE_LIMIT = 9;

export const PublicEventsPage = () => {
  const { translations } = useLanguage();
  const t = translations.events;

  // 1. Sync active secretariat with URL search params (?secretariat=media)
  const [searchParams, setSearchParams] = useSearchParams();
  const rawSecretariatParam = searchParams.get("secretariat");

  // Validates if the query parameter matches a valid Secretariat enum
  const activeSecretariat = Object.values(Secretariat).includes(
    rawSecretariatParam as Secretariat,
  )
    ? (rawSecretariatParam as Secretariat)
    : undefined; // undefined = "All Secretariats"

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEvent, setSelectedEvent] =
    useState<EventListItemResponse | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  // Handler to update URL when secretariat changes
  const handleSecretariatChange = (secretariat?: Secretariat) => {
    const newParams = new URLSearchParams(searchParams);
    if (secretariat) {
      newParams.set("secretariat", secretariat);
    } else {
      newParams.delete("secretariat"); // Removes param for "All"
    }
    setSearchParams(newParams);
    setPage(1);
  };

  const params: EventListRequest = {
    limit: PAGE_LIMIT,
    page,
    ...(activeSecretariat ? { belonging: activeSecretariat } : {}),
    ...(search ? { "search-name": search } : {}),
  };

  const {
    data: eventsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useEventList(params);

  const events = eventsResponse?.list ?? [];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>

      {/* --- SECRETARIAT SELECTION --- */}

      {/* MOBILE VIEW: Select Dropdown */}
      <div className="block sm:hidden mb-6">
        <label
          htmlFor="secretariat-select"
          className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
        >
          {t.secretariatViews}
        </label>
        <select
          id="secretariat-select"
          value={activeSecretariat ?? ""}
          onChange={(e) =>
            handleSecretariatChange(
              e.target.value ? (e.target.value as Secretariat) : undefined,
            )
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Secretariats</option>
          {Object.values(Secretariat).map((sec) => (
            <option key={sec} value={sec}>
              {t.secretariats[sec]}
            </option>
          ))}
        </select>
      </div>

      {/* DESKTOP VIEW: Wrapping Pill Filter Badges */}
      <div className="hidden sm:flex sm:flex-wrap sm:gap-2 mb-8">
        <button
          type="button"
          onClick={() => handleSecretariatChange(undefined)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeSecretariat === undefined
              ? "bg-blue-900 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
          }`}
        >
          All Secretariats
        </button>
        {Object.values(Secretariat).map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => handleSecretariatChange(sec)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeSecretariat === sec
                ? "bg-blue-900 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            {t.secretariats[sec]}
          </button>
        ))}
      </div>

      {/* --- CONTENT SECTION --- */}
      <section id="events-panel">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-blue-900">
            {activeSecretariat
              ? t.secretariats[activeSecretariat]
              : "All Events"}
          </h2>
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm sm:max-w-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {isLoading ? (
          <p className="py-8 text-center text-gray-500" role="status">
            {t.loadingEvents}
          </p>
        ) : isError ? (
          <div className="py-8 text-center" role="alert">
            <p className="mb-3 text-red-700">{t.loadError}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
            >
              {t.retry}
            </button>
          </div>
        ) : events.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            {search ? t.noSearchResults : t.noEvents}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onOpen={setSelectedEvent}
                />
              ))}
            </div>
            <TablePaginator
              currentPage={eventsResponse?.current_page ?? page}
              totalPages={eventsResponse?.total_pages ?? 1}
              onPageChange={setPage}
              disabled={isFetching}
            />
          </>
        )}
      </section>

      {selectedEvent && (
        <EventApplicationOverlay
          event={selectedEvent}
          show
          onHide={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default PublicEventsPage;
