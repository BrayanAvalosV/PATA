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
  const [showPwd, setShowPwd] = useState(false);

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
      window.location.href = "/";
    } catch (err) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Crear cuenta
            </h1>
            <p className="mt-2 text-slate-600">
              Regístrate para acceder a todas las funciones del portal.
            </p>
          </div>

          {/* Card clara (mismo contenedor, solo colores light) */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-xl">
            <div className="p-6 md:p-10">
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    placeholder="Ej: Camila Pérez"
                    className="w-full rounded-xl bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none px-4 py-3 placeholder:text-slate-400"
                    onChange={onChange}
                    required
                    autoComplete="name"
                  />
                </div>

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
                    className="w-full rounded-xl bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none px-4 py-3 placeholder:text-slate-400"
                    onChange={onChange}
                    required
                    autoComplete="email"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Usaremos este correo para confirmar tu cuenta.
                  </p>
                </div>

                {/* Password (ojo SVG minimal, como lo pediste) */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPwd ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full rounded-xl bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none px-4 py-3 pr-12 placeholder:text-slate-400"
                      onChange={onChange}
                      required
                      autoComplete="new-password"
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(s => !s)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700"
                      aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPwd ? (
                        // eye-off (minimal)
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24M10.73 5.08A9.53 9.53 0 0112 5c4.77 0 8.82 3.11 10.26 7.44a10.41 10.41 0 01-3 4.39M6.8 6.8A10.47 10.47 0 001.74 12c1.13 3.42 4.02 6.1 7.58 7.05" />
                        </svg>
                      ) : (
                        // eye (minimal)
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

                {/* RUT y Teléfono */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="rut" className="block text-sm font-medium text-slate-700 mb-1">
                      RUT
                    </label>
                    <input
                      id="rut"
                      name="rut"
                      placeholder="12.345.678-9"
                      className="w-full rounded-xl bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none px-4 py-3 placeholder:text-slate-400"
                      onChange={onChange}
                      required
                      pattern="^(\d{1,2}\.\d{3}\.\d{3}-[\dkK])$"
                      title="Formato válido: 12.345.678-9"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-slate-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      id="telefono"
                      name="telefono"
                      placeholder="+56 9 1234 5678"
                      className="w-full rounded-xl bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none px-4 py-3 placeholder:text-slate-400"
                      onChange={onChange}
                      required
                      inputMode="tel"
                      pattern="^\+?56\s?9\s?\d{4}\s?\d{4}$"
                      title="Formato chileno: +56 9 1234 5678"
                      autoComplete="tel-national"
                    />
                  </div>
                </div>

                {/* Región y Comuna */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-slate-700 mb-1">
                      Región (opcional)
                    </label>
                    <input
                      id="region"
                      name="region"
                      placeholder="Ej: Coquimbo"
                      className="w-full rounded-xl bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none px-4 py-3 placeholder:text-slate-400"
                      onChange={onChange}
                      autoComplete="address-level1"
                    />
                  </div>
                  <div>
                    <label htmlFor="comuna" className="block text-sm font-medium text-slate-700 mb-1">
                      Comuna (opcional)
                    </label>
                    <input
                      id="comuna"
                      name="comuna"
                      placeholder="Ej: La Serena"
                      className="w-full rounded-xl bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none px-4 py-3 placeholder:text-slate-400"
                      onChange={onChange}
                      autoComplete="address-level2"
                    />
                  </div>
                </div>

                {/* Red social */}
                <div>
                  <label htmlFor="redSocial" className="block text-sm font-medium text-slate-700 mb-1">
                    Red social (opcional)
                  </label>
                  <input
                    id="redSocial"
                    name="redSocial"
                    placeholder="@usuario"
                    className="w-full rounded-xl bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none px-4 py-3 placeholder:text-slate-400"
                    onChange={onChange}
                    autoComplete="off"
                  />
                </div>

                {/* Botón */}
                <button
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 transition-all shadow-sm"
                >
                  {loading ? "Creando…" : "Registrarme"}
                </button>

                {/* Nota */}
                <p className="text-xs text-slate-500 text-center">
                  Al registrarte aceptas nuestros términos y política de privacidad.
                </p>
              </form>
            </div>
          </div>

          {/* Footer mini */}
          <p className="mt-6 text-center text-slate-600 text-sm">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="underline decoration-emerald-500 decoration-2 underline-offset-4 hover:text-emerald-600">
              Iniciar sesión
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
