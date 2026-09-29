export interface Booking {
  id: number;
  desk: string;
  floor: string;
  date: string;
  active: boolean;
}

export class BookingRepository {
  private bookings: Booking[] = [
    {
      id: 1,
      desk: 'A1',
      floor: '1',
      date: '2026-09-22',
      active: true,
    },
    {
      id: 2,
      desk: 'B3',
      floor: '2',
      date: '2026-09-23',
      active: false,
    },
    {
      id: 3,
      desk: 'C2',
      floor: '1',
      date: '2026-09-24',
      active: true,
    },
    {
      id: 4,
      desk: 'A4',
      floor: '2',
      date: '2026-09-25',
      active: false,
    },
    {
      id: 5,
      desk: 'B1',
      floor: '3',
      date: '2026-09-26',
      active: true,
    },
    {
      id: 6,
      desk: 'C3',
      floor: '1',
      date: '2026-09-27',
      active: true,
    },
    {
      id: 7,
      desk: 'A2',
      floor: '2',
      date: '2026-09-28',
      active: false,
    },
    {
      id: 8,
      desk: 'B4',
      floor: '3',
      date: '2026-09-29',
      active: true,
    },
  ];

  findAll(): Booking[] {
    return this.bookings;
  }

  findById(id: number): Booking | undefined {
    return this.bookings.find((booking) => booking.id === id);
  }

  create(booking: Booking): Booking {
    this.bookings.push(booking);
    return booking;
  }

  update(id: number, updatedBooking: Partial<Booking>): Booking | null {
    const booking = this.findById(id);

    if (!booking) {
      return null;
    }

    Object.assign(booking, updatedBooking);
    return booking;
  }

  delete(id: number): boolean {
    const index = this.bookings.findIndex(
      (booking) => booking.id === id
    );

    if (index === -1) {
      return false;
    }

    this.bookings.splice(index, 1);
    return true;
  }

  findPaginated(skip: number, limit: number): Booking[] {
    return this.bookings.slice(skip, skip + limit);
  }

  count(): number {
    return this.bookings.length;
  }
}

export const bookingRepository = new BookingRepository();