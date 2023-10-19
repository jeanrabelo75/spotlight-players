import { compare } from "bcrypt";
import User from "../models/user.js";
import { generateToken } from "./tokenService.js";

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

export default function getUserWithoutPass(user) {
  const token = generateToken(user);

  return {
    _id: user._id.toHexString(),
    name: user.name,
    email: user.email,
    accessToken: token,
    birthday: user.birthday,
    created_at: user.created_at,
  };
}
