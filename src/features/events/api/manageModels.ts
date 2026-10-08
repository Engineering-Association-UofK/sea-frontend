import { ListResponse } from "./models";

// Coordinators

export interface EventCoord {
  id: number;
  name: string;
  role: string;
}

export interface CoordInput {
  name: string;
  role: string;
}

export interface AddCoordsRequest {
  list: CoordInput[];
}

// Participation

export interface ParticipationListRequest {
  limit?: number;
  page?: number;
}

export interface EventApplication {
  id: number;
  event_id: number;
  user_id: number;
  username: string;
  photo_url: string;
  form_id: number;
  accepted: boolean;
  started_at: string;
}

export interface EventApplicationListResponse extends ListResponse {
  list: EventApplication[];
}

export interface EventParticipant {
  id: number;
  event_id: number;
  user_id: number;
  username: string;
  photo_url: string;
  joined_at: string;
}

export interface EventParticipantListResponse extends ListResponse {
  list: EventParticipant[];
}
