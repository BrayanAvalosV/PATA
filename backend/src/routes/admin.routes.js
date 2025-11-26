// backend/src/routes/admin.routes.js
import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  listarSolicitudes,
  aprobarMascota,
  rechazarMascota,
} from "../controllers/admin.controller.js";

const router = Router();

// Todas estas rutas requieren login + rol admin (validado en el controlador)
router.get("/mascotas", requireAuth, listarSolicitudes);
router.patch("/mascotas/:id/aprobar", requireAuth, aprobarMascota);
router.patch("/mascotas/:id/rechazar", requireAuth, rechazarMascota);

export default router;
