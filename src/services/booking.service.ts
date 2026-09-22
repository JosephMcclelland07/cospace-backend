import {
  Booking,
  BookingRepository
} from '../repositories/booking.repository';

export class BookingService {
  constructor(
    private bookingRepository: BookingRepository
  ) {}

  findAll(): Booking[] {
    console.log('Service: findAll');
    return this.bookingRepository.findAll();
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
  ): Booking | undefined {
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

  delete(id: number): boolean {
    return this.bookingRepository.delete(id);
  }

  toggleBooking(id: number): Booking | undefined {
  const booking = this.bookingRepository.findById(id);

  if (!booking) {
    return undefined;
  }

  booking.active = !booking.active;

  return booking;
}

}