import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamsService } from "../api/teams.service";

export const TEAMS_KEYS = {
  all: ["teams"],
  list: () => [...TEAMS_KEYS.all, "list"],
  detail: (id) => [...TEAMS_KEYS.all, "detail", id],
};

export const useTeams = () => {
  return useQuery({
    queryKey: TEAMS_KEYS.list(),
    queryFn: () => teamsService.getAll(),
    staleTime: 0,
  });
};

export const useTeam = (id) => {
  return useQuery({
    queryKey: TEAMS_KEYS.detail(id),
    queryFn: () => teamsService.getById(id),
    enabled: !!id && id !== "0" && id !== "new",
    staleTime: 0,
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => teamsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAMS_KEYS.list() });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => teamsService.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TEAMS_KEYS.list() });
      queryClient.invalidateQueries({
        queryKey: TEAMS_KEYS.detail(variables.id),
      });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => teamsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAMS_KEYS.list() });
    },
  });
};
