import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { imageStorageService } from "../api/imageStorage.service";

// Key for caching
export const IMAGE_STORAGE_KEYS = {
  all: ["image storage items"],
  lists: () => [...IMAGE_STORAGE_KEYS.all, "list"],
  list: (page, limit) => [
    ...IMAGE_STORAGE_KEYS.lists(),
    "list",
    { page, limit },
  ],
  detail: (id) => [...IMAGE_STORAGE_KEYS.all, "detail", id],
};

// Hook for fetching all image storage items
export const useImageStorageItems = (page = 1, limit = 25) => {
  return useQuery({
    queryKey: IMAGE_STORAGE_KEYS.list(page, limit),
    queryFn: () => imageStorageService.getAll({ page, limit }),

    staleTime: 0,
    // Keep previous page data visible while the next page loads
    placeholderData: (prev) => prev,
  });
};

// Hook to CREATE a image storage item
export const useCreateImageStorageItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: imageStorageService.create,
    onSuccess: () => {
      // Invalidates cache so the list updates automatically without a refresh
      queryClient.invalidateQueries(IMAGE_STORAGE_KEYS.lists());
    },
  });
};

// Hook to DELETE all unused image storage items
export const useClearUnused = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: imageStorageService.clear,
    onSuccess: () => {
      // Refresh the list automatically
      queryClient.invalidateQueries(["image storage items", "list"]);
    },
  });
};
