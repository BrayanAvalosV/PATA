// backend/src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import mascotasRoutes from "./routes/mascotas.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import fundacionesRoutes from "./routes/fundaciones.routes.js"; // 🔹 NUEVO

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pata";
const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

// Conexión a Mongo
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  });

const app = express();

// Middlewares
app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/mascotas", mascotasRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/fundaciones", fundacionesRoutes); // 🔹 NUEVO

// Health-check rápido
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Manejo de 404
app.use((req, res, next) => {
  if (res.headersSent) return next();
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo de errores
app.use((err, _req, res, _next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`API lista en http://localhost:${PORT}`);
});
