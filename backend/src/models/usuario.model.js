// usuario.model.js
import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nombre: { type: String, required: true },
    tipo: { 
      type: String, 
      enum: ["individual", "fundacion", "admin"], 
      default: "individual" 
    },
    
    // Campos comunes
    telefono: String,
    
    // Campos específicos para fundaciones
    nombreFundacion: String,
    imagenUrl: String,
    quienesSomos: String,
    direccion: String,
    ciudad: String,
    sitioWeb: String,
    rut: { 
      type: String, 
      sparse: true,  // 🔹 AGREGADO: permite múltiples null
      unique: true 
    },
    
    // Campos específicos para individuos
    apellido: String,
    fechaNacimiento: Date,
  },
  { timestamps: true }
);

export const Usuario = mongoose.model("Usuario", UsuarioSchema);
