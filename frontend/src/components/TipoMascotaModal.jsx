// frontend/src/components/TipoMascotaModal.jsx

export default function TipoMascotaModal({ open, onSelect, onClose }) {
  if (!open) return null;

  const baseCard =
    "flex flex-col items-center justify-center rounded-2xl border px-8 py-6 cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="relative mx-4 w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 text-xl leading-none"
          aria-label="Cerrar"
        >
          ×
        </button>

        {/* Títulos */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Primero que nada…
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-500">
            ¿Qué tipo de mascota estás buscando?
          </p>
        </div>

        {/* Opciones principales */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Perro */}
            <button
              type="button"
              onClick={() => onSelect("perro")}
              className={`${baseCard} border-green-200 bg-green-50 hover:border-green-400`}
            >
              <i className="fa-solid fa-dog text-green-600 text-5xl mb-3" />
              <span className="text-base font-semibold text-slate-900">
                Perro
              </span>
            </button>

            {/* Gato */}
            <button
              type="button"
              onClick={() => onSelect("gato")}
              className={`${baseCard} border-green-200 bg-green-50 hover:border-green-400`}
            >
              <i className="fa-solid fa-cat text-green-600 text-5xl mb-3" />
              <span className="text-base font-semibold text-slate-900">
                Gato
              </span>
            </button>
          </div>

          {/* Otras mascotas */}
          <button
            type="button"
            onClick={() => onSelect("otro")}
            className={`${baseCard} flex-row justify-between border-amber-200 bg-amber-50 hover:border-amber-400`}
          >
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold text-slate-900">
                Otras mascotas
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Conejos, aves, reptiles u otros compañeros peludos.
              </span>
            </div>
            <i className="fa-solid fa-paw text-green-600 text-3xl ml-4" />
          </button>
        </div>

        {/* Ver sin filtro */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2"
        >
          Ver todas las mascotas sin filtro
        </button>
      </div>
    </div>
  );
}
