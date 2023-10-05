import { Router } from 'express';
import { authenticate } from '../services/loginService.js';
import { changePassword } from '../services/updateService.js';

const updateRoutes = Router();

updateRoutes.post('/change-password', authenticate, async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    await changePassword(email, newPassword);

    res.status(200).send({ message: 'Senha alterada com sucesso.' });
  } catch (error) {
    next(error);
  }
});

updateRoutes.patch('/update-profile', authenticate, async (req, res, next) => {
  try {
    console.log(req);
  } catch (error) {
    next(error)
  }
});

export { updateRoutes };
