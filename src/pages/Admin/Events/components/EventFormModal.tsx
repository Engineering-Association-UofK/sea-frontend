import { FormEvent, useEffect, useState } from "react";
import { Secretariat } from "@/features/events/api/models";
import {
  AdminEventDetail,
  EventRequest,
} from "@/features/events/api/adminModels";
import {
  useAdminEvent,
  useCreateEvent,
  useUpdateEvent,
} from "@/features/events/hooks/useAdminEvents";
import ImagePickerModal from "@/components/ImagePickerModal";
import {
  SECRETARIAT_OPTIONS,
  getErrorMessage,
  inputValueToIso,
  isoToInputValue,
} from "../utils";

interface EventFormModalProps {
  /** null = create a new event, number = edit that event */
  eventId: number | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

interface FormState {
  name: string;
  description: string;
  background_id: string;
  belonging: Secretariat | "";
  require_applying: boolean;
  form_id: string;
  max_applications: string;
  start_date: string;
  end_date: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  background_id: "",
  belonging: "",
  require_applying: false,
  form_id: "",
  max_applications: "",
  start_date: "",
  end_date: "",
};

function toFormState(event: AdminEventDetail): FormState {
  return {
    name: event.name,
    description: event.description,
    background_id: String(event.background_id),
    belonging: event.belonging,
    require_applying: event.require_applying,
    form_id:
      event.form_id != null && event.form_id !== 0 ? String(event.form_id) : "",
    max_applications:
      event.max_applications != null && event.max_applications !== 0
        ? String(event.max_applications)
        : "",
    start_date: isoToInputValue(event.start_date),
    end_date: isoToInputValue(event.end_date),
  };
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.description.trim()) errors.description = "Description is required";

  const bg = Number(form.background_id);
  if (!form.background_id || !Number.isInteger(bg) || bg <= 0) {
    errors.background_id = "Select a background image";
  }

  if (!form.belonging) errors.belonging = "Choose a secretariat";

  if (!form.start_date) errors.start_date = "Start date is required";
  if (!form.end_date) errors.end_date = "End date is required";
  if (
    form.start_date &&
    form.end_date &&
    new Date(form.end_date) < new Date(form.start_date)
  ) {
    errors.end_date = "End date must be after the start date";
  }

  if (form.form_id) {
    const f = Number(form.form_id);
    if (!Number.isInteger(f) || f <= 0) errors.form_id = "Invalid form ID";
  }
  if (form.max_applications) {
    const m = Number(form.max_applications);
    if (!Number.isInteger(m) || m <= 0) {
      errors.max_applications = "Must be a positive number";
    }
  }

  return errors;
}

function toRequest(form: FormState): EventRequest {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    background_id: Number(form.background_id),
    belonging: form.belonging as Secretariat,
    require_applying: form.require_applying,
    // Application settings only matter when applying is required
    form_id:
      form.require_applying && form.form_id ? Number(form.form_id) : null,
    max_applications:
      form.require_applying && form.max_applications
        ? Number(form.max_applications)
        : null,
    start_date: inputValueToIso(form.start_date),
    end_date: inputValueToIso(form.end_date),
  };
}

