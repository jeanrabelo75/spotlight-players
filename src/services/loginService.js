import { compare } from 'bcrypt';
import User from '../models/user.js';

export async function authenticate(email, password) {
  const authenticateUser = await User.findOne({ email });

  if (!authenticateUser) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await compare(password, authenticateUser.password);

  if (!isMatch) {
    const error = new Error("Incorrect password");
    error.statusCode = 401;
    throw error;
  }

  return authenticateUser;
}
