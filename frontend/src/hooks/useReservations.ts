import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationService } from '../api/services';
import type { Reservation } from '../types';

export const useReservations = () =>
  useQuery({
    queryKey: ['reservations'],
    queryFn: reservationService.getAll,
  });

export const useMyReservations = () =>
  useQuery({
    queryKey: ['reservations', 'my'],
    queryFn: reservationService.getMyReservations,
  });

export const useReservation = (id: string) =>
  useQuery({
    queryKey: ['reservations', id],
    queryFn: () => reservationService.getById(id),
    enabled: !!id,
  });

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reservationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservations', 'my'] });
    },
  });
};

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Reservation> }) => reservationService.update(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservations', vars.id] });
    },
  });
};

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reservationService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reservations'] }),
  });
};
