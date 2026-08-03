import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { artistService } from '../api/services';
import type { Artist } from '../types';

export const useArtists = () =>
  useQuery({
    queryKey: ['artists'],
    queryFn: artistService.getAll,
  });

export const useArtist = (id: string) =>
  useQuery({
    queryKey: ['artists', id],
    queryFn: () => artistService.getById(id),
    enabled: !!id,
  });

export const useCreateArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: artistService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['artists'] }),
  });
};

export const useUpdateArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Artist> }) => artistService.update(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      queryClient.invalidateQueries({ queryKey: ['artists', vars.id] });
    },
  });
};

export const useDeleteArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: artistService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['artists'] }),
  });
};
