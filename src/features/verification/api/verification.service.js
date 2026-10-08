import apiClient from "../../../api/axiosClient";

const VERIFICATION_ENDPOINT = "/v1/cert"; // Adjust this base path to match your actual API

export const verificationService = {
  verifyCertificate: (hash) => {
    return apiClient.get(`${VERIFICATION_ENDPOINT}/verify/${hash}`);
  },

  verifyDocument: (hash) => {
    return apiClient.get(`${VERIFICATION_ENDPOINT}/verify-document/${hash}`);
  },
};
