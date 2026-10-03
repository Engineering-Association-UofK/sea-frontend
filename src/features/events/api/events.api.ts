import apiClient from "@/api/axiosClient.ts";
import {
  EventViewListResponse,
  ApplicationStatus,
  ApplyResponse,
  EventListRequest,
} from "./models";

const PUBLIC_EVENT_ENDPOINT = "/v1/event";
const ACCOUNT_EVENT_ENDPOINT = "/v1/account/event";

export const eventsApi = {
  getEventList: async (
    params?: EventListRequest,
  ): Promise<EventViewListResponse> => {
    return apiClient.get<EventViewListResponse>(PUBLIC_EVENT_ENDPOINT, {
      params,
    });
  },

  checkStatus: async (id: number): Promise<ApplicationStatus> => {
    return apiClient.get<ApplicationStatus>(`${ACCOUNT_EVENT_ENDPOINT}/${id}`);
  },

  applyForEvent: async (id: number): Promise<ApplyResponse> => {
    return apiClient.post<ApplyResponse>(`${ACCOUNT_EVENT_ENDPOINT}/${id}`);
  },
};
