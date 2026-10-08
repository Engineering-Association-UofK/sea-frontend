import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collaboratorsService } from "../api/collaborators.service";

export const useCollaborators = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["collaborators", page, limit],
    queryFn: () => collaboratorsService.getAll(page, limit),
  });
};

export const useCollaborator = (id) => {
  return useQuery({
    queryKey: ["collaborator", id],
    queryFn: () => collaboratorsService.getById(id),
    enabled: !!id && id !== "0",
  });
};

export const useCreateCollaborator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => collaboratorsService.create(formData),
    onSuccess: () => queryClient.invalidateQueries(["collaborators"]),
  });
};

export const useUpdateCollaborator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => collaboratorsService.update(formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["collaborators"]);
      // Extract id from FormData if possible, otherwise let general cache refresh handle it
      const id = variables.get?.("id");
      if (id) queryClient.invalidateQueries(["collaborator", id]);
    },
  });
};

export const useDeleteCollaborator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => collaboratorsService.delete(id),
    onSuccess: () => queryClient.invalidateQueries(["collaborators"]),
  });
};
