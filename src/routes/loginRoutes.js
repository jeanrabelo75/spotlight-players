import { Router } from 'express';
import { authenticate } from '../services/loginService.js';
import { generateToken } from '../services/tokenService.js';

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

    const token = generateToken(user);
    res.json({ token });

  } catch (error) {
    next(error);
  }
});

export { loginRoutes };
