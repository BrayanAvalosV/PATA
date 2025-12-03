// backend/src/models/fundacion.model.js
import mongoose from "mongoose";

const fundacionSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    nombreFundacion: {
      type: String,
      required: true,
      trim: true,
    },
    ciudad: String,
    direccion: String,
    telefono: String,
    email: String,
    sitioWeb: String,
    imagenUrl: String,
    quienesSomos: String,
  },
  {
    timestamps: true,
    // 👇 Importantísimo: coincide con la colección que ves en Compass: "fundacions"
    collection: "fundacions",
  }
);

const Fundacion = mongoose.model("Fundacion", fundacionSchema);
export default Fundacion;
