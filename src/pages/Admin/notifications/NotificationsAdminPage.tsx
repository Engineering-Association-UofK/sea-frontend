import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BulkCreateForUsersRequest,
  BulkNotificationRequest,
  NotificationType,
} from "@/features/notifications/api/models";
import {
  useBulkCreateNotificationForAllUsers,
  useBulkCreateNotificationsForUsers,
} from "@/features/notifications/hooks/useNotifications";
import { isInternalPath, isSafeExternalUrl } from "@/utils/links";
import { getErrorMessage } from "@/pages/Admin/Events/utils";
import { parseUserIds } from "./utils";
// Reuses the shared admin look (buttons, inputs, modal, notices) from events
import "@/pages/Admin/Events/events.css";
import "./notifications.css";

type Audience = "users" | "all";

interface FormState {
  audience: Audience;
  type: NotificationType;
  title: string;
  message: string;
  userIds: string;
  redirectName: string;
  redirectPath: string;
}

const EMPTY_FORM: FormState = {
  audience: "users",
  type: NotificationType.Basic,
  title: "",
  message: "",
  userIds: "",
  redirectName: "",
  redirectPath: "",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

interface Notice {
  type: "success" | "error";
  text: string;
}

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (!form.title.trim()) errors.title = "Title is required";
  if (!form.message.trim()) errors.message = "Message is required";

  if (form.audience === "users") {
    const { ids, invalid } = parseUserIds(form.userIds);
    if (invalid.length > 0) {
      errors.userIds = `Not valid IDs: ${invalid.slice(0, 5).join(", ")}${
        invalid.length > 5 ? "…" : ""
      }`;
    } else if (ids.length === 0) {
      errors.userIds = "Enter at least one user ID";
    }
  }

  if (form.type === NotificationType.Redirect) {
    if (!form.redirectName.trim()) errors.redirectName = "Name is required";
    const path = form.redirectPath.trim();
    if (!path) {
      errors.redirectPath = "Path is required";
    } else if (!isInternalPath(path) && !isSafeExternalUrl(path)) {
      errors.redirectPath =
        "Use an in-site path like /about/association or a full http(s) link";
    }
  }

  return errors;
}

function buildPayload(form: FormState): BulkNotificationRequest {
  const base = { title: form.title.trim(), message: form.message.trim() };
  if (form.type === NotificationType.Redirect) {
    return {
      ...base,
      type: NotificationType.Redirect,
      data: {
        name: form.redirectName.trim(),
        path: form.redirectPath.trim(),
      },
    };
  }
  return { ...base, type: NotificationType.Basic, data: null };
}

