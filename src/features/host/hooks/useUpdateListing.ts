import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';
import type { ListingFormData } from '../schemas/listing';
import type { Listing } from '../../listings/types';

export function useUpdateListing(id: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ListingFormData) => api.put<Listing>(`/listings/${id}`, data),

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['listing', id] });
      const previous = queryClient.getQueryData<Listing>(['listing', id]);
      queryClient.setQueryData(['listing', id], (old: Listing) => ({ ...old, ...data }));
      return { previous };
    },

    onError: (_err, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['listing', id], context.previous);
      }
      toast.error('Failed to update listing');
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', 'mine'] });
      toast.success('Listing updated!');
      navigate('/host/dashboard');
    },
  });
}