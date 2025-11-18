// backend/src/controllers/admin.controller.js
import Mascota from "../models/Mascota.js";
import { Usuario } from "../models/usuario.model.js";
import { sendEmail } from "../utils/mailer.js";

function assertAdmin(req, res) {
  if (req.rol !== "admin") {
    res.status(403).json({ error: "Solo administradores" });
    return false;
  }
  return true;
}

/**
 * GET /api/admin/mascotas?estado=p
 * estado: pendiente | aprobada | rechazada | todas
 */
export async function listarSolicitudes(req, res, next) {
  try {
    if (!assertAdmin(req, res)) return;

    const { estado = "pendiente" } = req.query;
    const filter = {};

    if (estado !== "todas") {
      filter.estadoPublicacion = estado;
    }

    const mascotas = await Mascota.find(filter)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.json(mascotas);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/admin/mascotas/:id/aprobar
 */
export async function aprobarMascota(req, res, next) {
  try {
    if (!assertAdmin(req, res)) return;

    const { id } = req.params;
    const mascota = await Mascota.findById(id);
    if (!mascota) return res.status(404).json({ error: "Mascota no encontrada" });

    mascota.estadoPublicacion = "aprobada";
    mascota.motivoRechazo = "";
    mascota.revisadoPor = req.uid;
    mascota.fechaRevision = new Date();

    await mascota.save();
    res.json(mascota);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/admin/mascotas/:id/rechazar
 * body: { motivo?: string }
 */
export async function rechazarMascota(req, res, next) {
  try {
    if (!assertAdmin(req, res)) return;

    const { id } = req.params;
    const { motivo = "" } = req.body || {};

    const mascota = await Mascota.findById(id).populate("usuarioId").exec();
    if (!mascota) return res.status(404).json({ error: "Mascota no encontrada" });

    mascota.estadoPublicacion = "rechazada";
    mascota.motivoRechazo = motivo;
    mascota.revisadoPor = req.uid;
    mascota.fechaRevision = new Date();

    await mascota.save();

    // Intentar enviar correo al dueño
    try {
      let emailDestino = mascota.contacto?.correo || "";

      if (!emailDestino && mascota.usuarioId) {
        emailDestino = mascota.usuarioId.email;
      }

      if (emailDestino) {
        const asunto = `Solicitud de publicación rechazada: "${mascota.nombre}"`;
        const cuerpoTexto =
          motivo && motivo.trim().length > 0
            ? `Hola,\n\nTu publicación sobre ${mascota.nombre} ha sido rechazada por el siguiente motivo:\n\n${motivo}\n\nAtentamente,\nEquipo PATA`
            : `Hola,\n\nTu publicación sobre ${mascota.nombre} ha sido rechazada.\n\nAtentamente,\nEquipo PATA`;

        await sendEmail({
          to: emailDestino,
          subject: asunto,
          text: cuerpoTexto,
        });
      }
    } catch (errMail) {
      console.error("Error enviando correo de rechazo:", errMail);
    }

    res.json(mascota);
  } catch (err) {
    next(err);
  }
}
