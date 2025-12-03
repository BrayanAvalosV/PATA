// backend/src/routes/fundaciones.routes.js
import { Router } from "express";
import Fundacion from "../models/fundacion.model.js";
// 👇 IMPORT CORRECTO: con llaves y mismo nombre que en RequireAuth.js
import { requireAuth } from "../middlewares/RequireAuth.js";

const router = Router();

/**
 * GET /api/fundaciones
 * Lista todas las fundaciones
 */
router.get("/", async (_req, res, next) => {
  try {
    const fundaciones = await Fundacion.find().sort({ createdAt: -1 }).lean();
    res.json(fundaciones);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/fundaciones/:id
 * Perfil de una fundación
 */
router.get("/:id", async (req, res, next) => {
  try {
    const fundacion = await Fundacion.findById(req.params.id).lean();
    if (!fundacion) {
      return res.status(404).json({ error: "Fundación no encontrada" });
    }
    res.json(fundacion);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/fundaciones
 * Crear fundación asociada al usuario autenticado
 */
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const {
      nombreFundacion,
      ciudad,
      direccion,
      telefono,
      email,
      sitioWeb,
      imagenUrl,
      quienesSomos,
    } = req.body;

    const fundacion = await Fundacion.create({
      usuarioId: req.uid, // 👈 viene del middleware requireAuth
      nombreFundacion,
      ciudad,
      direccion,
      telefono,
      email,
      sitioWeb,
      imagenUrl,
      quienesSomos,
    });

    res.status(201).json(fundacion);
  } catch (err) {
    next(err);
  }
});

export default router;
