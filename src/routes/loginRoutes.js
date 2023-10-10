import { Router } from 'express';
import getUserWithoutPass, { authenticate } from '../services/loginService.js';

const loginRoutes = Router();

loginRoutes.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const user = await authenticate(email, password);

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const userWithoutPass = getUserWithoutPass(user);

    return res.json({
      status: 200,
      user: userWithoutPass
    });
  } catch (error) {
    next(error);
  }
});

export { loginRoutes };
