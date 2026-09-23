import { Request, Response } from 'express';
import { BookingRepository } from '../repositories/booking.repository';
import { BookingService } from '../services/booking.service';

export class BookingController {
  private bookingService: BookingService;

  constructor() {
    const bookingRepository = new BookingRepository();
    this.bookingService = new BookingService(bookingRepository);
  }

  getAllBookings = (
    req: Request,
    res: Response
  ): void => {
    console.log('Controller: getAllBookings');

    const page = parseInt(
      req.query.page as string,
      10
    );

    const limit = parseInt(
      req.query.limit as string,
      10
    );

    const safePage =
      !isNaN(page) && page >= 1
        ? page
        : 1;

    const safeLimit =
      !isNaN(limit) && limit >= 1
        ? Math.min(limit, 50)
        : 10;

    const result =
      this.bookingService.getPaginatedShifts(
        safePage,
        safeLimit
      );

    res.status(200).json(result);
  };

  getBookingById = (
    req: Request,
    res: Response
  ): void => {
    const booking = this.bookingService.findById(
      Number(req.params.id)
    );

    if (!booking) {
      res
        .status(404)
        .json({ error: 'Booking not found' });
      return;
    }

    res.status(200).json(booking);
  };

  createBooking = (
    req: Request,
    res: Response
  ): void => {
    try {
      const booking =
        this.bookingService.create(req.body);

      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : 'Invalid booking'
      });
    }
  };

  updateBooking = (
    req: Request,
    res: Response
  ): void => {
    try {
      const booking =
        this.bookingService.update(
          Number(req.params.id),
          req.body
        );

      if (!booking) {
        res
          .status(404)
          .json({ error: 'Booking not found' });
        return;
      }

      res.status(200).json(booking);
    } catch (error) {
      res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : 'Invalid booking'
      });
    }
  };

  deleteBooking = (
    req: Request,
    res: Response
  ): void => {
    const deleted =
      this.bookingService.delete(
        Number(req.params.id)
      );

    if (!deleted) {
      res
        .status(404)
        .json({ error: 'Booking not found' });
      return;
    }

    res.status(204).send();
  };

  patchBooking = (
    req: Request,
    res: Response
  ): void => {
    const booking =
      this.bookingService.toggleBooking(
        Number(req.params.id)
      );

    if (!booking) {
      res.status(404).json({
        error: 'Booking not found'
      });
      return;
    }

    res.status(200).json(booking);
  };
}