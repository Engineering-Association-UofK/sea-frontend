import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificatesService } from '../api/certificates.service';

const CERTIFICATE_KEYS = {
  all:        ['certificates'],
  lists: () => [...CERTIFICATE_KEYS.all, 'list'],
  list:  (type, page, limit) => [...CERTIFICATE_KEYS.all, {page, limit}],
  detail:     (id) => [...CERTIFICATE_KEYS.all, 'detail', id],
};

export const useCertificates = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: CERTIFICATE_KEYS.list(page, limit),
    queryFn:  () => certificatesService.getAll(page, limit),
    staleTime: 0,
    // Keep previous page data visible while the next page loads
    // placeholderData: (prev) => prev,
  });
}

export const useCertificate = (id) => {
  return useQuery({
    queryKey: CERTIFICATE_KEYS.detail(id),
    queryFn:  () => certificatesService.getById(id),
    enabled:  !!id && id !== '0' && id !== 'new',
    staleTime: 0,
  });
}
  
export const useCreateCertificate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: certificatesService.create,
    onSuccess:  () => {
      qc.invalidateQueries(CERTIFICATE_KEYS.list());
      qc.invalidateQueries(CERTIFICATE_KEYS.lists());
    }
  });
};
  
export const useTestCertificate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: certificatesService.test,
    onSuccess:  () => {
      qc.invalidateQueries(CERTIFICATE_KEYS.list());
      qc.invalidateQueries(CERTIFICATE_KEYS.lists());
    }
  });
};
   
export const useUpdateCertificate = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({data}) => certificatesService.update(data),
    onSuccess:  (_, variables) => {
      qc.invalidateQueries(CERTIFICATE_KEYS.list());
      qc.invalidateQueries(CERTIFICATE_KEYS.lists());
      qc.invalidateQueries(CERTIFICATE_KEYS.detail(variables.id));
    },
  });
};
   
export const useDeleteCertificate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => certificatesService.delete(id),
    onSuccess:  () => {
      qc.invalidateQueries(CERTIFICATE_KEYS.list());
      qc.invalidateQueries(CERTIFICATE_KEYS.lists());
    }
  });
};

export const useDownloadCertificate = () => {
  return useMutation({
    mutationFn: (id) => certificatesService.download(id),
  });
};
  