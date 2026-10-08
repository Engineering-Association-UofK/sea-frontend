import apiClient from "../../../api/axiosClient";

const COLLABS_ENDPOINT = "/v1/admin/collabs";

export const collaboratorsService = {
  getAll: async (page = 1, limit = 10) => {
    const response = await apiClient.get(COLLABS_ENDPOINT, {
      params: { page, limit },
    });
    return response.data || response;
  },

  getById: async (id) => {
    const response = await apiClient.get(`${COLLABS_ENDPOINT}/${id}`);
    return response.data || response;
  },

  create: async (formData) => {
    // FormData containing name_ar, name_en, email, and file
    const response = await apiClient.post(COLLABS_ENDPOINT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data || response;
  },

  update: async (formData) => {
    // FormData containing id, name_ar, name_en, email, and optional file
    const response = await apiClient.put(COLLABS_ENDPOINT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data || response;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`${COLLABS_ENDPOINT}/${id}`);
    return response.data || response;
  },
};
