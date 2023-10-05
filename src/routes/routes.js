import { Router } from 'express';
import { loginRoutes } from './loginRoutes.js';
import { profileRoutes } from './profileRoutes.js';
import { registerRoutes } from './registerRoutes.js';
import { updateRoutes } from './updateRoutes.js';

const router = Router();

router.use('/login', loginRoutes);
router.use('/profile', profileRoutes);
router.use('/register', registerRoutes);
router.use('/user', updateRoutes);

export { router };
