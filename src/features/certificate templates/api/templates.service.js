import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/v1/admin/certificate/template';

export const templatesService = {
  getAll: async (page = 1, limit = 20) => {
    return await apiClient.get(ENDPOINT, {
      params: { page, limit },
    })
  },

  getById: async (id) => {
    return await apiClient.get(`${ENDPOINT}/${id}`)
  },
 
  create: async (data) => {
    return await apiClient.post(ENDPOINT, data)
  },
 
  update: async (data) => {
    return await apiClient.put(ENDPOINT, data)
  },
 
  // adminDelete: async(id) => {
  //   return await apiClient.delete(`${ENDPOINT}/${id}`)
  // },
};