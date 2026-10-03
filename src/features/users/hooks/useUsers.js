import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService, assignPasscodesStream } from "../api/users.service";

// Key for caching
export const USERS_KEYS = {
  all: ["users"],
  lists: () => [...USERS_KEYS.all, "list"],
  list: (page, limit) => [...USERS_KEYS.all, "list", { page, limit }],
  detail: (id) => [...USERS_KEYS.all, "detail", id],
};

// Hook for fetching all users
export const useUsers = (page = 1, limit = 25) => {
  return useQuery({
    queryKey: USERS_KEYS.list(page, limit),
    queryFn: () => usersService.getAll({ page, limit }),

    staleTime: 0,
    // Keep previous page data visible while the next page loads
    placeholderData: (prev) => prev,
  });
};

// Hook for fetching a user by id
export const useUser = (id) => {
  return useQuery({
    queryKey: USERS_KEYS.detail(id),
    queryFn: () => usersService.getById(id),

    enabled: !!id && id !== "0" && id !== "new",
    staleTime: 0,
  });
};

// Hook to PROMOTE an user
export const useSuspendUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ user_id, reason, duration }) =>
      usersService.suspend({ user_id, reason, duration }),
    onSuccess: () => {
      queryClient.invalidateQueries(USERS_KEYS.lists());
    },
  });
};

// Hook to UPDATE a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }) => usersService.update(data),
    onSuccess: (_, variables) => {
      // Refresh the list
      queryClient.invalidateQueries(USERS_KEYS.lists());
      // Refresh the specific user details
      queryClient.invalidateQueries(USERS_KEYS.detail(variables?.data?.id));
    },
  });
};

// Hook to assign passcodes to user
export const useAssignPasscodes = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState(null);

  const start = async (onComplete) => {
    setIsRunning(true);
    setProgress([]);
    setError(null);

    try {
      await assignPasscodesStream(
        (data) => {
          setProgress((prev) => [...prev, data]);
        },
        (err) => {
          setError(err.message);
        },
      );

      onComplete?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return {
    start,
    isRunning,
    progress,
    error,
  };
};
