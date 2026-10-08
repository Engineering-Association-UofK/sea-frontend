import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersService } from "../api/adminUsers.service";

// Key for caching
export const ADMIN_USERS_KEYS = {
  all: ["adminUsers"],
  lists: () => [...ADMIN_USERS_KEYS.all, "list"],
  list: (page, limit) => [...ADMIN_USERS_KEYS.all, "list", { page, limit }],
  detail: (id) => [...ADMIN_USERS_KEYS.all, "detail", id],
};

// Hook for fetching all admin users
export const useAdminUsers = (page = 1, limit = 25) => {
  return useQuery({
    queryKey: ADMIN_USERS_KEYS.list(page, limit),
    queryFn: () => adminUsersService.getAll({ page, limit }),

    staleTime: 0,
    // Keep previous page data visible while the next page loads
    placeholderData: (prev) => prev,
  });
};

// Hook to PROMOTE an admin user
export const usePromoteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user_id) => adminUsersService.promote(user_id),
    onSuccess: () => {
      queryClient.invalidateQueries(ADMIN_USERS_KEYS.lists());
    },
  });
};

// Hook to ADD an admin manager
export const useAddAdminManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminUsersService.addManager(id),
    onSuccess: () => {
      queryClient.invalidateQueries(ADMIN_USERS_KEYS.lists());
    },
  });
};

// Hook to REMOVE an admin manager
export const useRemoveAdminManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminUsersService.removeManager(id),
    onSuccess: () => {
      queryClient.invalidateQueries(ADMIN_USERS_KEYS.lists());
    },
  });
};

// Hook to UPDATE a admin user
export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }) => adminUsersService.update(data),
    onSuccess: (data, variables) => {
      // Refresh the list
      queryClient.invalidateQueries(["adminUsers", "list"]);
      // Refresh the specific admin user details
      queryClient.invalidateQueries(["adminUsers", "detail", variables.id]);
    },
  });
};

// Hook to UPDATE a admin user email
export const useUpdateAdminUserEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }) => adminUsersService.updateEmail(data),
    onSuccess: (data, variables) => {
      // Refresh the list
      queryClient.invalidateQueries(["adminUsers", "list"]);
      // Refresh the specific admin user details
      queryClient.invalidateQueries(["adminUsers", "detail", variables.id]);
    },
  });
};

// Hook to DELETE a admin user
export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminUsersService.delete(id),
    onSuccess: () => {
      // Refresh the list automatically
      queryClient.invalidateQueries(["adminUsers", "list"]);
    },
  });
};
