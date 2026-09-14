import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/v1/admin/certificate';

// Helper function to append to FormData only if value is present
const appendIfPresent = (formData, key, value) => {
  // Check for null, undefined, and empty string (for text fields)
  // Since your IDs are numbers, we check for null specifically.
  // Also checks that if it's a number, it's not NaN.
  if (value !== null && value !== undefined && !Number.isNaN(value)) {
    formData.append(key, value);
  }
};

export const certificatesService = {
  getAll: async (page = 1, limit = 20) => {
    return await apiClient.get(ENDPOINT, {
      params: { page, limit },
    })
  },

  getById: async (id) => {
    return await apiClient.get(`${ENDPOINT}/${id}`)
  },
 
  create: async (data) => {
    const formData = new FormData();
    formData.append('recipient_email', data.recipient_email); 
    formData.append('recipient_name', data.recipient_name); 
    formData.append('signer_name_one', data.signer_name_one); 
    formData.append('signer_name_two', data.signer_name_two); 
    formData.append('signer_role_one', data.signer_role_one); 
    formData.append('signer_role_two', data.signer_role_two); 
    formData.append('signer_signature_one', data.signer_signature_one); 
    formData.append('signer_signature_two', data.signer_signature_two); 
    formData.append('template_id', data.template_id); 
    appendIfPresent(formData, 'event_id', data.event_id);
    appendIfPresent(formData, 'recipient_user_id', data.recipient_user_id);
    // return await apiClient.post(ENDPOINT, data)
    return await apiClient.post(ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
 
  test: async (data) => {
    const formData = new FormData();
    formData.append('recipient_email', data.recipient_email); 
    formData.append('recipient_name', data.recipient_name); 
    formData.append('signer_name_one', data.signer_name_one); 
    formData.append('signer_name_two', data.signer_name_two); 
    formData.append('signer_role_one', data.signer_role_one); 
    formData.append('signer_role_two', data.signer_role_two); 
    formData.append('signer_signature_one', data.signer_signature_one); 
    formData.append('signer_signature_two', data.signer_signature_two); 
    formData.append('template_id', data.template_id); 
    appendIfPresent(formData, 'event_id', data.event_id);
    appendIfPresent(formData, 'recipient_user_id', data.recipient_user_id);
    // return await apiClient.post(ENDPOINT, data)
    return await apiClient.post(`${ENDPOINT}/test`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
 
  update: async (data) => {
    return await apiClient.put(ENDPOINT, data)
  },
 
  delete: async(id) => {
    return await apiClient.delete(`${ENDPOINT}/${id}`)
  },

  download: async (id) => {
    return await apiClient.get(`${ENDPOINT}/${id}`, {
      responseType: 'blob',
    });
  }
};