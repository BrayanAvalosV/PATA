import { Router } from "express";
import {
  crearMascota,
  listarMascotas,
  listarPorTipo,
  obtenerMascota,
  marcarAdoptado,
  marcarEncontrado,
  statsMascotas,
} from "../controllers/mascotas.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

// Crear publicación (si quieres exigir login, deja requireAuth)
router.post("/", requireAuth, crearMascota);

// STATS (público)
router.get("/stats", statsMascotas);

// Listar (público)
router.get("/", listarMascotas);

// Atajo por tipo (público)
router.get("/tipo/:tipo", listarPorTipo);

// Acciones (solo dueño)
router.patch("/:id/adoptar", requireAuth, marcarAdoptado);
router.patch("/:id/encontrado", requireAuth, marcarEncontrado);

// Detalle (público)
router.get("/:id", obtenerMascota);

export default router;
