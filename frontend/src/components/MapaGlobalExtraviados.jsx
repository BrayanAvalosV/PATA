// frontend/src/components/MapaGlobalExtraviados.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

const DEFAULT_CENTER = {
  lat: -29.90453,
  lng: -71.24894,
};

export default function MapaGlobalExtraviados() {
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
        setMascotas(
          data.filter((m) => m.ultimaUbicacion && m.ultimaUbicacion.lat)
        );
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
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-amber-900">
              Mapa de mascotas extraviadas
            </h1>
            <p className="text-xs md:text-sm text-gray-700 mt-1 max-w-xl">
              Cada círculo representa una zona aproximada donde se vio por
              última vez una mascota extraviada en la región.
            </p>
          </div>
          <Link
            to="/extraviados"
            className="px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-semibold shadow hover:bg-amber-700"
          >
            Volver al listado
          </Link>
        </div>

        {cargando && (
          <div className="mt-10 flex justify-center">
            <p>Cargando mapa...</p>
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
              No hay mascotas extraviadas con ubicación registrada.
            </p>
          </div>
        )}

        {!cargando && !error && mascotas.length > 0 && (
          <div className="rounded-3xl overflow-hidden border border-amber-200 shadow-lg">
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={12}
              style={{ width: "100%", height: "520px" }}
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contrib.'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {mascotas.map((m) => {
                const { lat, lng, radioMetros } = m.ultimaUbicacion;
                const center = { lat, lng };
                return (
                  <Circle
                    key={m._id}
                    center={center}
                    radius={radioMetros || 300}
                    pathOptions={{
                      color: "#f97316",
                      fillColor: "#fed7aa",
                      fillOpacity: 0.35,
                    }}
                  >
                    <Popup>
                      <div className="text-xs max-w-[200px] space-y-1">
                        {/* 👇 Foto de la mascota en la burbuja */}
                        {m.imagen && (
                          <div className="w-full h-24 rounded-lg overflow-hidden mb-1">
                            <img
                              src={m.imagen}
                              alt={m.nombre || "Mascota extraviada"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <p className="font-semibold">
                          {m.nombre || "Mascota extraviada"}
                        </p>

                        {(m.comuna || m.region) && (
                          <p className="text-[11px] text-gray-700">
                            {[m.comuna, m.region]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}

                        <Link
                          to={`/post/${m._id}`}
                          className="inline-flex mt-1 text-[11px] text-amber-700 underline"
                        >
                          Ver detalles
                        </Link>
                      </div>
                    </Popup>

                    <Marker position={center} />
                  </Circle>
                );
              })}
            </MapContainer>
          </div>
        )}
      </div>
    </section>
  );
}