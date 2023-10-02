import { Router } from 'express';
import { authenticate } from '../services/loginService.js';
import { changePassword } from '../services/changePasswordService.js';

const changePasswordRoutes = Router();

changePasswordRoutes.post('/', authenticate, async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    await changePassword(email, newPassword);

    res.status(200).send({ message: 'Senha alterada com sucesso.' });
  } catch (error) {
    next(error);
  }
});

export { changePasswordRoutes };
