import { CONFIG } from ".";

export const API_BASE = CONFIG.API_NEW_BASE_URL;

export const endpoints = {
  forms: `${API_BASE}/v1/admin/form`,
  pages: `${API_BASE}/v1/admin/form/page`,
  questions: `${API_BASE}/v1/admin/form/question`,
  submit: `${API_BASE}/v1/admin/form/submit`,
  analysis: (id) => `${API_BASE}/v1/admin/form/analysis/${id}`,
  detailedAnalysis: (id) =>
    `${API_BASE}/v1/admin/form/detailed-responses/${id}`,
};

export const authFetch = (url, options = {}) => {
  const token =
    localStorage.getItem("sea-token") || sessionStorage.getItem("sea-token");
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
};
