import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';

export const auth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log('AUTH MIDDLEWARE HIT');

  const token = req.headers.authorization;

  if (token === 'super-secret-key') {
    req.user = {
        role: 'admin'
    };
    
    next();
    return;
  }

  res.status(HTTP_STATUS.UNAUTHORIZED).json({
    error: 'Unauthorized'
  });
  
};