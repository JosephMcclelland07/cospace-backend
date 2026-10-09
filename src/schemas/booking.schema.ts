import { z } from 'zod';

export const createBookingSchema = z.object({
  desk_id: z.number().int().positive(),
  booking_date: z.string().datetime(),
  active: z.boolean().optional().default(true)
});

export type Booking = z.infer<typeof createBookingSchema>;