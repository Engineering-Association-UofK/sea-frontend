import apiClient from "../../../api/axiosClient";

const ENDPOINT = "/v1/admin/gallery";

export const imageStorageService = {
  getAll: async ({ page = 1, limit = 25 } = {}) => {
    return await apiClient.get(`${ENDPOINT}?page=${page}&limit=${limit}`);
  },

  getById: async (id) => {
    return await apiClient.get(`${ENDPOINT}/${id}`);
  },

  create: async ({ file, file_name, alt_text = "" }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_name", file_name);
    formData.append("alt_text", alt_text);

    return await apiClient.post(ENDPOINT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  clear: async () => {
    return await apiClient.delete(`${ENDPOINT}`);
  },
};
