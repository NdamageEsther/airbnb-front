import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';

export interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  duration: number;
  maxGuests: number;
  category: string;
  img: string | null;
  hostId: string;
  createdAt: string;
  host: { id: string; name: string; avatar: string | null };
}

export function useExperiences() {
  return useQuery<Experience[]>({
    queryKey: ['experiences'],
    queryFn: () => api.get<Experience[]>('/experiences'),
  });
}

export function useMyExperiences() {
  return useQuery<Experience[]>({
    queryKey: ['experiences', 'mine'],
    queryFn: () => api.get<Experience[]>('/experiences/mine'),
  });
}

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Experience>) =>
      api.post<Experience>('/experiences', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience created!');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateExperience(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Experience>) =>
      api.put<Experience>(`/experiences/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      queryClient.invalidateQueries({ queryKey: ['experience', id] });
      toast.success('Experience updated!');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/experiences/${id}`),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['experiences', 'mine'] });
      const previous = queryClient.getQueryData<Experience[]>(['experiences', 'mine']);
      queryClient.setQueryData<Experience[]>(['experiences', 'mine'], (old) =>
        old?.filter((e) => e.id !== id) ?? []
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['experiences', 'mine'], context.previous);
      }
      toast.error('Failed to delete experience');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience deleted');
    },
  });
}