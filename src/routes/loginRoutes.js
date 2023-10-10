import { Router } from 'express';
import getUserWithoutPass, { authenticate } from '../services/loginService.js';

const loginRoutes = Router();

loginRoutes.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: 'Email and password are required.' });
    }

    const user = await authenticate(email, password);

    if (!user) {
      return res.status(401).send({ error: 'Invalid email or password.' });
    }

    const userWithoutPass = getUserWithoutPass(user);
    res.json({ user: userWithoutPass });
  } catch (error) {
    next(error);
  }
});

export { loginRoutes };
