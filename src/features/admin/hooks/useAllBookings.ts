import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import type { Booking } from '../../bookings/hooks/useMyBookings';

const MOCK: Booking[] = [
  { id: 'BK001', listingId: '1', listingTitle: 'Beachfront Villa', listingImg: '', listingLocation: 'Malibu, California', checkIn: '2026-06-10', checkOut: '2026-06-15', guests: 2, total: 420, status: 'confirmed' },
  { id: 'BK002', listingId: '2', listingTitle: 'Mountain Cabin', listingImg: '', listingLocation: 'Aspen, Colorado', checkIn: '2026-07-01', checkOut: '2026-07-05', guests: 3, total: 740, status: 'pending' },
  { id: 'BK003', listingId: '3', listingTitle: 'City Loft', listingImg: '', listingLocation: 'New York, USA', checkIn: '2026-08-01', checkOut: '2026-08-05', guests: 1, total: 1240, status: 'cancelled' },
];

export function useAllBookings(status = 'all', page = 1) {
  return useQuery<Booking[]>({
    queryKey: ['bookings', 'all', status, page],
    queryFn: async () => {
      try {
        return await api.get<Booking[]>(`/admin/bookings?status=${status}&page=${page}`);
      } catch {
        return status === 'all' ? MOCK : MOCK.filter((b) => b.status === status);
      }
    },
    placeholderData: (prev) => prev,
  });
}
