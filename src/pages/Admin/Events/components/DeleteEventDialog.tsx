import { useEffect } from "react";

interface DeleteEventDialogProps {
  eventName: string;
  isDeleting: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteEventDialog({
  eventName,
  isDeleting,
  error,
  onConfirm,
  onCancel,
}: DeleteEventDialogProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDeleting, onCancel]);

  return (
    <div
      className="ev-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onCancel();
      }}
    >
      <div
        className="ev-modal ev-modal--narrow"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="ev-delete-title"
      >
        <h2 id="ev-delete-title" className="ev-modal__title">
          Delete event?
        </h2>
        <p>
          <strong>{eventName}</strong> and its related data (coordinators,
          applications, participants) will be removed. This can’t be undone.
        </p>

        {error && <p className="ev-error">{error}</p>}

        <div className="ev-modal__footer">
          <button
            type="button"
            className="ev-btn"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="ev-btn ev-btn--danger-solid"
            onClick={onConfirm}
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
