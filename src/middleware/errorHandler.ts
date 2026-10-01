import {
  Request,
  Response,
  NextFunction
} from 'express';
import { AppError } from '../utils/appError';
import { HTTP_STATUS } from '../constants/httpStatus';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    return;
  }

  if (
    err instanceof SyntaxError &&
    'status' in err &&
    err.status === HTTP_STATUS.BAD_REQUEST &&
    'type' in err &&
    err.type === 'entity.parse.failed'
  ) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'fail',
      message: 'Invalid JSON payload'
    });

    return;
  }

  console.error(err);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Something went wrong on our end'
  });
};
