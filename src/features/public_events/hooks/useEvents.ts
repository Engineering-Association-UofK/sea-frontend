import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "../api/events.api";
import { EventListRequest } from "../api/models";

export const EVENTS_KEYS = {
  all: ["public_events"] as const,
  list: (params?: EventListRequest) =>
    [...EVENTS_KEYS.all, "list", params] as const,
  status: (id: number) => [...EVENTS_KEYS.all, "status", id] as const,
};

export function useEventList(params?: EventListRequest, enabled = true) {
  return useQuery({
    queryKey: EVENTS_KEYS.list(params),
    queryFn: () => eventsApi.getEventList(params),
    enabled,
  });
}

export function useCheckStatus(id: number, enabled: boolean) {
  return useQuery({
    queryKey: EVENTS_KEYS.status(id),
    queryFn: () => eventsApi.checkStatus(id),
    enabled,
    retry: false, // Prevents refetch spam if unauthorized/401 occurs unexpectedly
  });
}

export function useApplyEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eventsApi.applyForEvent(id),
    onSuccess: (_, id) => {
      // Invalidate the status query to immediately reflect the new applied state
      queryClient.invalidateQueries({ queryKey: EVENTS_KEYS.status(id) });
    },
  });
}
