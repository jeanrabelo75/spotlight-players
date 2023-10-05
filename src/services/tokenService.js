import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const SECRET_KEY = process.env.JWT_SECRET_KEY || "";
const EXPIRATION_TIME = process.env.JWT_EXPIRATION || "";

export function generateToken(user) {
  const userInfo = {
    _id: user._id,
    email: user.email,
    name: user.name,
  };

  return jwt.sign({ userInfo }, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
}
