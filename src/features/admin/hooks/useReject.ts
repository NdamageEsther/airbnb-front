import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { Listing } from '../../listings/types';

export function useReject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }): Promise<void> => {
      // No real API — just simulate success
      await new Promise((resolve) => setTimeout(resolve, 300));
      console.log('Rejected listing:', id, 'Reason:', reason);
    },

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['listings', 'pending'] });
      const previous = queryClient.getQueryData<Listing[]>(['listings', 'pending']);
      queryClient.setQueryData<Listing[]>(['listings', 'pending'], (old) =>
        old?.filter((l) => l.id !== id) ?? []
      );
      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['listings', 'pending'], context.previous);
      }
      toast.error('Failed to reject listing');
    },

    onSuccess: () => toast.success('Listing rejected ❌'),
  });
}