import { useState } from "react";
import { saveSession } from "../services/session";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Registro() {
  const [form, setForm] = useState({
    nombre: "", email: "", password: "",
    rut: "", telefono: "",
    region: "", comuna: "", redSocial: ""
  });
  const [loading, setLoading] = useState(false);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { alert(data?.error || "Error en registro"); return; }
      saveSession(data.token, data.user);
      alert("Cuenta creada. ¡Bienvenido!");
      window.location.href = "/"; // vuelve a inicio
    } catch (err) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-28 pb-16 max-w-xl mx-auto px-6">
      <h1 className="text-3xl font-bold mb-6">Crear cuenta</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input name="nombre" placeholder="Nombre completo" className="w-full border rounded p-2" onChange={onChange} required />
        <input name="email" type="email" placeholder="Email" className="w-full border rounded p-2" onChange={onChange} required />
        <input name="password" type="password" placeholder="Contraseña" className="w-full border rounded p-2" onChange={onChange} required />

        <input name="rut" placeholder="RUT (12.345.678-9)" className="w-full border rounded p-2" onChange={onChange} required />
        <input name="telefono" placeholder="Teléfono (+56 9 ...)" className="w-full border rounded p-2" onChange={onChange} required />

        <div className="grid md:grid-cols-2 gap-3">
          <input name="region" placeholder="Región (opcional)" className="w-full border rounded p-2" onChange={onChange} />
          <input name="comuna" placeholder="Comuna (opcional)" className="w-full border rounded p-2" onChange={onChange} />
        </div>
        <input name="redSocial" placeholder="Red social (opcional)" className="w-full border rounded p-2" onChange={onChange} />

        <button disabled={loading} className="w-full bg-green-700 text-white font-semibold py-2 rounded">
          {loading ? "Creando..." : "Registrarme"}
        </button>
      </form>
    </section>
  );
}
