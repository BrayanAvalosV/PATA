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
          Authorization: `Bearer ${getToken()}`, // 👈 requerido por requireAuth
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || "No se pudo marcar como adoptado.");
        return;
      }
      // ❌ Lo sacamos inmediatamente de la UI
      setLista((prev) => prev.filter((x) => String(x._id) !== String(id)));
    } catch (e) {
      console.error(e);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <section className="py-16 bg-gray-50" id="adopciones">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-green-700 mb-10">
          Mascotas en Adopción 🐶🐱
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Cargando...</p>
        ) : lista.length === 0 ? (
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
                key={m._id}
                className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition flex flex-col"
              >
                <img
                  src={m.imagen || "/placeholder.jpg"}
                  alt={m.nombre || "Mascota"}
                  className="w-full h-60 object-cover"
                />
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {m.nombre || "Sin nombre"}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {[m.tipoMascota || null, m.sexo || null, m.edad || null]
                      .filter(Boolean)
                      .join(" • ") || "—"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {[m.region || null, m.comuna || null].filter(Boolean).join(", ") || "—"}
                  </p>

                  <p className="mt-3 text-gray-600 flex-grow">{m.descripcion}</p>

                  <div className="mt-4 space-y-2">
                    <Link
                      to={`/post/${m._id}`}
                      className="block w-full bg-green-700 text-white text-center py-2 rounded-lg hover:bg-green-800 transition"
                    >
                      Ver más
                    </Link>

                    {user && m.usuarioId && sameUser(m.usuarioId, user.id) && (
                      <button
                        onClick={() => marcarAdoptado(m._id)}
                        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        Marcar como adoptado 🐾
                      </button>
                    )}
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
