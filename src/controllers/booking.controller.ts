import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';
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
    res: Response,
    next: NextFunction
  ): Promise<void> => {
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

    return this.bookingService
      .getPaginatedShifts(safePage, safeLimit)
      .then((result) => {
        res.status(HTTP_STATUS.OK).json(result);
      })
      .catch(next);
  };

  getBookingById = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    return this.bookingService
      .findById(Number(req.params.id))
      .then((booking) => {
        if (!booking) {
          res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ error: 'Booking not found' });
          return;
        }

        res.status(HTTP_STATUS.OK).json(booking);
      })
      .catch(next);
  };

  createBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const booking = await this.bookingService.create(req.body);
      res.status(HTTP_STATUS.CREATED).json(booking);
    } catch (error) {
      next(error);
    }
  };

  updateBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const booking = await this.bookingService.update(
        Number(req.params.id),
        req.body
      );

      if (!booking) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ error: 'Booking not found' });
        return;
      }

      res.status(HTTP_STATUS.OK).json(booking);
    } catch (error) {
      next(error);
    }
  };

  deleteBooking = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    return this.bookingService
      .delete(Number(req.params.id))
      .then((deleted) => {
        if (!deleted) {
          res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ error: 'Booking not found' });
          return;
        }

        res.status(HTTP_STATUS.NO_CONTENT).send();
      })
      .catch(next);
  };

  patchBooking = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    return this.bookingService
      .toggleBooking(Number(req.params.id))
      .then((booking) => {
        if (!booking) {
          res.status(HTTP_STATUS.NOT_FOUND).json({
            error: 'Booking not found'
          });
          return;
        }

        res.status(HTTP_STATUS.OK).json(booking);
      })
      .catch(next);
  };
}