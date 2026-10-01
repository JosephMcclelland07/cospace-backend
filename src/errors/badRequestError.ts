import { AppError } from '../utils/appError';
import { HTTP_STATUS } from '../constants/httpStatus';

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.BAD_REQUEST);
    this.name = 'BadRequestError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}