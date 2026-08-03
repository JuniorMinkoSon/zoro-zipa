import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exhibitionService } from '../api/services';
import type { Exhibition } from '../types';

export const useExhibitions = () =>
  useQuery({
    queryKey: ['exhibitions'],
    queryFn: exhibitionService.getAll,
  });

export const useExhibition = (id: string) =>
  useQuery({
    queryKey: ['exhibitions', id],
    queryFn: () => exhibitionService.getById(id),
    enabled: !!id,
  });

export const useCurrentExhibitions = () =>
  useQuery({
    queryKey: ['exhibitions', 'current'],
    queryFn: exhibitionService.getCurrent,
  });

export const useCreateExhibition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: exhibitionService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['exhibitions'] }),
  });
};

export const useUpdateExhibition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Exhibition> }) => exhibitionService.update(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['exhibitions'] });
      queryClient.invalidateQueries({ queryKey: ['exhibitions', vars.id] });
    },
  });
};

export const useDeleteExhibition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: exhibitionService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['exhibitions'] }),
  });
};
