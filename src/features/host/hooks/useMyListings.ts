import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { Listing } from '../../listings/types';
import { api } from '../../../lib/api';

interface BackendListing {
  id: string;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  rating: number | null;
  photos: { id: string; url: string }[];
  type: string;
  guests: number;
  amenities: string[];
}

function mapListing(l: BackendListing): Listing {
  const photoUrl = l.photos && l.photos.length > 0 ? l.photos[0].url : null;
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
    img: photoUrl ?? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    category: 'city',
  };
}

export function useMyListings(): UseQueryResult<Listing[]> {
  return useQuery<Listing[]>({
    queryKey: ['listings', 'mine'],
    queryFn: async (): Promise<Listing[]> => {
      const data = await api.get<BackendListing[]>('/listings/my');
      console.log('My listings data:', JSON.stringify(data[0]?.photos));
      return data.map(mapListing);
    },
    staleTime: 0,
  });
}