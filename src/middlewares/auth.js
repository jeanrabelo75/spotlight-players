import jwt from "jsonwebtoken";
import { config } from "dotenv";
import User from '../models/user.js';

config();

const SECRET_KEY = process.env.JWT_SECRET_KEY || "";

async function authMiddleware(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ msg: "Token não encontrado. Acesso não autorizado." });
  }

  const [bearer, token] = authHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ msg: "Bearer Token inválido. Acesso não autorizado." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const decodedUser = await User.find({_id: decoded.userInfo._id })
    req.user = decodedUser;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "Token inválido. Acesso não autorizado." });
  }
}

export default authMiddleware;
