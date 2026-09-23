import { z } from 'zod';

export const createBookingSchema = z.object({
  id: z.number(),

  desk: z
    .string()
    .trim()
    .min(3, 'Desk must be at least 3 characters long')
    .max(100, 'Desk must be no more than 100 characters long'),

  floor: z
    .string()
    .trim()
    .min(5, 'Floor must be at least 5 characters long')
    .max(200, 'Floor must be no more than 200 characters long'),

  date: z.string().datetime(),

  active: z.boolean().optional().default(true)
});

export type Booking = z.infer<typeof createBookingSchema>;