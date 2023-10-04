import e from "cors";
import User from "../models/user.js";

export async function createUser(userData) {
  if (
    !userData.email ||
    !userData.password ||
    !userData.name ||
    !userData.birthday
  ) {
    const error = new Error(
      "All fields (email, password, name, birthday) are required",
    );
    error.statusCode = 400;
    throw error;
  }

  try {
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.log(error);
    if (error.name === "MongoServerError" && error.code === 11000) {
      const duplicateError = new Error("Email already in use.");
      duplicateError.statusCode = 409;
      throw duplicateError;
    } else {
      const unexpectedError = new Error(
        "An unexpected error occurred while creating the user.".error,
      );
      unexpectedError.statusCode = 500;
      throw unexpectedError;
    }
  }
}

export async function getUserByEmail(email) {
  try {
    const userByEmail = await User.findOne({ email });

    if (!userByEmail) {
      const error = new Error("No user found with this email.");
      error.statusCode = 404;
      throw error;
    }

    return userByEmail;
  } catch (error) {
    console.error("Error retrieving user by email:", error);
    throw error;
  }
}
