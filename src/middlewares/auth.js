import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const SECRET_KEY = process.env.JWT_SECRET || "";

function authMiddleware(req, res, next) {
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
      .json({ msg: "Token inválido. Acesso não autorizado." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token inválido. Acesso não autorizado." });
  }
}

export default authMiddleware;
