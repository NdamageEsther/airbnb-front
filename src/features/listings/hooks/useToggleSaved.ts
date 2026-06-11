import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';

export function useToggleSaved() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.post(`/saved/${id}`),

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['saved'] });
      const previous = queryClient.getQueryData<number[]>(['saved']) ?? [];
      const next = previous.includes(id)
        ? previous.filter((s) => s !== id)
        : [...previous, id];
      queryClient.setQueryData(['saved'], next);
      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['saved'], context.previous);
      }
      toast.error('Failed to update saved listing');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['saved'] });
    },
  });
}