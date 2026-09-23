import { Booking } from '../schemas/booking.schema';

export class BookingRepository {
  private bookings: Booking[] = [
  {
    id: 1,
    desk: 'Desk A',
    floor: 'Floor 1',
    date: '2026-09-22T09:00:00Z',
    active: true
  },
  {
    id: 2,
    desk: 'Desk B',
    floor: 'Floor 2',
    date: '2026-09-23T09:00:00Z',
    active: false
  }
];
  findAll(): Booking[] {
    console.log('Repository: findAll');
    return this.bookings;
  }

  findById(id: number): Booking | undefined {
    return this.bookings.find(
      (booking) => booking.id === id
    );
  }

  create(booking: Booking): Booking {
    this.bookings.push(booking);
    return booking;
  }
  update(
    id: number,
    data: Partial<Booking>
  ): Booking | undefined {
    const bookingIndex = this.bookings.findIndex(
      (booking) => booking.id === id
    );

    if (bookingIndex === -1) {
      return undefined;
    }

    this.bookings[bookingIndex] = {
      ...this.bookings[bookingIndex],
      ...data,
      id
    };

    return this.bookings[bookingIndex];
  }

  delete(id: number): boolean {
    const bookingIndex = this.bookings.findIndex(
      (booking) => booking.id === id
    );

    if (bookingIndex === -1) {
      return false;
    }

    this.bookings.splice(bookingIndex, 1);
    return true;
  }
}