import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function PerfilFundacion() {
  const { id } = useParams(); // 🔹 Obtiene el ID de la URL
  const [fundacion, setFundacion] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFundacion = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener datos de la fundación
        const fundRes = await fetch(`${API}/api/fundaciones/${id}`);
        if (!fundRes.ok) {
          throw new Error("Fundación no encontrada");
        }
        const fundData = await fundRes.json();
        setFundacion(fundData);

        // Obtener mascotas de la fundación
        const mascotasRes = await fetch(
          `${API}/api/mascotas?usuarioId=${id}&tipo=adopcion`
        );
        if (mascotasRes.ok) {
          const mascotasData = await mascotasRes.json();
          setMascotas(
            Array.isArray(mascotasData) ? mascotasData : mascotasData?.items || []
          );
        }
      } catch (error) {
        console.error("Error al cargar fundación:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFundacion();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-2xl mb-8" />
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-8" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !fundacion) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Fundación no encontrada"}
          </h2>
          <Link
            to="/fundaciones"
            className="text-green-600 hover:underline mt-4 inline-block"
          >
            ← Volver a fundaciones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Botón volver */}
        <Link
          to="/fundaciones"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          ← Volver a fundaciones
        </Link>

        {/* Header con imagen de la fundación */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="h-64 bg-gradient-to-r from-green-400 to-blue-500 relative">
            {fundacion.imagenUrl ? (
              <img
                src={fundacion.imagenUrl}
                alt={fundacion.nombreFundacion || fundacion.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-8xl">
                🏠
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h1 className="text-4xl font-bold text-white">
                {fundacion.nombreFundacion || fundacion.nombre}
              </h1>
            </div>
          </div>

          <div className="p-8">
            {/* Quiénes Somos */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🏢</span> Quiénes Somos
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {fundacion.quienesSomos || "Información no disponible"}
              </p>
            </section>

            {/* Ubicación y Contacto */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📍</span> Ubicación y Contacto
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                {fundacion.direccion && (
                  <p className="text-gray-700">
                    <strong>Dirección:</strong> {fundacion.direccion}
                  </p>
                )}
                {fundacion.ciudad && (
                  <p className="text-gray-700">
                    <strong>Ciudad:</strong> {fundacion.ciudad}
                  </p>
                )}
                {fundacion.telefono && (
                  <p className="text-gray-700">
                    <strong>Teléfono:</strong>{" "}
                    <a
                      href={`tel:${fundacion.telefono}`}
                      className="text-green-600 hover:underline"
                    >
                      {fundacion.telefono}
                    </a>
                  </p>
                )}
                {fundacion.email && (
                  <p className="text-gray-700">
                    <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${fundacion.email}`}
                      className="text-green-600 hover:underline"
                    >
                      {fundacion.email}
                    </a>
                  </p>
                )}
                {fundacion.sitioWeb && (
                  <p className="text-gray-700">
                    <strong>Sitio web:</strong>{" "}
                    <a
                      href={fundacion.sitioWeb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      {fundacion.sitioWeb}
                    </a>
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Mascotas en adopción */}
        <section>
          <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
            Mascotas en Adopción 🐾
          </h2>

          {mascotas.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg">
                Esta fundación no tiene mascotas disponibles para adopción en este
                momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {mascotas.map((mascota) => (
                <Link
                  key={mascota._id}
                  to={`/post/${mascota._id}`}
                  className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="h-56 overflow-hidden bg-gray-200">
                    {mascota.imagen ? (
                      <img
                        src={mascota.imagen}
                        alt={mascota.nombre}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                        🐾
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {mascota.nombre}
                    </h3>
                    <p className="text-gray-600 mb-1">
                      <strong>Raza:</strong> {mascota.raza || "Sin especificar"}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Edad:</strong> {mascota.edad || "Desconocida"}
                    </p>
                    {mascota.descripcion && (
                      <p className="text-gray-700 text-sm mt-3 line-clamp-2">
                        {mascota.descripcion}
                      </p>
                    )}
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
