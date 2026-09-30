import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt, { type JwtPayload } from 'jsonwebtoken';

dotenv.config();

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is missing');
}

type TokenUser = {
  id: number;
  email: string;
};

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, SALT_ROUNDS);

export const comparePassword = (
  password: string,
  hash: string
): Promise<boolean> => bcrypt.compare(password, hash);

export const generateToken = (user: TokenUser): string =>
  jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { subject: String(user.id), expiresIn: '1h' }
  );

export const verifyToken = (token: string): JwtPayload => {
  const payload = jwt.verify(token, JWT_SECRET);

  if (typeof payload === 'string') {
    throw new Error('Invalid token payload');
  }

  return payload;
};