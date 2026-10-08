import axios from "axios";
import { CONFIG } from "../config/index.js";

const api = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    if (
      typeof response.data === "string" &&
      response.data.trim().startsWith("<!doctype html>")
    ) {
      return Promise.reject(
        new Error(
          "Invalid server response: Endpoint returned HTML. Check API path or Proxy.",
        ),
      );
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
