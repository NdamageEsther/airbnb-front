import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { ListingFormData } from '../schemas/listing';
import type { Listing } from '../../listings/types';
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
    img: l.photos?.[0]?.url ?? '',
    category: 'city',
  };
}

export function getCreatedListings(): Listing[] {
  return [];
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: ListingFormData & { imageFile?: File }): Promise<Listing> => {
      // Step 1: Create the listing
      const payload = {
        title: data.title,
        description: data.description,
        location: data.location,
        pricePerNight: Number(data.price),
        type: 'APARTMENT',
        guests: 2,
        amenities: ['WiFi', 'Kitchen'],
      };

      const created = await api.post<BackendListing>('/listings', payload);

      // Step 2: Upload image if provided
      if (data.imageFile) {
        const formData = new FormData();
        formData.append('photos', data.imageFile);

        const token = localStorage.getItem('token');
        await fetch(`http://localhost:3000/listings/${created.id}/photos`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        // Fetch the updated listing with photos
        const updated = await api.get<BackendListing>(`/listings/${created.id}`);
        return mapListing(updated);
      }

      return mapListing(created);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', 'mine'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      toast.success('Listing created!');
      navigate('/host/listings');
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to create listing');
    },
  });
}