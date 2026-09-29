import { HTTP_STATUS } from '../constants/httpStatus';

export class AppError extends Error {
  statusCode: number;
  status: 'fail' | 'error';
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.status =
      statusCode >= HTTP_STATUS.BAD_REQUEST &&
      statusCode < HTTP_STATUS.INTERNAL_SERVER_ERROR
        ? 'fail'
        : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}