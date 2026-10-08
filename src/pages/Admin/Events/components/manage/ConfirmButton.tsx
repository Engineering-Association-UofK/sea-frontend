import { useEffect, useState } from "react";

interface ConfirmButtonProps {
  label: string;
  confirmLabel?: string;
  disabled?: boolean;
  onConfirm: () => void;
}

/**
 * Two-step destructive button: the first click asks "Sure?", the second runs the action.
 * Reverts on its own after a few seconds so a stray click never lingers armed.
 */
export default function ConfirmButton({
  label,
  confirmLabel = "Confirm",
  disabled,
  onConfirm,
}: ConfirmButtonProps) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(timer);
  }, [armed]);

  if (!armed) {
    return (
      <button
        type="button"
        className="ev-btn ev-btn--small ev-btn--danger"
        disabled={disabled}
        onClick={() => setArmed(true)}
      >
        {label}
      </button>
    );
  }

  return (
    <span className="ev-confirm">
      <button
        type="button"
        className="ev-btn ev-btn--small ev-btn--danger-solid"
        disabled={disabled}
        onClick={() => {
          setArmed(false);
          onConfirm();
        }}
        autoFocus
      >
        {confirmLabel}
      </button>
      <button
        type="button"
        className="ev-btn ev-btn--small"
        onClick={() => setArmed(false)}
      >
        Cancel
      </button>
    </span>
  );
}
