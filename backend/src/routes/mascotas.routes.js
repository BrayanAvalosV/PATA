// backend/src/routes/mascotas.routes.js
import { Router } from "express";
import {
  crearMascota,
  listarMascotas,
  listarPorTipo,
  obtenerMascota,
  marcarAdoptado,
  marcarEncontrado,
  statsMascotas,
  contactarDuenoMascota,
} from "../controllers/mascotas.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";


const router = Router();

// Crear publicación (requiere login)
router.post("/", requireAuth, crearMascota);

// Listar (público, solo aprobadas)
router.get("/", listarMascotas);

// Atajo por tipo (público)
router.get("/tipo/:tipo", listarPorTipo);

// Stats para el home
router.get("/stats", statsMascotas);

// Acciones (solo dueño)
router.patch("/:id/adoptar", requireAuth, marcarAdoptado);
router.patch("/:id/encontrado", requireAuth, marcarEncontrado);
router.post("/:id/contactar", contactarDuenoMascota);
// Detalle (público, solo aprobadas)
router.get("/:id", obtenerMascota);

export default router;
