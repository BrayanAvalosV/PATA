// frontend/src/components/ListaFundaciones.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ListaFundaciones() {
  const [fundaciones, setFundaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("todas");

  useEffect(() => {
    const fetchFundaciones = async () => {
      try {
        const res = await fetch(`${API}/api/fundaciones`);
        if (res.ok) {
          const data = await res.json();
          console.log("Fundaciones recibidas:", data);
          setFundaciones(Array.isArray(data) ? data : data?.items || []);
        } else {
          console.error("Error al cargar fundaciones:", await res.text());
        }
      } catch (error) {
        console.error("Error al cargar fundaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFundaciones();
  }, []);

  // Ciudades únicas
  const ciudades = useMemo(() => {
    const set = new Set(
      fundaciones
        .map((f) => f.ciudad?.trim())
        .filter((c) => c && c.length > 0)
    );
    return ["todas", ...Array.from(set)];
  }, [fundaciones]);

  // Filtro + búsqueda
  const fundacionesFiltradas = useMemo(() => {
    return fundaciones.filter((f) => {
      const texto =
        `${f.nombreFundacion || f.nombre || ""} ${f.ciudad || ""} ${
          f.quienesSomos || ""
        }`.toLowerCase();

      const coincideBusqueda = texto.includes(search.toLowerCase().trim());
      const coincideCiudad =
        ciudadSeleccionada === "todas" ||
        (f.ciudad || "").toLowerCase() ===
          ciudadSeleccionada.toLowerCase();

      return coincideBusqueda && coincideCiudad;
    });
  }, [fundaciones, search, ciudadSeleccionada]);

  const total = fundaciones.length;
  const totalFiltradas = fundacionesFiltradas.length;

  // ---------- LOADING ----------
  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Hero */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-[11px] uppercase tracking-[0.16em] text-emerald-700">
                <span className="text-[9px]">●</span> Red de protección animal
              </div>
              <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
                Fundaciones y Refugios
                <span className="block text-emerald-600 mt-1">
                  Cargando organizaciones aliadas… 🐾
                </span>
              </h1>
              <p className="mt-3 text-sm md:text-base text-gray-600 max-w-xl">
                Estamos preparando el directorio de instituciones que
                rescatan, rehabilitan y dan en adopción a miles de animales
                en Chile.
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-3">
              <div className="px-4 py-3 rounded-2xl bg-white border border-emerald-100 shadow-sm">
                <p className="text-[11px] text-gray-500 uppercase tracking-[0.16em]">
                  Estado del directorio
                </p>
                <p className="mt-1 text-base font-semibold text-emerald-700">
                  Cargando datos…
                </p>
              </div>
            </div>
          </div>

          {/* Skeleton cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="relative rounded-3xl overflow-hidden bg-white border border-emerald-100 shadow-md animate-pulse"
              >
                <div className="h-40 bg-gradient-to-r from-emerald-200 to-teal-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-32 bg-gray-200 rounded-full" />
                  <div className="h-3 w-24 bg-gray-200 rounded-full" />
                  <div className="h-3 w-full bg-gray-200 rounded-full" />
                  <div className="h-3 w-3/4 bg-gray-200 rounded-full" />
                  <div className="flex gap-2 mt-3">
                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ---------- VISTA NORMAL ----------
  return (
    <section className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* HERO */}
        <div className="relative mb-10">
          {/* Glow suave */}
          <div className="pointer-events-none absolute -inset-16 -z-10 opacity-70">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(110,231,183,0.35),transparent_55%)]" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-[11px] uppercase tracking-[0.16em] text-emerald-700">
                <span className="text-[9px]">●</span> Directorio oficial PATA
              </div>
              <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
                Fundaciones y Refugios
                <span className="block text-emerald-600 mt-1">
                  Conectando personas con quienes más los necesitan.
                </span>
              </h1>
              <p className="mt-3 text-sm md:text-base text-gray-600 max-w-xl">
                Explora las organizaciones que trabajan por el bienestar
                animal, conoce su labor y descubre cómo puedes apoyar con
                adopciones, donaciones o voluntariado.
              </p>
            </div>

            {/* KPIs */}
            <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-4">
              <div className="flex gap-4">
                <div className="px-4 py-3 rounded-2xl bg-white border border-emerald-100 shadow-sm min-w-[140px]">
                  <p className="text-[11px] text-gray-500 uppercase tracking-[0.18em]">
                    Registradas
                  </p>
                  <p className="mt-1 text-2xl font-bold text-emerald-700">
                    {total}
                  </p>
                  <p className="text-xs text-gray-500">
                    en el directorio PATA
                  </p>
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white border border-teal-100 shadow-sm min-w-[140px]">
                  <p className="text-[11px] text-gray-500 uppercase tracking-[0.18em]">
                    Mostrando
                  </p>
                  <p className="mt-1 text-2xl font-bold text-teal-600">
                    {totalFiltradas}
                  </p>
                  <p className="text-xs text-gray-500">
                    según tus filtros
                  </p>
                </div>
              </div>

              <Link
                to="/mi-fundacion"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 text-sm font-semibold text-white shadow-lg hover:bg-emerald-400 transition-colors"
              >
                Registrar mi fundación
                <span className="text-base">＋</span>
              </Link>
            </div>
          </div>
        </div>

        {/* BUSCADOR + FILTROS */}
        <div className="bg-white border border-emerald-100 rounded-3xl shadow-md p-4 md:p-5 mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Buscador */}
            <div className="relative w-full md:max-w-md">
              <span className="absolute inset-y-0 left-4 flex items-center text-emerald-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Buscar por nombre, ciudad o misión de la fundación..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-emerald-200 bg-emerald-50/40 text-sm text-gray-800 placeholder:text-emerald-400/70 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300"
              />
            </div>

            {/* Filtros ciudad */}
            <div className="flex flex-wrap gap-2">
              {ciudades.map((ciudad) => (
                <button
                  key={ciudad}
                  type="button"
                  onClick={() => setCiudadSeleccionada(ciudad)}
                  className={`px-3 py-1.5 rounded-full text-xs md:text-[13px] border transition-all duration-150 ${
                    ciudadSeleccionada === ciudad
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                      : "bg-white text-gray-700 border-emerald-100 hover:border-emerald-400 hover:text-emerald-700"
                  }`}
                >
                  {ciudad === "todas" ? "Todas las ciudades" : ciudad}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENIDO */}
        {fundacionesFiltradas.length === 0 ? (
          <div className="bg-white border border-emerald-100 rounded-3xl shadow-md p-10 text-center">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              No encontramos fundaciones con esos criterios.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Prueba quitando filtros, usando menos palabras o revisa
              nuevamente más tarde: constantemente se suman nuevas
              organizaciones a PATA.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
              🐾 Tip: deja la ciudad en “Todas” para explorar el
              directorio completo.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {fundacionesFiltradas.map((fundacion) => {
              const id = fundacion._id || fundacion.id;
              const nombre = fundacion.nombreFundacion || fundacion.nombre;
              const ciudad = fundacion.ciudad;
              const descripcion = fundacion.quienesSomos || "";
              const imagenUrl = fundacion.imagenUrl;

              return (
                <Link
                  key={id}
                  to={`/fundacion/${id}`}
                  className="relative group rounded-3xl overflow-hidden bg-white border border-emerald-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Imagen */}
                  <div className="relative h-44 overflow-hidden rounded-t-3xl">
                    {imagenUrl ? (
                      <img
                        src={imagenUrl}
                        alt={nombre}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-emerald-300 to-teal-300 flex items-center justify-center text-6xl text-white">
                        🐾
                      </div>
                    )}

                    {/* Overlay suave */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

                    {/* Header card */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-50/90">
                          Fundación aliada
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-white line-clamp-1 drop-shadow-sm">
                          {nombre}
                        </h3>
                      </div>
                      {ciudad && (
                        <span className="px-2.5 py-1 rounded-full bg-white/85 text-[11px] font-medium text-gray-800 border border-emerald-100 whitespace-nowrap">
                          📍 {ciudad}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="relative p-5 flex flex-col flex-1">
                    <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                      {descripcion ||
                        "Organización dedicada al rescate, rehabilitación y adopción responsable de animales."}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-emerald-100">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <span className="text-[10px]">●</span>
                        Activa en la red PATA
                      </span>
                      <span className="text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 group-hover:underline">
                        Ver perfil →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
