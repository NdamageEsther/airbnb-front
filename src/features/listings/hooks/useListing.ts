import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { Listing } from '../types';
import { api } from '../../../lib/api';

interface BackendListing {
  id: string;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  rating: number | null;
  photos: { url: string }[];
  type: string;
  guests: number;
  amenities: string[];
}

function mapListing(l: BackendListing): Listing {
  return {
    id: l.id as any,
    title: l.title,
    description: l.description,
    location: l.location,
    price: l.pricePerNight,
    rating: l.rating ?? 4.5,
    superhost: false,
    available: true,
    availableFrom: new Date().toISOString(),
    img: l.photos?.[0]?.url ?? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    category: 'city',
  };
}

export function useListing(id: string | undefined): UseQueryResult<Listing> {
  return useQuery<Listing>({
    queryKey: ['listing', id],
    queryFn: async (): Promise<Listing> => {
      const data = await api.get<BackendListing>(`/listings/${id}`);
      return mapListing(data);
    },
    enabled: !!id,
    staleTime: 0,
  });
}