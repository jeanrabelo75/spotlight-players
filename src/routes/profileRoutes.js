import { Router } from "express";
import authMiddleware from "../middlewares/auth.js";

const profileRoutes = Router();

profileRoutes.get("/", authMiddleware, (req, res) => {
  const user = req.user[0];
  const objectUser = {
    _id: user._id.toHexString(),
    email: user.email,
    name: user.name,
    birthday: user.birthday,
    created_at: user.created_at,
  };

  res.json(objectUser);
});

export { profileRoutes };
