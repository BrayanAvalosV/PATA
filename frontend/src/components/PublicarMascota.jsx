import { useState } from "react";
import { getUser, getToken } from "../services/session";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function PublicarMascota() {
  const [tipoPublicacion, setTipoPublicacion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);

  const usuario = getUser();        // si hay sesión, lo usamos como contacto
  const token = getToken();         // si hay token, lo mandamos en Authorization

  // 🔹 Convierte imagen a Base64
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipoPublicacion) {
      alert("Por favor selecciona el tipo de publicación.");
      return;
    }

    const formData = new FormData(e.target);

    // Base común
    const mascota = {
      tipoPublicacion,
      nombre: formData.get("nombre") || "Sin nombre",
      tipoMascota: formData.get("tipoMascota") || "",
      raza: formData.get("raza") || "",
      sexo: formData.get("sexo") || "",
      edad: formData.get("edad") || "",
      tamano: formData.get("tamano") || "",
      microchip: !!formData.get("microchip"),
      vacunas: !!formData.get("vacunas"),
      desparasitado: !!formData.get("desparasitado"),
      esterilizado: !!formData.get("esterilizado"),
      salud: formData.get("salud") || "",
      region: formData.get("region") || "",
      comuna: formData.get("comuna") || "",
      descripcion: formData.get("descripcion") || "",
      imagen: preview || null,

      // Contacto: si hay usuario logeado lo usamos; si no, fallback estático
      contacto: usuario
        ? {
            nombre: usuario.nombre,
            telefono: usuario.telefono,
            correo: usuario.email,
            redSocial: usuario.redSocial || "",
          }
        : {
            nombre: "Usuario estático",
            telefono: "+56 9 0000 0000",
            correo: "usuario@ejemplo.cl",
          },

      // opcional: guardar relación con el usuario
      usuarioId: usuario?.id || null,
    };

    // Campos específicos para EXTRAVIADO
    if (tipoPublicacion === "extraviado") {
      mascota.estado = formData.get("estado") || "Perdido";
      mascota.ubicacion = formData.get("ubicacion") || "";
    }

    try {
      const response = await fetch(`${API}/api/mascotas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}), // si hay token, lo enviamos
        },
        body: JSON.stringify(mascota),
      });

      if (response.ok) {
        alert("¡Mascota publicada correctamente! 🐾");
        // Reset visual
        e.target.reset();
        setPreview(null);
        setImagen(null);
        setTipoPublicacion("");
        window.location.href =
          tipoPublicacion === "adopcion" ? "/adopta" : "/extraviados";
      } else {
        const err = await response.json().catch(() => ({}));
        alert(`Error al publicar la mascota. ${err?.error || ""}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor.");
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

      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 max-w-3xl w-full bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Publicar Mascota <span className="text-2xl">🐾</span>
        </h2>

        {/* Tipo de publicación */}
        <div className="mb-6 text-center">
          <label className="block font-semibold text-gray-700 mb-2">
            ¿Qué deseas publicar?
          </label>
          <div className="flex justify-center space-x-6">
            <button
              onClick={() =>
                setTipoPublicacion(
                  tipoPublicacion === "adopcion" ? "" : "adopcion"
                )
              }
              className={`px-6 py-2 rounded-lg font-semibold border transition ${
                tipoPublicacion === "adopcion"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-green-700 border-green-700 hover:bg-green-50"
              }`}
              type="button"
            >
              En Adopción
            </button>

            <button
              onClick={() =>
                setTipoPublicacion(
                  tipoPublicacion === "extraviado" ? "" : "extraviado"
                )
              }
              className={`px-6 py-2 rounded-lg font-semibold border transition ${
                tipoPublicacion === "extraviado"
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-white text-amber-600 border-amber-600 hover:bg-amber-50"
              }`}
              type="button"
            >
              Extraviado
            </button>
          </div>
        </div>

        {/* Formulario dinámico */}
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
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* ADOPCIÓN */}
            {tipoPublicacion === "adopcion" && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <select
                    name="tipoMascota"
                    className="border p-2 rounded"
                    required
                  >
                    <option value="">Tipo de mascota</option>
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="otro">Otro</option>
                  </select>
                  <input
                    name="raza"
                    type="text"
                    placeholder="Raza (opcional)"
                    className="border p-2 rounded"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <select name="sexo" className="border p-2 rounded" required>
                    <option value="">Sexo</option>
                    <option value="macho">Macho</option>
                    <option value="hembra">Hembra</option>
                    <option value="desconocido">Desconocido</option>
                  </select>
                  <select name="edad" className="border p-2 rounded" required>
                    <option value="">Edad aproximada</option>
                    <option value="cachorro">Cachorro (0–11 meses)</option>
                    <option value="joven">Joven (1–3 años)</option>
                    <option value="adulto">Adulto (4–8 años)</option>
                    <option value="senior">Senior (9+ años)</option>
                  </select>
                  <select name="tamano" className="border p-2 rounded">
                    <option value="">Tamaño</option>
                    <option value="pequeno">Pequeño (-10kg)</option>
                    <option value="mediano">Mediano (10–25kg)</option>
                    <option value="grande">Grande (+25kg)</option>
                  </select>
                </div>

                {/* Salud */}
                <div className="mt-4 grid md:grid-cols-2 gap-2 text-sm">
                  <label>
                    <input type="checkbox" name="microchip" /> Posee microchip
                  </label>
                  <label>
                    <input type="checkbox" name="vacunas" /> Vacunas al día
                  </label>
                  <label>
                    <input type="checkbox" name="desparasitado" /> Desparasitado
                  </label>
                  <label>
                    <input type="checkbox" name="esterilizado" /> Esterilizado /
                    Castrado
                  </label>
                </div>

                <select
                  name="salud"
                  className="border p-2 rounded w-full"
                  required
                >
                  <option value="">Estado de salud</option>
                  <option value="sano">Sano</option>
                  <option value="cuidados">Requiere cuidados</option>
                  <option value="desconocido">Desconocido</option>
                </select>

                {/* Ubicación */}
                <div className="grid md:grid-cols-2 gap-4">
                  <select
                    name="region"
                    className="border p-2 rounded"
                    required
                  >
                    <option value="">Región</option>
                    <option value="Coquimbo">Coquimbo</option>
                    <option value="Valparaíso">Valparaíso</option>
                    <option value="Metropolitana">Metropolitana</option>
                    <option value="Biobío">Biobío</option>
                  </select>
                  <input
                    name="comuna"
                    placeholder="Comuna"
                    className="border p-2 rounded"
                    required
                  />
                </div>
              </>
            )}

            {/* EXTRAVIADO */}
            {tipoPublicacion === "extraviado" && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Estado
                  </label>
                  <select
                    name="estado"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500"
                  >
                    <option>Perdido</option>
                    <option>Encontrado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Última ubicación conocida
                  </label>
                  <input
                    name="ubicacion"
                    type="text"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500"
                    placeholder="Ej: Plaza de Armas, La Serena"
                  />
                </div>
              </>
            )}

            {/* Descripción e imagen */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                rows="3"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
                placeholder="Escribe una breve descripción..."
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
                className="w-full border rounded-lg px-4 py-2"
              />
              {preview && (
                <div className="mt-3 text-center">
                  <img
                    src={preview}
                    alt="Vista previa"
                    className="w-48 h-48 object-cover rounded-lg mx-auto shadow-md"
                  />
                  <p className="text-sm text-gray-500 mt-1">Vista previa</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white font-semibold py-2 rounded-lg hover:bg-green-800 transition"
            >
              Publicar
            </button>
          </form>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-green-900"></div>
    </section>
  );
}
