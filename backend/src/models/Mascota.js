// backend/src/models/Mascota.js
import mongoose from "mongoose";

const ContactoSchema = new mongoose.Schema(
  {
    nombre: { type: String, default: "" },
    telefono: { type: String, default: "" },
    correo: { type: String, default: "" },
    redSocial: { type: String, default: "" },
  },
  { _id: false }
);

const MascotaSchema = new mongoose.Schema(
  {
    tipoPublicacion: { type: String, enum: ["adopcion", "extraviado"], required: true },
    nombre: { type: String, default: "Sin nombre" },
    tipoMascota: { type: String, default: "" },
    raza: { type: String, default: "" },
    sexo: { type: String, default: "" },
    edad: { type: String, default: "" },
    tamano: { type: String, default: "" },
    microchip: { type: Boolean, default: false },
    vacunas: { type: Boolean, default: false },
    desparasitado: { type: Boolean, default: false },
    esterilizado: { type: Boolean, default: false },
    salud: { type: String, default: "" },
    region: { type: String, default: "" },
    comuna: { type: String, default: "" },
    descripcion: { type: String, default: "" },
    imagen: { type: String, default: "" },
    estado: { type: String, default: "" }, // Perdido | Encontrado (extraviado)
    ubicacion: { type: String, default: "" },
    estadoAdopcion: { type: String, enum: ["disponible", "adoptado"], default: "disponible" },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", default: null },
    contacto: { type: ContactoSchema, default: () => ({}) },
  },
  { timestamps: true }
);

MascotaSchema.index({ tipoPublicacion: 1, createdAt: -1 });

export default mongoose.model("Mascota", MascotaSchema);
