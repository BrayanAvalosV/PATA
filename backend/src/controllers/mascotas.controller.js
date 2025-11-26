// backend/src/controllers/mascotas.controller.js
import Mascota from "../models/Mascota.js";
import {Usuario} from "../models/usuario.model.js"; // 
import { sendEmail } from "../utils/mailer.js";

/**
 * POST /api/mascotas
 * Crea una nueva publicación. Siempre queda en estado "pendiente".
 */
export const crearMascota = async (req, res, next) => {
  try {
    const body = req.body || {};

    if (!["adopcion", "extraviado"].includes(body.tipoPublicacion)) {
      return res.status(400).json({ error: "tipoPublicacion inválido" });
    }

    if (!body.nombre) {
      return res.status(400).json({ error: "El nombre de la mascota es obligatorio" });
    }

    // Asignar usuario si viene del token
    if (req.uid) {
      body.usuarioId = req.uid;
    }

    // Aseguramos que siempre haya un objeto contacto
    if (!body.contacto) {
      body.contacto = {};
    }

    // Estado de publicación siempre pendiente al crear
    body.estadoPublicacion = "pendiente";
    body.motivoRechazo = "";

    const mascota = await Mascota.create(body);
    res.status(201).json(mascota);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/mascotas
 * Listado público. Solo muestra publicaciones aprobadas.
 * Soporta filtros: ?tipo=adopcion|extraviado&region=&comuna=&usuarioId=
 */
export const listarMascotas = async (req, res, next) => {
  try {
    const { tipo, region, comuna, usuarioId } = req.query; // 🔹 AGREGADO: usuarioId

    const filter = {
      estadoPublicacion: "aprobada",
    };

    if (tipo && ["adopcion", "extraviado"].includes(tipo)) {
      filter.tipoPublicacion = tipo;
    }
    if (region) filter.region = region;
    if (comuna) filter.comuna = comuna;
    if (usuarioId) filter.usuarioId = usuarioId; // 🔹 NUEVO: filtro por fundación

    const mascotas = await Mascota.find(filter).sort({ createdAt: -1 });
    res.json(mascotas);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/mascotas/tipo/:tipo
 * Atajo por tipo, también solo aprobadas.
 */
export const listarPorTipo = async (req, res, next) => {
  try {
    const { tipo } = req.params;
    if (!["adopcion", "extraviado"].includes(tipo)) {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    const mascotas = await Mascota.find({
      tipoPublicacion: tipo,
      estadoPublicacion: "aprobada",
    }).sort({ createdAt: -1 });

    res.json(mascotas);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/mascotas/:id
 * Detalle público. Solo accesible si la publicación está "aprobada".
 */
export const obtenerMascota = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mascota = await Mascota.findById(id);

    if (!mascota) return res.status(404).json({ error: "No encontrada" });

    if (mascota.estadoPublicacion !== "aprobada") {
      return res.status(404).json({ error: "No disponible" });
    }

    res.json(mascota);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/mascotas/:id/adoptar  (solo dueño)
 */
export const marcarAdoptado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mascota = await Mascota.findById(id);
    if (!mascota) return res.status(404).json({ error: "No encontrada" });

    if (!mascota.usuarioId || String(mascota.usuarioId) !== String(req.uid)) {
      return res.status(403).json({ error: "No eres el dueño de esta publicación" });
    }

    if (mascota.tipoPublicacion !== "adopcion") {
      return res.status(400).json({ error: "Solo se puede marcar adoptado en adopciones" });
    }

    mascota.estadoAdopcion = "adoptado";
    await mascota.save();

    res.json(mascota);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/mascotas/:id/encontrado  (solo dueño)
 */
export const marcarEncontrado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mascota = await Mascota.findById(id);
    if (!mascota) return res.status(404).json({ error: "No encontrada" });

    if (!mascota.usuarioId || String(mascota.usuarioId) !== String(req.uid)) {
      return res.status(403).json({ error: "No eres el dueño de esta publicación" });
    }

    if (mascota.tipoPublicacion !== "extraviado") {
      return res.status(400).json({ error: "Solo se puede marcar encontrado en extraviados" });
    }

    mascota.estado = "Encontrado";
    await mascota.save();

    res.json(mascota);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/mascotas/stats
 * Para el componente StatsFloating (adoptados y reencuentros).
 */
export const statsMascotas = async (_req, res, next) => {
  try {
    const [adoptedCount, reunitedCount, totalAdopciones, totalExtraviados] = await Promise.all([
      Mascota.countDocuments({ tipoPublicacion: "adopcion", estadoAdopcion: "adoptado" }),
      Mascota.countDocuments({ tipoPublicacion: "extraviado", estado: "Encontrado" }),
      Mascota.countDocuments({ tipoPublicacion: "adopcion" }),
      Mascota.countDocuments({ tipoPublicacion: "extraviado" }),
    ]);

    res.json({ adoptedCount, reunitedCount, totalAdopciones, totalExtraviados });
  } catch (err) {
    next(err);
  }
};

export const contactarDuenoMascota = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { mensaje, nombre, telefono, correo, ubicacionVista } = req.body || {};

    const mascota = await Mascota.findById(id).populate("usuarioId").exec();
    if (!mascota) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }

    if (mascota.tipoPublicacion !== "extraviado") {
      return res.status(400).json({ error: "Solo se puede contactar en mascotas extraviadas" });
    }

    const correoDestino =
      mascota.contacto?.correo ||
      (mascota.usuarioId && mascota.usuarioId.email);

    if (!correoDestino) {
      return res
        .status(400)
        .json({ error: "No hay correo de contacto disponible para esta publicación." });
    }

    const nombreMascota = mascota.nombre || "tu mascota";
    const subject = `Alguien tiene información sobre ${nombreMascota}`;

    let texto = `Hola,\n\nAlguien ha enviado un mensaje desde la página de PATA 4ta Región sobre la mascota "${nombreMascota}".\n\n`;

    texto += `Mensaje:\n${mensaje || "(sin mensaje)"}\n\n`;

    if (ubicacionVista) {
      texto += `Posible lugar donde la vieron:\n${ubicacionVista}\n\n`;
    }

    if (nombre || telefono || correo) {
      texto += "Datos de contacto de quien envía el mensaje:\n";
      if (nombre) texto += `- Nombre: ${nombre}\n`;
      if (telefono) texto += `- Teléfono: ${telefono}\n`;
      if (correo) texto += `- Correo: ${correo}\n`;
      texto += "\n";
    } else {
      texto += "La persona no dejó datos de contacto adicionales.\n\n";
    }

    texto += "Por favor ten cuidado con posibles intentos de estafa. Verifica bien la información antes de entregar dinero o datos sensibles.\n\n";
    texto += "Este mensaje fue enviado automáticamente por la página.\n";

    await sendEmail({
      to: correoDestino,
      subject,
      text: texto,
    });

    res.json({ ok: true, msg: "Mensaje enviado al dueño de la mascota." });
  } catch (err) {
    next(err);
  }
};
