import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { templatesService } from '../api/templates.service';

const TEMPLATE_KEYS = {
  all:        ['templates'],
  lists: () => [...TEMPLATE_KEYS.all, 'list'],
  list:  (type, page, limit) => [...TEMPLATE_KEYS.all, {type, page, limit}],
  detail:     (id) => [...TEMPLATE_KEYS.all, 'detail', id],
};

export const useTemplates = (type, page = 1, limit = 20) => {
  return useQuery({
    queryKey: TEMPLATE_KEYS.list(type, page, limit),
    queryFn:  () => templatesService.getAll(type, page, limit),
    staleTime: 0,
    // Keep previous page data visible while the next page loads
    // placeholderData: (prev) => prev,
  });
}

export const useTemplate = (id) => {
  return useQuery({
    queryKey: TEMPLATE_KEYS.detail(id),
    queryFn:  () => templatesService.getById(id),
    enabled:  !!id && id !== '0' && id !== 'new',
    staleTime: 0,
  });
}
  
export const useCreateTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: templatesService.create,
    onSuccess:  () => {
      qc.invalidateQueries(TEMPLATE_KEYS.list());
      qc.invalidateQueries(TEMPLATE_KEYS.lists());
    }
  });
};
   
export const useUpdateTemplate = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({data}) => templatesService.update(data),
    onSuccess:  (_, variables) => {
      qc.invalidateQueries(TEMPLATE_KEYS.list());
      qc.invalidateQueries(TEMPLATE_KEYS.lists());
      qc.invalidateQueries(TEMPLATE_KEYS.detail(variables.id));
    },
  });
};
   
export const useDeleteTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => templatesService.delete(id),
    onSuccess:  () => {
      qc.invalidateQueries(TEMPLATE_KEYS.list());
      qc.invalidateQueries(TEMPLATE_KEYS.lists());
    }
  });
};
  