import express, { Request, Response } from 'express';
import bookingRouter from './routes/booking.routes';
import { logger } from './middleware/logger';
import { auth } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { NotFoundError } from './errors';
import { HTTP_STATUS } from './constants/httpStatus';



export const app = express();

const PORT = 5000;

app.use(express.json());
app.use(logger);

app.use(errorHandler);

app.get('/', (_req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({
    status: 'active',
    message: 'CoSpace API is running'
  });
});

app.use('/bookings', bookingRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', () => {
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

// Route to trigger a test NotFoundError
app.get("/boom-app-error", () => {
  throw new NotFoundError("Test resource not found");
});
 
// Temporary: trigger a plain, unexpected error to verify sanitized 500 response
app.get("/boom-unexpected", () => {
  throw new Error("db connection string: postgres://user:pass@internal-host/db");
});