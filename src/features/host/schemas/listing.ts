import { z } from 'zod';

export const listingSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: z.string().min(3, 'Location is required'),
 price: z.coerce.number().min(10, 'Price must be at least $10'),
  category: z.enum(['beach', 'mountain', 'city', 'countryside']),
  superhost: z.boolean().default(false),
  available: z.boolean().default(true),
  availableFrom: z.string().min(1, 'Available from date is required'),
  img: z.string().optional(),
});

export type ListingFormData = z.infer<typeof listingSchema>;
