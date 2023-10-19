import { Router } from "express";
import authMiddleware from "../middlewares/auth.js";
import { changePassword, updateProfile } from "../services/updateService.js";

const updateRoutes = Router();

updateRoutes.post(
  "/change-password",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { email, newPassword } = req.body;

      await changePassword(email, newPassword);

      res.status(200).send({ message: "Password updated!" });
    } catch (error) {
      next(error);
    }
  },
);

updateRoutes.patch(
  "/update-profile",
  authMiddleware,
  async (req, res, next) => {
    try {
      const body = req.body;

      await updateProfile(body);

      res.status(200).send({ message: "Profile updated!" });
    } catch (error) {
      next(error);
    }
  },
);

export { updateRoutes };
