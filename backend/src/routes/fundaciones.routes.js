import express from "express";
import {Usuario} from "../models/usuario.model.js";


const router = express.Router();

// Obtener todas las fundaciones
router.get("/", async (req, res) => {
  try {
    const fundaciones = await Usuario.find({ tipo: "fundacion" }).select("-password");
    res.json(fundaciones);
  } catch (error) {
    console.error("Error al obtener fundaciones:", error);
    res.status(500).json({ error: "Error al obtener fundaciones" });
  }
});

// Obtener una fundación por ID
router.get("/:id", async (req, res) => {
  try {
    const fundacion = await Usuario.findOne({
      _id: req.params.id,
      tipo: "fundacion",
    }).select("-password");

    if (!fundacion) {
      return res.status(404).json({ error: "Fundación no encontrada" });
    }

    res.json(fundacion);
  } catch (error) {
    console.error("Error al obtener fundación:", error);
    res.status(500).json({ error: "Error al obtener fundación" });
  }
});

export default router;
