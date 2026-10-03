import React from "react";
import {
  EventListItemResponse,
  Secretariat,
} from "@/features/public_events/api/models";
import { useLanguage } from "@/context/LanguageContext";

interface EventCardProps {
  event: EventListItemResponse;
  onOpen: (event: EventListItemResponse) => void;
}

const formatDate = (dateString: string, locale: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const EventCard = ({ event, onOpen }: EventCardProps) => {
  const { translations, language } = useLanguage();
  const t = translations.events;

  return (
    <article
      onClick={() => onOpen(event)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      {/* Image Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
        {event.background_url ? (
          <img
            src={event.background_url}
            alt={event.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-blue-50 text-blue-300 font-bold text-2xl">
            {event.name.charAt(0)}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center gap-2">
          <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-medium text-white">
            {t.secretariats[event.belonging] || event.belonging}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm ${
              event.require_applying
                ? "bg-amber-100 text-amber-800 border border-amber-200"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}
          >
            {event.require_applying ? t.actions.apply : "Open Event"}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
          {event.name}
        </h3>

        <p className="flex-1 text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
          {event.description}
        </p>

        {/* Schedule */}
        <div className="mt-auto border-t border-gray-100 pt-3 text-xs text-gray-500 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-700">
              {t.labels.starts}:
            </span>
            <span>{formatDate(event.start_date, language)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-700">
              {t.labels.ends}:
            </span>
            <span>{formatDate(event.end_date, language)}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(event);
          }}
          className="mt-4 w-full rounded-lg bg-gray-50 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-900 hover:text-white transition"
        >
          {t.actions.viewDetails}
        </button>
      </div>
    </article>
  );
};

export default EventCard;
