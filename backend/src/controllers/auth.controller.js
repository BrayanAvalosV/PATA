// backend/src/controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/usuario.model.js";
import { validarRut, limpiarRut } from "../utils/rut.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_cambia_esto";

function toPublicUser(u) {
  return {
    id: u._id,
    nombre: u.nombre,
    email: u.email,
    rut: u.rut,
    telefono: u.telefono,
    region: u.region,
    comuna: u.comuna,
    redSocial: u.redSocial,
    rol: u.rol || "usuario",
  };
}

function signToken(user) {
  return jwt.sign(
    {
      uid: user._id.toString(),
      rol: user.rol || "usuario",
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function register(req, res) {
  try {
    const {
      nombre,
      email,
      password,
      rut,
      telefono,
      region = "",
      comuna = "",
      redSocial = "",
    } = req.body || {};

    if (!nombre || !email || !password || !rut || !telefono) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    if (!validarRut(rut)) {
      return res.status(400).json({ error: "RUT inválido" });
    }

    const rutLimpio = limpiarRut(rut);

    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({ error: "Email ya registrado" });
    }

    const existeRut = await Usuario.findOne({ rut: rutLimpio });
    if (existeRut) {
      return res.status(400).json({ error: "RUT ya registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await Usuario.create({
      nombre,
      email,
      passwordHash,
      rut: rutLimpio,
      telefono,
      region,
      comuna,
      redSocial,
      rol: "usuario", // registro público siempre "usuario"
    });

    const token = signToken(user);
    res.status(201).json({
      token,
      user: toPublicUser(user),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error en registro" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña requeridos" });
    }

    const user = await Usuario.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    const token = signToken(user);
    res.json({
      token,
      user: toPublicUser(user),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error en login" });
  }
}

export async function me(req, res) {
  try {
    const user = await Usuario.findById(req.uid);
    if (!user) return res.status(401).json({ error: "No autorizado" });
    res.json({ user: toPublicUser(user) });
  } catch (e) {
    res.status(500).json({ error: "Error" });
  }
}
