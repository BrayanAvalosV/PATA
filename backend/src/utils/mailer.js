// backend/src/utils/mailer.js
import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
} = process.env;

// Transporter básico. Configúralo según tu proveedor (Gmail, etc.).
let transporter = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
} else {
  console.warn("⚠️ SMTP no configurado. Los correos de rechazo solo se loguearán en consola.");
}

export async function sendEmail({ to, subject, text, html }) {
  if (!transporter) {
    console.log("📧 [MAIL MOCK] A:", to, "| Subject:", subject, "| Text:", text);
    return;
  }

  await transporter.sendMail({
    from: FROM_EMAIL || SMTP_USER,
    to,
    subject,
    text,
    html,
  });
}
    