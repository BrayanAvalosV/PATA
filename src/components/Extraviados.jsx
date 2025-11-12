import { useEffect, useState } from "react";

export default function Extraviados({ mascotas = [] }) {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    // Si vienen mascotas por props (desde App.jsx → solo las recientes)
    if (mascotas.length > 0) {
      setLista(mascotas);
    } else {
      // Si no, cargamos todas desde localStorage (para /extraviados)
      const guardadas = JSON.parse(localStorage.getItem("mascotasExtraviadas")) || [];
      setLista(guardadas);
    }
  }, [mascotas]);

  // 🐾 Marcar mascota como encontrada
  const marcarEncontrado = (id) => {
    const confirmacion = confirm("¿Marcar como encontrada y eliminar de la lista?");
    if (!confirmacion) return;

    const actualizadas = lista.filter((m) => m.id !== id);
    setLista(actualizadas);
    localStorage.setItem("mascotasExtraviadas", JSON.stringify(actualizadas));
  };

  return (
    <section className="py-16 bg-amber-50" id="extraviados">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-amber-600 mb-10">
          Mascotas Extraviadas 🔍
        </h2>

        {lista.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No hay reportes de mascotas extraviadas por el momento.  
            <br />
            Si perdiste o encontraste una mascota, publícala desde la sección{" "}
            <span className="font-semibold text-amber-600">“Publicar”</span> 🐾
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {lista.map((m) => (
              <div
                key={m.id}
                className="relative bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition flex flex-col"
              >
                {/* 🏷️ Cinta de estado */}
                <span
                  className={`absolute top-3 left-3 px-3 py-1 text-sm font-semibold rounded-full text-white shadow-md ${
                    m.estado === "Encontrado"
                      ? "bg-green-600"
                      : "bg-amber-600"
                  }`}
                >
                  {m.estado || "Perdido"}
                </span>

                <img
                  src={m.imagen || "/placeholder.jpg"}
                  alt={m.nombre || "Mascota sin nombre"}
                  className="w-full h-60 object-cover"
                />

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {m.nombre || "Mascota sin nombre"}
                  </h3>

                  {m.ubicacion && (
                    <p className="text-sm text-gray-500">{m.ubicacion}</p>
                  )}

                  <p className="mt-3 text-gray-600 flex-grow">{m.descripcion}</p>

                  <div className="mt-4 space-y-2">
                    <button className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition">
                      Ver más
                    </button>
                    <button
                      onClick={() => marcarEncontrado(m.id)}
                      className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Encontrado 🐾
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
