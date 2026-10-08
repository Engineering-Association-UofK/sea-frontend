import apiClient from "../../../api/axiosClient";

const ENDPOINT = "/v1/admin";

export const adminUsersService = {
  getAll: async ({ page = 1, limit = 25 } = {}) => {
    return await apiClient.get(`${ENDPOINT}?page=${page}&limit=${limit}`);
  },

  addManager: async (id) => {
    return await apiClient.post(`${ENDPOINT}/add-manager/${id}`);
  },

  removeManager: async (id) => {
    return await apiClient.post(`${ENDPOINT}/remove-manager/${id}`);
  },

  promote: async (user_id) => {
    return await apiClient.post(`${ENDPOINT}/${user_id}`);
  },

  update: async (data) => {
    return await apiClient.put(`${ENDPOINT}`, data);
  },

  delete: async (id) => {
    return await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};
