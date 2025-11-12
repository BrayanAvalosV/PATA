import Mascota from "../models/Mascota.js";

/**
 * POST /api/mascotas
 */
export const crearMascota = async (req, res, next) => {
  try {
    const body = req.body || {};

    if (!["adopcion", "extraviado"].includes(body.tipoPublicacion)) {
      return res.status(400).json({ error: "tipoPublicacion inválido" });
    }

    if (req.uid) body.usuarioId = req.uid;

    if (!body.contacto) {
      body.contacto = {
        nombre: "Usuario estático",
        telefono: "+56 9 0000 0000",
        correo: "usuario@ejemplo.cl",
      };
    }

    if (body.tipoPublicacion === "adopcion" && !body.estadoAdopcion) {
      body.estadoAdopcion = "disponible";
    }

    const mascota = await Mascota.create(body);
    return res.status(201).json(mascota);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/mascotas
 * ?tipo=adopcion|extraviado&region=...&comuna=...&page=1&limit=20
 * Flags opcionales:
 *  - incluirAdoptados=true     (por defecto NO incluye adoptados)
 *  - incluirEncontrados=true   (por defecto NO incluye encontrados)
 */
export const listarMascotas = async (req, res, next) => {
  try {
    const { tipo, region, comuna, page = 1, limit = 20 } = req.query;
    const incluirAdoptados = String(req.query.incluirAdoptados || "false") === "true";
    const incluirEncontrados = String(req.query.incluirEncontrados || "false") === "true";

    const filtro = {};

    if (tipo && ["adopcion", "extraviado"].includes(tipo)) {
      filtro.tipoPublicacion = tipo;
      if (tipo === "adopcion" && !incluirAdoptados) {
        filtro.estadoAdopcion = "disponible";
      }
      if (tipo === "extraviado" && !incluirEncontrados) {
        filtro.estado = { $ne: "Encontrado" };
      }
    }
    if (region) filtro.region = region;
    if (comuna) filtro.comuna = comuna;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 20);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Mascota.find(filtro).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limitNum),
      Mascota.countDocuments(filtro),
    ]);

    res.json({ total, page: pageNum, limit: limitNum, items });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/mascotas/:id
 */
export const obtenerMascota = async (req, res, next) => {
  try {
    const mascota = await Mascota.findById(req.params.id);
    if (!mascota) return res.status(404).json({ error: "No encontrada" });
    res.json(mascota);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/mascotas/tipo/:tipo
 */
export const listarPorTipo = async (req, res, next) => {
  try {
    const { tipo } = req.params;
    if (!["adopcion", "extraviado"].includes(tipo)) {
      return res.status(400).json({ error: "tipo inválido" });
    }
    const items = await Mascota.find({ tipoPublicacion: tipo }).sort({ createdAt: -1, _id: -1 });
    res.json(items);
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
      return res.status(403).json({ error: "No autorizado" });
    }

    if (mascota.tipoPublicacion !== "adopcion") {
      return res.status(400).json({ error: "Solo aplica a publicaciones de adopción" });
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
      return res.status(403).json({ error: "No autorizado" });
    }

    if (mascota.tipoPublicacion !== "extraviado") {
      return res.status(400).json({ error: "Solo aplica a reportes de extraviados" });
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
 * Devuelve contadores para la portada.
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
