import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { EventListItemResponse } from "@/features/events/api/models";
import {
  useApplyEvent,
  useCheckStatus,
} from "@/features/events/hooks/useEvents";

interface EventApplicationOverlayProps {
  event: EventListItemResponse;
  show: boolean;
  onHide: () => void;
}

const formatFullDateTime = (dateString: string, locale: string) => {
  return new Date(dateString).toLocaleString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const EventApplicationOverlay = ({
  event,
  show,
  onHide,
}: EventApplicationOverlayProps) => {
  const { translations, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const t = translations.events;
  const [applyError, setApplyError] = useState(false);

  const {
    data: status,
    isLoading: statusLoading,
    isError: statusError,
    refetch: refetchStatus,
  } = useCheckStatus(
    event.id,
    show && isAuthenticated && event.require_applying,
  );

  const { mutate: apply, isPending: isApplying } = useApplyEvent();

  const handleApply = () => {
    setApplyError(false);
    apply(event.id, {
      onSuccess: (response) => {
        if (response.needs_form && response.form_id) {
          onHide();
          navigate(`/forms/${response.form_id}`);
        }
      },
      onError: () => setApplyError(true),
    });
  };

  const handleSignIn = () => {
    onHide();
    navigate("/login");
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      className="rounded-2xl overflow-hidden"
    >
      {/* Banner Header */}
      <div className="relative h-52 w-full bg-gray-900">
        {event.background_url && (
          <img
            src={event.background_url}
            alt={event.name}
            className="h-full w-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6 text-white">
          <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-2">
            {t.secretariats[event.belonging] || event.belonging}
          </span>
          <h2 className="text-2xl font-bold">{event.name}</h2>
        </div>
      </div>

      <Modal.Body className="p-6">
        {/* Schedule Grid */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t.labels.starts}
            </span>
            <p className="text-sm font-medium text-gray-800">
              {formatFullDateTime(event.start_date, language)}
            </p>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t.labels.ends}
            </span>
            <p className="text-sm font-medium text-gray-800">
              {formatFullDateTime(event.end_date, language)}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            About Event
          </h3>
          <p className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
            {event.description}
          </p>
        </div>

        {/* Coordinators */}
        {!!event.coords?.length && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {t.labels.coordinators}
            </h3>
            <div className="flex flex-wrap gap-2">
              {event.coords.map((coord, index) => (
                <div
                  key={`${coord.name}-${index}`}
                  className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-700"
                >
                  <span className="font-semibold text-gray-900 mr-1">
                    {coord.name}
                  </span>
                  <span className="text-gray-500">({coord.role})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action / Application Card */}
        <div className="rounded-xl border p-4 bg-gray-50">
          {!event.require_applying ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-green-800">
                  {t.actions.noApplicationNeeded}
                </p>
                <p className="text-xs text-gray-600">
                  {t.actions.noApplicationReason}
                </p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                Open Access
              </span>
            </div>
          ) : !isAuthenticated ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">
                  {t.actions.signInToApply}
                </p>
                <p className="text-xs text-gray-600">
                  {t.actions.signInReason}
                </p>
              </div>
              <button
                type="button"
                onClick={handleSignIn}
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition"
              >
                {t.actions.signInToApply}
              </button>
            </div>
          ) : statusLoading ? (
            <div
              className="py-2 text-center text-sm text-gray-500"
              role="status"
            >
              {t.actions.loadingStatus}
            </div>
          ) : statusError ? (
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-700">{t.actions.statusError}</p>
              <button
                type="button"
                onClick={() => refetchStatus()}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-gray-50"
              >
                {t.retry}
              </button>
            </div>
          ) : status?.applied && status.accepted ? (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3">
              <p className="font-bold text-green-800">{t.actions.accepted}</p>
              <p className="text-xs text-green-700">
                {t.actions.acceptedReason}
              </p>
            </div>
          ) : status?.applied && status.form_id ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-semibold text-amber-900">Form Required</p>
                <p className="text-xs text-amber-700">
                  {t.actions.goToFormReason}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/forms/${status.form_id}`)}
                className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition"
              >
                {t.actions.goToForm}
              </button>
            </div>
          ) : status?.applied ? (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <p className="font-bold text-blue-900">
                {t.actions.applicationSubmitted}
              </p>
              <p className="text-xs text-blue-700">
                Your application is currently under review.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">Ready to join?</p>
                <p className="text-xs text-gray-600">{t.actions.applyReason}</p>
                {applyError && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {t.actions.applyError}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleApply}
                disabled={isApplying}
                className="rounded-lg bg-green-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition disabled:opacity-50"
              >
                {isApplying ? "Applying..." : t.actions.apply}
              </button>
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer className="border-t border-gray-100 px-6 py-3">
        <button
          type="button"
          onClick={onHide}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          {t.actions.close}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventApplicationOverlay;
