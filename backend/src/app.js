import express from "express";
import cors from "cors";
import morgan from "morgan";
import "./config/db.js"; // inicializa conexión a Mongo
import mascotasRoutes from "./routes/mascotas.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" })); // por imágenes base64 temporales
app.use(morgan("dev"));

// Rutas
app.use("/api/mascotas", mascotasRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "pata-backend" });
});

// Manejo de 404
app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo de errores
app.use((err, _req, res, _next) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor"
  });
});
app.use("/api/auth", authRoutes);

export default app;
