import { join } from 'path';
import { Router } from 'express';
import { authenticate } from '../services/loginService.js';

const router = Router();

router.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../views/', 'login.html'));
});

router.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: 'Email and password are required.' });
    }

    const user = await authenticate(email, password);

    if (!user) {
      return res.status(401).send({ error: 'Invalid email or password.' });
    }

    req.session.user = user;
    res.redirect('/logged');

  } catch (error) {
    next(error);
  }
});

export default router;
