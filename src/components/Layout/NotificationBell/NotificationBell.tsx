import React, { useState } from "react";
import { Badge, Button, Dropdown, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "@/features/profile/hooks/useProfile";
import { NotificationResponse } from "@/features/profile/api/models";
import {
  NotificationType,
  NotificationDataRedirect,
} from "@/features/notifications/api/models";
import {
  isInternalPath,
  isSafeExternalUrl,
  openExternalSafely,
} from "@/utils/links";

interface NotificationBellProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const PREVIEW_LIMIT = 8;

function formatRelativeTime(iso: string, language: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return language === "ar" ? "الآن" : "just now";
  if (diffMin < 60)
    return language === "ar" ? `منذ ${diffMin} د` : `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24)
    return language === "ar" ? `منذ ${diffHr} س` : `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7)
    return language === "ar" ? `منذ ${diffDay} يوم` : `${diffDay}d ago`;
  return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US");
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  isMobile = false,
  onItemClick,
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const { data, isLoading } = useNotifications(1, PREVIEW_LIMIT);
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();

  // Set while the "you're leaving this site" warning is open for an
  // external redirect; null means no warning is showing. We hold off on
  // navigating until it's confirmed.
  const [pendingRedirect, setPendingRedirect] =
    useState<NotificationDataRedirect | null>(null);

  const notifications = data?.list ?? [];
  // Best-effort count from the fetched page; there's no dedicated
  // unread-count endpoint on the backend yet.
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleOpen = (notification: NotificationResponse) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }

    if (notification.type === NotificationType.Redirect) {
      const redirect = notification.data as NotificationDataRedirect | null;

      if (redirect?.path) {
        if (isInternalPath(redirect.path)) {
          if (onItemClick) onItemClick();
          navigate(redirect.path);
          return;
        }

        if (isSafeExternalUrl(redirect.path)) {
          setPendingRedirect(redirect);
          return;
        }

        console.warn(
          "Notification redirect has an unusable path:",
          redirect.path,
        );
      }
    }

    if (onItemClick) onItemClick();
  };

  const handleCancelRedirect = () => setPendingRedirect(null);

  const handleConfirmRedirect = () => {
    if (pendingRedirect) {
      openExternalSafely(pendingRedirect.path);
    }
    setPendingRedirect(null);
    if (onItemClick) onItemClick();
  };

  const handleDelete = (
    e: React.MouseEvent,
    notification: NotificationResponse,
  ) => {
    e.stopPropagation();
    deleteNotification.mutate(notification.id);
  };

  const styles = (
    <style>{`
      .notif-list {
        max-height: 360px;
        overflow-y: auto;
      }
      .notif-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 10px 12px;
        cursor: pointer;
        border-radius: 8px;
        transition: background 0.15s;
      }
      .notif-item:hover {
        background: #F4F8FA;
      }
      .notif-item.is-unread {
        background: #EBF8FC;
      }
      .notif-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #22B2E6;
        margin-top: 6px;
        flex-shrink: 0;
      }
      .notif-dot.is-read {
        background: transparent;
      }
      .notif-body {
        flex: 1;
        min-width: 0;
      }
      .notif-title {
        font-weight: 600;
        font-size: 0.9rem;
        color: #1b1f24;
      }
      .notif-link-icon {
        margin-inline-start: 6px;
        font-size: 0.72rem;
        color: #9aa3af;
      }
      .notif-message {
        font-size: 0.82rem;
        color: #6b7280;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .notif-time {
        font-size: 0.72rem;
        color: #9aa3af;
      }
      .notif-remove {
        border: none;
        background: transparent;
        color: #9aa3af;
        padding: 2px 6px;
        line-height: 1;
        flex-shrink: 0;
      }
      .notif-remove:hover {
        color: #DC3545;
      }
      .notif-bell-badge {
        position: absolute;
        top: -2px;
        ${language === "ar" ? "left" : "right"}: -4px;
        font-size: 0.62rem;
        padding: 0.22em 0.4em;
      }
    `}</style>
  );

  const header = (
    <div className="d-flex align-items-center justify-content-between px-3 pt-2 pb-1">
      <span className="fw-bold">
        {language === "ar" ? "الإشعارات" : "Notifications"}
      </span>
      {unreadCount > 0 && (
        <button
          type="button"
          className="btn btn-link btn-sm p-0 text-decoration-none"
          style={{ color: "#22B2E6", fontSize: "0.8rem" }}
          disabled={markAllAsRead.isPending}
          onClick={(e) => {
            e.stopPropagation();
            markAllAsRead.mutate();
          }}
        >
          {language === "ar" ? "تحديد الكل كمقروء" : "Mark all as read"}
        </button>
      )}
    </div>
  );

  const body = (
    <div className="notif-list px-1">
      {isLoading ? (
        <div className="d-flex justify-content-center py-4">
          <Spinner animation="border" size="sm" variant="info" />
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-muted text-center small mb-0 py-4">
          {language === "ar" ? "لا توجد إشعارات" : "No notifications yet"}
        </p>
      ) : (
        notifications.map((n) => {
          const isRedirect = n.type === NotificationType.Redirect;
          const redirectData = isRedirect
            ? (n.data as NotificationDataRedirect | null)
            : null;
          const isExternalLink = Boolean(
            redirectData?.path && !isInternalPath(redirectData.path),
          );

          return (
            <div
              key={n.id}
              className={`notif-item ${!n.is_read ? "is-unread" : ""}`}
              onClick={() => handleOpen(n)}
            >
              <span className={`notif-dot ${n.is_read ? "is-read" : ""}`} />
              <div className="notif-body">
                <div className="notif-title">
                  {n.title}
                  {isRedirect && (
                    <i
                      className={`bi ${
                        isExternalLink
                          ? "bi-box-arrow-up-right"
                          : "bi-arrow-right-short"
                      } notif-link-icon`}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <span className="notif-message">{n.message}</span>
                <span className="notif-time">
                  {formatRelativeTime(n.created_at, language)}
                </span>
              </div>
              <button
                type="button"
                className="notif-remove"
                aria-label={language === "ar" ? "حذف" : "Dismiss"}
                onClick={(e) => handleDelete(e, n)}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
          );
        })
      )}
    </div>
  );

  // Warning shown before following an external redirect. Rendered as a
  // sibling of the Dropdown so it stays mounted and visible even if the
  // dropdown itself closes.
  const leavingSiteModal = (
    <Modal
      show={Boolean(pendingRedirect)}
      onHide={handleCancelRedirect}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="fs-6 fw-bold">
          {language === "ar" ? "أنت تغادر الموقع" : "You're leaving this site"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-2">
          {language === "ar" ? (
            <>
              هذا الرابط سينقلك إلى <strong>{pendingRedirect?.name}</strong>،
              خارج موقعنا.
            </>
          ) : (
            <>
              This link goes to <strong>{pendingRedirect?.name}</strong>,
              outside our website.
            </>
          )}
        </p>
        <p
          className="text-muted small mb-0"
          style={{ wordBreak: "break-all" }}
        >
          {pendingRedirect?.path}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={handleCancelRedirect}
        >
          {language === "ar" ? "إلغاء" : "Cancel"}
        </Button>
        <Button
          size="sm"
          className="border-0 text-white"
          style={{ backgroundColor: "#22B2E6" }}
          onClick={handleConfirmRedirect}
        >
          {language === "ar" ? "متابعة" : "Continue"}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  if (isMobile) {
    return (
      <div className="w-100">
        {styles}
        {header}
        {body}
        <hr className="my-2" />
        {leavingSiteModal}
      </div>
    );
  }

  return (
    <>
      <Dropdown align={language === "ar" ? "start" : "end"}>
        {styles}
        <Dropdown.Toggle
          variant="link"
          id="notification-bell-toggle"
          className="p-0 border-0 text-decoration-none d-flex align-items-center shadow-none position-relative"
        >
          <i
            className="bi bi-bell fs-5"
            style={{ color: "#333" }}
            aria-label={language === "ar" ? "الإشعارات" : "Notifications"}
          />
          {unreadCount > 0 && (
            <Badge bg="danger" pill className="notif-bell-badge">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu
          className="shadow-lg border-0 p-1 rounded-3 mt-2"
          style={{ minWidth: "320px" }}
        >
          {header}
          {body}
        </Dropdown.Menu>
      </Dropdown>
      {leavingSiteModal}
    </>
  );
};

export default NotificationBell;
