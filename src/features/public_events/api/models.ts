export enum Secretariat {
  Media = "media",
  Academic = "academic",
  Sports = "sports",
  ExRelations = "external_relations",
  Cultural = "cultural",
  Financial = "financial",
  General = "general",
  Social = "social",
}

export interface EventListRequest {
  limit?: number;
  page?: number;
  "search-name"?: string;
  belonging?: Secretariat;
}

export interface ListResponse {
  total_pages: number;
  current_page: number;
  count: number;
}

export interface EventListItemResponse {
  id: number;
  name: string;
  description: string;
  background_url: string;
  coords: EventCoordinator[];
  require_applying: boolean;
  belonging: Secretariat;
  start_date: string;
  end_date: string;
}

export interface EventCoordinator {
  name: string;
  role: string;
}

export interface EventViewListResponse extends ListResponse {
  list: EventListItemResponse[];
}

export interface ApplicationStatus {
  applied: boolean;
  accepted: boolean;
  needs_form?: boolean;
  form_id?: number;
}

export interface ApplyResponse {
  needs_form: boolean;
  form_id?: number;
}
