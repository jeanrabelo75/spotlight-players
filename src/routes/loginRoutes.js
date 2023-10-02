import { join } from 'path';
import { Router } from 'express';
import { generateToken } from '../services/tokenService.js';

const loginRoute = Router();

loginRoute.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../views/', 'login.html'));
});

loginRoute.post('/', async (req, res, next) => {
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

export { loginRoute };
