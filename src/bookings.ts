import { Router, Request, Response } from 'express';

const router = Router();

interface Booking {
  id: number;
  desk: string;
  floor: number;
  date: string;
  active: boolean;
}

let bookings: Booking[] = [
  { id: 1, desk: 'A1', floor: 1, date: '2026-09-22', active: true },
  { id: 2, desk: 'B3', floor: 2, date: '2026-09-23', active: false },
  { id: 3, desk: 'C5', floor: 3, date: '2026-09-24', active: true }
];

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json(bookings);
});

router.get('/:id', (req: Request, res: Response) => {
  const bookingId = Number(req.params.id);
  const booking = bookings.find((item) => item.id === bookingId);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  return res.status(200).json(booking);
});

router.post('/', (req: Request, res: Response) => {
  const newBooking: Booking = req.body;

  bookings.push(newBooking);

  return res.status(201).json(newBooking);
});

router.put('/:id', (req: Request, res: Response) => {
  const bookingId = Number(req.params.id);
  const bookingIndex = bookings.findIndex((item) => item.id === bookingId);

  if (bookingIndex === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  bookings[bookingIndex] = {
    id: bookingId,
    ...req.body
  };

  return res.status(200).json(bookings[bookingIndex]);
});

router.patch('/:id', (req: Request, res: Response) => {
  const bookingId = Number(req.params.id);
  const booking = bookings.find((item) => item.id === bookingId);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  booking.active = !booking.active;

  return res.status(200).json(booking);
});

router.delete('/:id', (req: Request, res: Response) => {
  const bookingId = Number(req.params.id);
  const bookingIndex = bookings.findIndex((item) => item.id === bookingId);

  if (bookingIndex === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  bookings.splice(bookingIndex, 1);

  return res.status(204).send();
});

export default router;