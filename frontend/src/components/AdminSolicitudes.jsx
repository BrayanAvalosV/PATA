// frontend/src/components/AdminSolicitudes.jsx
import { useEffect, useState } from "react";
import { getToken } from "../services/session";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

const ESTADOS = [
  { value: "pendiente", label: "Pendientes" },
  { value: "aprobada", label: "Aprobadas" },
  { value: "rechazada", label: "Rechazadas" },
  { value: "todas", label: "Todas" },
];

export default function AdminSolicitudes() {
  const [estadoFiltro, setEstadoFiltro] = useState("pendiente");
  const [mascotas, setMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [accionEnCurso, setAccionEnCurso] = useState(null); // id

  const token = getToken();

  const cargar = async () => {
    if (!token) {
      setError("Falta token de administrador.");
      setCargando(false);
      return;
    }
    setCargando(true);
    setError("");
    try {
      const res = await fetch(
        `${API}/api/admin/mascotas?estado=${estadoFiltro}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json().catch(() => []);
      if (!res.ok) {
        throw new Error(data.error || "Error al cargar solicitudes");
      }
      setMascotas(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al cargar solicitudes");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoFiltro]);

  const aprobar = async (id) => {
    if (!token) return;
    setAccionEnCurso(id);
    try {
      const res = await fetch(`${API}/api/admin/mascotas/${id}/aprobar`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Error al aprobar");
      }
      await cargar();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al aprobar");
    } finally {
      setAccionEnCurso(null);
    }
  };

  const rechazar = async (id) => {
    if (!token) return;
    const motivo = window.prompt(
      "Motivo del rechazo (opcional, se enviará por correo):",
      ""
    );
    setAccionEnCurso(id);
    try {
      const res = await fetch(`${API}/api/admin/mascotas/${id}/rechazar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ motivo: motivo || "" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Error al rechazar");
      }
      await cargar();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al rechazar");
    } finally {
      setAccionEnCurso(null);
    }
  };

  return (
    <section className="relative min-h-[100vh] pt-24 pb-10 bg-slate-50">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Panel de moderación
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Revisa las publicaciones enviadas por la comunidad y decide si
              se aprueban o se rechazan.
            </p>
          </div>

          <div className="flex gap-2">
            {ESTADOS.map((e) => (
              <button
                key={e.value}
                type="button"
                onClick={() => setEstadoFiltro(e.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                  estadoFiltro === e.value
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-800 border-slate-300 hover:bg-slate-100"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {cargando && (
          <div className="mt-10 flex justify-center">
            <p>Cargando publicaciones...</p>
          </div>
        )}

        {error && !cargando && (
          <div className="mt-10 flex justify-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!cargando && !error && mascotas.length === 0 && (
          <div className="mt-10 flex justify-center">
            <p className="text-slate-600">No hay publicaciones en este estado.</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mascotas.map((m) => (
            <article
              key={m._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden"
            >
              <div className="relative h-40 bg-slate-100">
                {m.imagen ? (
                  <img
                    src={m.imagen}
                    alt={m.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    Sin imagen
                  </div>
                )}

                <span className="absolute top-2 left-2 px-2 py-1 rounded-full text-[11px] font-semibold bg-white/80 border border-slate-200 text-slate-900">
                  {m.tipoPublicacion === "adopcion"
                    ? "Adopción"
                    : "Extraviado"}
                </span>

                <span className="absolute top-2 right-2 px-2 py-1 rounded-full text-[11px] font-semibold bg-slate-900/80 text-white">
                  {m.estadoPublicacion}
                </span>
              </div>

              <div className="p-3 flex flex-col flex-1 text-xs">
                <h2 className="text-sm font-bold text-slate-900 mb-1 truncate">
                  {m.nombre || "Sin nombre"}
                </h2>

                {(m.comuna || m.region) && (
                  <p className="text-slate-600 mb-1">
                    {[m.comuna, m.region].filter(Boolean).join(", ")}
                  </p>
                )}

                <p className="text-slate-600 line-clamp-3 flex-1">
                  {m.descripcion || "Sin descripción."}
                </p>

                {m.motivoRechazo && m.estadoPublicacion === "rechazada" && (
                  <p className="mt-1 text-[11px] text-red-700">
                    Motivo rechazo: {m.motivoRechazo}
                  </p>
                )}

                <div className="mt-3 flex gap-2">
                  {m.estadoPublicacion !== "aprobada" && (
                    <button
                      type="button"
                      onClick={() => aprobar(m._id)}
                      disabled={!!accionEnCurso}
                      className="flex-1 px-3 py-1 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 text-[11px] disabled:opacity-60"
                    >
                      {accionEnCurso === m._id
                        ? "Procesando..."
                        : "Aprobar"}
                    </button>
                  )}
                  {m.estadoPublicacion !== "rechazada" && (
                    <button
                      type="button"
                      onClick={() => rechazar(m._id)}
                      disabled={!!accionEnCurso}
                      className="flex-1 px-3 py-1 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 text-[11px] disabled:opacity-60"
                    >
                      {accionEnCurso === m._id
                        ? "Procesando..."
                        : "Rechazar"}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
