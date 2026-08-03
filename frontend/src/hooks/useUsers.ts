import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../api/services';
import type { User } from '../types';

export const useUsers = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  });

export const useUser = (id: string) =>
  useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => userService.update(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', vars.id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};
