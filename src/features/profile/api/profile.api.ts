// profile.api.ts
import apiClient from "@/api/axiosClient.ts";
import {
  UserProfileResponse,
  UserProfileSummaryResponse,
  UpdateProfileRequest,
  UpdateUsernameRequest,
  UpdateEmailRequest,
  UpdatePasswordRequest,
  CheckUsernameResponse,
  TicketResponse,
  CertListParams,
  CertListResponse,
  NotificationsListResponse,
  TransactionResponse,
} from "./models";

const ACCOUNT_ENDPOINT = "/v1/account";

export const profileApi = {
  // --- Profile Queries & Mutations ---
  getProfile: async (): Promise<UserProfileResponse> => {
    return apiClient.get<UserProfileResponse>(ACCOUNT_ENDPOINT);
  },

  getProfileSummary: async (): Promise<UserProfileSummaryResponse> => {
    return apiClient.get<UserProfileSummaryResponse>(
      `${ACCOUNT_ENDPOINT}/summary`,
    );
  },

  updateProfile: async (
    payload: UpdateProfileRequest,
  ): Promise<TransactionResponse> => {
    return apiClient.put<TransactionResponse>(ACCOUNT_ENDPOINT, payload);
  },

  updatePicture: async (file: File): Promise<TransactionResponse> => {
    const formData = new FormData();
    formData.append("picture", file);
    return apiClient.put<TransactionResponse>(
      `${ACCOUNT_ENDPOINT}/picture`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },

  updateUsername: async (
    payload: UpdateUsernameRequest,
  ): Promise<TransactionResponse> => {
    return apiClient.put<TransactionResponse>(
      `${ACCOUNT_ENDPOINT}/username`,
      payload,
    );
  },

  checkUsernameAvailability: async (
    payload: UpdateUsernameRequest,
  ): Promise<CheckUsernameResponse> => {
    return apiClient.post<CheckUsernameResponse>(
      "/v1/auth/check-username",
      payload,
    );
  },

  updateEmail: async (
    payload: UpdateEmailRequest,
  ): Promise<TransactionResponse> => {
    return apiClient.put<TransactionResponse>(
      `${ACCOUNT_ENDPOINT}/email`,
      payload,
    );
  },

  updatePassword: async (
    payload: UpdatePasswordRequest,
  ): Promise<TransactionResponse> => {
    return apiClient.put<TransactionResponse>(
      `${ACCOUNT_ENDPOINT}/password`,
      payload,
    );
  },

  // --- Election Ticket ---
  getElectionTicket: async (): Promise<TicketResponse> => {
    return apiClient.get<TicketResponse>(`${ACCOUNT_ENDPOINT}/election/ticket`);
  },

  // --- Certificates ---
  getCertificates: async (
    params?: CertListParams,
  ): Promise<CertListResponse> => {
    return apiClient.get<CertListResponse>(`${ACCOUNT_ENDPOINT}/certificates`, {
      params,
    });
  },

  downloadCertificate: async (id: number): Promise<Blob> => {
    return apiClient.get(`${ACCOUNT_ENDPOINT}/cert/${id}`, {
      responseType: "blob",
    });
  },

  // --- Notifications ---
  getNotifications: async (
    page = 1,
    limit = 10,
  ): Promise<NotificationsListResponse> => {
    return apiClient.get<NotificationsListResponse>(
      `${ACCOUNT_ENDPOINT}/notifications`,
      {
        params: { page, limit },
      },
    );
  },

  markNotificationAsRead: async (id: number): Promise<TransactionResponse> => {
    return apiClient.post<TransactionResponse>(
      `${ACCOUNT_ENDPOINT}/notifications/${id}`,
    );
  },

  markAllNotificationsAsRead: async (): Promise<TransactionResponse> => {
    return apiClient.post<TransactionResponse>(
      `${ACCOUNT_ENDPOINT}/notifications`,
    );
  },

  deleteNotification: async (id: number): Promise<TransactionResponse> => {
    return apiClient.delete<TransactionResponse>(
      `${ACCOUNT_ENDPOINT}/notifications/${id}`,
    );
  },
};
