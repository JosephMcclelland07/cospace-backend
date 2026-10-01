import { AppError } from '../utils/appError';
import { HTTP_STATUS } from '../constants/httpStatus';

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.FORBIDDEN);
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}