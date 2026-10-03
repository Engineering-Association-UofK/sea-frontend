import apiClient from "../../../api/axiosClient";

export const teamService = {
  getAll: () => apiClient.get("/v1/cms/team", { skipAuth: true }), // removed `/api` from API cause it's already included in the baseURL of axiosClient, see config for more details
};
