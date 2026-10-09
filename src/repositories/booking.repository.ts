import { Prisma, type Booking } from '../generated/prisma/client';
import { prisma } from '../utils/db';

export class BookingRepository {
  findAll(): Promise<Booking[]> {
    return prisma.booking.findMany({
      orderBy: { id: 'asc' },
    });
  }

  findPaginated(skip: number, limit: number): Promise<Booking[]> {
    return prisma.booking.findMany({
      skip,
      take: limit,
      orderBy: { id: 'asc' },
    });
  }

  findById(id: number): Promise<Booking | null> {
    return prisma.booking.findUnique({
      where: { id },
    });
  }

  create(
    data: Omit<Prisma.BookingCreateInput, 'createdBy' | 'desk'>,
    deskId: number,
    userId: number
  ): Promise<Booking> {
    return prisma.booking.create({
      data: {
        ...data,
        desk: { connect: { id: deskId } },
        createdBy: { connect: { id: userId } },
      },
    });
  }

  async update(
    id: number,
    data: Prisma.BookingUncheckedUpdateInput
  ): Promise<Booking | null> {
    try {
      return await prisma.booking.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return null;
      }

      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    const result = await prisma.booking.deleteMany({
      where: { id },
    });

    return result.count > 0;
  }

  count(): Promise<number> {
    return prisma.booking.count();
  }
}

export const bookingRepository = new BookingRepository();