import apiClient from "@/api/axiosClient.ts";
import { TransactionResponse } from "./adminModels";
import {
  AddCoordsRequest,
  CoordInput,
  EventApplication,
  EventApplicationListResponse,
  EventCoord,
  EventParticipant,
  EventParticipantListResponse,
  ParticipationListRequest,
} from "./manageModels";

const ADMIN_EVENT_ENDPOINT = "/v1/admin/event";

// ---- Normalizers -----------------------------------------------------------

type Raw = Record<string, unknown>;

function pick(raw: Raw, ...keys: string[]): unknown {
  for (const key of keys) {
    if (raw[key] !== undefined && raw[key] !== null) return raw[key];
  }
  return undefined;
}

const num = (raw: Raw, ...keys: string[]): number => Number(pick(raw, ...keys) ?? 0);
const str = (raw: Raw, ...keys: string[]): string => String(pick(raw, ...keys) ?? "");
const bool = (raw: Raw, ...keys: string[]): boolean => Boolean(pick(raw, ...keys));

/** fall back to an empty array. */
function toArray(value: unknown): Raw[] {
  return Array.isArray(value) ? (value as Raw[]) : [];
}

function toCoord(raw: Raw): EventCoord {
  return {
    id: num(raw, "id", "ID"),
    name: str(raw, "name", "Name"),
    role: str(raw, "role", "Role"),
  };
}

function toApplication(raw: Raw): EventApplication {
  return {
    id: num(raw, "id", "ID"),
    event_id: num(raw, "event_id", "EventID"),
    user_id: num(raw, "user_id", "UserID"),
    username: str(raw, "username", "Username"),
    photo_url: str(raw, "photo_url", "PhotoURL"),
    form_id: num(raw, "form_id", "FormID"),
    accepted: bool(raw, "accepted", "Accepted"),
    started_at: str(raw, "started_at", "StartedAt"),
  };
}

function toParticipant(raw: Raw): EventParticipant {
  return {
    id: num(raw, "id", "ID"),
    event_id: num(raw, "event_id", "EventID"),
    user_id: num(raw, "user_id", "UserID"),
    username: str(raw, "username", "Username"),
    photo_url: str(raw, "photo_url", "PhotoURL"),
    joined_at: str(raw, "joined_at", "JoinedAt"),
  };
}

function toPagination(raw: Raw) {
  return {
    total_pages: num(raw, "total_pages"),
    current_page: num(raw, "current_page") || 1,
    count: num(raw, "count"),
  };
}

// ---- API -------------------------------------------------------------------

export const adminEventManageApi = {
  // Coordinators

  getCoords: async (eventId: number): Promise<EventCoord[]> => {
    const res = await apiClient.get<unknown>(
      `${ADMIN_EVENT_ENDPOINT}/${eventId}/coord`,
    );
    const rows = Array.isArray(res) ? res : (res as Raw | null)?.list;
    return toArray(rows).map(toCoord);
  },

  addCoords: async (
    eventId: number,
    body: AddCoordsRequest,
  ): Promise<TransactionResponse> => {
    return apiClient.post<TransactionResponse>(
      `${ADMIN_EVENT_ENDPOINT}/${eventId}/coord`,
      body,
    );
  },

  updateCoord: async (
    eventId: number,
    coordId: number,
    body: CoordInput,
  ): Promise<TransactionResponse> => {
    return apiClient.put<TransactionResponse>(
      `${ADMIN_EVENT_ENDPOINT}/${eventId}/coord/${coordId}`,
      body,
    );
  },

  deleteCoord: async (
    eventId: number,
    coordId: number,
  ): Promise<TransactionResponse> => {
    return apiClient.delete<TransactionResponse>(
      `${ADMIN_EVENT_ENDPOINT}/${eventId}/coord/${coordId}`,
    );
  },

  deleteAllCoords: async (eventId: number): Promise<TransactionResponse> => {
    return apiClient.delete<TransactionResponse>(
      `${ADMIN_EVENT_ENDPOINT}/${eventId}/coord`,
    );
  },

  // Applications

  getApplications: async (
    eventId: number,
    params?: ParticipationListRequest,
  ): Promise<EventApplicationListResponse> => {
    const res = await apiClient.get<Raw>(
      `${ADMIN_EVENT_ENDPOINT}/${eventId}/application`,
      { params },
    );
    return { ...toPagination(res), list: toArray(res?.list).map(toApplication) };
  },

  acceptApplication: async (
    eventId: number,
    applicationId: number,
  ): Promise<TransactionResponse> => {
    return apiClient.post<TransactionResponse>(
      `${ADMIN_EVENT_ENDPOINT}/${eventId}/application/${applicationId}`,
    );
  },

  rejectApplication: async (
    eventId: number,
    applicationId: number,
  ): Promise<TransactionResponse> => {
    return apiClient.delete<TransactionResponse>(
      `${ADMIN_EVENT_ENDPOINT}/${eventId}/application/${applicationId}`,
    );
  },

  // Participants

  getParticipants: async (
    eventId: number,
    params?: ParticipationListRequest,
  ): Promise<EventParticipantListResponse> => {
    const res = await apiClient.get<Raw>(
      `${ADMIN_EVENT_ENDPOINT}/${eventId}/participant`,
      { params },
    );
    return { ...toPagination(res), list: toArray(res?.list).map(toParticipant) };
  },

  removeParticipant: async (
    eventId: number,
    participationId: number,
  ): Promise<TransactionResponse> => {
    return apiClient.delete<TransactionResponse>(
      `${ADMIN_EVENT_ENDPOINT}/${eventId}/participant/${participationId}`,
    );
  },
};
