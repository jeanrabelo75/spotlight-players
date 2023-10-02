import { Router } from 'express';
import authMiddleware from '../middlewares/auth.js';

const profileRoutes = Router();

profileRoutes.get('/', authMiddleware, (req, res) => {
  const user = req.user;
  const { password, ...userInfo } = user.toObject();

  res.json(userInfo);
});

export { profileRoutes };
