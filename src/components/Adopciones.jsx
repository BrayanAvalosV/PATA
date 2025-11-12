import { useEffect, useState } from "react";

export default function Adopciones({ mascotas = [] }) {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    // Si vienen mascotas por props, las usamos
    if (mascotas.length > 0) {
      setLista(mascotas);
    } else {
      // Si no hay props (por ejemplo en /adopta), las cargamos desde localStorage
      const guardadas = JSON.parse(localStorage.getItem("mascotasAdopcion")) || [];
      setLista(guardadas);
    }
  }, [mascotas]);

  const eliminarMascota = (id) => {
    const confirmacion = confirm("¿Marcar como adoptada y eliminar de la lista?");
    if (!confirmacion) return;

    const actualizadas = lista.filter((m) => m.id !== id);
    setLista(actualizadas);
    localStorage.setItem("mascotasAdopcion", JSON.stringify(actualizadas));
  };

  return (
    <section className="py-16 bg-gray-50" id="adopciones">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-green-700 mb-10">
          Mascotas en Adopción 🐶🐱
        </h2>

        {lista.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            Aún no hay mascotas publicadas para adopción.  
            <br />
            ¡Publica una nueva mascota desde la sección{" "}
            <span className="font-semibold text-green-700">“Publicar”</span>! 💚
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {lista.map((m) => (
              <div
                key={m.id}
                className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition flex flex-col"
              >
                <img
                  src={m.imagen || "/placeholder.jpg"}
                  alt={m.nombre}
                  className="w-full h-60 object-cover"
                />
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {m.nombre}
                  </h3>
                  {m.edad && <p className="text-sm text-gray-500">{m.edad}</p>}
                  <p className="mt-3 text-gray-600 flex-grow">{m.descripcion}</p>

                  <div className="mt-4 space-y-2">
                    <button className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition">
                      Ver más
                    </button>
                    <button
                      onClick={() => eliminarMascota(m.id)}
                      className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Adoptado 🐾
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
