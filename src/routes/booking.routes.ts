import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/requireAuth';
import { validateSchema } from '../middleware/validate';
import { createBookingSchema } from '../schemas/booking.schema';


``

const router = Router();
const bookingController = new BookingController();

router.post(
  '/',
  requireAuth,
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