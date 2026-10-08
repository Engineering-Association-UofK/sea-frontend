import apiClient from "../../../api/axiosClient";

const PUBLIC_ENDPOINT = "/v1/election";
const ADMIN_ENDPOINT = "/v1/admin/election";
const ACCOUNT_ENDPOINT = "/v1/account/election";

export const electionService = {
  // Public & Statistics
  getIfLive: async () => {
    return await apiClient.get(PUBLIC_ENDPOINT);
  },

  getPublicStatistics: async () => {
    return await apiClient.get(`${PUBLIC_ENDPOINT}/statistics`);
  },

  getCandidates: async () => {
    return await apiClient.get(`${PUBLIC_ENDPOINT}/candidates`);
  },

  getResults: async (cycle) => {
    return await apiClient.get(`${PUBLIC_ENDPOINT}/results`, {
      params: { cycle },
    });
  },

  // Authenticated Voting
  getTicket: async () => {
    return await apiClient.get(`${ACCOUNT_ENDPOINT}/ticket`);
  },

  submitVote: async (voteData) => {
    return await apiClient.post(`${PUBLIC_ENDPOINT}/vote`, voteData);
  },

  // Admin Candidate Setup
  createCandidate: async (candidateData) => {
    return await apiClient.post(`${ADMIN_ENDPOINT}/candidate`, candidateData);
  },

  updateCandidate: async ({ id, ...payload }) => {
    return await apiClient.put(`${ADMIN_ENDPOINT}/candidate/${id}`, payload);
  },

  deleteCandidate: async (id) => {
    return await apiClient.delete(`${ADMIN_ENDPOINT}/candidate/${id}`);
  },

  // Admin Statistics
  getPrivateStatistics: async () => {
    return await apiClient.get(`${ADMIN_ENDPOINT}/statistics`);
  },

  // Admin Resolution
  resolveAndReset: async () => {
    return await apiClient.post(`${ADMIN_ENDPOINT}/reset`);
  },
};
