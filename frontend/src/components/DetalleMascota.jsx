import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function DetalleMascota() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [selIdx, setSelIdx] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;

    const cargar = async () => {
      try {
        setCargando(true);
        // 👀 log rápido para confirmar ID
        console.log("DetalleMascota → id:", id);
        const res = await fetch(`${API}/api/mascotas/${id}`);
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`No se pudo cargar (${res.status}). ${txt}`);
        }
        const item = await res.json();
        if (!cancelado) setData(item);
      } catch (e) {
        if (!cancelado) setError(e.message || "Error al cargar");
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    cargar();
    return () => { cancelado = true; };
  }, [id]);

  const imagenes = useMemo(() => {
    if (!data) return [];
    const arr = Array.isArray(data.imagenes) ? data.imagenes : [];
    if (data.imagen && arr.length === 0) return [data.imagen];
    return arr;
  }, [data]);

  if (cargando) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse w-11/12 max-w-6xl">
          <div className="h-80 bg-white rounded-2xl shadow mb-6" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="h-40 bg-white rounded-2xl shadow" />
            <div className="h-40 bg-white rounded-2xl shadow" />
            <div className="h-40 bg-white rounded-2xl shadow" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">No se pudo cargar</h1>
          <p className="text-gray-700 mb-4">{error || "Publicación no encontrada (404)"}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900"
          >
            Volver
          </button>
        </div>
      </section>
    );
  }

  const esAdopcion = data.tipoPublicacion === "adopcion";
  const cintaColor = esAdopcion ? "bg-green-600" : "bg-amber-600";

  return (
    <section className="pb-20 pt-28 md:pt-36 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-100"
          >
            ← Volver
          </button>
          <span className={`px-3 py-1 text-white text-sm font-semibold rounded-full ${cintaColor}`}>
            {esAdopcion ? "En adopción" : (data.estado || "Extraviado")}
          </span>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7">
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="relative">
                <img
                  src={imagenes[selIdx] || "/placeholder.jpg"}
                  className="w-full h-[380px] md:h-[460px] object-cover"
                  alt={data.nombre}
                />
                {imagenes.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {selIdx + 1} / {imagenes.length}
                  </div>
                )}
              </div>
              {imagenes.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-3 border-t">
                  {imagenes.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setSelIdx(i)}
                      className={`h-20 rounded-lg overflow-hidden border ${selIdx === i ? "ring-2 ring-green-600" : "border-gray-200"}`}
                    >
                      <img src={src} className="w-full h-full object-cover" alt={`mini-${i}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h1 className="text-3xl font-bold text-gray-900">{data.nombre || "Sin nombre"}</h1>
              <p className="text-gray-600 mt-1">{data.descripcion || "Sin descripción"}</p>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <Ficha titulo="Tipo" valor={data.tipoMascota || "—"} />
                <Ficha titulo="Sexo" valor={data.sexo || "—"} />
                <Ficha titulo="Edad" valor={data.edad || "—"} />
                <Ficha titulo="Tamaño" valor={data.tamano || "—"} />
                {esAdopcion ? (
                  <>
                    <Ficha titulo="Raza" valor={data.raza || "—"} />
                    <Ficha titulo="Salud" valor={data.salud || "—"} />
                  </>
                ) : (
                  <>
                    <Ficha titulo="Estado" valor={data.estado || "—"} />
                    <Ficha titulo="Última ubicación" valor={data.ubicacion || "—"} />
                  </>
                )}
                <Ficha
                  titulo="Ubicación"
                  valor={[data.region, data.comuna].filter(Boolean).join(", ") || "—"}
                  spanFull
                />
              </div>

              {esAdopcion && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge ok={data.microchip}>Microchip</Badge>
                  <Badge ok={data.vacunas}>Vacunas al día</Badge>
                  <Badge ok={data.desparasitado}>Desparasitado</Badge>
                  <Badge ok={data.esterilizado}>Esterilizado</Badge>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold mb-3">Contacto</h2>
              <div className="space-y-1 text-gray-700">
                <p><span className="font-medium">Responsable:</span> {data?.contacto?.nombre || "—"}</p>
                <p><span className="font-medium">Teléfono:</span> {data?.contacto?.telefono || "—"}</p>
                <p><span className="font-medium">Correo:</span> {data?.contacto?.correo || "—"}</p>
                {data?.contacto?.redSocial && (
                  <p>
                    <span className="font-medium">Red social:</span>{" "}
                    <a className="text-green-700 underline" href={data.contacto.redSocial} target="_blank">
                      {data.contacto.redSocial}
                    </a>
                  </p>
                )}
              </div>

              <div className="mt-4 flex gap-3">
                {data?.contacto?.telefono && (
                  <a
                    href={`https://wa.me/${data.contacto.telefono.replace(/\D/g, "")}`}
                    target="_blank"
                    className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white rounded-xl py-2 font-semibold"
                  >
                    WhatsApp
                  </a>
                )}
                {data?.contacto?.correo && (
                  <a
                    href={`mailto:${data.contacto.correo}`}
                    className="flex-1 text-center bg-gray-900 hover:bg-black text-white rounded-xl py-2 font-semibold"
                  >
                    Email
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function Ficha({ titulo, valor, spanFull }) {
  return (
    <div className={`${spanFull ? "col-span-2" : ""} bg-gray-50 rounded-xl p-3`}>
      <p className="text-xs text-gray-500">{titulo}</p>
      <p className="text-sm font-semibold text-gray-900">{valor}</p>
    </div>
  );
}

function Badge({ ok, children }) {
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${
        ok ? "bg-green-100 text-green-800 border border-green-200" : "bg-gray-100 text-gray-500 border border-gray-200"
      }`}
    >
      {children}
    </span>
  );
}
