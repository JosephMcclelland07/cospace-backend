import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';

const router = Router();
const bookingController = new BookingController();

router.get('/', (req, res) =>
  bookingController.getAllBookings(req, res)
);

router.get('/:id', (req, res) =>
  bookingController.getBookingById(req, res)
);

router.post('/', (req, res) =>
  bookingController.createBooking(req, res)
);

router.put('/:id', (req, res) =>
  bookingController.updateBooking(req, res)
);

router.patch('/:id', (req, res) =>
  bookingController.patchBooking(req, res)
);

router.delete('/:id', (req, res) =>
  bookingController.deleteBooking(req, res)
);

export default router;