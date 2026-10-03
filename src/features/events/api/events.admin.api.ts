import apiClient from "@/api/axiosClient.ts";
import {
  AdminEventDetail,
  AdminEventListRequest,
  AdminEventListResponse,
  EventRequest,
  EventUpdateRequest,
  TransactionResponse,
} from "./adminModels";

const ADMIN_EVENT_ENDPOINT = "/v1/admin/event";

export const adminEventsApi = {
  getEventList: async (
    params?: AdminEventListRequest,
  ): Promise<AdminEventListResponse> => {
    return apiClient.get<AdminEventListResponse>(ADMIN_EVENT_ENDPOINT, {
      params,
    });
  },

  getEvent: async (id: number): Promise<AdminEventDetail> => {
    return apiClient.get<AdminEventDetail>(`${ADMIN_EVENT_ENDPOINT}/${id}`);
  },

  createEvent: async (body: EventRequest): Promise<TransactionResponse> => {
    return apiClient.post<TransactionResponse>(ADMIN_EVENT_ENDPOINT, body);
  },

  updateEvent: async (
    body: EventUpdateRequest,
  ): Promise<TransactionResponse> => {
    return apiClient.put<TransactionResponse>(ADMIN_EVENT_ENDPOINT, body);
  },

  deleteEvent: async (id: number): Promise<TransactionResponse> => {
    return apiClient.delete<TransactionResponse>(
      `${ADMIN_EVENT_ENDPOINT}/${id}`,
    );
  },
};
