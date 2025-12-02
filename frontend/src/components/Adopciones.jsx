// frontend/src/components/Adopciones.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken, getUser } from "../services/session";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Adopciones({ mascotas = null }) {
  const user = getUser();
  const [lista, setLista] = useState(mascotas || []);
  const [loading, setLoading] = useState(!mascotas);

  // Si no vienen por props, traemos TODO desde API (sin adoptados por defecto)
  useEffect(() => {
    if (mascotas && Array.isArray(mascotas)) {
      setLista(mascotas);
      setLoading(false);
      return;
    }
    const cargar = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/mascotas?tipo=adopcion`);
        const data = await res.json().catch(() => ({}));
        const items = Array.isArray(data) ? data : data.items || [];
        setLista(items);
      } catch (e) {
        console.warn("No se pudieron cargar adopciones:", e.message);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [mascotas]);

  const sameUser = (a, b) => {
    if (!a || !b) return false;
    if (typeof a === "object") a = a._id || a.id || `${a}`;
    if (typeof b === "object") b = b._id || b.id || `${b}`;
    return String(a) === String(b);
  };

  const marcarAdoptado = async (id) => {
    if (!confirm("¿Confirmas marcar esta mascota como adoptada?")) return;
    try {
      const token = getToken();
      if (!token) {
        alert("Debes iniciar sesión para realizar esta acción.");
        return;
      }
      const res = await fetch(`${API}/api/mascotas/${id}/adoptar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 requerido por requireAuth
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || "No se pudo marcar como adoptado.");
        return;
      }
      // Lo sacamos inmediatamente de la UI
      setLista((prev) => prev.filter((x) => String(x._id) !== String(id)));
    } catch (e) {
      console.error(e);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <section className="py-16 bg-gray-50" id="adopciones">
      <div className="max-w-7xl mx-auto px-6">
        {/* Encabezado profesional */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 border border-green-100">
              <span className="text-xs font-semibold text-green-700">
                🐾 Mascotas en adopción
              </span>
            </div>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900">
              Mascotas en Adopción
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl">
              Revisa las mascotas que están buscando un nuevo hogar. Si alguna
              te interesa, revisa los detalles del aviso y sigue las
              instrucciones de contacto del responsable de la publicación.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/publicar"
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition"
            >
              Publicar mascota
            </Link>
          </div>
        </header>

        {/* Estados: cargando / vacío / listado */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white shadow-sm rounded-2xl border border-green-100 p-4 animate-pulse h-80"
              >
                <div className="h-40 bg-slate-100 rounded-xl mb-4" />
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/3 mb-1" />
                <div className="h-3 bg-slate-100 rounded w-2/3 mb-3" />
                <div className="h-9 bg-slate-100 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : lista.length === 0 ? (
          <p className="text-center text-slate-600 text-sm md:text-base">
            Aún no hay mascotas publicadas para adopción.
            <br />
            Puedes ser la primera persona en ayudar publicando desde{" "}
            <Link
              to="/publicar"
              className="font-semibold text-green-700 underline-offset-2 hover:underline"
            >
              la sección “Publicar”
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {lista.map((m) => {
              const nombre = m.nombre || "Sin nombre";
              const infoLinea =
                [m.tipoMascota || null, m.sexo || null, m.edad || null]
                  .filter(Boolean)
                  .join(" • ") || "Mascota";

              const ubicacion =
                [m.region || null, m.comuna || null]
                  .filter(Boolean)
                  .join(", ") || null;

              const descripcion =
                m.descripcion || "Esta mascota está en búsqueda de un hogar.";

              const imagen = m.imagen || m.fotos?.[0] || "/placeholder.jpg";

              const esDueno = user && m.usuarioId && sameUser(m.usuarioId, user.id);

              return (
                <article
                  key={m._id}
                  className="bg-white shadow-sm rounded-2xl border border-green-100 overflow-hidden flex flex-col transition hover:shadow-md hover:-translate-y-0.5"
                >
                  {/* Imagen */}
                  <div className="relative h-56 bg-slate-100">
                    <img
                      src={imagen}
                      alt={nombre}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-800 border border-green-200 shadow-sm">
                      En adopción
                    </span>
                  </div>

                  {/* Contenido */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">
                      {nombre}
                    </h3>

                    <p className="text-xs text-slate-600 mb-1">{infoLinea}</p>

                    {ubicacion && (
                      <p className="text-xs text-slate-700 mb-2">
                        <span className="font-semibold">Zona:</span>{" "}
                        {ubicacion}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 flex-1 line-clamp-3">
                      {descripcion}
                    </p>

                    <div className="mt-4 space-y-2">
                      <Link
                        to={`/post/${m._id}`}
                        className="block w-full bg-green-600 text-white text-center py-2 rounded-xl text-xs font-semibold hover:bg-green-700 transition"
                      >
                        Ver más detalles
                      </Link>

                      {esDueno && (
                        <button
                          onClick={() => marcarAdoptado(m._id)}
                          className="w-full bg-red-600 text-white py-2 rounded-xl text-xs font-semibold hover:bg-red-700 transition"
                        >
                          Marcar como adoptado 🐾
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
