// Models for the admin bulk-notification endpoints.
//
//   type === "basic"    -> data is always null
//   type === "redirect" -> data is { name, path }
//
// `path` can be an in-app route ("/about/association") or an external link
// ("https://partner.example.com") — the frontend tells them apart by the
// string's shape (see src/utils/links.ts), not by anything in this payload.

export enum NotificationType {
  Basic = "basic",
  Redirect = "redirect",
}

export interface NotificationDataRedirect {
  name: string;
  path: string;
}

export type NotificationData = NotificationDataRedirect | null;

interface BasicNotificationFields {
  title: string;
  message: string;
  type: NotificationType.Basic;
  data?: null;
}

interface RedirectNotificationFields {
  title: string;
  message: string;
  type: NotificationType.Redirect;
  data: NotificationDataRedirect;
}

// POST /admin/notifications/all - notify every user.
export type BulkNotificationRequest =
  | BasicNotificationFields
  | RedirectNotificationFields;

// POST /admin/notifications - notify a specific set of users.
export type BulkCreateForUsersRequest =
  | (BasicNotificationFields & { ids: number[] })
  | (RedirectNotificationFields & { ids: number[] });

export interface TransactionResponse {
  status: number;
  message: string;
  id?: number | string;
}
