export enum Gender {
  Male = "male",
  Female = "female",
}

export enum Department {
  Mechanical = "mechanical",
  Civil = "civil",
  Electrical = "electrical",
  Chemical = "chemical",
  Petroleum = "petroleum",
  Agricultural = "agricultural",
  Mining = "mining",
  Surveying = "surveying",
}

export interface UserProfileResponse {
  id: number;
  uni_id: string;
  username: string;
  name_ar: string;
  name_en: string;
  email: string;
  phone: string;
  department: Department;
  gender: Gender;
  profile_pic: string;
}

export interface UserProfileSummaryResponse {
  id: number;
  username: string;
  email: string;
  profile_pic: string;
  department: Department;
  gender: Gender;
  name_ar: string;
  name_en: string;
}

export interface UpdateProfileRequest {
  id: number;
  uni_id: string;
  name_ar: string;
  name_en: string;
  phone: string;
  department: Department;
  gender: Gender;
}

export interface UpdateUsernameRequest {
  username: string;
}

export interface UpdateEmailRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface CheckUsernameResponse {
  available: boolean;
}

export interface TicketResponse {
  ticket: string;
}

export interface CertResponse {
  id: number;
  event_id?: number;
  issued_date: string;
  issuer_id: number;
  recipient_email?: string;
  recipient_name: string;
  recipient_user_id?: number;
  template_id: number;
  template_name: string;
}

export interface CertListParams {
  limit?: number;
  page?: number;
  "user-id"?: number;
  "event-id"?: number;
  "issue-date-after"?: string;
  "issue-date-before"?: string;
  "search-name"?: string;
}

export interface CertListResponse {
  list: CertResponse[];
  total_pages: number;
  current_page: number;
  count: number;
}

// Notifications

export enum NotificationType {
  Basic = "basic",
  Redirect = "redirect",
}

export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  data: DataType;
  created_at: string;
  is_read: boolean;
}
export interface DataType {}
export interface DataBasic extends DataType {}
export interface DataRedirect extends DataType {
  title: string;
  path: string;
}

export interface NotificationsListResponse {
  list: NotificationResponse[];
  total_pages: number;
  current_page: number;
  count: number;
}

export interface TransactionResponse {
  status: number;
  message: string;
  id?: number | string;
}