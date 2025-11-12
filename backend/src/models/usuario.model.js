// backend/src/models/usuario.model.js
import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },

    // Chile
    rut: { type: String, required: true, unique: true, trim: true }, // ej: 12.345.678-9
    telefono: { type: String, required: true, trim: true }, // +56 9 ...
    region: { type: String, default: "" },
    comuna: { type: String, default: "" },

    // Opcional
    redSocial: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Usuario = mongoose.model("Usuario", UsuarioSchema);
