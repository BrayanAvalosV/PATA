// frontend/src/components/DetalleMascota.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

const DEFAULT_CENTER = {
  lat: -29.90453,
  lng: -71.24894,
};

export default function DetalleMascota() {
  const { id } = useParams();
  const [mascota, setMascota] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // formulario de contacto
  const [contactForm, setContactForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    mensaje: "",
    ubicacionVista: "",
  });
  const [contactSending, setContactSending] = useState(false);
  const [contactDone, setContactDone] = useState(false);
  const [contactError, setContactError] = useState("");

  useEffect(() => {
    const fetchMascota = async () => {
      try {
        const res = await fetch(`${API}/api/mascotas/${id}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || "Mascota no encontrada");
        }
        setMascota(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar la mascota");
      } finally {
        setCargando(false);
      }
    };
    fetchMascota();
  }, [id]);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactError("");
    setContactDone(false);

    if (!contactForm.mensaje.trim()) {
      setContactError("Escribe un mensaje para el dueño.");
      return;
    }

    try {
      setContactSending(true);
      const res = await fetch(`${API}/api/mascotas/${id}/contactar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "No se pudo enviar el mensaje.");
      }
      setContactDone(true);
      setContactForm({
        nombre: "",
        correo: "",
        telefono: "",
        mensaje: "",
        ubicacionVista: "",
      });
    } catch (err) {
      console.error(err);
      setContactError(err.message || "No se pudo enviar el mensaje.");
    } finally {
      setContactSending(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p>Cargando publicación...</p>
      </div>
    );
  }

  if (error || !mascota) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-red-600 mb-3">
          {error || "No se pudo cargar la publicación."}
        </p>
        <Link
          to="/"
          className="px-4 py-2 rounded-lg bg-green-700 text-white text-sm"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  const esExtraviado = mascota.tipoPublicacion === "extraviado";
  const tieneUbicacion = !!mascota.ultimaUbicacion;

  const center = tieneUbicacion
    ? {
        lat: mascota.ultimaUbicacion.lat,
        lng: mascota.ultimaUbicacion.lng,
      }
    : DEFAULT_CENTER;

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-start pt-32 pb-10 bg-gradient-to-b from-green-50 to-white">
      <div className="w-full max-w-5xl px-4 mx-auto">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            to={esExtraviado ? "/extraviados" : "/adopta"}
            className="inline-flex items-center gap-2 text-sm text-green-800 hover:text-green-900"
          >
            <span>← Volver</span>
          </Link>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              esExtraviado
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : "bg-green-100 text-green-900 border border-green-300"
            }`}
          >
            {esExtraviado ? "Mascota extraviada" : "En adopción"}
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Imagen */}
            <div className="relative bg-gray-100 min-h-[260px]">
              {mascota.imagen ? (
                <img
                  src={mascota.imagen}
                  alt={mascota.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                  Sin imagen
                </div>
              )}
            </div>

            {/* Info principal */}
            <div className="p-5 md:p-6 space-y-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {mascota.nombre || "Mascota sin nombre"}
              </h1>

              <div className="flex flex-wrap gap-2 text-xs">
                {mascota.tipoMascota && (
                  <span className="px-2 py-1 rounded-full bg-green-50 border border-green-200 text-green-900">
                    {mascota.tipoMascota}
                  </span>
                )}
                {mascota.raza && (
                  <span className="px-2 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-900">
                    {mascota.raza}
                  </span>
                )}
                {mascota.sexo && (
                  <span className="px-2 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900">
                    {mascota.sexo}
                  </span>
                )}
                {mascota.edad && (
                  <span className="px-2 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-900">
                    {mascota.edad}
                  </span>
                )}
                {mascota.tamano && (
                  <span className="px-2 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-900">
                    {mascota.tamano}
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-700">
                {(mascota.region || mascota.comuna) && (
                  <p>
                    <span className="font-semibold">Zona:</span>{" "}
                    {[mascota.comuna, mascota.region]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}

                {esExtraviado && mascota.ubicacion && (
                  <p className="mt-1">
                    <span className="font-semibold">
                      Referencia del lugar:
                    </span>{" "}
                    {mascota.ubicacion}
                  </p>
                )}
              </div>

              {mascota.salud && (
                <div className="mt-2 text-sm text-gray-700">
                  <p className="font-semibold mb-1">Salud y cuidados:</p>
                  <p className="whitespace-pre-line">{mascota.salud}</p>
                </div>
              )}

              {mascota.descripcion && (
                <div className="mt-2 text-sm text-gray-700">
                  <p className="font-semibold mb-1">Descripción:</p>
                  <p className="whitespace-pre-line">{mascota.descripcion}</p>
                </div>
              )}

              {/* Estado sanitario (solo si aplica) */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <EstadoFlag ok={mascota.microchip} label="Microchip" />
                <EstadoFlag ok={mascota.vacunasAlDia} label="Vacunas al día" />
                <EstadoFlag ok={mascota.desparasitado} label="Desparasitado" />
                <EstadoFlag ok={mascota.esterilizado} label="Esterilizado" />
              </div>

              {/* Contacto: adopciones muestran datos; extraviado usa formulario seguro */}
              {!esExtraviado && mascota.contacto && (
                <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-100 text-sm">
                  <p className="font-semibold text-green-900 mb-1">
                    Datos de contacto
                  </p>
                  {mascota.contacto.nombre && (
                    <p>Nombre: {mascota.contacto.nombre}</p>
                  )}
                  {mascota.contacto.telefono && (
                    <p>Teléfono: {mascota.contacto.telefono}</p>
                  )}
                  {mascota.contacto.correo && (
                    <p>Correo: {mascota.contacto.correo}</p>
                  )}
                  {mascota.contacto.redSocial && (
                    <p>Red social: {mascota.contacto.redSocial}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mapa para extraviados + formulario seguro */}
          {esExtraviado && (
            <div className="border-t border-gray-100 p-4 md:p-6 bg-gray-50/70 space-y-6">
              <div>
                <h2 className="text-sm md:text-base font-semibold text-gray-800 mb-2">
                  Última zona donde fue vista la mascota
                </h2>
                <p className="text-xs md:text-sm text-gray-600 mb-2">
                  El círculo muestra un área aproximada, no una dirección exacta,
                  para proteger la privacidad de la persona que hizo la
                  publicación.
                </p>

                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  <MapContainer
                    center={center}
                    zoom={tieneUbicacion ? 15 : 13}
                    style={{ width: "100%", height: "320px" }}
                    scrollWheelZoom
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contrib.'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {tieneUbicacion && (
                      <>
                        <Marker
                          position={{
                            lat: mascota.ultimaUbicacion.lat,
                            lng: mascota.ultimaUbicacion.lng,
                          }}
                        />
                        <Circle
                          center={{
                            lat: mascota.ultimaUbicacion.lat,
                            lng: mascota.ultimaUbicacion.lng,
                          }}
                          radius={mascota.ultimaUbicacion.radioMetros || 300}
                        />
                      </>
                    )}
                  </MapContainer>
                </div>
              </div>

              {/* Formulario de contacto seguro */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <h2 className="text-sm md:text-base font-semibold text-amber-900 mb-1">
                  Enviar información al dueño
                </h2>
                <p className="text-xs md:text-sm text-amber-900 mb-3">
                  Tu mensaje se enviará al correo de la persona que publicó la
                  mascota, pero tus datos solo se compartirán si los llenas
                  aquí. Evita compartir información sensible.
                </p>

                {contactError && (
                  <div className="mb-2 text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                    {contactError}
                  </div>
                )}
                {contactDone && (
                  <div className="mb-2 text-xs text-green-800 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                    Mensaje enviado correctamente. Gracias por ayudar 💚
                  </div>
                )}

                <form
                  onSubmit={handleContactSubmit}
                  className="grid md:grid-cols-2 gap-3 text-xs md:text-sm"
                >
                  <div className="space-y-2">
                    <div>
                      <label className="block font-medium text-amber-900 mb-1">
                        Mensaje *
                      </label>
                      <textarea
                        name="mensaje"
                        value={contactForm.mensaje}
                        onChange={handleContactChange}
                        rows={4}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Cuenta qué viste, cuándo, y cualquier detalle que pueda ayudar."
                      />
                    </div>
                    <div>
                      <label className="block text-amber-900 mb-1">
                        Zona donde la viste (opcional)
                      </label>
                      <input
                        type="text"
                        name="ubicacionVista"
                        value={contactForm.ubicacionVista}
                        onChange={handleContactChange}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Ej: sector, calle, referencia..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] text-amber-900">
                      Estos datos son opcionales, pero ayudan a que el dueño
                      pueda contactarte más fácilmente.
                    </p>
                    <div>
                      <label className="block text-amber-900 mb-1">
                        Tu nombre (opcional)
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={contactForm.nombre}
                        onChange={handleContactChange}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-amber-900 mb-1">
                        Tu correo (opcional)
                      </label>
                      <input
                        type="email"
                        name="correo"
                        value={contactForm.correo}
                        onChange={handleContactChange}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Para que puedan escribirte de vuelta"
                      />
                    </div>
                    <div>
                      <label className="block text-amber-900 mb-1">
                        Tu teléfono (opcional)
                      </label>
                      <input
                        type="text"
                        name="telefono"
                        value={contactForm.telefono}
                        onChange={handleContactChange}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="+56 9..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={contactSending}
                      className="mt-2 w-full px-3 py-2 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:opacity-60"
                    >
                      {contactSending
                        ? "Enviando..."
                        : "Enviar mensaje al dueño"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function EstadoFlag({ ok, label }) {
  if (!ok) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 border border-green-200 text-green-800">
      <span className="text-[10px]">✔</span>
      <span>{label}</span>
    </span>
  );
}
