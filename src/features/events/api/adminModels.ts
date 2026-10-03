import { ListResponse, Secretariat } from "@/features/events/api/models";

// Create / update payloads

export interface EventRequest {
  name: string;
  description: string;
  background_id: number;
  belonging: Secretariat;
  require_applying: boolean;
  form_id: number | null;
  max_applications: number | null;
  /** ISO 8601 */
  start_date: string;
  /** ISO 8601 */
  end_date: string;
}

export interface EventUpdateRequest extends EventRequest {
  id: number;
}

// Single event (GET /admin/event/{id})

export interface AdminEventDetail extends EventUpdateRequest {
  background_url?: string;
}

// List (GET /admin/event)

export interface AdminEventListItem {
  id: number;
  name: string;
  background_url: string;
  belonging: Secretariat;
  require_applying: boolean;
  form_id: number | null;
  created_at: string;
}

export interface AdminEventListRequest {
  limit?: number;
  page?: number;
  "search-name"?: string;
  belonging?: Secretariat;
}

export interface AdminEventListResponse extends ListResponse {
  list: AdminEventListItem[];
}

// Mutations

export interface TransactionResponse {
  message?: string;
  id?: number;
  [key: string]: unknown;
}
