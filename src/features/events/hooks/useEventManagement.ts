import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { adminEventManageApi } from "../api/events.manage.api";
import {
  AddCoordsRequest,
  CoordInput,
  ParticipationListRequest,
} from "../api/manageModels";
import { ADMIN_EVENTS_KEYS } from "./useAdminEvents";

export const EVENT_MANAGE_KEYS = {
  coords: (eventId: number) =>
    [...ADMIN_EVENTS_KEYS.all, "coords", eventId] as const,
  applications: (eventId: number) =>
    [...ADMIN_EVENTS_KEYS.all, "applications", eventId] as const,
  applicationsPage: (eventId: number, params?: ParticipationListRequest) =>
    [...EVENT_MANAGE_KEYS.applications(eventId), params] as const,
  participants: (eventId: number) =>
    [...ADMIN_EVENTS_KEYS.all, "participants", eventId] as const,
  participantsPage: (eventId: number, params?: ParticipationListRequest) =>
    [...EVENT_MANAGE_KEYS.participants(eventId), params] as const,
};

// ---- Coordinators ----------------------------------------------------------

export function useEventCoords(eventId: number) {
  return useQuery({
    queryKey: EVENT_MANAGE_KEYS.coords(eventId),
    queryFn: () => adminEventManageApi.getCoords(eventId),
  });
}

export function useAddCoords(eventId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddCoordsRequest) =>
      adminEventManageApi.addCoords(eventId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: EVENT_MANAGE_KEYS.coords(eventId),
      }),
  });
}

export function useUpdateCoord(eventId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ coordId, ...body }: CoordInput & { coordId: number }) =>
      adminEventManageApi.updateCoord(eventId, coordId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: EVENT_MANAGE_KEYS.coords(eventId),
      }),
  });
}

export function useDeleteCoord(eventId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coordId: number) =>
      adminEventManageApi.deleteCoord(eventId, coordId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: EVENT_MANAGE_KEYS.coords(eventId),
      }),
  });
}

export function useDeleteAllCoords(eventId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => adminEventManageApi.deleteAllCoords(eventId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: EVENT_MANAGE_KEYS.coords(eventId),
      }),
  });
}

// ---- Applications ----------------------------------------------------------

export function useEventApplications(
  eventId: number,
  params?: ParticipationListRequest,
) {
  return useQuery({
    queryKey: EVENT_MANAGE_KEYS.applicationsPage(eventId, params),
    queryFn: () => adminEventManageApi.getApplications(eventId, params),
    placeholderData: keepPreviousData,
  });
}

/** Accepting an application should turn it into a participant, so refresh both. */
export function useAcceptApplication(eventId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) =>
      adminEventManageApi.acceptApplication(eventId, applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EVENT_MANAGE_KEYS.applications(eventId),
      });
      queryClient.invalidateQueries({
        queryKey: EVENT_MANAGE_KEYS.participants(eventId),
      });
    },
  });
}

export function useRejectApplication(eventId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) =>
      adminEventManageApi.rejectApplication(eventId, applicationId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: EVENT_MANAGE_KEYS.applications(eventId),
      }),
  });
}

// ---- Participants ----------------------------------------------------------

export function useEventParticipants(
  eventId: number,
  params?: ParticipationListRequest,
) {
  return useQuery({
    queryKey: EVENT_MANAGE_KEYS.participantsPage(eventId, params),
    queryFn: () => adminEventManageApi.getParticipants(eventId, params),
    placeholderData: keepPreviousData,
  });
}

export function useRemoveParticipant(eventId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (participationId: number) =>
      adminEventManageApi.removeParticipant(eventId, participationId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: EVENT_MANAGE_KEYS.participants(eventId),
      }),
  });
}