export default function EventFormModal({
  eventId,
  onClose,
  onSaved,
}: EventFormModalProps) {
  const isEdit = eventId !== null;
  const detailQuery = useAdminEvent(eventId);

  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Pre-fill once the event details arrive (edit mode only)
  useEffect(() => {
    if (detailQuery.data) setForm(toFormState(detailQuery.data));
  }, [detailQuery.data]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSaving && !showImagePicker) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSaving, showImagePicker, onClose]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    try {
      const body = toRequest(form);
      if (isEdit) {
        await updateMutation.mutateAsync({ id: eventId, ...body });
        onSaved("Event updated successfully");
      } else {
        await createMutation.mutateAsync(body);
        onSaved("Event created successfully");
      }
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Couldn't save the event. Try again."));
    }
  };

  const handleImageSelect = (id: number | string) => {
    setField("background_id", String(id));
    setShowImagePicker(false);
  };

  const isLoadingDetails = isEdit && detailQuery.isLoading;
  const detailsFailed = isEdit && detailQuery.isError;

  return (
    <>
      <div
        className="ev-overlay"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget && !isSaving) onClose();
        }}
      >
        <div
          className="ev-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ev-form-title"
        >
          <h2 id="ev-form-title" className="ev-modal__title">
            {isEdit ? "Edit event" : "Create event"}
          </h2>

          {isLoadingDetails && <p className="ev-muted">Loading event…</p>}

          {detailsFailed && (
            <>
              <p className="ev-error">
                {getErrorMessage(detailQuery.error, "Couldn't load this event.")}
              </p>
              <div className="ev-modal__footer">
                <button type="button" className="ev-btn" onClick={onClose}>
                  Close
                </button>
                <button
                  type="button"
                  className="ev-btn ev-btn--primary"
                  onClick={() => detailQuery.refetch()}
                >
                  Retry
                </button>
              </div>
            </>
          )}

          {!isLoadingDetails && !detailsFailed && (
            <form onSubmit={handleSubmit} noValidate className="ev-form">
              <label className="ev-field">
                <span>Name</span>
                <input
                  className="ev-input"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  autoFocus
                />
                {errors.name && <small className="ev-error">{errors.name}</small>}
              </label>

              <label className="ev-field">
                <span>Description</span>
                <textarea
                  className="ev-input"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                />
                {errors.description && (
                  <small className="ev-error">{errors.description}</small>
                )}
              </label>

              <div className="ev-form__row">
                <label className="ev-field">
                  <span>Secretariat</span>
                  <select
                    className="ev-input"
                    value={form.belonging}
                    onChange={(e) =>
                      setField("belonging", e.target.value as Secretariat | "")
                    }
                  >
                    <option value="">Select…</option>
                    {SECRETARIAT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  {errors.belonging && (
                    <small className="ev-error">{errors.belonging}</small>
                  )}
                </label>

                <div className="ev-field">
                  <span>Background ID</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      className="ev-input"
                      inputMode="numeric"
                      placeholder="Select image…"
                      value={form.background_id}
                      disabled
                      readOnly
                    />
                    <button
                      type="button"
                      className="ev-btn"
                      onClick={() => setShowImagePicker(true)}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Select Image
                    </button>
                  </div>
                  {errors.background_id && (
                    <small className="ev-error">{errors.background_id}</small>
                  )}
                </div>
              </div>

              <div className="ev-form__row">
                <label className="ev-field">
                  <span>Starts</span>
                  <input
                    type="datetime-local"
                    className="ev-input"
                    value={form.start_date}
                    onChange={(e) => setField("start_date", e.target.value)}
                  />
                  {errors.start_date && (
                    <small className="ev-error">{errors.start_date}</small>
                  )}
                </label>

                <label className="ev-field">
                  <span>Ends</span>
                  <input
                    type="datetime-local"
                    className="ev-input"
                    value={form.end_date}
                    onChange={(e) => setField("end_date", e.target.value)}
                  />
                  {errors.end_date && (
                    <small className="ev-error">{errors.end_date}</small>
                  )}
                </label>
              </div>

              <label className="ev-check">
                <input
                  type="checkbox"
                  checked={form.require_applying}
                  onChange={(e) => setField("require_applying", e.target.checked)}
                />
                <span>Require users to apply</span>
              </label>

              {form.require_applying && (
                <div className="ev-form__row">
                  <label className="ev-field">
                    <span>Application form ID (optional)</span>
                    <input
                      className="ev-input"
                      inputMode="numeric"
                      value={form.form_id}
                      onChange={(e) => setField("form_id", e.target.value)}
                    />
                    {errors.form_id && (
                      <small className="ev-error">{errors.form_id}</small>
                    )}
                  </label>

                  <label className="ev-field">
                    <span>Max applications (optional)</span>
                    <input
                      className="ev-input"
                      inputMode="numeric"
                      value={form.max_applications}
                      onChange={(e) =>
                        setField("max_applications", e.target.value)
                      }
                    />
                    {errors.max_applications && (
                      <small className="ev-error">
                        {errors.max_applications}
                      </small>
                    )}
                  </label>
                </div>
              )}

              {submitError && <p className="ev-error">{submitError}</p>}

              <div className="ev-modal__footer">
                <button
                  type="button"
                  className="ev-btn"
                  onClick={onClose}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ev-btn ev-btn--primary"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving…" : isEdit ? "Save changes" : "Create event"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <ImagePickerModal
        show={showImagePicker}
        onHide={() => setShowImagePicker(false)}
        onSelect={handleImageSelect}
      />
    </>
  );
}
