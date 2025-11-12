import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken, getUser } from "../services/session";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Extraviados({ mascotas = null }) {
  const user = getUser();
  const [lista, setLista] = useState(mascotas || []);
  const [loading, setLoading] = useState(!mascotas);

  useEffect(() => {
    if (mascotas && Array.isArray(mascotas)) {
      setLista(mascotas);
      setLoading(false);
      return;
    }
    const cargar = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/mascotas?tipo=extraviado`);
        const data = await res.json().catch(() => ({}));
        const items = Array.isArray(data) ? data : data.items || [];
        setLista(items);
      } catch (e) {
        console.warn("No se pudieron cargar extraviados:", e.message);
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

  const marcarEncontrado = async (id) => {
    if (!confirm("¿Confirmas marcar esta mascota como encontrada?")) return;
    try {
      const token = getToken();
      if (!token) {
        alert("Debes iniciar sesión para realizar esta acción.");
        return;
      }
      const res = await fetch(`${API}/api/mascotas/${id}/encontrado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || "No se pudo marcar como encontrada.");
        return;
      }
      // ❌ quitar de la UI
      setLista((prev) => prev.filter((x) => String(x._id) !== String(id)));
    } catch (e) {
      console.error(e);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <section className="py-16 bg-amber-50" id="extraviados">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-amber-600 mb-10">
          Mascotas Extraviadas 🔍
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Cargando...</p>
        ) : lista.length === 0 ? (
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
                key={m._id}
                className="relative bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition flex flex-col"
              >
                {/* Cinta de estado */}
                <span
                  className={`absolute top-3 left-3 px-3 py-1 text-sm font-semibold rounded-full text-white shadow-md ${
                    m.estado === "Encontrado" ? "bg-green-600" : "bg-amber-600"
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
                    <Link
                      to={`/post/${m._id}`}
                      className="block w-full bg-amber-500 text-white text-center py-2 rounded-lg hover:bg-amber-600 transition"
                    >
                      Ver más
                    </Link>

                    {/* Solo dueño */}
                    {user && m.usuarioId && sameUser(m.usuarioId, user.id) && (
                      <button
                        onClick={() => marcarEncontrado(m._id)}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        Volvió con su familia 💚
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