export default function NotificationsAdminPage() {
  const usersMutation = useBulkCreateNotificationsForUsers();
  const allMutation = useBulkCreateNotificationForAllUsers();
  const isSending = usersMutation.isPending || allMutation.isPending;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<Notice | null>(null);
  const [confirmAll, setConfirmAll] = useState(false);

  const parsedIds = useMemo(() => parseUserIds(form.userIds), [form.userIds]);

  useEffect(() => {
    if (!notice || notice.type === "error") return;
    const timer = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const send = async () => {
    setNotice(null);
    try {
      const payload = buildPayload(form);
      if (form.audience === "all") {
        await allMutation.mutateAsync(payload);
        setNotice({
          type: "success",
          text: "Notification sent to all users.",
        });
      } else {
        const body = { ...payload, ids: parsedIds.ids } as BulkCreateForUsersRequest;
        await usersMutation.mutateAsync(body);
        const n = parsedIds.ids.length;
        setNotice({
          type: "success",
          text: `Notification sent to ${n} user${n === 1 ? "" : "s"}.`,
        });
      }
      // Keep audience/type so several similar sends are quick
      setForm((prev) => ({
        ...EMPTY_FORM,
        audience: prev.audience,
        type: prev.type,
      }));
    } catch (err) {
      setNotice({
        type: "error",
        text: getErrorMessage(err, "Couldn't send the notification."),
      });
    } finally {
      setConfirmAll(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // Broadcasting can't be undone, so make the admin confirm it
    if (form.audience === "all") setConfirmAll(true);
    else void send();
  };

  const isRedirect = form.type === NotificationType.Redirect;
  const previewPath = form.redirectPath.trim();
  const previewExternal =
    previewPath !== "" && !isInternalPath(previewPath);

  return (
    <div className="ev-page nt-page">
      <header className="ev-header">
        <div>
          <h1 className="ev-title">Send notifications</h1>
          <p className="ev-muted">
            Notify specific users by ID, or broadcast to everyone.
          </p>
        </div>
      </header>

      {notice && (
        <div
          className={`ev-notice ev-notice--${notice.type}`}
          role={notice.type === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {notice.text}
        </div>
      )}

      <div className="nt-layout">
        <form className="nt-card" onSubmit={handleSubmit} noValidate>
          <div className="nt-group">
            <span>Send to</span>
            <div className="nt-segment" role="group" aria-label="Audience">
              <button
                type="button"
                aria-pressed={form.audience === "users"}
                onClick={() => setField("audience", "users")}
              >
                Specific users
              </button>
              <button
                type="button"
                aria-pressed={form.audience === "all"}
                onClick={() => setField("audience", "all")}
              >
                All users
              </button>
            </div>
          </div>

          {form.audience === "users" && (
            <label className="nt-group">
              <span>User IDs</span>
              <textarea
                className="ev-input"
                rows={3}
                placeholder="12, 40, 97"
                value={form.userIds}
                onChange={(e) => setField("userIds", e.target.value)}
              />
              <small className="nt-hint">
                Separate with commas, spaces or new lines. Duplicates are
                ignored.
              </small>
              {errors.userIds && (
                <small className="ev-error">{errors.userIds}</small>
              )}
              {parsedIds.ids.length > 0 && !errors.userIds && (
                <>
                  <small className="nt-hint">
                    {parsedIds.ids.length} recipient
                    {parsedIds.ids.length === 1 ? "" : "s"}
                    {parsedIds.duplicates > 0
                      ? ` (${parsedIds.duplicates} duplicate${
                          parsedIds.duplicates === 1 ? "" : "s"
                        } removed)`
                      : ""}
                  </small>
                  <div className="nt-chips">
                    {parsedIds.ids.slice(0, 30).map((id) => (
                      <span key={id} className="nt-chip">
                        {id}
                      </span>
                    ))}
                    {parsedIds.ids.length > 30 && (
                      <span className="nt-chip">
                        +{parsedIds.ids.length - 30} more
                      </span>
                    )}
                  </div>
                </>
              )}
            </label>
          )}

          <div className="nt-group">
            <span>Type</span>
            <div className="nt-segment" role="group" aria-label="Type">
              <button
                type="button"
                aria-pressed={form.type === NotificationType.Basic}
                onClick={() => setField("type", NotificationType.Basic)}
              >
                Basic
              </button>
              <button
                type="button"
                aria-pressed={isRedirect}
                onClick={() => setField("type", NotificationType.Redirect)}
              >
                Redirect
              </button>
            </div>
            <small className="nt-hint">
              {isRedirect
                ? "Clicking it takes the user to a page or link."
                : "Plain message, nothing happens on click."}
            </small>
          </div>

          <label className="nt-group">
            <span>Title</span>
            <input
              className="ev-input"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
            />
            {errors.title && <small className="ev-error">{errors.title}</small>}
          </label>

          <label className="nt-group">
            <span>Message</span>
            <textarea
              className="ev-input"
              rows={4}
              value={form.message}
              onChange={(e) => setField("message", e.target.value)}
            />
            {errors.message && (
              <small className="ev-error">{errors.message}</small>
            )}
          </label>

          {isRedirect && (
            <>
              <label className="nt-group">
                <span>Destination name</span>
                <input
                  className="ev-input"
                  placeholder="e.g. Association page"
                  value={form.redirectName}
                  onChange={(e) => setField("redirectName", e.target.value)}
                />
                <small className="nt-hint">
                  Shown to users in the "leaving this site" warning for
                  external links.
                </small>
                {errors.redirectName && (
                  <small className="ev-error">{errors.redirectName}</small>
                )}
              </label>

              <label className="nt-group">
                <span>Path or link</span>
                <input
                  className="ev-input"
                  placeholder="/about/association or https://…"
                  value={form.redirectPath}
                  onChange={(e) => setField("redirectPath", e.target.value)}
                />
                {errors.redirectPath && (
                  <small className="ev-error">{errors.redirectPath}</small>
                )}
              </label>
            </>
          )}

          <div className="ev-modal__footer">
            <button
              type="button"
              className="ev-btn"
              disabled={isSending}
              onClick={() => {
                setForm(EMPTY_FORM);
                setErrors({});
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              className="ev-btn ev-btn--primary"
              disabled={isSending}
            >
              {isSending ? "Sending…" : "Send notification"}
            </button>
          </div>
        </form>

        <aside className="nt-card nt-preview" aria-label="Preview">
          <h3>Preview</h3>
          <div className="nt-preview-item">
            <span className="nt-preview-dot" />
            <div>
              <div className="nt-preview-title">
                {form.title.trim() || "Title"}
              </div>
              <div className="nt-preview-msg">
                {form.message.trim() || "Your message appears here."}
              </div>
              {isRedirect && previewPath && (
                <div className="nt-preview-link">
                  {previewExternal
                    ? "External link (users get a warning first): "
                    : "In-site: "}
                  {form.redirectName.trim() && (
                    <strong>{form.redirectName.trim()} · </strong>
                  )}
                  {previewPath}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {confirmAll && (
        <div
          className="ev-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isSending) setConfirmAll(false);
          }}
        >
          <div
            className="ev-modal ev-modal--narrow"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="nt-confirm-title"
          >
            <h2 id="nt-confirm-title" className="ev-modal__title">
              Send to all users?
            </h2>
            <p>
              "<strong>{form.title.trim()}</strong>" will be delivered to every
              user. This can't be undone.
            </p>
            <div className="ev-modal__footer">
              <button
                type="button"
                className="ev-btn"
                disabled={isSending}
                onClick={() => setConfirmAll(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ev-btn ev-btn--primary"
                disabled={isSending}
                onClick={() => void send()}
              >
                {isSending ? "Sending…" : "Send to everyone"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
