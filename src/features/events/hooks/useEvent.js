import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "../api/event.service";

// Open endpoints

export const useEvents = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["events", page],
    queryFn: () => eventService.getEvents(page, limit),
  });
};

export const useEvent = (id) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => eventService.getEvent(id),
    enabled: !!id,
  });
};

// Application endpoints

export const useGetAllStatus = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["all-status", page],
    queryFn: () => eventService.getAllStatus(page, limit),
    enabled: !!eventID,
  });
};

export const useGetStatus = (eventID) => {
  return useQuery({
    queryKey: ["status", eventID],
    queryFn: () => eventService.getStatus(eventID),
    enabled: !!eventID,
  });
};

export const useCancelApplication = (id) => {
  return useMutation({
    mutationFn: (id) => eventService.cancel(id),
  });
};

export const useApply = (id, eventID = 0) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => eventService.apply(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["status"]);
    },
  });
};

// Admin endpoints

export const useAdminEvent = (id) => {
  return useQuery({
    queryKey: ["event admin", id],
    queryFn: () => eventService.getAdminEvent(id),
    enabled: !!id,
  });
};

export const useGetParticipants = (id, page = 1, limit = 25) => {
  return useQuery({
    queryKey: ["participants", id, page, limit],
    queryFn: () => eventService.getEventParticipants(id, page, limit),
    refetchOnWindowFocus: false,
  });
};

export const useUpdateParticipants = (eventId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => eventService.updateEventParticipants(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["participants", eventId]);
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => eventService.create(data),
    onSuccess: () => queryClient.invalidateQueries(["events"]),
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => eventService.update(data),
    onSuccess: () => queryClient.invalidateQueries(["events"]),
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => eventService.delete(id),
    onSuccess: () => queryClient.invalidateQueries(["events"]),
  });
};

export const useGenerateCerts = () => {
  return useMutation({
    mutationFn: (data) => eventService.generateCerts(data),
  });
};

export const useSendFinishEmails = () => {
  return useMutation({
    mutationFn: (data) => eventService.sendFinishEmails(data),
  });
};
export const useSendEmails = () => {
  return useMutation({
    mutationFn: (data) => eventService.sendEmails(data),
  });
};

export const useLinkForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => eventService.linkForm(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([
        "event admin",
        String(variables.event_id),
      ]);
      queryClient.invalidateQueries(["events"]);
    },
  });
};
