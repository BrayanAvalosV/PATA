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

const UltimaUbicacionSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    radioMetros: { type: Number, default: 300 }, // 300m por defecto
  },
  { _id: false }
);

const MascotaSchema = new mongoose.Schema(
  {
    // adopcion | extraviado
    tipoPublicacion: {
      type: String,
      enum: ["adopcion", "extraviado"],
      required: true,
    },

    // Datos generales
    nombre: { type: String, required: true, trim: true },
    tipoMascota: { type: String, default: "" }, // perro, gato, etc.
    raza: { type: String, default: "" },
    sexo: { type: String, default: "" }, // macho / hembra / otro
    edad: { type: String, default: "" },
    tamano: { type: String, default: "" }, // pequeño/mediano/grande
    salud: { type: String, default: "" },

    // Flags básicos (puedes adaptarlos a tu front)
    microchip: { type: Boolean, default: false },
    vacunasAlDia: { type: Boolean, default: false },
    desparasitado: { type: Boolean, default: false },
    esterilizado: { type: Boolean, default: false },

    // Ubicación textual (región/comuna) y descripción
    region: { type: String, default: "" },
    comuna: { type: String, default: "" },
    descripcion: { type: String, default: "" },

    // Imagen en base64 o URL
    imagen: { type: String, default: "" },

    // SOLO para publicaciones de extraviados
    // estado: Perdido | Encontrado
    estado: { type: String, default: "" },
    // texto libre del lugar (ej: "Cerca de la Plaza de Armas")
    ubicacion: { type: String, default: "" },
    // ubicación para el mapa (círculo)
    ultimaUbicacion: { type: UltimaUbicacionSchema, default: null },

    // SOLO para adopción
    estadoAdopcion: {
      type: String,
      enum: ["disponible", "adoptado"],
      default: "disponible",
    },

    // Moderación
    estadoPublicacion: {
      type: String,
      enum: ["pendiente", "aprobada", "rechazada"],
      default: "pendiente",
    },
    motivoRechazo: { type: String, default: "" },
    revisadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", default: null },
    fechaRevision: { type: Date, default: null },

    // Relación con usuario
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
    },

    // Datos de contacto originales
    contacto: { type: ContactoSchema, default: () => ({}) },
  },
  { timestamps: true }
);

MascotaSchema.index({ tipoPublicacion: 1, estadoPublicacion: 1, createdAt: -1 });

export default mongoose.model("Mascota", MascotaSchema);
