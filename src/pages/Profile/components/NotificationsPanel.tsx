import { Check, CheckCheck, Trash2, Loader2 } from "lucide-react";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "@/features/profile/hooks/useProfile";
import { useLanguage } from "@/context/LanguageContext";

export function NotificationsPanel() {
  const { translations } = useLanguage();
  const t = translations.profile.notifications;

  const { data, isLoading } = useNotifications(1, 10);
  const markRead = useMarkNotificationAsRead();
  const markAllRead = useMarkAllNotificationsAsRead();
  const deleteNotif = useDeleteNotification();

  if (isLoading) return <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600" />;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{t.title}</h2>
        <button
          onClick={() => markAllRead.mutate()}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
        >
          <CheckCheck className="h-4 w-4" /> {t.markAllRead}
        </button>
      </div>

      {!data?.notifications?.length ? (
        <p className="text-sm text-gray-500">{t.empty}</p>
      ) : (
        <div className="space-y-3">
          {data.notifications.map((item) => (
            <div
              key={item.id}
              className={`flex items-start justify-between rounded-lg border p-3 ${
                item.is_read ? "border-gray-100 bg-white" : "border-blue-100 bg-blue-50/50"
              }`}
            >
              <div>
                <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-600">{item.message}</p>
                <span className="text-[10px] text-gray-400">
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!item.is_read && (
                  <button
                    onClick={() => markRead.mutate(item.id)}
                    className="text-gray-400 hover:text-blue-600"
                    title={t.markAsRead}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotif.mutate(item.id)}
                  className="text-gray-400 hover:text-red-600"
                  title={t.delete}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}