import apiClient from "../../../api/axiosClient";
import { CONFIG } from "../../../config";

const ENDPOINT = "/v1/admin/team";

export const teamsService = {
  getAll: async () => {
    return await apiClient.get(`${ENDPOINT}`);
  },

  getById: async (id) => {
    return await apiClient.get(`${ENDPOINT}/${id}`);
  },

  create: async (data) => {
    return await apiClient.post(`${ENDPOINT}`, data);
  },

  update: async (data) => {
    return await apiClient.put(`${ENDPOINT}`, data);
  },

  delete: async (id) => {
    return await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};
