// frontend/src/App.jsx
import { useEffect, useMemo, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Adopciones from "./components/Adopciones";
import Categorias from "./components/Categorias";
import Extraviados from "./components/Extraviados";
import PublicarMascota from "./components/PublicarMascota";
import Footer from "./components/Footer";
import DetalleMascota from "./components/DetalleMascota";
import Login from "./components/Login";
import Registro from "./components/Registro";
import ProtectedRoute from "./components/ProtectedRoute";
import StatsFloating from "./components/StatsFloating";
import MapaGlobalExtraviados from "./components/MapaGlobalExtraviados";
import AdminSolicitudes from "./components/AdminSolicitudes";
import AdminRoute from "./components/AdminRoute";
import UniqueDivider from "./components/UniqueDivider";
import FaqAdopcion from "./components/FaqAdopcion";
import SobreNosotros from "./components/SobreNosotros";
import ListaFundaciones from "./components/ListaFundaciones";
import PerfilFundacion from "./components/PerfilFundacion";
import MiFundacion from "./components/MiFundacion"; // 🔹 NUEVO IMPORT

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Opciones fijas para filtros
const REGIONES_CHILE = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana de Santiago",
  "O’Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes",
];

const TAMANOS_POSIBLES = ["Pequeño", "Mediano", "Grande"];
const SEXOS_POSIBLES = ["Macho", "Hembra"];

// ---------- helpers ----------
const asArray = (data) => (Array.isArray(data) ? data : data?.items || []);

const fetchList = async (tipo, limit) => {
  const url = `${API}/api/mascotas?tipo=${encodeURIComponent(
    tipo
  )}${limit ? `&limit=${limit}` : ""}&_=${Date.now()}`;
  try {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) return [];
    return asArray(await r.json());
  } catch {
    return [];
  }
};

