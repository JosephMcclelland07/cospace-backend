import { Prisma, type User } from '../generated/prisma/client';
import { BadRequestError, UnauthorizedError } from '../errors';
import { HTTP_STATUS } from '../constants/httpStatus';
import {
  comparePassword,
  generateToken,
  hashPassword,
} from '../utils/auth';
import { UserRepository } from '../repositories/user.repository';
import type { NextFunction, Request, Response } from 'express';

const publicUser = (user: User) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

const isDuplicateEmail = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2002';

export class AuthController {
  constructor(private readonly userRepository = new UserRepository()) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { first_name, last_name, email, password } = req.body ?? {};

      if (
        typeof first_name !== 'string' ||
        typeof last_name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string'
      ) {
        throw new BadRequestError(
          'first_name, last_name, email, and password are required'
        );
      }

      const normalizedFirstName = first_name.trim();
      const normalizedLastName = last_name.trim();
      const normalizedEmail = email.trim().toLowerCase();

      if (
        !normalizedFirstName ||
        normalizedFirstName.length > 100 ||
        !normalizedLastName ||
        normalizedLastName.length > 100 ||
        normalizedEmail.length > 191 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
        password.length < 8 ||
        Buffer.byteLength(password, 'utf8') > 72
      ) {
        throw new BadRequestError('Invalid registration details');
      }

      const passwordHash = await hashPassword(password);

      let user: User;
      try {
        user = await this.userRepository.create({
          first_name: normalizedFirstName,
          last_name: normalizedLastName,
          email: normalizedEmail,
          password: passwordHash,
        });
      } catch (error) {
        if (isDuplicateEmail(error)) {
          throw new BadRequestError('Email is already registered');
        }

        throw error;
      }

      res.status(HTTP_STATUS.CREATED).json({ user: publicUser(user) });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body ?? {};

      if (typeof email !== 'string' || typeof password !== 'string') {
        throw new BadRequestError('Email and password are required');
      }

      const user = await this.userRepository.findByEmail(
        email.trim().toLowerCase()
      );

      if (!user || !(await comparePassword(password, user.password))) {
        throw new UnauthorizedError('Invalid email or password');
      }

      res.status(HTTP_STATUS.OK).json({
        token: generateToken(user),
        user: publicUser(user),
      });
    } catch (error) {
      next(error);
    }
  };
}