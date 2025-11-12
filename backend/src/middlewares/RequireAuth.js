// backend/src/middlewares/requireAuth.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_cambia_esto";

export function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const [, token] = h.split(" "); // "Bearer <token>"
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.uid = payload.uid; // <-- ID del usuario autenticado
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}
