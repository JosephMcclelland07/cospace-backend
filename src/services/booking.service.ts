import { BookingRepository } from '../repositories/booking.repository';
import { Prisma, type Booking } from '../generated/prisma/client';

export class BookingService {
  private bookingRepository: BookingRepository;

  constructor(bookingRepository: BookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  findAll(): Promise<Booking[]> {
    return this.bookingRepository.findAll();
  }

  async getPaginatedShifts(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.bookingRepository.findPaginated(skip, limit),
      this.bookingRepository.count(),
    ]);

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

  findById(id: number): Promise<Booking | null> {
    return this.bookingRepository.findById(id);
  }

  create(data: Prisma.BookingUncheckedCreateInput): Promise<Booking> {
    return this.bookingRepository.create(data);
  }

  update(
    id: number,
    data: Prisma.BookingUncheckedUpdateInput
  ): Promise<Booking | null> {
    return this.bookingRepository.update(
      id,
      data
    );
  }

  async toggleBooking(id: number): Promise<Booking | null> {
    const booking = await this.bookingRepository.findById(id);

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

  delete(id: number): Promise<boolean> {
    return this.bookingRepository.delete(id);
  }
}