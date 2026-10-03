import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { profileApi } from "../api/profile.api";
import {
  UpdateProfileRequest,
  UpdateUsernameRequest,
  UpdateEmailRequest,
  UpdatePasswordRequest,
  CertListParams,
} from "../api/models";

export const PROFILE_KEYS = {
  all: ["profile"] as const,
  details: () => [...PROFILE_KEYS.all, "details"] as const,
  summary: () => [...PROFILE_KEYS.all, "summary"] as const,
  ticket: () => [...PROFILE_KEYS.all, "ticket"] as const,
  certificates: (params?: CertListParams) =>
    [...PROFILE_KEYS.all, "certificates", params] as const,
  notifications: (page?: number, limit?: number) =>
    [...PROFILE_KEYS.all, "notifications", page, limit] as const,
  infiniteNotifications: (limit: number) =>
    [...PROFILE_KEYS.all, "notifications", "infinite", limit] as const,
};

// --- Profile Hooks ---

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_KEYS.details(),
    queryFn: profileApi.getProfile,
  });
}

export function useProfileSummary() {
  return useQuery({
    queryKey: PROFILE_KEYS.summary(),
    queryFn: profileApi.getProfileSummary,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) =>
      profileApi.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.details() });
    },
  });
}

export function useUpdatePicture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => profileApi.updatePicture(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
}

export function useUpdateUsername() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUsernameRequest) =>
      profileApi.updateUsername(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
}

export function useCheckUsername() {
  return useMutation({
    mutationFn: (payload: UpdateUsernameRequest) =>
      profileApi.checkUsernameAvailability(payload),
  });
}

export function useUpdateEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateEmailRequest) =>
      profileApi.updateEmail(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (payload: UpdatePasswordRequest) =>
      profileApi.updatePassword(payload),
  });
}

// --- Election Ticket Hook ---

export function useElectionTicket(enabled = false) {
  return useQuery({
    queryKey: PROFILE_KEYS.ticket(),
    queryFn: profileApi.getElectionTicket,
    retry: false,
    enabled,
  });
}

// --- Certificate Hooks ---

export function useCertificates(params?: CertListParams) {
  return useQuery({
    queryKey: PROFILE_KEYS.certificates(params),
    queryFn: () => profileApi.getCertificates(params),
  });
}

export function useDownloadCertificate() {
  return useMutation({
    mutationFn: async (id: number) => {
      const blob = await profileApi.downloadCertificate(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${id}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}

// --- Notification Hooks ---

export function useNotifications(page = 1, limit = 10) {
  return useQuery({
    queryKey: PROFILE_KEYS.notifications(page, limit),
    queryFn: () => profileApi.getNotifications(page, limit),
  });
}

export function useInfiniteNotifications(limit = 10) {
  return useInfiniteQuery({
    queryKey: PROFILE_KEYS.infiniteNotifications(limit),
    queryFn: ({ pageParam = 1 }) =>
      profileApi.getNotifications(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.total_pages) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => profileApi.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => profileApi.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => profileApi.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
}
