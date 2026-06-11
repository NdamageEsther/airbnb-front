import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { listings as mockListings } from '../../../data/listings';
import type { Listing } from '../../listings/types';

export function usePendingListings() {
  return useQuery<Listing[]>({
    queryKey: ['listings', 'pending'],
    queryFn: async () => {
      try {
        return await api.get<Listing[]>('/admin/listings/pending');
      } catch {
        return mockListings.slice(0, 4);
      }
    },
  });
}