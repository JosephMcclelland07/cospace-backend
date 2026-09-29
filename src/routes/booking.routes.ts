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
  (req, res, next) =>
    bookingController.createBooking(req, res, next)
);

router.post(
  '/',
  auth,
  validateSchema(createBookingSchema),
  (req, res, next) =>
    bookingController.createBooking(req, res, next)
);

router.put(
  '/:id',
  validate([
    'desk',
    'floor',
    'date',
    'active'
  ]),
  (req, res, next) =>
    bookingController.updateBooking(req, res, next)
);

router.get('/', (req, res, next) =>
bookingController.getAllBookings(req, res, next)
);


router.get('/', (req, res, next) =>
  bookingController.getAllBookings(req, res, next)
);

router.get('/:id', (req, res, next) =>
  bookingController.getBookingById(req, res, next)
);

router.post('/', (req, res, next) =>
  bookingController.createBooking(req, res, next)
);

router.put('/:id', (req, res, next) =>
  bookingController.updateBooking(req, res, next)
);

router.patch('/:id', (req, res, next) =>
  bookingController.patchBooking(req, res, next)
);

router.delete('/:id', (req, res, next) =>
  bookingController.deleteBooking(req, res, next)
);

export default router;