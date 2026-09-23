import { BookingRepository } from '../repositories/booking.repository';
import { Booking } from '../schemas/booking.schema';

export class BookingService {
  private bookingRepository: BookingRepository;

  constructor(bookingRepository: BookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  findAll(): Booking[] {
    return this.bookingRepository.findAll();
  }

  getPaginatedShifts(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const data = this.bookingRepository.findPaginated(
      skip,
      limit
    );

    const total = this.bookingRepository.count();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findById(id: number): Booking | undefined {
    return this.bookingRepository.findById(id);
  }

  create(booking: Booking): Booking {
    if (booking.desk.length < 3) {
      throw new Error(
        'Desk name must be at least 3 characters long'
      );
    }

    return this.bookingRepository.create(booking);
  }

  update(
    id: number,
    data: Partial<Booking>
  ): Booking | null {
    if (
      data.desk &&
      data.desk.length < 3
    ) {
      throw new Error(
        'Desk name must be at least 3 characters long'
      );
    }

    return this.bookingRepository.update(
      id,
      data
    );
  }

  toggleBooking(
    id: number
  ): Booking | null {
    const booking =
      this.bookingRepository.findById(id);

    if (!booking) {
      return null;
    }

    return this.bookingRepository.update(
      id,
      {
        active: !booking.active,
      }
    );
  }

  delete(id: number): boolean {
  const existingBooking =
    this.bookingRepository.findById(id);

  if (!existingBooking) {
    return false;
  }

  return this.bookingRepository.delete(id);
  }


}