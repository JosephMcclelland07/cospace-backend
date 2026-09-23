import { Request, Response, NextFunction } from 'express';

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

  res.status(401).json({
    error: 'Unauthorized'
  });
  
};