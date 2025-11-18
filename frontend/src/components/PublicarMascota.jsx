// frontend/src/components/PublicarMascota.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, getToken } from "../services/session";
import MapaSelector from "./MapaSelector";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function PublicarMascota() {
  const navigate = useNavigate();

  const [tipoPublicacion, setTipoPublicacion] = useState(""); // "adopcion" | "extraviado"
  const [preview, setPreview] = useState(null);
  const [imagenFile, setImagenFile] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    tipoMascota: "",
    raza: "",
    sexo: "",
    edad: "",
    tamano: "",
    microchip: false,
    vacunasAlDia: false,
    desparasitado: false,
    esterilizado: false,
    salud: "",
    region: "",
    comuna: "",
    descripcion: "",
    ubicacion: "", // texto libre para extraviado
  });

  // Para mapa de extraviados
  const [ultimaUbicacion, setUltimaUbicacion] = useState(null); // { lat, lng }
  const [radioMetros, setRadioMetros] = useState(300);

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const usuario = getUser();
  const token = getToken();

  // Imagen -> Base64
  const handleImagenChange = (e) => {
    const file = e.target.files?.[0];
    setImagenFile(file || null);
    setPreview(null);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result?.toString() || null);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!tipoPublicacion) {
      setError("Selecciona el tipo de publicación.");
      return;
    }

    if (!form.nombre.trim()) {
      setError("El nombre de la mascota es obligatorio.");
      return;
    }

    if (!token) {
      setError("Debes iniciar sesión para publicar.");
      return;
    }

    if (tipoPublicacion === "extraviado" && !ultimaUbicacion) {
      setError("Selecciona en el mapa la zona aproximada donde se perdió la mascota.");
      return;
    }

    const contacto = usuario
      ? {
          nombre: usuario.nombre || "",
          telefono: usuario.telefono || "",
          correo: usuario.email || "",
          redSocial: usuario.redSocial || "",
        }
      : {
          nombre: "",
          telefono: "",
          correo: "",
          redSocial: "",
        };

    // Cuerpo a enviar al backend
    const mascota = {
      tipoPublicacion,
      nombre: form.nombre || "Sin nombre",
      tipoMascota: form.tipoMascota || "",
      raza: form.raza || "",
      sexo: form.sexo || "",
      // estos campos se usan sobre todo en adopción
      edad: tipoPublicacion === "adopcion" ? form.edad || "" : "",
      tamano: tipoPublicacion === "adopcion" ? form.tamano || "" : "",
      microchip: tipoPublicacion === "adopcion" ? !!form.microchip : false,
      vacunasAlDia: tipoPublicacion === "adopcion" ? !!form.vacunasAlDia : false,
      desparasitado: tipoPublicacion === "adopcion" ? !!form.desparasitado : false,
      esterilizado: tipoPublicacion === "adopcion" ? !!form.esterilizado : false,
      salud: tipoPublicacion === "adopcion" ? form.salud || "" : "",
      region: form.region || "",
      comuna: form.comuna || "",
      descripcion: form.descripcion || "",
      imagen: preview || null,
      contacto,
    };

    if (tipoPublicacion === "extraviado") {
      mascota.estado = "Perdido";
      mascota.ubicacion = form.ubicacion || "";
      mascota.ultimaUbicacion = {
        lat: ultimaUbicacion.lat,
        lng: ultimaUbicacion.lng,
        radioMetros: radioMetros || 300,
      };
    }

    setEnviando(true);
    try {
      const res = await fetch(`${API}/api/mascotas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(mascota),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Error al publicar la mascota.");
      }

      alert(
        "¡Mascota enviada para revisión! Un administrador deberá aprobarla antes de que sea visible."
      );

      // Reset
      setTipoPublicacion("");
      setPreview(null);
      setImagenFile(null);
      setUltimaUbicacion(null);
      setRadioMetros(300);
      setForm({
        nombre: "",
        tipoMascota: "",
        raza: "",
        sexo: "",
        edad: "",
        tamano: "",
        microchip: false,
        vacunasAlDia: false,
        desparasitado: false,
        esterilizado: false,
        salud: "",
        region: "",
        comuna: "",
        descripcion: "",
        ubicacion: "",
      });

      // Redirigir
      if (tipoPublicacion === "adopcion") {
        navigate("/adopta");
      } else {
        navigate("/extraviados");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al publicar la mascota.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-start pt-60 pb-0 overflow-hidden">
      {/* Fondo video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
        className="absolute inset-0 w-full h-full object-cover brightness-75 blur-sm pointer-events-none select-none"
        tabIndex={-1}
        onContextMenu={(e) => e.preventDefault()}
      >
        <source src="/fondo-pata.mp4" type="video/mp4" />
      </video>

      {/* Capa oscura */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenido */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-6 md:p-8 border border-green-100">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-800 mb-2">
            Publicar mascota
          </h1>
          <p className="text-sm md:text-base text-gray-700 mb-4">
            Las publicaciones se revisan antes de mostrarse públicamente, para
            cuidar a las personas y a los animales de la región.
          </p>

          {error && (
            <div className="mb-4 bg-red-50 text-red-800 text-sm px-4 py-2 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Selector tipo publicación */}
          <div className="mb-6">
            <span className="block text-sm font-semibold text-gray-800 mb-2">
              Tipo de publicación
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setTipoPublicacion("adopcion")}
                className={`flex-1 px-4 py-2 rounded-xl border text-sm font-semibold transition ${
                  tipoPublicacion === "adopcion"
                    ? "bg-green-700 text-white border-green-800"
                    : "bg-white text-green-800 border-green-300 hover:bg-green-50"
                }`}
              >
                Adopción
              </button>
              <button
                type="button"
                onClick={() => setTipoPublicacion("extraviado")}
                className={`flex-1 px-4 py-2 rounded-xl border text-sm font-semibold transition ${
                  tipoPublicacion === "extraviado"
                    ? "bg-amber-600 text-white border-amber-700"
                    : "bg-white text-amber-800 border-amber-300 hover:bg-amber-50"
                }`}
              >
                Mascota extraviada
              </button>
            </div>
          </div>

          {/* Formulario */}
          {tipoPublicacion && (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 transition-all duration-500"
            >
              {/* Nombre */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Nombre de la mascota
                </label>
                <input
                  name="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Datos básicos */}
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Tipo de mascota
                  </label>
                  <select
                    name="tipoMascota"
                    value={form.tipoMascota}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Selecciona</option>
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Raza
                  </label>
                  <input
                    name="raza"
                    type="text"
                    value={form.raza}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="Opcional"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Sexo
                  </label>
                  <select
                    name="sexo"
                    value={form.sexo}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">No especificar</option>
                    <option value="macho">Macho</option>
                    <option value="hembra">Hembra</option>
                  </select>
                </div>
              </div>

              {/* Edad / tamaño / salud SOLO para adopción */}
              {tipoPublicacion === "adopcion" && (
                <>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Edad aproximada
                      </label>
                      <input
                        name="edad"
                        type="text"
                        value={form.edad}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="Cachorro, adulto, senior, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Tamaño
                      </label>
                      <select
                        name="tamano"
                        value={form.tamano}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="">No especificar</option>
                        <option value="pequeno">Pequeño</option>
                        <option value="mediano">Mediano</option>
                        <option value="grande">Grande</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <label className="font-medium text-gray-700">
                        Salud y cuidados
                      </label>
                      <textarea
                        name="salud"
                        value={form.salud}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="Vacunas, enfermedades, carácter, etc."
                      />
                    </div>
                    <div className="space-y-1 mt-6 md:mt-0">
                      <label className="font-medium text-gray-700">
                        Estado sanitario
                      </label>
                      <div className="grid grid-cols-1 gap-1">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="microchip"
                            checked={form.microchip}
                            onChange={handleChange}
                          />
                          <span>Posee microchip</span>
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="vacunasAlDia"
                            checked={form.vacunasAlDia}
                            onChange={handleChange}
                          />
                          <span>Vacunas al día</span>
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="desparasitado"
                            checked={form.desparasitado}
                            onChange={handleChange}
                          />
                          <span>Desparasitado</span>
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="esterilizado"
                            checked={form.esterilizado}
                            onChange={handleChange}
                          />
                          <span>Esterilizado</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Región / comuna */}
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Región
                  </label>
                  <input
                    name="region"
                    type="text"
                    value={form.region}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="Ej: Coquimbo"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Comuna
                  </label>
                  <input
                    name="comuna"
                    type="text"
                    value={form.comuna}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="Ej: La Serena"
                  />
                </div>
              </div>

              {/* Extra para EXTRAVIADO: mapa + ubicación textual */}
              {tipoPublicacion === "extraviado" && (
                <div className="space-y-2 border border-amber-200 bg-amber-50/70 rounded-xl p-3">
                  <h2 className="text-sm font-semibold text-amber-800">
                    Zona donde se perdió
                  </h2>
                  <label className="block text-sm text-gray-700 mb-1">
                    Referencia textual (opcional)
                  </label>
                  <input
                    name="ubicacion"
                    type="text"
                    value={form.ubicacion}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm mb-2"
                    placeholder="Ej: Cerca de la plaza, sector Las Compañías..."
                  />

                  <MapaSelector
                    posicion={ultimaUbicacion}
                    setPosicion={setUltimaUbicacion}
                    radioMetros={radioMetros}
                    setRadioMetros={setRadioMetros}
                  />
                </div>
              )}

              {/* Descripción general */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Descripción general
                </label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder={
                    tipoPublicacion === "extraviado"
                      ? "Cuenta cómo se perdió, señas particulares, collar, etc."
                      : "Cuenta detalles importantes de la mascota, su carácter, y cualquier cosa que ayude a encontrarle hogar."
                  }
                />
              </div>

              {/* Imagen */}
              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Imagen
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagenChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
                {preview && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-1">
                      Vista previa:
                    </p>
                    <img
                      src={preview}
                      alt="Vista previa"
                      className="max-h-56 rounded-xl border border-gray-200 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Botón */}
              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {enviando ? "Enviando..." : "Publicar para revisión"}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-green-900"></div>
    </section>
  );
}
