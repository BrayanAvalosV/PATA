import { useState } from "react";
import { saveSession } from "../services/session";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { alert(data?.error || "Login inválido"); return; }
      saveSession(data.token, data.user);
      alert("Sesión iniciada");
      window.location.href = "/";
    } catch (err) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-28 pb-16 max-w-md mx-auto px-6">
      <h1 className="text-3xl font-bold mb-6">Iniciar sesión</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input name="email" type="email" placeholder="Email" className="w-full border rounded p-2" onChange={onChange} required />
        <input name="password" type="password" placeholder="Contraseña" className="w-full border rounded p-2" onChange={onChange} required />
        <button disabled={loading} className="w-full bg-green-700 text-white font-semibold py-2 rounded">
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>
    </section>
  );
}
