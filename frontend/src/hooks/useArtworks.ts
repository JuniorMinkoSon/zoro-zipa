import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { artworkService } from '../api/services';
import type { Artwork, FilterOption, SortOption } from '../types';

export const useArtworks = (filters?: FilterOption, sort?: SortOption) =>
  useQuery({
    queryKey: ['artworks', filters, sort],
    queryFn: () =>
      artworkService.getAll({
        ...filters,
        sort: sort || 'newest',
      }),
  });

export const useArtwork = (id: string) =>
  useQuery({
    queryKey: ['artworks', id],
    queryFn: () => artworkService.getById(id),
    enabled: !!id,
  });

export const useFeaturedArtworks = () =>
  useQuery({
    queryKey: ['artworks', 'featured'],
    queryFn: artworkService.getFeatured,
  });

export const useTrendingArtworks = () =>
  useQuery({
    queryKey: ['artworks', 'trending'],
    queryFn: artworkService.getTrending,
  });

export const useCreateArtwork = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: artworkService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['artworks'] }),
  });
};

export const useUpdateArtwork = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Artwork> }) => artworkService.update(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      queryClient.invalidateQueries({ queryKey: ['artworks', vars.id] });
    },
  });
};

export const useDeleteArtwork = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: artworkService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['artworks'] }),
  });
};
