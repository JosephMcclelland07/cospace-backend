import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';
import { validateSchema } from '../middleware/validate';
import { createBookingSchema } from '../schemas/booking.schema';

``

const router = Router();
const bookingController = new BookingController();

router.post(
  '/',
  validate([
    'id',
    'desk',
    'floor',
    'date',
    'active'
  ]),
  (req, res) =>
    bookingController.createBooking(req, res)
);

router.post(
  '/',
  auth,
  validateSchema(createBookingSchema),
  (req, res) =>
    bookingController.createBooking(req, res)
);

router.put(
  '/:id',
  validate([
    'desk',
    'floor',
    'date',
    'active'
  ]),
  (req, res) =>
    bookingController.updateBooking(req, res)
);

router.get('/', (req, res) =>
bookingController.getAllBookings(req, res)
);


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