// frontend/src/components/Extraviados.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

/**
 * Listado de mascotas extraviadas
 *
 * - Si recibe `mascotas` por props, solo las muestra (no hace fetch).
 * - Si NO recibe `mascotas`, hace fetch a la API (para usarlo como página completa).
 */
export default function Extraviados({ mascotas: mascotasProp }) {
  const [mascotas, setMascotas] = useState(mascotasProp || []);
  const [cargando, setCargando] = useState(!mascotasProp);
  const [error, setError] = useState("");

  useEffect(() => {
    // Si vienen mascotas desde el padre (Home o ExtraviadosPage), solo las usamos
    if (mascotasProp) {
      setMascotas(mascotasProp);
      setCargando(false);
      setError("");
      return;
    }

    // Si no hay props, este componente se encarga de hacer el fetch
    const fetchExtraviados = async () => {
      setCargando(true);
      setError("");
      try {
        const res = await fetch(`${API}/api/mascotas?tipo=extraviado`);
        const data = await res.json().catch(() => []);
        if (!res.ok) {
          throw new Error(data.error || "Error al cargar extraviados");
        }
        setMascotas(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar extraviados");
      } finally {
        setCargando(false);
      }
    };

    fetchExtraviados();
  }, [mascotasProp]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Encabezado */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 border border-amber-100">
              <span className="text-xs font-semibold text-amber-700">
                🔍 Mascotas extraviadas
              </span>
            </div>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900">
              Mascotas extraviadas
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl">
              Revisa los casos recientes de mascotas que necesitan volver con
              sus familias. Si reconoces a alguna, contáctate con la persona
              que publicó el aviso de forma respetuosa y responsable.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/mapa-extraviados"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold shadow-sm hover:bg-amber-600 transition"
            >
              Ver mapa de extraviados
            </Link>
          </div>
        </header>

        {/* Estados: cargando / error / vacío */}
        {cargando && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4 animate-pulse h-80"
              >
                <div className="h-40 bg-slate-100 rounded-xl mb-4" />
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/3 mb-1" />
                <div className="h-3 bg-slate-100 rounded w-2/3 mb-3" />
                <div className="h-9 bg-slate-100 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        )}

        {error && !cargando && (
          <div className="mt-10 flex justify-center">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {!cargando && !error && mascotas.length === 0 && (
          <div className="mt-10 flex justify-center">
            <p className="text-slate-600 text-sm">
              No hay mascotas extraviadas publicadas por ahora.
            </p>
          </div>
        )}

        {/* Grid de tarjetas */}
        {!cargando && !error && mascotas.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {mascotas.map((m) => {
              const nombre = m.nombre || "Mascota sin nombre";
              const tipo =
                [m.tipoMascota, m.raza].filter(Boolean).join(" · ") ||
                "Mascota";

              const zona = [m.comuna, m.region]
                .filter((x) => !!x)
                .join(", ");

              const descripcion =
                m.descripcion || "Sin descripción adicional.";

              const imagen = m.imagen || m.fotos?.[0] || null;

              const esReencuentro = m.estado === "Encontrado";

              return (
                <article
                  key={m._id}
                  className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden flex flex-col transition hover:shadow-md hover:-translate-y-0.5"
                >
                  {/* Imagen */}
                  <div className="relative h-52 bg-slate-100">
                    {imagen ? (
                      <img
                        src={imagen}
                        alt={nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        Sin imagen
                      </div>
                    )}

                    {/* Chip de estado */}
                    <span
                      className={`absolute top-2 left-2 px-2 py-1 rounded-full text-[11px] font-semibold border shadow-sm ${
                        esReencuentro
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-amber-100 text-amber-900 border-amber-300"
                      }`}
                    >
                      {esReencuentro ? "Reencuentro logrado" : "Perdido"}
                    </span>
                  </div>

                  {/* Contenido */}
                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-lg font-bold text-slate-900 mb-1 truncate">
                      {nombre}
                    </h2>

                    <p className="text-xs text-slate-600 mb-2">{tipo}</p>

                    {zona && (
                      <p className="text-xs text-slate-700 mb-2">
                        <span className="font-semibold">Zona:</span> {zona}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 flex-1 overflow-hidden">
                      {descripcion}
                    </p>

                    <div className="mt-4">
                      <Link
                        to={`/post/${m._id}`}
                        className="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-semibold rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition"
                      >
                        Ver más detalles
                      </Link>
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
