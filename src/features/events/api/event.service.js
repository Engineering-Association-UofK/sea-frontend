import apiClient from "../../../api/axiosClient";

const VIEW_ENDPOINT = "/v1/event";
const USER_ENDPOINT = "/v1/account/event";
const ADMIN_ENDPOINT = "/v1/admin/event";

export const eventService = {
  // Open endpoints

  getEvents: (page, limit) => {
    return apiClient.get(`${VIEW_ENDPOINT}`, { params: { page, limit } });
  },

  getEvent: (id) => {
    return apiClient.get(`${VIEW_ENDPOINT}/${id}`);
  },

  // Application endpoints

  getAllStatus: (page, limit) => {
    return apiClient.get(`${USER_ENDPOINT}/all-status`, {
      params: { page, limit },
    });
  },

  getStatus: (event_id) => {
    return apiClient.get(`${USER_ENDPOINT}/status/${event_id}`);
  },

  cancel: (id) => {
    return apiClient.post(`${USER_ENDPOINT}/cancel/${id}`);
  },

  apply: (id) => {
    return apiClient.post(`${USER_ENDPOINT}/apply/${id}`);
  },

  // Admin endpoints

  getAdminEvent: (id) => {
    return apiClient.get(`${ADMIN_ENDPOINT}/${id}`);
  },

  getEventParticipants: (id, page = 1, limit = 25) => {
    return apiClient.get(
      `${ADMIN_ENDPOINT}/${id}/participants?page=${page}&limit=${limit}`,
    );
  },

  updateEventParticipants: (id, data) => {
    return apiClient.put(`${ADMIN_ENDPOINT}/${id}/participants`, data);
  },

  create: (data) => {
    return apiClient.post(`${ADMIN_ENDPOINT}`, data);
  },

  update: (data) => {
    return apiClient.put(`${ADMIN_ENDPOINT}`, data);
  },

  delete: (id) => {
    return apiClient.delete(`${ADMIN_ENDPOINT}/${id}`);
  },

  linkForm: (data) => {
    return apiClient.post(`${ADMIN_ENDPOINT}/link-form`, data);
  },
};

export const processFetchStream = async (endpoint, data, onMessage) => {
  const baseURL = apiClient.defaults.baseURL || CONFIG.API_NEW_BASE_URL;
  const token =
    localStorage.getItem("sea-token") || sessionStorage.getItem("sea-token");

  const response = await fetch(`${baseURL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      const trimmedLine = line.trim();
      // Match 'data:' regardless of whether there is a space following it
      if (trimmedLine.startsWith("data:")) {
        // Remove 'data:' and then trim any remaining whitespace
        const message = trimmedLine.substring(5).trim();
        if (message) {
          onMessage(message);
        }
      }
    }
  }

  if (buffer.trim().startsWith("data:")) {
    const message = buffer.trim().substring(5).trim();
    if (message) onMessage(message);
  }
};
