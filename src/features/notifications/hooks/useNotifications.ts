import { useMutation } from "@tanstack/react-query";
import { adminNotificationsApi } from "../api/notifications.api";
import {
  BulkCreateForUsersRequest,
  BulkNotificationRequest,
} from "../api/models";

export function useBulkCreateNotificationsForUsers() {
  return useMutation({
    mutationFn: (payload: BulkCreateForUsersRequest) =>
      adminNotificationsApi.bulkCreateForUsers(payload),
  });
}

export function useBulkCreateNotificationForAllUsers() {
  return useMutation({
    mutationFn: (payload: BulkNotificationRequest) =>
      adminNotificationsApi.bulkCreateForAllUsers(payload),
  });
}
