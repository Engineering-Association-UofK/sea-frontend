import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { adminEventsApi } from "../api/events.admin.api";
import {
  AdminEventListRequest,
  EventRequest,
  EventUpdateRequest,
} from "../api/adminModels";
import { EVENTS_KEYS } from "../hooks/useEvents";

export const ADMIN_EVENTS_KEYS = {
  all: ["admin_events"] as const,
  lists: () => [...ADMIN_EVENTS_KEYS.all, "list"] as const,
  list: (params?: AdminEventListRequest) =>
    [...ADMIN_EVENTS_KEYS.lists(), params] as const,
  details: () => [...ADMIN_EVENTS_KEYS.all, "detail"] as const,
  detail: (id: number) => [...ADMIN_EVENTS_KEYS.details(), id] as const,
};

/** Paginated + filtered list. Keeps the previous page on screen while the next one loads. */
export function useAdminEventList(params?: AdminEventListRequest) {
  return useQuery({
    queryKey: ADMIN_EVENTS_KEYS.list(params),
    queryFn: () => adminEventsApi.getEventList(params),
    placeholderData: keepPreviousData,
  });
}

/** Full event details, only fetched while the edit form is open. */
export function useAdminEvent(id: number | null) {
  return useQuery({
    queryKey: ADMIN_EVENTS_KEYS.detail(id ?? 0),
    queryFn: () => adminEventsApi.getEvent(id as number),
    enabled: id !== null,
    // The form copies the data into local state, so avoid refetching under the user's hands
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}

function useInvalidateEvents() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_EVENTS_KEYS.all });
    queryClient.invalidateQueries({ queryKey: EVENTS_KEYS.all });
  };
}

export function useCreateEvent() {
  const invalidate = useInvalidateEvents();
  return useMutation({
    mutationFn: (body: EventRequest) => adminEventsApi.createEvent(body),
    onSuccess: invalidate,
  });
}

export function useUpdateEvent() {
  const invalidate = useInvalidateEvents();
  return useMutation({
    mutationFn: (body: EventUpdateRequest) => adminEventsApi.updateEvent(body),
    onSuccess: invalidate,
  });
}

export function useDeleteEvent() {
  const invalidate = useInvalidateEvents();
  return useMutation({
    mutationFn: (id: number) => adminEventsApi.deleteEvent(id),
    onSuccess: invalidate,
  });
}
