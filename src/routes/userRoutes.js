import { join } from 'path';
import { Router } from 'express';
import { createUser } from '../services/userService.js';

const router = Router();

router.route('/')
  .get((req, res) => {
    res.sendFile(join(__dirname, '..', 'views', 'createUser.html'));
  })
  .post(async (req, res) => {
    try {
      const newUser = await createUser(req.body);
      res.json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

export default router;
