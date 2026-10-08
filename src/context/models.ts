import { ReactNode } from "react";

export interface AuthUser {
  user_id?: number | string;
  roles?: string[];
  [key: string]: any;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResult {
  success: boolean;
  status?: string;
  user_id?: number | string | null;
  message?: string;
}
