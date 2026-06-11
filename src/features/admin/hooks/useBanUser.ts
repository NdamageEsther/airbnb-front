import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.post(`/admin/users/${id}/ban`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('User banned');
    },
    onError: () => toast.error('Failed to ban user'),
  });
}