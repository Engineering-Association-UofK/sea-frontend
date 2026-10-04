import apiClient from "@/api/axiosClient";
import {
  BulkCreateForUsersRequest,
  BulkNotificationRequest,
  TransactionResponse,
} from "./models";

const ADMIN_NOTIFICATIONS_ENDPOINT = "/v1/admin/notifications";

export const adminNotificationsApi = {
  // Create one notification for every user ID listed in the request.
  bulkCreateForUsers: async (
    payload: BulkCreateForUsersRequest,
  ): Promise<TransactionResponse> => {
    return apiClient.post<TransactionResponse>(
      ADMIN_NOTIFICATIONS_ENDPOINT,
      payload,
    );
  },

  // Create one notification for every user in the system.
  bulkCreateForAllUsers: async (
    payload: BulkNotificationRequest,
  ): Promise<TransactionResponse> => {
    return apiClient.post<TransactionResponse>(
      `${ADMIN_NOTIFICATIONS_ENDPOINT}/all`,
      payload,
    );
  },
};
