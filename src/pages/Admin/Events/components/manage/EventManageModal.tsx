import { KeyboardEvent as ReactKeyboardEvent, useEffect, useState } from "react";
import ApplicationsTab from "./ApplicationsTab";
import CoordinatorsTab from "./CoordinatorsTab";
import ParticipantsTab from "./ParticipantsTab";

type TabId = "coords" | "applications" | "participants";

const TABS: { id: TabId; label: string }[] = [
  { id: "coords", label: "Coordinators" },
  { id: "applications", label: "Applications" },
  { id: "participants", label: "Participants" },
];

interface EventManageModalProps {
  eventId: number;
  eventName: string;
  requireApplying: boolean;
  onClose: () => void;
}

export default function EventManageModal({
  eventId,
  eventName,
  requireApplying,
  onClose,
}: EventManageModalProps) {
  const [tab, setTab] = useState<TabId>("coords");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Arrow keys move between tabs, as expected from a tablist
  const handleTabKey = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const index = TABS.findIndex((t) => t.id === tab);
    const delta = e.key === "ArrowRight" ? 1 : -1;
    const next = TABS[(index + delta + TABS.length) % TABS.length];
    setTab(next.id);
    document.getElementById(`ev-tab-${next.id}`)?.focus();
  };

  return (
    <div
      className="ev-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="ev-modal ev-modal--wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ev-manage-title"
      >
        <div className="ev-manage-head">
          <div>
            <h2 id="ev-manage-title" className="ev-modal__title">
              Manage event
            </h2>
            <p className="ev-muted ev-manage-name">
              {eventName} · #{eventId}
            </p>
          </div>
          <button
            type="button"
            className="ev-btn ev-btn--ghost"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="ev-tabs" role="tablist" aria-label="Event management">
          {TABS.map((t) => (
            <button
              key={t.id}
              id={`ev-tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              aria-controls="ev-tabpanel"
              tabIndex={tab === t.id ? 0 : -1}
              className={`ev-tab ${tab === t.id ? "is-active" : ""}`}
              onClick={() => setTab(t.id)}
              onKeyDown={handleTabKey}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          id="ev-tabpanel"
          role="tabpanel"
          aria-labelledby={`ev-tab-${tab}`}
          className="ev-tabpanel"
        >
          {tab === "coords" && <CoordinatorsTab eventId={eventId} />}
          {tab === "applications" && (
            <>
              {!requireApplying && (
                <p className="ev-notice ev-notice--info">
                  This event doesn't require applying, so new applications
                  aren't expected.
                </p>
              )}
              <ApplicationsTab eventId={eventId} />
            </>
          )}
          {tab === "participants" && <ParticipantsTab eventId={eventId} />}
        </div>
      </div>
    </div>
  );
}
