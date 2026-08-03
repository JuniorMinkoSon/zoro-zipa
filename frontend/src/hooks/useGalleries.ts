import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryService } from '../api/services';
import type { Gallery } from '../types';

export const useGalleries = () =>
  useQuery({
    queryKey: ['galleries'],
    queryFn: galleryService.getAll,
  });

export const useGallery = (id: string) =>
  useQuery({
    queryKey: ['galleries', id],
    queryFn: () => galleryService.getById(id),
    enabled: !!id,
  });

export const usePartnerGalleries = () =>
  useQuery({
    queryKey: ['galleries', 'partners'],
    queryFn: galleryService.getPartners,
  });

export const useCreateGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: galleryService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['galleries'] }),
  });
};

export const useUpdateGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Gallery> }) => galleryService.update(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['galleries'] });
      queryClient.invalidateQueries({ queryKey: ['galleries', vars.id] });
    },
  });
};

export const useDeleteGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: galleryService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['galleries'] }),
  });
};
