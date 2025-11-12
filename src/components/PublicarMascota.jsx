import { useState } from "react";

export default function PublicarMascota() {
  const [tipoPublicacion, setTipoPublicacion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);

  // 🔹 Convierte la imagen en Base64 para mostrarla y guardarla correctamente
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!tipoPublicacion) {
      alert("Por favor selecciona el tipo de publicación.");
      return;
    }

    const formData = new FormData(e.target);

    // 🐾 Crear objeto mascota completo
    const nuevaMascota = {
      id: Date.now(),
      tipo: tipoPublicacion,
      nombre: formData.get("nombre") || "Sin nombre",
      edad: formData.get("edad") || "",
      descripcion: formData.get("descripcion") || "",
      imagen: preview,
    };

    // 📦 Publicación de adopción
    if (tipoPublicacion === "adopcion") {
      const guardadas = JSON.parse(localStorage.getItem("mascotasAdopcion")) || [];
      guardadas.push(nuevaMascota);
      localStorage.setItem("mascotasAdopcion", JSON.stringify(guardadas));

      alert("¡Mascota publicada para adopción! 🐶");
      window.location.href = "/adopta";
    }

    // 📦 Publicación de extraviado
    if (tipoPublicacion === "extraviado") {
      nuevaMascota.estado = formData.get("estado") || "Perdido";
      nuevaMascota.ubicacion = formData.get("ubicacion") || "Ubicación no especificada";

      const guardadas = JSON.parse(localStorage.getItem("mascotasExtraviadas")) || [];
      guardadas.push(nuevaMascota);
      localStorage.setItem("mascotasExtraviadas", JSON.stringify(guardadas));

      alert("¡Mascota extraviada registrada correctamente! 🐾");
      window.location.href = "/extraviados";
    }
  };

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-start pt-60 pb-0 overflow-hidden">
      {/* 🔹 Video de fondo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-75 blur-sm"
      >
        <source src="/fondo-pata.mp4" type="video/mp4" />
      </video>

      {/* Capa semitransparente */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Contenedor del formulario */}
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
                setTipoPublicacion(tipoPublicacion === "adopcion" ? "" : "adopcion")
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
                setTipoPublicacion(tipoPublicacion === "extraviado" ? "" : "extraviado")
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

            {/* Campos específicos */}
            {tipoPublicacion === "adopcion" && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Edad
                  </label>
                  <input
                    name="edad"
                    type="text"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
                    placeholder="Ej: 2 años"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Tipo de mascota
                  </label>
                  <select
                    name="tipoMascota"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
                  >
                    <option>Perro</option>
                    <option>Gato</option>
                    <option>Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Género
                  </label>
                  <select
                    name="genero"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
                  >
                    <option>Macho</option>
                    <option>Hembra</option>
                  </select>
                </div>
              </>
            )}

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

            {/* Descripción */}
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

            {/* Imagen */}
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

      {/* Línea inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-green-900"></div>
    </section>
  );
}
