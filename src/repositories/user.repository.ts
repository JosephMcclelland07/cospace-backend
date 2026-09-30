import type { Prisma, User } from '../generated/prisma/client';
import { prisma } from '../utils/db';

type NewUser = Pick<
  Prisma.UserUncheckedCreateInput,
  'first_name' | 'last_name' | 'email' | 'password'
>;

export class UserRepository {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  create(data: NewUser): Promise<User> {
    return prisma.user.create({ data });
  }
}