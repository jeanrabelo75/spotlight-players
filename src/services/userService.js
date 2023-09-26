import { compare } from 'bcrypt';
import user from '../models/user.js';

export async function createUser(userData) {
  if (!userData.email || !userData.password || !userData.name) {
    const error = new Error("All fields (email, password, name) are required");
    error.statusCode = 400;
    throw error;
  }

  try {
    const newUser = await user.create(userData);
    return newUser;
  } catch (error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      const duplicateError = new Error('Email already in use.');
      duplicateError.statusCode = 409;
      throw duplicateError;
    } else {
      const unexpectedError = new Error('An unexpected error occurred while creating the user.');
      unexpectedError.statusCode = 500;
      throw unexpectedError;
    }
  }
}

export async function validateUser(email, password) {
  const validateUser = await user.findOne({ email });

  if (!validateUser) {
    const error = new Error('No user found with this email.');
    error.statusCode = 401;
    throw error;
  }

  const validPassword = await compare(password, validateUser.password);
  if (!validPassword) {
    const error = new Error('Incorrect password.');
    error.statusCode = 401;
    throw error;
  }

  return validateUser;
}

export async function getUserByEmail(email) {
  try {
    const userByEmail = await user.findOne({ email });
    
    if (!userByEmail) {
      const error = new Error('No user found with this email.');
      error.statusCode = 404;
      throw error;
    }

    return userByEmail;
  } catch (error) {
    console.error('Error retrieving user by email:', error);
    throw error;
  }
}
