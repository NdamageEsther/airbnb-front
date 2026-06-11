import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../../lib/api';

interface BookingPayload {
  checkIn: string;
  checkOut: string;
  guests?: number;
}

interface BackendBooking {
  id: string;
  listingId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
}

export function useCreateBooking(listingId: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: BookingPayload): Promise<BackendBooking> => {
      return api.post<BackendBooking>('/bookings', {
        listingId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', listingId] });
      toast.success('Booking confirmed! 🎉');
      navigate('/bookings');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create booking');
    },
  });
}