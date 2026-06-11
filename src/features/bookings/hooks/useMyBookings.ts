import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImg: string;
  listingLocation: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface ListingPhoto {
  id: string;
  url: string;
  publicId: string;
}

interface BackendBooking {
  id: string;
  listingId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  listing?: {
    title: string;
    location: string;
    photos?: ListingPhoto[];
  };
}

function mapBooking(b: BackendBooking): Booking {
  return {
    id: b.id,
    listingId: b.listingId,
    listingTitle: b.listing?.title ?? 'Listing',
    listingImg: b.listing?.photos?.[0]?.url ?? '',
    listingLocation: b.listing?.location ?? '',
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    guests: 1,
    total: b.totalPrice,
    status: b.status.toLowerCase() as Booking['status'],
  };
}

export function getStoredBookings(): Booking[] { return []; }
export function saveBooking(_booking: Booking) {}

export function useMyBookings() {
  return useQuery<Booking[]>({
    queryKey: ['bookings', 'me'],
    queryFn: async () => {
      const data = await api.get<BackendBooking[]>('/bookings');
      return data.map(mapBooking);
    },
    staleTime: 0,
    refetchInterval: 5000, // poll every 5 seconds for status updates
  });
}