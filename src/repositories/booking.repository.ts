export interface Booking {
  id: number;
  desk: string;
  floor: number;
  date: string;
  active: boolean;
}

export class BookingRepository {
  private bookings: Booking[] = [
    { id: 1, desk: 'A1', floor: 1, date: '2026-09-22', active: true },
    { id: 2, desk: 'B3', floor: 2, date: '2026-09-23', active: false },
    { id: 3, desk: 'C5', floor: 3, date: '2026-09-24', active: true }
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