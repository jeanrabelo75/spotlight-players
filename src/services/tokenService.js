import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const SECRET_KEY = process.env.JWT_SECRET_KEY || '';
const EXPIRATION_TIME = process.env.JWT_EXPIRATION || '';

export function generateToken(user) {
  return jwt.sign({ user }, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
}