// ---------- Modal de tipo de mascota ----------
function TipoMascotaModal({ open, onSelect, onClose }) {
  if (!open) return null;

  const cards = [
    {
      tipo: "perro",
      titulo: "Perro",
      desc: "Llenos de energía, leales y perfectos para paseos largos.",
      iconClass: "fa-dog",
    },
    {
      tipo: "gato",
      titulo: "Gato",
      desc: "Independientes, regaloneadores y especialistas en siestas.",
      iconClass: "fa-cat",
    },
    {
      tipo: "otro",
      titulo: "Otras mascotas",
      desc: "Conejos, aves, reptiles u otros compañeros peludos.",
      iconClass: "fa-paw",
    },
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-4 bg-white rounded-3xl shadow-2xl p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Cerrar selector"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Primero que nada…
          </h2>
          <p className="mt-1 text-sm md:text-base text-slate-600">
            ¿Qué tipo de mascota estás buscando para adoptar?
          </p>
        </div>

        <div className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            {cards.slice(0, 2).map((c) => (
              <button
                key={c.tipo}
                type="button"
                onClick={() => onSelect(c.tipo)}
                className="group bg-green-50 border border-green-100 rounded-2xl px-4 py-5 flex items-center gap-4 text-left hover:border-green-500 hover:shadow-md transition-all"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <i className={`fa-solid ${c.iconClass} text-3xl text-green-600`} />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {c.titulo}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">{c.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onSelect("otro")}
            className="group bg-amber-50 border border-amber-100 rounded-2xl px-4 py-4 flex items-center justify-between text-left hover:border-amber-500 hover:shadow-md transition-all"
          >
            <div>
              <p className="text-base font-semibold text-slate-900">
                Otras mascotas
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Conejos, aves, reptiles u otros compañeros especiales que
                también buscan familia.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
              <i className="fa-solid fa-paw text-2xl text-amber-500" />
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full text-xs md:text-sm text-slate-500 hover:text-slate-700 underline"
        >
          Ver todas las mascotas sin filtro
        </button>
      </div>
    </div>
  );
}

// ---------- portada ----------
function Home() {
  const [adopciones, setAdopciones] = useState([]);
  const [extraviados, setExtraviados] = useState([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    (async () => {
      // Traemos varias para poder rotar, no solo 3
      const [a, e] = await Promise.all([
        fetchList("adopcion", 20),
        fetchList("extraviado", 20),
      ]);
      setAdopciones(a);
      setExtraviados(e);
    })();
  }, []);

  // Rotación cada 20s
  useEffect(() => {
    if (adopciones.length <= 3 && extraviados.length <= 3) return;
    const id = setInterval(() => {
      setOffset((prev) => prev + 1);
    }, 20000);
    return () => clearInterval(id);
  }, [adopciones.length, extraviados.length]);

  const tomar3 = (lista) => {
    if (!lista || lista.length <= 3) return lista;
    const start = offset % lista.length;
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(lista[(start + i) % lista.length]);
      if (result.length >= lista.length) break;
    }
    return result;
  };

  const visiblesAdop = tomar3(adopciones);
  const visiblesExt = tomar3(extraviados);

  return (
    <>
      <StatsFloating />
      <Hero />
      <Categorias />

      <UniqueDivider variant="green" thickness={2} className="my-10" />

      {/* Adopciones destacadas (3 que van rotando) */}
      <Adopciones mascotas={visiblesAdop} />

      <UniqueDivider variant="green" thickness={2} className="my-10" />

      {/* Extraviados destacados (3 que van rotando) */}
      <Extraviados mascotas={visiblesExt} />

      <UniqueDivider variant="green" thickness={2} className="my-14" />

      <FaqAdopcion />

      <Footer />
    </>
  );
}

// ---------- página Adopta con modal + filtros avanzados ----------
function AdoptaPage() {
  const location = useLocation();
  const [items, setItems] = useState(null); // todas las mascotas de adopción

  // filtros base
  const [tipoFiltro, setTipoFiltro] = useState(null); // perro | gato | otro | null
  const [showModal, setShowModal] = useState(true);

  // filtros adicionales
  const [sexoFiltro, setSexoFiltro] = useState("todos");
  const [tamanoFiltro, setTamanoFiltro] = useState("todos");
  const [regionFiltro, setRegionFiltro] = useState("todos");
  const [comunaFiltro, setComunaFiltro] = useState("todos");
  const [razaFiltro, setRazaFiltro] = useState("todos");
  const [edadFiltro, setEdadFiltro] = useState("todos");

  const [soloMicrochip, setSoloMicrochip] = useState(false);
  const [soloVacunados, setSoloVacunados] = useState(false);
  const [soloDesparasitado, setSoloDesparasitado] = useState(false);
  const [soloEsterilizados, setSoloEsterilizados] = useState(false);

  // Lee parámetros de la URL (tipo y open)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tipoParam = params.get("tipo");
    const hasOpen = params.has("open");

    if (tipoParam === "perro" || tipoParam === "gato" || tipoParam === "otro") {
      setTipoFiltro(tipoParam);
      setShowModal(false);
    } else if (hasOpen) {
      setTipoFiltro(null);
      setShowModal(true);
    } else {
      setTipoFiltro(null);
      setShowModal(true);
    }

    resetFiltrosBasicos();
  }, [location.search]);

  const resetFiltrosBasicos = () => {
    setSexoFiltro("todos");
    setTamanoFiltro("todos");
    setRegionFiltro("todos");
    setComunaFiltro("todos");
    setRazaFiltro("todos");
    setEdadFiltro("todos");
    setSoloMicrochip(false);
    setSoloVacunados(false);
    setSoloDesparasitado(false);
    setSoloEsterilizados(false);
  };

  // Cargar todas las adopciones
  useEffect(() => {
    (async () => {
      const data = await fetchList("adopcion");
      setItems(data);
    })();
  }, []);

  // helper para sacar opciones únicas de un campo (dinámicas)
  const opcionesDesdeCampo = (campo) =>
    useMemo(() => {
      if (!items) return [];
      const setVals = new Set(
        items
          .map((m) => (m[campo] || "").trim())
          .filter((v) => v && v.length > 0)
      );
      return Array.from(setVals);
    }, [items]);

  // dinámicos
  const opcionesRaza = opcionesDesdeCampo("raza");
  const opcionesComuna = opcionesDesdeCampo("comuna");
  const opcionesEdad = opcionesDesdeCampo("edad");

  // Aplica todos los filtros
  const filteredItems = useMemo(() => {
    if (!items) return null;
    let data = [...items];

    // tipo mascota (perro/gato/otro)
    if (tipoFiltro) {
      const t = tipoFiltro.toLowerCase();
      data = data.filter((m) => {
        const tipo = (m.tipoMascota || "").toLowerCase();
        if (t === "otro") {
          return tipo !== "perro" && tipo !== "gato";
        }
        return tipo === t;
      });
    }

    const byEquals = (valueFiltro, campo, item) =>
      valueFiltro === "todos" ||
      (item[campo] || "").trim().toLowerCase() === valueFiltro.toLowerCase();

    // filtros select
    data = data.filter(
      (m) =>
        byEquals(sexoFiltro, "sexo", m) &&
        byEquals(tamanoFiltro, "tamano", m) &&
        byEquals(regionFiltro, "region", m) &&
        byEquals(comunaFiltro, "comuna", m) &&
        byEquals(razaFiltro, "raza", m) &&
        byEquals(edadFiltro, "edad", m)
    );

    // estado sanitario
    if (soloMicrochip) {
      data = data.filter((m) => m.microchipPosee === true);
    }
    if (soloVacunados) {
      data = data.filter((m) => m.vacunasAlDia === true);
    }
    if (soloDesparasitado) {
      data = data.filter((m) => m.desparasitado === true);
    }
    if (soloEsterilizados) {
      data = data.filter((m) => m.esterilizado === true);
    }

    return data;
  }, [
    items,
    tipoFiltro,
    sexoFiltro,
    tamanoFiltro,
    regionFiltro,
    comunaFiltro,
    razaFiltro,
    edadFiltro,
    soloMicrochip,
    soloVacunados,
    soloDesparasitado,
    soloEsterilizados,
  ]);

  const resetTodosFiltros = () => {
    setTipoFiltro(null);
    resetFiltrosBasicos();
  };

  return (
    <>
      {/* Modal de selección inicial (perro/gato/otros) */}
      {items && (
        <TipoMascotaModal
          open={showModal}
          onSelect={(tipo) => {
            setTipoFiltro(tipo);
            setShowModal(false);
          }}
          onClose={() => {
            setTipoFiltro(null);
            setShowModal(false);
          }}
        />
      )}

      {items === null ? (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-green-700 mb-10">
              Mascotas en Adopción 🐶🐱
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white shadow-md rounded-2xl p-4 animate-pulse h-80"
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Barra de filtros avanzada */}
          <section className="bg-gray-50 pt-24 pb-4">
            <div className="max-w-7xl mx-auto px-6">
              <div className="bg-white/90 border border-green-100 rounded-2xl shadow-sm p-4 md:p-5 flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-700">
                      Filtros de adopción
                    </p>
                    <p className="text-sm text-gray-700">
                      Filtra por tipo, tamaño, región y estado sanitario para
                      encontrar la mascota ideal.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetTodosFiltros}
                    className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-green-200 text-green-800 hover:bg-green-50"
                  >
                    Limpiar filtros
                  </button>
                </div>

                {/* fila 1: tipo + sexo + tamaño + edad */}
                <div className="grid gap-3 md:grid-cols-4 text-xs md:text-sm">
                  {/* Tipo mascota */}
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-800 mb-1">
                      Tipo de mascota
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["perro", "gato", "otro"].map((tipo) => (
                        <button
                          key={tipo}
                          type="button"
                          onClick={() =>
                            setTipoFiltro((prev) =>
                              prev === tipo ? null : tipo
                            )
                          }
                          className={`px-3 py-1.5 rounded-full border text-xs font-medium ${
                            tipoFiltro === tipo
                              ? "bg-green-700 text-white border-green-700"
                              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {tipo === "perro"
                            ? "Perros"
                            : tipo === "gato"
                            ? "Gatos"
                            : "Otras"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sexo */}
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-800 mb-1">
                      Sexo
                    </label>
                    <select
                      value={sexoFiltro}
                      onChange={(e) => setSexoFiltro(e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                    >
                      <option value="todos">Todos</option>
                      {SEXOS_POSIBLES.map((sx) => (
                        <option key={sx} value={sx}>
                          {sx}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tamaño */}
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-800 mb-1">
                      Tamaño
                    </label>
                    <select
                      value={tamanoFiltro}
                      onChange={(e) => setTamanoFiltro(e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                    >
                      <option value="todos">Todos</option>
                      {TAMANOS_POSIBLES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Edad aproximada (dinámica) */}
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-800 mb-1">
                      Edad aproximada
                    </label>
                    <select
                      value={edadFiltro}
                      onChange={(e) => setEdadFiltro(e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                    >
                      <option value="todos">Todas</option>
                      {opcionesEdad.map((ed) => (
                        <option key={ed} value={ed}>
                          {ed}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* fila 2: raza + región + comuna */}
                <div className="grid gap-3 md:grid-cols-3 text-xs md:text-sm">
                  {/* Raza (dinámica) */}
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-800 mb-1">
                      Raza
                    </label>
                    <select
                      value={razaFiltro}
                      onChange={(e) => setRazaFiltro(e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                    >
                      <option value="todos">Todas</option>
                      {opcionesRaza.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Región (todas las regiones de Chile) */}
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-800 mb-1">
                      Región
                    </label>
                    <select
                      value={regionFiltro}
                      onChange={(e) => setRegionFiltro(e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                    >
                      <option value="todos">Todas</option>
                      {REGIONES_CHILE.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Comuna (dinámica) */}
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-800 mb-1">
                      Comuna
                    </label>
                    <select
                      value={comunaFiltro}
                      onChange={(e) => setComunaFiltro(e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                    >
                      <option value="todos">Todas</option>
                      {opcionesComuna.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Estado sanitario */}
                <div className="flex flex-wrap gap-4 text-xs md:text-sm">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soloMicrochip}
                      onChange={(e) => setSoloMicrochip(e.target.checked)}
                      className="rounded border-gray-300 text-green-700 focus:ring-green-600"
                    />
                    <span className="text-gray-700">
                      Con microchip registrado
                    </span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soloVacunados}
                      onChange={(e) => setSoloVacunados(e.target.checked)}
                      className="rounded border-gray-300 text-green-700 focus:ring-green-600"
                    />
                    <span className="text-gray-700">Con vacunas al día</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soloDesparasitado}
                      onChange={(e) => setSoloDesparasitado(e.target.checked)}
                      className="rounded border-gray-300 text-green-700 focus:ring-green-600"
                    />
                    <span className="text-gray-700">Desparasitado</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soloEsterilizados}
                      onChange={(e) => setSoloEsterilizados(e.target.checked)}
                      className="rounded border-gray-300 text-green-700 focus:ring-green-600"
                    />
                    <span className="text-gray-700">Esterilizado</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Lista filtrada */}
          <Adopciones mascotas={filteredItems || []} />
        </>
      )}

      <Footer />
    </>
  );
}

// ---------- página de lista completas de extraviados ----------
function ExtraviadosPage() {
  const [items, setItems] = useState(null); // null = cargando

  useEffect(() => {
    (async () => setItems(await fetchList("extraviado")))();
  }, []);

  return (
    <>
      {items === null ? (
        <section className="py-16 bg-amber-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-amber-700 mb-10">
              Mascotas Extraviadas 🔍
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white shadow-md rounded-2xl p-4 animate-pulse h-80"
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <Extraviados mascotas={items} />
      )}
      <Footer />
    </>
  );
}

// ---------- App principal ----------
export default function App() {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adopta" element={<AdoptaPage />} />
        <Route path="/extraviados" element={<ExtraviadosPage />} />

        {/* mapa global de extraviados */}
        <Route
          path="/mapa-extraviados"
          element={
            <>
              <MapaGlobalExtraviados />
              <Footer />
            </>
          }
        />

        {/* publicar (protegida) */}
        <Route
          path="/publicar"
          element={
            <ProtectedRoute>
              <>
                <PublicarMascota />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* detalle */}
        <Route
          path="/post/:id"
          element={
            <>
              <DetalleMascota />
              <Footer />
            </>
          }
        />

        {/* auth */}
        <Route
          path="/login"
          element={
            <>
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/registro"
          element={
            <>
              <Registro />
              <Footer />
            </>
          }
        />

        {/* panel admin */}
        <Route
          path="/admin/solicitudes"
          element={
            <AdminRoute>
              <>
                <AdminSolicitudes />
                <Footer />
              </>
            </AdminRoute>
          }
        />

        {/* página Sobre nosotros */}
        <Route
          path="/nosotros"
          element={
            <>
              <SobreNosotros />
              <Footer />
            </>
          }
        />

        {/* listado de fundaciones */}
        <Route
          path="/fundaciones"
          element={
            <>
              <ListaFundaciones />
              <Footer />
            </>
          }
        />

        {/* perfil de una fundación */}
        <Route
          path="/fundacion/:id"
          element={
            <>
              <PerfilFundacion />
              <Footer />
            </>
          }
        />

        {/* 🔹 NUEVA RUTA: registrar / editar mi fundación */}
        <Route
          path="/mi-fundacion"
          element={
            <ProtectedRoute>
              <>
                <MiFundacion />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
