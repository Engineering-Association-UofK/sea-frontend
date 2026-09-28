/**
 * ============================================================================
 * AXIOS CLIENT (TYPESCRIPT VERSION)
 * ============================================================================
 * 
 * WHY THIS FILE EXISTS:
 * This TypeScript client replaces the legacy `axiosClient.js` as part of our 
 * migration to a strongly-typed codebase. 
 *
 * KEY DIFFERENCES & BEHAVIOR:
 * 1. RESPONSE UNWRAPPING: 
 *    The response interceptor unwraps `response.data` directly. Module augmentation 
 *    is applied below so Axios generic methods like `apiClient.get<T>()` return 
 *    `Promise<T>` instead of `Promise<AxiosResponse<T>>`.
 *
 * 2. CUSTOM CONFIG FLAGS:
 *    Supports custom request config options like `skipAuth: true` to bypass 
 *    attaching the Bearer token for public endpoints.
 *
 * MIGRATION GUIDELINES:
 * - NEW code (written in TypeScript) MUST import this file (`axiosClient.ts`).
 * - LEGACY code can continue using `axiosClient.js` until refactored.
 * - DO NOT import `axiosClient.js` in newly created `.ts` / `.tsx` files.
 * ============================================================================
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { CONFIG } from "../config";

// --- Axios Module Augmentation ---
// Extends AxiosRequestConfig so `skipAuth` is valid on request objects,
// and updates return types to reflect `response.data` unwrapping.
declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    skipAuth?: boolean;
  }
  export interface AxiosInstance {
    request<T = any, R = T, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
    get<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    delete<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    head<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    options<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    post<T = any, R = T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    put<T = any, R = T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    patch<T = any, R = T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  }
}

// Create Instance
const apiClient = axios.create({
  baseURL: CONFIG.API_NEW_BASE_URL,
  timeout: CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Helper: Get Token from storage
const getAuthToken = (): string | null => {
  return localStorage.getItem("sea-token") || sessionStorage.getItem("sea-token");
};

// Helper: Clear auth data
const clearAuthData = (): void => {
  localStorage.removeItem("sea-token");
  localStorage.removeItem("sea-user");
  sessionStorage.removeItem("sea-token");
  sessionStorage.removeItem("sea-user");
};

// Request Interceptor to Attach Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();

    if (token && !config.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor (Global Unwrapping & Error Handling)
apiClient.interceptors.response.use(
  (response) => {
    // Unwraps `response.data` directly
    return response.data;
  },
  (error: AxiosError) => {
    const config = error.config;
    const response = error.response;
    const currentPath = window.location.pathname;

    const isAuthRequest =
      config?.url?.includes("/login") ||
      config?.url?.includes("/verify") ||
      config?.url?.includes("/send-code");

    // Handle 401 Unauthorized
    if (response?.status === 401 || (response?.data as any)?.status === 401) {
      if (isAuthRequest) {
        return Promise.reject(error);
      }

      localStorage.removeItem("token");
      console.error("Unauthorized! Redirecting to login...");

      if (!currentPath.includes("/login") && !currentPath.includes("/register")) {
        clearAuthData();
        window.location.href = "/login?session_expired=true";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;