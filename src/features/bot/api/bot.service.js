import apiClient from "../../../api/axiosClient";

const ENDPOINT = "/v1/open/bot";
const API_URL = "/v1/admin/bot";

export const botService = {
  /**
   * @param {string} sessionId - UUID for the session
   * @param {string} keyword - The keyword (edge) or text input
   * @param {string} input - The user input from input nodes
   * @param {string} language - 'en' or 'ar'
   */
  interact: (sessionId, keyword, input, language) => {
    return apiClient.post(ENDPOINT, {
      session_id: sessionId,
      keyword: keyword,
      input: input,
      language: language,
    });
  },

  gerGraph: () => {
    return apiClient.get(`${API_URL}/graph`);
  },

  updateGraph: (data) => {
    return apiClient.put(`${API_URL}/graph`, data);
  },

  resetBot: () => {
    return apiClient.post(`${API_URL}/reset`);
  },
};
