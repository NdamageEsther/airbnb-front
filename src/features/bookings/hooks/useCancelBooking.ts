import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getStoredBookings } from './useMyBookings';

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const bookings = getStoredBookings();
      const updated = bookings.map((b) =>
        b.id === id ? { ...b, status: 'cancelled' as const } : b
      );
      localStorage.setItem('my_bookings', JSON.stringify(updated));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'me'] });
      toast.success('Booking cancelled');
    },
    onError: () => {
      toast.error('Failed to cancel booking');
    },
  });
}