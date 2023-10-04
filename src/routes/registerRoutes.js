import { Router } from "express";
import User from "../models/user.js";
import { createUser } from "../services/userService.js";

const registerRoutes = Router();

registerRoutes.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password, name, birthdate } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ error: "Email already in use" });
    }
    
    const newUser = await createUser({
      name,
      email,
      password,
      birthdate: new Date(birthdate),
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    next(error);
  }
});

export { registerRoutes };
