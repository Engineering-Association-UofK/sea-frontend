import apiClient from '../../../api/axiosClient';

const ADMIN_ENDPOINT = '/v1/admin';

export const adminService = {
  getAnalysis: () => {
    return apiClient.get(`${ADMIN_ENDPOINT}/analysis`);
  },
};