import apiClient from "../../../api/axiosClient";

const ENDPOINT = "/api/gallery";

export const galleryService = {
  getAll: async () => {
    return await apiClient.get(ENDPOINT);
  },

  getByKeyword: async (keyword) => {
    return await apiClient.get(`${ENDPOINT}/open/${keyword}`, {
      skipAuth: true,
    });
  },

  create: async (data) => {
    return await apiClient.post(ENDPOINT, data);
  },

  update: async (data) => {
    return await apiClient.put(ENDPOINT, data);
  },

  delete: async (id) => {
    return await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};
