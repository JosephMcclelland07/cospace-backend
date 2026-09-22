import express, { Request, Response } from 'express';
export const app = express();

const bookingRouter = express.Router();

const PORT = 5000;

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
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