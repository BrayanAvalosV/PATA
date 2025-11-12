import { useState } from "react";
import { saveSession } from "../services/session";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

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
    <div
      
    >
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Iniciar sesión
            </h1>
            <p className="mt-2 text-slate-600">
              Ingresa con tu correo y contraseña.
            </p>
          </div>

          {/* Card clara */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-xl">
            <div className="p-6 md:p-8">
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    onChange={onChange}
                    required
                    autoComplete="email"
                  />
                </div>

                {/* Password + ojo minimal */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPwd ? "text" : "password"}
                      placeholder="Tu contraseña"
                      className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 pr-12 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      onChange={onChange}
                      required
                      autoComplete="current-password"
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(s => !s)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700"
                      aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPwd ? (
                        // eye-off (SVG minimal)
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24M10.73 5.08A9.53 9.53 0 0112 5c4.77 0 8.82 3.11 10.26 7.44a10.41 10.41 0 01-3 4.39M6.8 6.8A10.47 10.47 0 001.74 12c1.13 3.42 4.02 6.1 7.58 7.05" />
                        </svg>
                      ) : (
                        // eye (SVG minimal)
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Botón */}
                <button
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 transition-all shadow-sm"
                >
                  {loading ? "Ingresando…" : "Entrar"}
                </button>
              </form>

              {/* Links secundarios */}
              <div className="mt-6 flex items-center justify-between text-sm">
                <a href="/recuperar" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                  ¿Olvidaste tu contraseña?
                </a>
                <a href="/registro" className="text-slate-600 hover:text-slate-800 underline underline-offset-4">
                  Crear cuenta
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
