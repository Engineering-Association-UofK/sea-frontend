import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Check, CheckCheck, Trash2, Loader2, ExternalLink, ArrowRight } from "lucide-react";
import {
  useInfiniteNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "@/features/profile/hooks/useProfile";
import { useLanguage } from "@/context/LanguageContext";
import { NotificationType, DataRedirect } from "@/features/profile/api/models";

export function NotificationsPanel() {
  const { translations } = useLanguage();
  const t = translations.profile.notifications;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteNotifications(10);

  const markRead = useMarkNotificationAsRead();
  const markAllRead = useMarkAllNotificationsAsRead();
  const deleteNotif = useDeleteNotification();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for trigger infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <Loader2 className="mx-auto h-6 w-6 animate-spin [color:var(--primary-color)]" />;
  }

  const allNotifications = data?.pages.flatMap((page) => page.list) || [];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{t.title}</h2>
        <button
          onClick={() => markAllRead.mutate()}
          className="flex items-center gap-1 text-xs font-medium hover:underline"
          style={{ color: "var(--primary-color)" }}
        >
          <CheckCheck className="h-4 w-4" /> {t.markAllRead}
        </button>
      </div>

      {allNotifications.length === 0 ? (
        <p className="text-sm text-gray-500">{t.empty}</p>
      ) : (
        <div className="space-y-3">
          {allNotifications.map((item) => {
            const isRedirect = item.type === NotificationType.Redirect || (item.type as string) === "redirect";
            const redirectData = isRedirect ? (item.data as DataRedirect) : null;
            const path = redirectData?.path || "";
            const isExternal = /^https?:\/\//i.test(path);
            const buttonText = redirectData?.title || item.title;

            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-lg border p-3.5 transition-colors sm:flex-row sm:items-start sm:justify-between"
                style={{
                  borderColor: item.is_read ? "#f3f4f6" : "var(--primary-color)",
                  backgroundColor: item.is_read ? "#ffffff" : "rgba(var(--primary-color), 0.05)",
                }}
              >
                <div className="space-y-1.5 flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.message}</p>

                  {/* Redirect Action Button */}
                  {isRedirect && path && (
                    <div className="pt-1">
                      {isExternal ? (
                        <a
                          href={path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
                          style={{ backgroundColor: "var(--primary-color)" }}
                        >
                          <span>{buttonText}</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <Link
                          to={path}
                          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
                          style={{ backgroundColor: "var(--primary-color)" }}
                        >
                          <span>{buttonText}</span>
                          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                        </Link>
                      )}
                    </div>
                  )}

                  <span className="block text-[10px] text-gray-400 pt-1">
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start">
                  {!item.is_read && (
                    <button
                      onClick={() => markRead.mutate(item.id)}
                      className="text-gray-400 transition-colors p-1"
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-color)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
                      title={t.markAsRead}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotif.mutate(item.id)}
                    className="text-gray-400 hover:text-red-600 p-1"
                    title={t.delete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Infinite scroll sentinel trigger & loading indicator */}
          <div ref={loadMoreRef} className="py-2 text-center">
            {isFetchingNextPage && (
              <Loader2 className="mx-auto h-5 w-5 animate-spin [color:var(--primary-color)]" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}