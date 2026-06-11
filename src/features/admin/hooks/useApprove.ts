import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';
import type { Listing } from '../../listings/types';

export function useApprove() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.patch(`/listings/${id}/status`, { status: 'approved' }),

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['listings', 'pending'] });
      const previous = queryClient.getQueryData<Listing[]>(['listings', 'pending']);
      queryClient.setQueryData<Listing[]>(['listings', 'pending'], (old) =>
        old?.filter((l) => l.id !== id) ?? []
      );
      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['listings', 'pending'], context.previous);
      }
      toast.error('Failed to approve listing');
    },

    onSuccess: () => toast.success('Listing approved!'),
  });
}