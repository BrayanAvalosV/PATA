import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ListaFundaciones() {
  const [fundaciones, setFundaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFundaciones = async () => {
      try {
        const res = await fetch(`${API}/api/fundaciones`);
        if (res.ok) {
          const data = await res.json();
          console.log("Fundaciones recibidas:", data); // 🔹 DEBUG: ver los datos
          setFundaciones(Array.isArray(data) ? data : data?.items || []);
        }
      } catch (error) {
        console.error("Error al cargar fundaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFundaciones();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-green-700 mb-10">
            Fundaciones y Refugios 🏠
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white shadow-md rounded-2xl p-4 animate-pulse h-80" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-green-700 mb-4">
          Fundaciones y Refugios 🏠
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Conoce las organizaciones que trabajan día a día para el bienestar animal
        </p>

        {fundaciones.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">
              No hay fundaciones registradas en este momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {fundaciones.map((fundacion) => {
              // 🔹 DEBUG: ver el ID de cada fundación
              console.log("ID de fundación:", fundacion._id || fundacion.id);
              
              return (
                <Link
                  key={fundacion._id || fundacion.id}
                  to={`/fundacion/${fundacion._id || fundacion.id}`} // 🔹 CAMBIADO: usar _id o id
                  className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500 relative overflow-hidden">
                    {fundacion.imagenUrl ? (
                      <img
                        src={fundacion.imagenUrl}
                        alt={fundacion.nombreFundacion || fundacion.nombre}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                        🏠
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {fundacion.nombreFundacion || fundacion.nombre}
                    </h3>
                    {fundacion.ciudad && (
                      <p className="text-gray-600 mb-2 flex items-center">
                        <span className="mr-2">📍</span>
                        {fundacion.ciudad}
                      </p>
                    )}
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {fundacion.quienesSomos?.substring(0, 120)}...
                    </p>
                    <div className="mt-4 text-green-600 font-semibold group-hover:underline">
                      Ver perfil →
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
