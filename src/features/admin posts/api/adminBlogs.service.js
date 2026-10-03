import apiClient from "../../../api/axiosClient";

const ENDPOINT = "/v1/admin/blog";

export const POST_TYPES = ["NEWS", "ISSUES", "BLOG", "DONATIONS"];

export const blogsService = {
  adminGetAll: async (type, page = 1, limit = 20) => {
    return await apiClient.get(ENDPOINT, {
      params: { type: type || undefined, page, limit },
    });
  },

  adminGetById: async (id) => {
    return await apiClient.get(`${ENDPOINT}/${id}`);
  },

  adminCreate: async (data) => {
    return await apiClient.post(ENDPOINT, data);
  },

  adminUpdate: async (data) => {
    return await apiClient.put(ENDPOINT, data);
  },

  adminDelete: async (id) => {
    return await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};
