// frontend/src/components/PerfilFundacion.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function PerfilFundacion() {
  const { id } = useParams(); // ID de la fundación en la URL
  const [fundacion, setFundacion] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Datos de la fundación
        const fundRes = await fetch(`${API}/api/fundaciones/${id}`);
        if (!fundRes.ok) {
          throw new Error("Fundación no encontrada");
        }
        const fundData = await fundRes.json();
        setFundacion(fundData);

        // 2) Mascotas de la fundación (en adopción, filtrando por fundacionId)
        const mascRes = await fetch(
          `${API}/api/mascotas?fundacionId=${id}&tipo=adopcion`
        );
        if (mascRes.ok) {
          const mascData = await mascRes.json();
          setMascotas(
            Array.isArray(mascData) ? mascData : mascData?.items || []
          );
        } else {
          setMascotas([]);
        }
      } catch (err) {
        console.error("Error al cargar fundación:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ---------- LOADING ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6">
            <div className="h-5 w-36 bg-emerald-100 rounded-full mb-4" />
            <div className="h-8 w-64 bg-gray-200 rounded-full" />
          </div>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-3xl mb-8" />
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-emerald-100 shadow-md p-4"
                >
                  <div className="h-32 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- ERROR / NO FUNDACIÓN ----------
  if (error || !fundacion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {error || "Fundación no encontrada"}
          </h2>
          <p className="text-gray-600 mb-6">
            Es posible que el enlace esté roto o que la fundación haya sido
            eliminada.
          </p>
          <Link
            to="/fundaciones"
            className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-semibold shadow-md hover:bg-emerald-400"
          >
            ← Volver al directorio de fundaciones
          </Link>
        </div>
      </div>
    );
  }

  const nombre = fundacion.nombreFundacion || fundacion.nombre;
  const ciudad = fundacion.ciudad;
  const descripcion = fundacion.quienesSomos;
  const imagenUrl = fundacion.imagenUrl;

  // ---------- VISTA NORMAL ----------
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Botón volver */}
        <div className="mb-6">
          <Link
            to="/fundaciones"
            className="inline-flex items-center text-emerald-700 hover:text-emerald-800 text-sm font-medium"
          >
            <span className="mr-1">←</span> Volver al directorio
          </Link>
        </div>

        {/* HEADER / HERO */}
        <section className="bg-white rounded-3xl border border-emerald-100 shadow-md overflow-hidden mb-10">
          <div className="relative h-64 md:h-72">
            {imagenUrl ? (
              <img
                src={imagenUrl}
                alt={nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-emerald-300 to-teal-300 flex items-center justify-center text-7xl text-white">
                🐾
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100/90 text-[11px] font-medium text-emerald-800 uppercase tracking-[0.16em]">
                  Fundación aliada
                </p>
                <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-white drop-shadow-sm">
                  {nombre}
                </h1>
                {ciudad && (
                  <p className="mt-1 text-sm text-emerald-50/90">
                    📍 {ciudad}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {fundacion.sitioWeb && (
                  <a
                    href={fundacion.sitioWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/90 text-xs font-semibold text-emerald-700 shadow-sm hover:bg-white"
                  >
                    🌐 Visitar sitio web
                  </a>
                )}
                {fundacion.email && (
                  <a
                    href={`mailto:${fundacion.email}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-500 text-xs font-semibold text-white shadow-md hover:bg-emerald-400"
                  >
                    ✉️ Contactar por correo
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quiénes Somos */}
            <section className="md:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="mr-2 text-lg">🏢</span> Quiénes somos
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {descripcion ||
                  "Esta fundación trabaja por el bienestar animal, promoviendo el rescate, rehabilitación y adopción responsable."}
              </p>
            </section>

            {/* Datos de contacto */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="mr-2 text-lg">📞</span> Ubicación y contacto
              </h2>
              <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-5 space-y-2 text-sm">
                {fundacion.direccion && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Dirección: </span>
                    {fundacion.direccion}
                  </p>
                )}
                {ciudad && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Ciudad: </span>
                    {ciudad}
                  </p>
                )}
                {fundacion.telefono && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Teléfono: </span>
                    <a
                      href={`tel:${fundacion.telefono}`}
                      className="text-emerald-700 hover:underline"
                    >
                      {fundacion.telefono}
                    </a>
                  </p>
                )}
                {fundacion.email && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Email: </span>
                    <a
                      href={`mailto:${fundacion.email}`}
                      className="text-emerald-700 hover:underline"
                    >
                      {fundacion.email}
                    </a>
                  </p>
                )}
                {fundacion.sitioWeb && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Sitio web: </span>
                    <a
                      href={fundacion.sitioWeb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline"
                    >
                      {fundacion.sitioWeb}
                    </a>
                  </p>
                )}
              </div>
            </section>
          </div>
        </section>

        {/* MASCOTAS EN ADOPCIÓN */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
              Mascotas en adopción 🐾
            </h2>
            {mascotas.length > 0 && (
              <span className="text-sm text-gray-600">
                {mascotas.length} mascota
                {mascotas.length === 1 ? "" : "s"} publicada
              </span>
            )}
          </div>

          {mascotas.length === 0 ? (
            <div className="bg-white rounded-3xl border border-emerald-100 shadow-md p-10 text-center">
              <p className="text-gray-700 text-lg mb-2">
                Esta fundación no tiene mascotas disponibles para adopción en
                este momento.
              </p>
              <p className="text-sm text-gray-500">
                Vuelve a revisar más adelante o explora otras fundaciones en el
                directorio.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {mascotas.map((mascota) => (
                <Link
                  key={mascota._id}
                  to={`/post/${mascota._id}`}
                  className="group bg-white rounded-3xl border border-emerald-100 shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="h-52 bg-gray-100 overflow-hidden">
                    {mascota.imagen ? (
                      <img
                        src={mascota.imagen}
                        alt={mascota.nombre}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl text-emerald-300">
                        🐶
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {mascota.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Raza: </span>
                      {mascota.raza || "Sin especificar"}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">Edad: </span>
                      {mascota.edad || "Desconocida"}
                    </p>
                    {mascota.descripcion && (
                      <p className="text-sm text-gray-700 line-clamp-3 mt-1 flex-1">
                        {mascota.descripcion}
                      </p>
                    )}
                    <div className="mt-4 pt-2 border-t border-emerald-50 flex justify-between items-center">
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        En adopción
                      </span>
                      <span className="text-sm font-semibold text-emerald-600 group-hover:underline">
                        Ver detalle →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
