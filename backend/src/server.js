// backend/src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import mascotasRoutes from "./routes/mascotas.routes.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pata";
const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5179";

// Conexión a Mongo
mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((e) => {
    console.error("Error conectando a MongoDB:", e.message);
    process.exit(1);
  });

const app = express();

// CORS (permitimos el front local)
app.use(cors({
  origin: true,                       // en dev acepta cualquier http://localhost:*
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], // 👈 incluye PATCH
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.options("*", cors()); // maneja preflight para cualquier ruta
// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/mascotas", mascotasRoutes);

// Health-check rápido
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Manejo de errores
app.use((err, _req, res, _next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`API lista en http://localhost:${PORT}`);
});
