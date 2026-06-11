import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: any): Promise<void> => {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/v1/listings/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok && res.status !== 204) {
        const error = await res.json().catch(() => ({ message: 'Delete failed' }));
        throw new Error(error.message || 'Delete failed');
      }
      // 204 No Content - no body to parse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', 'mine'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      toast.success('Listing deleted!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete listing');
    },
  });
}