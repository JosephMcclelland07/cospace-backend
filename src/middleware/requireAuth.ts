import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/unauthorizedError';
import { verifyToken } from '../utils/auth';

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authorization = req.headers.authorization;
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    throw new UnauthorizedError('Bearer token required');
  }

  try {
    req.user = verifyToken(match[1]);
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
};