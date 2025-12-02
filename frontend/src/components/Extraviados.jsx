// frontend/src/components/Extraviados.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Extraviados() {
  const [mascotas, setMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExtraviados = async () => {
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
  }, []);

  return (
    <section className="relative min-h-[100vh] pt-32 pb-10 bg-gradient-to-b from-amber-50 to-white">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-amber-900">
              Mascotas extraviadas
            </h1>
            <p className="text-sm md:text-base text-gray-700 mt-1 max-w-xl">
              Ayuda a difundir y estar atento a las mascotas perdidas en la
              región. Si ves algo, siempre hazlo con respeto y cuidado.
            </p>
          </div>

          <Link
            to="/mapa-extraviados"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-semibold shadow hover:bg-amber-700"
          >
            Ver mapa de extraviados
          </Link>
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
            <p className="text-gray-600">
              No hay mascotas extraviadas publicadas por ahora.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {mascotas.map((m) => (
            <article
              key={m._id}
              className="bg-white rounded-2xl shadow-md border border-amber-100 overflow-hidden flex flex-col"
            >
              <div className="relative h-52 bg-gray-100">
                {m.imagen ? (
                  <img
                    src={m.imagen}
                    alt={m.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    Sin imagen
                  </div>
                )}
                <span className="absolute top-2 left-2 px-2 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                  {m.estado === "Encontrado" ? "Reencuentro logrado" : "Perdido"}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-lg font-bold text-gray-900 mb-1 truncate">
                  {m.nombre || "Mascota sin nombre"}
                </h2>
                <p className="text-xs text-gray-600 mb-2">
                  {[m.tipoMascota, m.raza].filter(Boolean).join(" · ") ||
                    "Mascota"}
                </p>
                {(m.comuna || m.region) && (
                  <p className="text-xs text-gray-700 mb-2">
                    <span className="font-semibold">Zona:</span>{" "}
                    {[m.comuna, m.region].filter(Boolean).join(", ")}
                  </p>
                )}

                <p className="text-xs text-gray-600 flex-1 line-clamp-2">
                  {m.descripcion || "Sin descripción adicional."}
                </p>

                <div className="mt-3">
                  <Link
                    to={`/post/${m._id}`}
                    className="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-semibold rounded-xl bg-amber-600 text-white hover:bg-amber-700"
                  >
                    Ver más detalles
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
