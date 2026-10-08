import apiClient from "../../../api/axiosClient";
import { CONFIG } from "../../../config";

const ENDPOINT = "/v1/admin/user";

export const usersService = {
  getAll: async ({ page = 1, limit = 25 } = {}) => {
    return await apiClient.get(`${ENDPOINT}/all?page=${page}&limit=${limit}`);
  },

  getById: async (id) => {
    return await apiClient.get(`${ENDPOINT}/${id}`);
  },

  getTempPasscode: async (id) => {
    return await apiClient.get(`${ENDPOINT}/passcode/${id}`);
  },

  createTempUser: async (id, options = {}) => {
    return await apiClient.post(`${ENDPOINT}/passcode/create/${id}`, options);
  },

  update: async (data) => {
    return await apiClient.put(`${ENDPOINT}`, data);
  },

  suspend: async ({ user_id, reason, duration }) => {
    return await apiClient.post(`${ENDPOINT}/suspend`, {
      user_id,
      reason,
      duration,
    });
  },
};

export const assignPasscodesStream = async (onMessage, onError) => {
  const token =
    localStorage.getItem("sea-token") || sessionStorage.getItem("sea-token");
  const response = await fetch(
    `${CONFIG.API_NEW_BASE_URL + ENDPOINT}/assign-passcodes`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");

    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();

      if (line.startsWith("data:")) {
        const json = line.replace("data:", "").trim();

        try {
          const parsed = JSON.parse(json);
          onMessage(parsed);
        } catch (e) {
          console.error("Invalid JSON:", json);
        }
      }
    }

    buffer = lines[lines.length - 1];
  }
};
