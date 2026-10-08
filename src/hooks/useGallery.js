import { useState, useEffect } from "react";
import api from "../utils/api.js";

export const useGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await api.get("/gallery/news", { skipAuth: true });
        setImages(response.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load gallery images.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, []);

  return { images, loading, error };
};
