import axios from "axios";
import apiClient from "./axiosClient";

// Assuming your backend has a generic upload endpoint
// If it's specific to blogs, change to '/blogs/upload'
const ENDPOINT = "/api/sign";

const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const uploadService = {
  uploadImage: async (file) => {
    try {
      // Generate current timestamp in seconds (Unix time)
      const timestamp = Math.round(new Date().getTime() / 1000);

      const signaturePayload = {
        apiKey: API_KEY,
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        resourceType: "image",
        timestamp: timestamp,
      };

      const signResponse = await apiClient.post(ENDPOINT, signaturePayload);

      const signature = signResponse.uploadSignature;
      if (!signature) {
        throw new Error("Failed to retrieve signature from backend");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", API_KEY);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const dataToReturn = {
        secureUrl: response?.data?.secure_url,
        publicId: response?.data?.public_id,
      };

      // console.log('ff', response, dataToReturn);

      return dataToReturn;
    } catch (error) {
      console.error("Upload failed:", error);
      throw new Error("Image upload failed");
    }
  },
};
