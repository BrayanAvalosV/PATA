// frontend/src/components/ResumenSecciones.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

const asArray = (data) => (Array.isArray(data) ? data : data?.items || []);

// mismo helper que en App.jsx, pero limitado a 3
const fetchList = async (tipo, limit) => {
  const url = `${API}/api/mascotas?tipo=${encodeURIComponent(
    tipo
  )}${limit ? `&limit=${limit}` : ""}&_=${Date.now()}`;

  try {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) return [];
    return asArray(await r.json());
  } catch (err) {
    console.error("Error cargando mascotas:", err);
    return [];
  }
};

export default function ResumenSecciones() {
  const [adopciones, setAdopciones] = useState([]);
  const [extraviados, setExtraviados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [a, e] = await Promise.all([
        fetchList("adopcion", 3),
        fetchList("extraviado", 3),
      ]);
      setAdopciones(a);
      setExtraviados(e);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <section className="py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-center text-4xl font-bold mb-6 text-green-700">
            Mascotas Destacadas 🐾
          </h2>
          <p className="text-center text-gray-500">
            Cargando mascotas destacadas...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <h2 className="text-center text-4xl font-bold text-green-700">
          Mascotas destacadas 🐾
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Bloque Adopciones */}
          <div className="rounded-2xl border border-green-100 bg-green-50/70 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-green-900">
                  En adopción
                </h3>
                <p className="text-sm text-green-900/80">
                  Algunas de las mascotas que están buscando hogar.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-900">
                🐶 Adopción
              </span>
            </div>

            <div className="space-y-3">
              {adopciones.length === 0 && (
                <p className="text-sm text-green-900/80">
                  Aún no hay mascotas en adopción registradas.
                </p>
              )}

              {adopciones.map((m) => (
                <article
                  key={m._id}
                  className="flex items-center gap-3 rounded-xl bg-white/80 p-3 shadow-sm"
                >
                  {m.fotos?.[0] && (
                    <img
                      src={m.fotos[0]}
                      alt={m.nombre || "Mascota en adopción"}
                      className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900">
                      {m.nombre || "Sin nombre"}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {m.especie} {m.raza ? `• ${m.raza}` : ""}
                    </p>
                    {m.ubicacion?.comuna && (
                      <p className="text-[11px] text-slate-500">
                        📍 {m.ubicacion.comuna}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <Link
                to="/adopta"
                className="inline-flex items-center rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
              >
                Ver todas las adopciones
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>

          {/* Bloque Extraviados */}
          <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-amber-900">
                  Mascotas extraviadas
                </h3>
                <p className="text-sm text-amber-900/80">
                  Casos recientes de mascotas que necesitan volver a casa.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
                🧡 Extraviados
              </span>
            </div>

            <div className="space-y-3">
              {extraviados.length === 0 && (
                <p className="text-sm text-amber-900/80">
                  Aún no hay informes de mascotas extraviadas registradas.
                </p>
              )}

              {extraviados.map((m) => (
                <article
                  key={m._id}
                  className="flex items-center gap-3 rounded-xl bg-white/80 p-3 shadow-sm"
                >
                  {m.fotos?.[0] && (
                    <img
                      src={m.fotos[0]}
                      alt={m.nombre || "Mascota extraviada"}
                      className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900">
                      {m.nombre || "Sin nombre"}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {m.especie} {m.raza ? `• ${m.raza}` : ""}
                    </p>
                    {m.ultimaUbicacion?.comuna && (
                      <p className="text-[11px] text-slate-500">
                        📍 Última vez visto en {m.ultimaUbicacion.comuna}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <Link
                to="/extraviados"
                className="inline-flex items-center rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition"
              >
                Ver todos los extraviados
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
